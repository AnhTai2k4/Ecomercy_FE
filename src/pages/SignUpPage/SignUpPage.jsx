import React, { useEffect } from "react";
import "../SignUpPage/SignUpPage.css";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { registerUser, registerUserWebauthn } from "../../../service/UserService";
import { useNavigate } from "react-router-dom";

const SignUpPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [way, setWay] = useState("password");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: async ({ type, data }) => {
      if (type === "password") return await registerUser(data);
      else if (type === "webauthn") {
        console.log(data)
        return await registerUserWebauthn(data);
      }
    },
    onSuccess: (data) => {
      console.log("✅ Thành công:", data);
    },
    onError: (error) => {
      console.error("❌ Lỗi:", error);
      setError(error.response.data.message || "Đăng ký thất bại");
    },
  });

  const validatePassword = (password, confirmPassword) => {
    if (password.length < 8) {
      setError("Mật khẩu phải có ít nhất 8 ký tự");
      return false;
    }
    if (password !== confirmPassword) {
      setError("Mật khẩu và mật khẩu xác nhận không khớp");
      return false;
    }
    return true;
  };


  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSignUp = () => {
    console.log("username:", username);
    console.log("Password:", password);
    console.log("Confirm Password:", confirmPassword);
    if (way === "password" && validatePassword(password, confirmPassword) === false) return;

    if (way === "password")
      mutation.mutate({ type: way, data: { username, password, confirmPassword } });
    else if (way === "webauthn") mutation.mutate({ type: way, data: { username } });
  };

  useEffect(() => {
    if (mutation.data) {
      alert("Đăng ký thành công");
      setTimeout(() => {
        navigate("/sign-in");
      }, 1000);
    }
  }, [mutation.data, navigate]);


  return (
    <div className="signup__container">
      <div className="signup__card">
        <div className="signup__item--1">
          <h1>Xin chào</h1>
          <p>Tạo tài khoản</p>
          {/**-------------Đăng ký bằng mật khẩu-------------------- */}

          <>
            <input
              className="input__form"
              type="username"
              placeholder="username"
              value={username}
              onChange={(e) => { handleUsernameChange(e); setError("") }}
            />

            <input
              className="input__form"
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => { handlePasswordChange(e); setError("") }}
            />
            <input
              className="input__form"
              type="password"
              placeholder="confirm password"
              value={confirmPassword}
              onChange={(e) => { handleConfirmPasswordChange(e); setError("") }}
            />

            {error && (
              <p
                style={{ fontSize: "small", marginTop: "0px", color: "red" }}
              >
                {error}
              </p>
            )}
          </>


          <button className="button__form" onClick={handleSignUp}>
            Đăng ký
          </button>
          <br />

          <a className="a__item" href="">
            Quay lại
          </a>
          <span className="span__item" style={{ display: "flex" }}>
            Đã có tài khoản?
            <a className="a__item" href="/sign-in">
              Đăng nhập
            </a>
          </span>
        </div>
        <div className="signup__item--2">
          <img
            src="https://salt.tikicdn.com/ts/upload/df/48/21/b4d225f471fe06887284e1341751b36e.png"
            alt=""
            className="signup__img"
          />
          <h3>Mua sắm tại Tiki</h3>
          <p style={{ margin: "0px" }}>Siêu ưu đãi mỗi ngày</p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
