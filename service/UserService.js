import axios from "axios";
 const loginUser = async (data) => {
    const res = await axios.post("http://localhost:3001/api/user/sign-in", data)
    return res.data
}

const registerUser = async (data) => {
    const res = await axios.post("http://localhost:3001/api/user/sign-up", data)
    return res.data
}

const getDetailUser = async (id, access_token) => {
  const res = await axios.get(`http://localhost:3001/api/user/getUser/${id}`,{
    headers: {token: `Bearer ${access_token}`}
  })
  return res.data
}
export {loginUser, registerUser, getDetailUser};