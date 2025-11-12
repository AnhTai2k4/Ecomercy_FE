import React from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import "./CardComponent.css";
import { productList } from "./ProductList";
import {useNavigate } from "react-router-dom";

const CardComponent = () => {
  const navigate = useNavigate()
  return (
    <div className="card__container" onClick={()=>navigate("/product-detail")}>
      <img src="https://salt.tikicdn.com/cache/750x750/media/catalog/producttmp/f9/ef/80/db2030d1d4f125d28b0b0bf02461b759.png.webp" alt="" className="card__img" />
      <p>Máy giặt LG AI DD Inverter 10 kg FV1410S4W1 </p>
      <p className="card__rate">⭐⭐⭐</p>
      <p>500000 đ</p>
    </div>
  );
};

export default CardComponent;
