import axios from "axios";
import {
  startRegistration,
  startAuthentication,
} from "@simplewebauthn/browser";
import { useNavigate } from "react-router";

const axiosJWT = axios.create();
const axiosInstance = axios.create();
const loginUser = async (data) => {
  const res = await axiosJWT.post(
    "http://localhost:3001/api/user/sign-in",
    data,
    { withCredentials: true }
  );
  return res.data.data;
};

const loginUserWebauthn = async ({ username }) => {
  try {
    const res = await axiosJWT.post(
      "http://localhost:3001/api/user/login/option",
      { username }
    );

    const options = await res.data;
    const authResp = await startAuthentication(options);

    if (authResp) {
      const verifyRes = await axios.post(
        "http://localhost:3001/api/user/login/verify",
        { username, authResp }
      );

      const result = await verifyRes.data;
      console.log("result", result);
      if (result) return result;
    }
    
  } catch (err) {
    console.log(err.response.data.message)
    throw err
  } finally {
  }
};
const registerUser = async (data) => {
  const res = await axiosJWT.post(
    "http://localhost:3001/api/user/sign-up",
    data
  );
  return res.data;
};

const registerUserWebauthn = async ({ username }) => {
  try {
    // console.log(username)
    // Gọi BE lấy challenge đăng ký
    const res = await axiosJWT.post(
      "http://localhost:3001/api/user/register/option",
      { username }
    );

    const options = res.data.option;
    
    console.log(options);

    if (!options.challenge) {
      throw new Error("Backend không trả về challenge. Kiểm tra BE logs!");
    }

    // Gọi API WebAuthn của trình duyệt
    console.log(" Starting WebAuthn registration with options:", options);
    const attResp = await startRegistration(options);
    if (!attResp) {
      throw new Error("Vui lòng xác thực WebAuthn");
    }
    console.log(" WebAuthn registration response:", attResp);

    // Gửi lại để verify
    const verifyRes = await axiosJWT.post(
      "http://localhost:3001/api/user/register/verify",
      { username, attResp }
    );

    const result = await verifyRes.data;
    alert(result.message);
    return result;
  } catch (err) {
    console.error("Register error:", err.response.data.message);
    throw err
  }
};

const addRegister = async ({ username }) => {
  try {
    // console.log(username)
    // Gọi BE lấy challenge đăng ký
    const res = await axiosJWT.post(
      "http://localhost:3001/api/user/register/add",
      { username }
    );

    const options = res.data.option;
    
    console.log(options);

    if (!options.challenge) {
      throw new Error("Backend không trả về challenge. Kiểm tra BE logs!");
    }

    // Gọi API WebAuthn của trình duyệt
    console.log(" Starting WebAuthn registration with options:", options);
    const attResp = await startRegistration(options);
    if (!attResp) {
      throw new Error("Vui lòng xác thực WebAuthn");
    }
    console.log(" WebAuthn registration response:", attResp);

    // Gửi lại để verify
    const verifyRes = await axiosJWT.post(
      "http://localhost:3001/api/user/register/addVerify",
      { username, attResp }
    );

    const result = await verifyRes.data;
    if(result) alert("Tạo Webauthn thành công ");
    return result;
  } catch (err) {
    console.error("Register error:", err.response.data.message);
    throw err
  }
};

const getDetailUser = async (id, access_token) => {
  const res = await axiosJWT.get(
    `http://localhost:3001/api/user/getUser/${id}`,
    {
      headers: { token: `Bearer ${access_token}` },
    }
  );
  return res.data;
};

const putUser = async (id, data) => {
  const res = await axiosJWT.put(
    `http://localhost:3001/api/user/update/${id}`,
    data
  );
  return res.data;
};

const refreshToken = async () => {
  const res = await axiosInstance.post(
    `http://localhost:3001/api/user/refreshToken`,
    {},
    {
      withCredentials: true,
    }
  );
  console.log("res data sau refresh ne", res.data);
  return res.data;
};
const logoutUser = async (data) => {
  const res = await axiosJWT.post(
    "http://localhost:3001/api/user/log-out",
    data
  );
  return res.data;
};

export {
  loginUser,
  loginUserWebauthn,
  registerUser,
  addRegister,
  registerUserWebauthn,
  getDetailUser,
  refreshToken,
  axiosJWT,
  logoutUser,
  putUser,
};
