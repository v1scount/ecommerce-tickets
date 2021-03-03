import React, { useState } from "react";


const OrderDetail = ({ product, addProduct,removeProduct, deleteProduct}) => {
  return (
    <div className="orderProduct">
      <img src={product.img} style={{ width: "36px", height: "36px" }}/>
      <span>{product.name}</span>
      <span>{product.price.toFixed(2)*product.cantidad}</span>
      <div style={{ display: "flex" }}>
        <button onClick={addProduct}>+</button>
        <span style={{ margin: "10px" }}>{product.cantidad}</span>
        <button onClick={removeProduct}>-</button>
      </div>
      <button onClick={deleteProduct}>X</button>
    </div>
  );
};

export default OrderDetail;
