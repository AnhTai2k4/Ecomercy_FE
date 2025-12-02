import "./HeaderComponent.css";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import "../../pages/HomePage/HomePage.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { logoutUser, getDetailUser } from "../../../service/UserService";
import { getCookie } from "../../utils";
import { jwtDecode } from "jwt-decode";
import { useState } from "react";
import SecuritySettingsModal from "../SecuritySettings/SecuritySettingsModal";

export default function HeaderComponent() {
  const navigate = useNavigate();

  const user = useSelector((state) => state.user);
  const [showSecurityModal, setShowSecurityModal] = useState(false);

  const typeProduct = [
    "Thịt, rau củ",
    "Bách hóa",
    "Nhà cửa",
    "Điện tử",
    " Thiết bị số",
    "Điện thoại",
    "Mẹ & bé",
    "Làm đẹp",
    "Gia dụng",
    "Thời trang nữ",
    "Thời trang nam",
    "Giày nữ",
    "Túi nữ",
  ];

  const handleLogout = async () => {
    // Xóa thông tin người dùng khỏi Redux
    // dispatch(logout());
    // Chuyển hướng về trang đăng nhập
    try{
      // const cookie = getCookie("Refresh_token");
      // console.log("Cookie de logout ne", cookie);
      // const response = await logoutUser('cookie');
      // console.log("Logout response:", response);
      const access_token= localStorage.getItem('access_token')
      console.log("access_token de logout", access_token)
      localStorage.removeItem('access_token')
      navigate("/sign-in"); 
    }
    catch(error){
      console.error("Logout failed:", error);
    }
  }

  const handleGetDetailUser = async () => {
    
    try{
      navigate("/detail-user");
    }
    catch(error){
      console.error("navigate detail user failed:", error);
    }
  }

  return (
    <>
      <div className="introduce__container">
        Freeship đơn từ 45k, giảm nhiều hơn cùng
        <img
          className="img__introduce"
          src="https://salt.tikicdn.com/ts/upload/a7/18/8c/910f3a83b017b7ced73e80c7ed4154b0.png"
          alt=""
        />
      </div>

      <div className="header__container">
        <div className="header__container--2 ">
          <img
            className="img__logo--brand"
            src="https://salt.tikicdn.com/ts/upload/0e/07/78/ee828743c9afa9792cf20d75995e134e.png"
            alt="Anh logo"
            onClick={() => {
              navigate("/");
            }}
          />
          <div className="sreach__container"></div>

          <InputGroup className="mb-3">
            <Form.Control
              aria-label="Example text with button addon"
              aria-describedby="basic-addon1"
              placeholder="Tìm kiếm sản phẩm tại đây"
              className="search__input"
            />

            <Button
              className="search__button"
              variant="outline-secondary"
              id="button-addon1"
            >
              Tìm kiếm
            </Button>
          </InputGroup>

          <div className="login__container">

            <div class="dropdown">
              <img
                class= "btn btn-secondary dropdown-toggle"
                src="https://cdn1.iconfinder.com/data/icons/material-core/20/account-circle-1024.png"
                alt=""
                className= "img__logo--account"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{cursor: "pointer"}}
              />
                
              <div class="dropdown-menu">
                <button class="dropdown-item" style={{cursor: "pointer", fontSize: "16px"}} onClick={() => handleGetDetailUser()}>
                  Thông tin cá nhân
                </button>
                <button class="dropdown-item" style={{cursor: "pointer", fontSize: "16px"}}>
                  Quản trị viên
                </button>
                <button class="dropdown-item" style={{cursor: "pointer", fontSize: "16px"}} onClick={() => setShowSecurityModal(true)}>
                  Cài đặt bảo mật
                </button>
                <button class="dropdown-item" style={{cursor: "pointer", fontSize: "16px"}} onClick={() => handleLogout()}>
                  Đăng xuất
                </button>
                
              </div>
            </div>

            {user?.name ? (
              <span style={{ marginLeft: "10px" }}>
                <div className="link__text" href="/sign-in">
                  {user?.name}
                </div>
              </span>
            ) : (
              <span style={{ marginLeft: "10px" }}>
                <a className="link__text" href="/sign-in">
                  Đăng nhập
                </a>
                <span style={{ fontSize: "18px" }}> / </span>
                <a className="link__text" href="/sign-up">
                  Đăng ký
                </a>
              </span>
            )}
          </div>

          <div className="cart__container">
            <img
              src="https://cdn1.iconfinder.com/data/icons/material-core/20/shopping-cart-1024.png"
              alt=""
              className="img__logo--account"
            />
            <span style={{ marginLeft: "10px" }}>
              <a className="link__text" href="https://www.google.com">
                Giỏ hàng
              </a>
            </span>
          </div>
        </div>

        <hr />
      </div>

      <div className="TypeProduct__container">
        {typeProduct.map((type) => {
          return (
            <div key={type} className="TypeProduct__card">
              {type}
            </div>
          );
        })}
      </div>
      <br />
      <hr />
      <SecuritySettingsModal
        isOpen={showSecurityModal}
        onClose={() => setShowSecurityModal(false)}
      />
    </>
  );
}
