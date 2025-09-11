import React, { Fragment, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HeaderComponent from "./components/HeaderComponent/HeaderComponent";
import HomePage from "./pages/HomePage/HomePage";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";
import { routes } from "./routes/index";
import FooterComponent from "./components/FooterComponent/FooterComponent";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { configureStore } from "@reduxjs/toolkit";
import { isJsonString } from "./utils";
import { jwtDecode } from "jwt-decode";
import { getDetailUser, refreshToken, axiosJWT } from "../service/UserService";
import { useDispatch } from "react-redux";
import { updateUser } from "./redux/slices/userSlice";
// Main App Component
export default function App() {
  const handleDecode = () => {
    let storageData = localStorage.getItem("access_token");
    let decoded = {};
   
    if (storageData && isJsonString(storageData)) {
      storageData = JSON.parse(storageData);
      decoded = jwtDecode(storageData); ///Notice
      console.log("decode ne: ",decoded)
    }
    return { decoded, storageData };
  };

  axiosJWT.interceptors.request.use(
  async function (config) {
    const currentTime = Math.floor(Date.now() / 1000);
    let { storageData, decoded } = handleDecode();
    console.log("decoded exp va date now", decoded, currentTime);

    // Nếu có token và token hết hạn
    if (decoded && decoded.exp < currentTime) {
      try {
        console.log("Token het han, dang refresh ne");
        const data = await refreshToken(); // gọi API /refresh
        console.log("data sau refresh ne", data);
        const newAccessToken = data?.data
        console.log("newAccessToken ne", newAccessToken);

        // Lưu lại
        localStorage.setItem("access_token", JSON.stringify(newAccessToken));

        // Gắn header chuẩn
        config.headers["token"] = `Bearer ${newAccessToken}`;
      } catch (err) {
        console.error("❌ Refresh token failed:", err);
      }
    } else if (storageData) {
      // Token còn hạn
      console.log("Token con han")
      config.headers["token"] = `Bearer ${storageData}`;
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);


  let { decoded, storageData } = handleDecode();
  const dispatch = useDispatch();
  const handleGetDetailUser = async (id, access_token) => {
    try {
      const res = await getDetailUser(id, access_token);
      console.log("res data user", res);
      dispatch(updateUser({ ...res?.data, access_token: access_token }));
      console.log("res ne", res);
    } catch (error) {
      console.log("Failed to fetch user details:", error);
    }
  };

  useEffect(() => {
    if (decoded?.id) {
      console.log("decode", decoded?.id, storageData);
      handleGetDetailUser(decoded?.id, storageData);
    }
  }, []);

  // const query = useQuery({ queryKey: ["todos"], queryFn: fetchAPI });

  return (
    <>
      <Routes>
        {routes.map((route) => {
          const Layout = route.isShowHeader ? HeaderComponent : Fragment;
          return (
            <Route
              path={route.path}
              element={
                <>
                  <Layout />
                  <route.page />
                </>
              }
            />
          );
        })}
      </Routes>
    </>
  );
}
