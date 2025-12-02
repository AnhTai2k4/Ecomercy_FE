import React, { useState } from "react";
import "./SignInPage.css";
import {
  getDetailUser,
  loginUser,
  loginUserWebauthn,
  loginUserWebauthnTwoFactor,
  checkUsername,
} from "../../../service/UserService";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../../redux/slices/userSlice";

const SignInPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const user = useSelector((state) => state.user);
  const [step, setStep] = useState(1); // 1 = nhập username, 2 = đăng nhập, 3 = xác thực WebAuthn (cho 2FA), 0: Thay đổi phương thức đăng 
  const [loginType, setLoginType] = useState(""); // "webauthn" hoặc "password"
  const [isTwoFactorAuth, setIsTwoFactorAuth] = useState(false);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleGetDetailUser = async (id, access_token) => {
    try {
      const res = await getDetailUser(id, access_token);
      console.log("res", res.data);
      dispatch(updateUser({ ...res?.data, access_token: access_token }));
    } catch (error) {
      console.log("Failed to fetch user details:", error);
    }
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    setErrorMessage("");
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setErrorMessage("");
  };

  // Xử lý khi nhập username và click đăng nhập
  const handleCheckUsername = async () => {
    if (!username.trim()) {
      setErrorMessage("Vui lòng nhập username");
      return;
    }

    setIsCheckingUsername(true);
    setErrorMessage("");

    try {
      const res = await checkUsername({ username });

      console.log("Response from checkUsername:", res);
      console.log("hasWebAuthnCredentials:", res?.data?.hasWebAuthnCredentials);
      console.log("isTwoFactorAuth:", res?.data?.isTwoFactorAuth);

      const hasCredentials = res?.data?.hasWebAuthnCredentials;
      const is2FA = res?.data?.isTwoFactorAuth;

      setIsTwoFactorAuth(is2FA);

      // Nếu bật 2FA, luôn bắt đầu bằng mật khẩu
      if (is2FA) {
        setLoginType("password");
        setStep(2);
      } else {
        // Nếu không bật 2FA, đăng nhập bình thường
        if (hasCredentials) {
          setLoginType("webauthn");
          setStep(2);
        } else {
          setLoginType("password");
          setStep(2);
        }
      }
    } catch (error) {
      setErrorMessage("Tài khoản không hợp lệ");
      console.error("Error checking username:", error);
    } finally {
      setIsCheckingUsername(false);
    }
  };

  // Xử lý đăng nhập bằng WebAuthn
  const handleWebAuthnLogin = async () => {
    try {
      const result = await loginUserWebauthn({ username });

      if (result?.Access_token) {
        localStorage.setItem("access_token", JSON.stringify(result.Access_token));
        const decoded = jwtDecode(result.Access_token);

        if (decoded?.id) {
          await handleGetDetailUser(decoded?.id, result.Access_token);
        }

        navigate("/");
      }
    } catch (error) {
      setErrorMessage("Xác thực WebAuthn thất bại");
      console.error("WebAuthn login error:", error);
    }
  };

  // Xử lý đăng nhập bằng mật khẩu
  const handlePasswordLogin = async () => {
    if (!password.trim()) {
      setErrorMessage("Vui lòng nhập mật khẩu");
      return;
    }

    try {
      const result = await loginUser({ username, password });

      // Nếu bật 2FA, chỉ xác thực mật khẩu, chuyển sang bước 2 (WebAuthn)
      if (result?.requiresTwoFactor) {
        setStep(3); // Chuyển sang bước xác thực WebAuthn
        setErrorMessage("");
        return;
      }

      // Nếu không bật 2FA, đăng nhập thành công
      if (result?.Access_token) {
        localStorage.setItem("access_token", JSON.stringify(result.Access_token));
        const decoded = jwtDecode(result.Access_token);

        if (decoded?.id) {
          await handleGetDetailUser(decoded?.id, result.Access_token);
        }

        navigate("/");
      }
    } catch (error) {
      setErrorMessage("Sai mật khẩu hoặc tài khoản không hợp lệ");
      console.error("Password login error:", error);
    }
  };

  // Xử lý xác thực WebAuthn cho 2FA (bước 2)
  const handleWebAuthnTwoFactor = async () => {
    try {
      const result = await loginUserWebauthnTwoFactor({ username });

      if (result?.Access_token) {
        localStorage.setItem("access_token", JSON.stringify(result.Access_token));
        const decoded = jwtDecode(result.Access_token);

        if (decoded?.id) {
          await handleGetDetailUser(decoded?.id, result.Access_token);
        }

        navigate("/");
      }
    } catch (error) {
      setErrorMessage("Xác thực WebAuthn thất bại");
      console.error("WebAuthn 2FA error:", error);
    }
  };

  const handleSubmit = () => {
    if (step === 1) {
      // Bước 1: Kiểm tra username
      handleCheckUsername();
    } else if (step === 2) {
      // Bước 2: Đăng nhập
      if (loginType === "webauthn") {
        handleWebAuthnLogin();
      } else if (loginType === "password") {
        handlePasswordLogin();
      }
    } else if (step === 3) {
      // Bước 3: Xác thực WebAuthn cho 2FA
      handleWebAuthnTwoFactor();
    }
  };

  const handleBack = () => {
    if (step === 3) {
      // Nếu đang ở bước 3 (WebAuthn 2FA), quay lại bước 2 (nhập mật khẩu)
      setStep(2);
      setPassword("");
      setErrorMessage("");
    } else {
      // Quay lại bước 1
      setStep(1);
      setLoginType("");
      setPassword("");
      setIsTwoFactorAuth(false);
      setErrorMessage("");
    }
  };

  const handleChangeLoginType = () => {
    setStep(0);
    setLoginType("");
    setPassword("");
    setIsTwoFactorAuth(false);
    setErrorMessage("");
  };

  //-----------------------Select way signin----------------------------
  if (step === 0) {
   return (
      <div className="signin__container">
        <div className="signin__card">
          {/**----------------Signin Left------------------------------ */}

          <div className="signin__item--1">
            <h1>Xi n chào</h1>
            <p>Mời lựa chọn phương thức đăng nhập</p>

            <button className="button__form" style={{width:"70%"}} onClick={() => {setStep(2); setLoginType("password");}}>
              Đăng nhập bằng mật khẩu
            </button>

            <button
              className="button__form"
              style={{ backgroundColor: "GrayText", width:"70%" }}
              onClick={() => {setStep(2); setLoginType("webauthn");}}
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

        {step === 1 ? (
          // Bước 1: Nhập username
          <div className="signin__item--1">
            <h1>Xin chào</h1>
            <p>Vui lòng nhập tên đăng nhập</p>

            <input
              className="input__form"
              type="text"
              placeholder="Username"
              value={username}
              onChange={handleUsernameChange}
              disabled={isCheckingUsername}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSubmit();
                }
              }}
            />

            {errorMessage && (
              <p style={{ fontSize: "small", marginTop: "0px", color: "red" }}>
                {errorMessage}
              </p>
            )}

            <button
              className="button__form"
              onClick={handleSubmit}
              disabled={isCheckingUsername}
            >
              {isCheckingUsername ? "Đang kiểm tra..." : "Tiếp tục"}
            </button>
            <br />
            <span className="span__item" style={{ display: "flex" }}>
              Chưa có tài khoản?
              <a className="a__item" href="/sign-up">
                Tạo tài khoản
              </a>
            </span>
          </div>
        ) : step === 2 && loginType === "webauthn" ? (
          // Bước 2: Đăng nhập bằng WebAuthn
          <div className="signin__item--1">
            <h1>Xin chào</h1>
            <p>Đăng nhập bằng WebAuthn</p>
            <img src="./passkey-illustration-1.svg" alt="WebAuthn" style={{ marginBottom: "20px" }} />

            {errorMessage && (
              <p style={{ fontSize: "small", marginTop: "0px", color: "red" }}>
                {errorMessage}
              </p>
            )}

            <button className="button__form" onClick={handleSubmit}>
              Đăng nhập bằng WebAuthn
            </button>
            <br />
            {step == 3 ?
              <>
                <a className="a__item" href="#" onClick={(e) => { e.preventDefault(); handleBack(); }}>
                  Quay lại
                </a>
              </> :
              <>
                <a className="a__item" href="#" onClick={(e) => { e.preventDefault(); handleChangeLoginType()}}>
                  Phương thức đăng nhập khác
                </a>
              </>}
            <span className="span__item" style={{ display: "flex" }}>
              Chưa có tài khoản?
              <a className="a__item" href="/sign-up">
                Tạo tài khoản
              </a>
            </span>
          </div>
        ) : step === 3 ? (
          // Bước 3: Xác thực WebAuthn cho 2FA
          <div className="signin__item--1">
            <h1>Xin chào</h1>
            <p>Xác thực bảo mật 2 lớp</p>
            
            
            <img src="./passkey-illustration-1.svg" alt="WebAuthn" style={{ marginBottom: "20px" }} />

            {errorMessage && (
              <p style={{ fontSize: "small", marginTop: "0px", color: "red" }}>
                {errorMessage}
              </p>
            )}

            <button className="button__form" onClick={handleSubmit}>
              Xác thực WebAuthn
            </button>
            <br />
            <a className="a__item" href="#" onClick={(e) => { e.preventDefault(); handleBack(); }}>
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
          // Bước 2: Đăng nhập bằng mật khẩu
          <div className="signin__item--1">
            <h1>Xin chào</h1>
            <p>Đăng nhập bằng mật khẩu</p>

            <input
              className="input__form"
              type="text"
              placeholder="Username"
              value={username}
              disabled
            />

            <input
              className="input__form"
              type="password"
              placeholder="Mật khẩu"
              value={password}
              onChange={handlePasswordChange}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSubmit();
                }
              }}
            />

            {errorMessage && (
              <p style={{ fontSize: "small", marginTop: "0px", color: "red" }}>
                {errorMessage}
              </p>
            )}

            <button className="button__form" onClick={handleSubmit}>
              Đăng nhập
            </button>
            <br />
            <a className="a__item" href="#" onClick={(e) => { e.preventDefault(); handleBack(); }}>
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
