import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../../redux/slices/userSlice";
import "./UserDetail.css";
import { jwtDecode } from "jwt-decode";
import { putUser, addRegister, getDetailUser } from "../../../service/UserService";
import TwoFactorCheckbox from "../../components/WebAuthnCheckbox/WebAuthnCheckbox";

const UserDetail = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch()
  console.log("User detail ne", user);
  const [nameEdit, setNameEdit] = useState(user.name);
  const [usernameEdit, setUsernameEdit] = useState(user.username);
  const [addTwoFactorAuth, setAddTwoFactorAuth] = useState(false);
  const [removeTwoFactorAuth, setRemoveTwoFactorAuth] = useState(false);
  useEffect(() => {
    if (user) {
      setNameEdit(user.name || "");
      setUsernameEdit(user.username || "");
    }
  }, [user]); // chạy lại khi user thay đổi

  


  const handleUpdate = async () => {
    const decode = jwtDecode(user.access_token)
    const id = decode.id;
    
    // Xử lý tắt 2FA
    if (removeTwoFactorAuth && user.isTwoFactorAuth) {
      // Tắt 2FA, giữ nguyên credentials
      const updatedUser = { ...user, isTwoFactorAuth: false };
      dispatch(updateUser(updatedUser));
      await putUser(id, { name: nameEdit, username: usernameEdit, isAdmin: "false", isTwoFactorAuth: false });
      alert("Đã tắt bảo mật 2 lớp!");
      return;
    }
    
    // Xử lý bật 2FA
    if (addTwoFactorAuth && !user.isTwoFactorAuth) {
      // Kiểm tra xem user đã có credentials chưa
      const hasCredentials = user.credentials && user.credentials.length > 0;
      
      if (!hasCredentials) {
        // Nếu chưa có credentials, thêm thiết bị đầu tiên
        const username = user.username;
        try {
      const result = await addRegister({username});
          // result từ addRegister là { data: user.credentials } từ controller
          if(result && result.data) {
            // Sau khi đăng ký thành công, gọi lại getDetailUser để lấy thông tin user mới nhất (bao gồm credentials)
            const updatedUserRes = await getDetailUser(id, user.access_token);
            if(updatedUserRes?.data) {
              // Cập nhật user với thông tin mới nhất từ backend (bao gồm credentials array)
              const updatedUser = { ...updatedUserRes.data, access_token: user.access_token, isTwoFactorAuth: true };
              dispatch(updateUser(updatedUser));
              // Cập nhật isTwoFactorAuth trên backend
              await putUser(id, { name: nameEdit, username: usernameEdit, isAdmin: "false", isTwoFactorAuth: true });
              alert("Bật bảo mật 2 lớp thành công!");
              return;
            }
          }
        } catch (error) {
          console.error("Error adding credential:", error);
          alert("Không thể thêm thiết bị WebAuthn: " + (error.response?.data?.message || error.message));
          return;
    }
      } else {
        // Nếu đã có credentials, chỉ bật 2FA
        const updatedUser = { ...user, isTwoFactorAuth: true };
        dispatch(updateUser(updatedUser));
        await putUser(id, { name: nameEdit, username: usernameEdit, isAdmin: "false", isTwoFactorAuth: true });
        alert("Bật bảo mật 2 lớp thành công!");
        return;
      }
    }
    
    // Cập nhật thông tin user bình thường (không thay đổi 2FA)
    dispatch(updateUser({ name: nameEdit, username: usernameEdit, isAdmin:"false", isTwoFactorAuth: user.isTwoFactorAuth || false }))
    await putUser(id, { name: nameEdit, username: usernameEdit, isAdmin: "false", isTwoFactorAuth: user.isTwoFactorAuth || false });
  };
  return (
    <div className=" table__container">
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">username</th>
            <th scope="col">isAdmin</th>
            <th scope="col">Bảo mật 2 lớp</th>
            <th scope="col">Update</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td scope="row">
              <input
                type="text"
                value={nameEdit}
                style={{ border: "hidden" }}
                onChange={(e) => setNameEdit(e.target.value)}
              />
            </td>
            <td>
              <input
                type="text"
                value={usernameEdit}
                style={{ border: "hidden" }}
                onChange={(e) => setUsernameEdit(e.target.value)}
              />
            </td>
            <td>
              <input
                type="text"
                value={String(user.isAdmin)}
                style={{ border: "hidden" }}
              />
            </td>
            <td>
              <TwoFactorCheckbox 
                user={user} 
                setAddTwoFactorAuth={setAddTwoFactorAuth} 
                setRemoveTwoFactorAuth={setRemoveTwoFactorAuth}
              />
              <label style={{marginLeft:"10px"}} htmlFor="">
                {user.isTwoFactorAuth ? "Bảo mật 2 lớp đang bật" : "Bảo mật 2 lớp đang tắt"}
              </label>
            </td>
            <td scope="row">
              <button onClick={handleUpdate}>Update</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default UserDetail;
