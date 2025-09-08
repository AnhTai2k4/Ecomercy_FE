import React, { useEffect } from "react";
import "../SignInPage/SignInPage.css";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { registerUser } from "../../../service/UserService";
import { useNavigate } from "react-router-dom";

const SignUpPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (data) => registerUser(data),
    onSuccess: (data) => {
      console.log("✅ Thành công:", data);
      navigate("/sign-in");
    },
  });

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSignUp = () => {
    console.log("Email:", email);
    console.log("Password:", password);
    console.log("Confirm Password:", confirmPassword);
    mutation.mutate({ email, password, confirmPassword });
  };

  useEffect(() => {
    if (mutation.data) {
      alert("Đăng ký thành công");
      setTimeout(() => {
        navigate("/sign-in");
      }, 1000);
    }
  }, [mutation.data, navigate]);
  console.log("mutation", mutation);

  return (
    <div className="signin__container">
      <div className="signin__card">
        <div className="signin__item--1">
          <h1>Xin chào</h1>
          <p>Tạo tài khoản</p>

          <input
            className="input__form"
            type="email"
            placeholder="abc@gmail.com"
            value={email}
            onChange={handleEmailChange}
          />
          <br />
          <input
            className="input__form"
            type="password"
            placeholder="password"
            value={password}
            onChange={handlePasswordChange}
          />
          <input
            className="input__form"
            type="password"
            placeholder="confirm password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
          />

          {mutation.isError && (
            (<p style={{ fontSize: "small", marginTop: "0px", color: "red" }}>
              Thông tin không hợp lệ
            </p>)
          )}
          <button className="button__form" onClick={handleSignUp}>
            Đăng ký
          </button>
          <br />

          <span className="span__item" style={{ display: "flex" }}>
            Đã có tài khoản?
            <a className="a__item" href="/sign-in">
              Đăng nhập
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

export default SignUpPage;
