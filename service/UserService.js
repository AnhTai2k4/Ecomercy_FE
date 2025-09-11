import axios from "axios";

 const axiosJWT = axios.create();
 const axiosInstance = axios.create();
 const loginUser = async (data) => {
    const res = await axiosJWT.post("http://localhost:3001/api/user/sign-in", data,{ withCredentials: true })
    return res.data
}

const registerUser = async (data) => {
    const res = await axiosJWT.post("http://localhost:3001/api/user/sign-up", data)
    return res.data
}

const getDetailUser = async (id, access_token) => {
  const res = await axiosJWT.get(`http://localhost:3001/api/user/getUser/${id}`,{
    headers: {token: `Bearer ${access_token}`}
  })
  return res.data
}

const refreshToken = async () => {
  const res = await axiosInstance.post(`http://localhost:3001/api/user/refreshToken`,{},{
    withCredentials: true
  })
  console.log("res data sau refresh ne", res.data);
  return res.data
}
export {loginUser, registerUser, getDetailUser,refreshToken, axiosJWT};