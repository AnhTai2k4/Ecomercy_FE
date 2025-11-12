import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../../redux/slices/userSlice";
import "./UserDetail.css";
import { jwtDecode } from "jwt-decode";
import { putUser, addRegister } from "../../../service/UserService";
import WebAuthnCheckbox from "../../components/WebAuthnCheckbox/WebAuthnCheckbox";

const UserDetail = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch()
  console.log("User detail ne", user);
  const [nameEdit, setNameEdit] = useState(user.name);
  const [usernameEdit, setUsernameEdit] = useState(user.username);
  const [addWebAuthn, setAddWebAuthn] = useState(false);
  const [removeWebAuthn, setRemoveWebAuthn] = useState(false);
  useEffect(() => {
    if (user) {
      setNameEdit(user.name || "");
      setUsernameEdit(user.username || "");
    }
  }, [user]); // chạy lại khi user thay đổi


  const handleUpdate = async () => {
    dispatch(updateUser({ name: nameEdit, username: usernameEdit, isAdmin:"false", credential: addWebAuthn }))
    console.log("user sau khi gan lai", user)
    const decode = jwtDecode(user.access_token)
    const id = decode.id;
    console.log("id: ", decode.id);
    if (addWebAuthn) {
      const username = user.username
      const result = await addRegister({username});
      user.credential = result.data;
    }
    await putUser(id, user);
  };
  return (
    <div className=" table__container">
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">username</th>
            <th scope="col">isAdmin</th>
            <th scope="col">Web Authn</th>
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
              {!user.credential?
              <>
              <WebAuthnCheckbox user={user} setAddWebAuthn={setAddWebAuthn} setRemoveWebAuthn={setRemoveWebAuthn}/>
              <label style={{marginLeft:"10px"}} htmlFor="">Thêm </label>
              </>
              :
              <>
              <p>Đã có</p>
              </>}
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
