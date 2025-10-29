import axios from "axios";
import {
  startRegistration,
  startAuthentication,
} from "@simplewebauthn/browser";

const axiosJWT = axios.create();
const axiosInstance = axios.create();
const loginUser = async (data) => {
  const res = await axiosJWT.post(
    "http://localhost:3001/api/user/sign-in",
    data,
    { withCredentials: true }
  );
  return res.data;
};

const registerUser = async (data) => {
  const res = await axiosJWT.post(
    "http://localhost:3001/api/user/sign-up",
    data
  );
  return res.data;
};

const registerUserWebauthn = async ({username}) => {
  try {
    
    // console.log(username)
    // Gọi BE lấy challenge đăng ký
    const res = await fetch(
        "http://localhost:3001/api/user/register/option",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username }),
        }
      );

    if (!res.ok) {
      const errorData = await res.json();
      console.log(errorData)
      throw new Error(errorData.error || "Lỗi từ server");
    }

    const data = await res.json();
    const options = data.option
    console.log(options)

    if (!options.challenge) {
      throw new Error("Backend không trả về challenge. Kiểm tra BE logs!");
    }

    // Gọi API WebAuthn của trình duyệt
    console.log(" Starting WebAuthn registration with options:", options);
    const attResp = await startRegistration(options);
    console.log(" WebAuthn registration response:", attResp);

    // Gửi lại để verify
    const verifyRes = await fetch(
      "http://localhost:3001/api/user/register/verify",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, attResp }),
      }
    );

    if (!verifyRes.ok) {
      const errorData = await verifyRes.json();
      throw new Error(errorData.error || "Xác minh thất bại");
    }

    const result = await verifyRes.json();
    alert(result.message)
    return result
  } catch (err) {
    console.error("Register error:", err);
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
  registerUser,
  registerUserWebauthn,
  getDetailUser,
  refreshToken,
  axiosJWT,
  logoutUser,
  putUser,
};
