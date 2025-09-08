import React from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import "./CardComponent.css";
import { productList } from "./ProductList";
import {useNavigate } from "react-router-dom";

const CardComponent = () => {
  const navigate = useNavigate()
  return (
    <div className="product__container">
      {productList.map((product) => {
        return (
          <Card key= {product.id} className="product__card">
            <Card.Img
              variant="top"
              src={product.image}
              style={{ height: "180px", width: "180px", paddingTop: "15px" }}
            />
            <Card.Body>
              <Card.Text className="product__text">
                {product.name}
              </Card.Text>
              <div>{product.star}</div>
              <div className="price__div--card">{product.price}</div>
              <Button variant="primary" className="buy__button"  onClick={()=> navigate("/product-detail")}>
                Mua ngay
              </Button>
            </Card.Body>
          </Card>
        );
      })}
    </div>
  );
};

export default CardComponent;
