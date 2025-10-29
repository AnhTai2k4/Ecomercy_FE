import React, { useEffect, useState } from "react";
import "./SignInPage.css";
import { getDetailUser, loginUser } from "../../../service/UserService";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { updateUser } from "../../redux/slices/userSlice";

const SignInPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const mutation = useMutation({
    mutationFn: (data) => loginUser(data),
  });

  const { data, isLoading, isError, isSuccess } = mutation;
  console.log("mutation", mutation);

  const handleGetDetailUser = async (id, access_token) => {
    try {
      const res = await getDetailUser(id, access_token);
      dispatch(updateUser({ ...res?.data, access_token: access_token }));
      console.log("res ne", res);
    } catch (error) {
      console.log("Failed to fetch user details:", error);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      navigate("/");

      localStorage.setItem(
        "access_token",
        JSON.stringify(data.data?.Access_token)
      );
      console.log("access_token", data.data?.Access_token);
      const decoded = jwtDecode(data.data?.Access_token);
      console.log("decoded ne", decoded);

      if (decoded?.id) {
        handleGetDetailUser(decoded?.id, data.data?.Access_token);
      }
    }
  }, [isSuccess, navigate]);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = () => {
    mutation.mutate({ username, password });
    console.log("username:", username);
    console.log("Password:", password);
  };
  return (
    <div className="signin__container">
      <div className="signin__card">
        <div className="signin__item--1">
          <h1>Xin chào</h1>
          <p>Đăng nhập</p>

          <input
            className="input__form"
            type="username"
            placeholder="abc@gmail.com"
            value={username}
            onChange={handleUsernameChange}
          />
          <br />
          <input
            className="input__form"
            type="password"
            placeholder="password"
            value={password}
            onChange={handlePasswordChange}
          />

          {mutation.isError && (
            <p style={{ fontSize: "small", marginTop: "0px", color: "red" }}>
              Tài khoản không hợp lệ
            </p>
          )}

          <button className="button__form" onClick={handleSubmit}>
            Đăng nhập
          </button>
          <br />
          <a className="a__item" href="">
            Quên mật khẩu
          </a>
          <span className="span__item" style={{ display: "flex" }}>
            Chưa có tài khoản?
            <a className="a__item" href="/sign-up">
              Tạo tài khoản
            </a>
          </span>
        </div>
        <div className="signin__item--2">
          <img
            src="https://salt.tikicdn.com/ts/upload/df/48/21/b4d225f471fe06887284e1341751b36e.png"
            alt=""
            className="signin__img"
          />
          <h3>Mua sắm tại Tiki</h3>
          <p style={{ margin: "0px" }}>Siêu ưu đãi mỗi ngày</p>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
