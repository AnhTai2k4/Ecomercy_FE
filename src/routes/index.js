import HeaderComponent from "../components/HeaderComponent/HeaderComponent";
import HomePage from "../pages/HomePage/HomePage";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import OrderPage from "../pages/OrderPage/OrderPage";
import ProductPage from "../pages/ProductPage/ProductPage";
import SignInPage from "../pages/SignInPage/SignInPage";
import SignUpPage from "../pages/SignUpPage/SignUpPage";
import ProductDetail from "../pages/ProductDetail/ProductDetail";
import UserDetail from "../pages/UserDetail/UserDetail.jsx";

export const routes = [
  {
    path: "/",
    page: HomePage,
    isShowHeader: true,
  },
  {
    path: "/error",
    page: NotFoundPage,
    isShowHeader: false,
  },
  {
    path: "/order",
    page: OrderPage,
    isShowHeader: true,
  },
  {
    path: "/product",
    page: ProductPage,
    isShowHeader: true,
  },
  {
    path: "/product-detail",
    page: ProductDetail,
    isShowHeader: true,
  },
  {
    path: "/sign-in",
    page: SignInPage,
    isShowHeader: false,
  },
  {
    path: "/sign-up",
    page: SignUpPage,
    isShowHeader: false,
  },
  {
    path: "/detail-user",
    page: UserDetail,
    isShowHeader: true,
  },
  {
    path: "*",
    page: NotFoundPage,
    isShowHeader: false,
  },
];
