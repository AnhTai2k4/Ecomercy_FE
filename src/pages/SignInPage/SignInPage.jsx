import React, { useEffect, useState } from "react";
import "./SignInPage.css";
import {
  getDetailUser,
  loginUser,
  loginUserWebauthn,
} from "../../../service/UserService";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../../redux/slices/userSlice";

const SignInPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const user = useSelector((state) => state.user);
  const [way, setWay] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  console.log("way", way);

  const mutation = useMutation({
    mutationFn: ({ type, data }) => {
      if (type === "password") return loginUser(data);
      else {
        const { username } = data;
        return loginUserWebauthn({ username });
      }
    },
  });

  const { data, isLoading, isError, isSuccess } = mutation;
  console.log("data", mutation.data);

  const handleGetDetailUser = async (id, access_token) => {
    try {
      const res = await getDetailUser(id, access_token);
      dispatch(updateUser({ ...res?.data, access_token: access_token }));
    } catch (error) {
      console.log("Failed to fetch user details:", error);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      localStorage.setItem("access_token", JSON.stringify(data?.Access_token));
      console.log("access_token", data?.Access_token);
      const decoded = jwtDecode(data?.Access_token);
      console.log("decoded ne", decoded);

      if (decoded?.id) {
        handleGetDetailUser(decoded?.id, data?.Access_token);
      }

      console.log("credential ne", user.credential);

      if (way === "password") {
        if (user.credential) {
          console.log("Dang xac thuc Webauthn");
          loginUserWebauthn({ username })
          .then((res) => {navigate("/");})
          .catch((err) => {
            alert("Xác thực Webauthn thất bại");
          });
        } else {
          navigate("/");
        }
      } else {
        navigate("/");
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
    mutation.mutate({ type: way, data: { username, password } });
    console.log("username:", username);
    console.log("Password:", password);
  };

  //-----------------------Select way signin----------------------------
  if (way === "") {
    return (
      <div className="signin__container">
        <div className="signin__card">
          {/**----------------Signin Left------------------------------ */}

          <div className="signin__item--1">
            <h1>Xin chào</h1>
            <p>Mời lựa chọn phương thức đăng nhập</p>

            <button className="button__form" onClick={() => setWay("password")}>
              Đăng nhập bằng mật khẩu
            </button>

            <button
              className="button__form"
              style={{ backgroundColor: "GrayText" }}
              onClick={() => setWay("webauthn")}
            >
              Đăng nhập bằng WebAuthn
            </button>
            <br />
            <span className="span__item" style={{ display: "flex" }}>
              Chưa có tài khoản?
              <a className="a__item" href="/sign-up">
                Tạo tài khoản
              </a>
            </span>
          </div>

          {/**---------------Signin Right------------------- */}
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
  }
  return (
    <div className="signin__container">
      <div className="signin__card">
        {/**----------------Signin Left------------------------------ */}

        {way === "password" ? (
          <div className="signin__item--1">
            <h1>Xin chào</h1>
            <p>Đăng nhập bằng mật khẩu</p>

            <input
              className="input__form"
              type="username"
              placeholder="Username"
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
              Quay lại
            </a>
            <span className="span__item" style={{ display: "flex" }}>
              Chưa có tài khoản?
              <a className="a__item" href="/sign-up">
                Tạo tài khoản
              </a>
            </span>
          </div>
        ) : (
          <div className="signin__item--1">
            <h1>Xin chào</h1>
            <p>Đăng nhập bằng WebAuthn</p>

            <input
              className="input__form"
              type="username"
              placeholder="Username"
              value={username}
              onChange={handleUsernameChange}
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
              Quay lại
            </a>
            <span className="span__item" style={{ display: "flex" }}>
              Chưa có tài khoản?
              <a className="a__item" href="/sign-up">
                Tạo tài khoản
              </a>
            </span>
          </div>
        )}

        {/**---------------Signin Right------------------- */}
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
