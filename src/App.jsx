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
// Main App Component
export default function App() {
  const fetchAPI = async () => {
    console.log(import.meta.env.VITE_BE_URL);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BE_URL}/api/product/get-all-product`
      );
      console.log(res.data.data);
    } catch (error) {
      console.error("Error fetching API:", error);
    }
  };

  const query = useQuery({ queryKey: ["todos"], queryFn: fetchAPI });

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
