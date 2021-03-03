import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import OrderDetail from "./OrderDetail/orderDetail";
import {
  removeProduct,
  addProduct,
  removeAllProduct,
} from "../../redux/reducers/carritoReducer";
import { Link, useHistory } from "react-router-dom";

import "./Order.css";

const Order = () => {
  const history = useHistory();
  const productos = useSelector((state) => state.carrito.products);
  const dispatch = useDispatch();

  const addProductAction = (id) => {
    console.log("add product");
    dispatch(addProduct({ id }));
  };

  const removeProductAction = (id) => {
    console.log("remove product");
    dispatch(removeProduct({ id }));
  };
  const deleteProduct = (id) => {
    console.log("remove product");
    dispatch(removeAllProduct({ id }));
  };


  return (
    <div className="orderContainer" >
      <div className="container2">
        <div className="row">
          <div className="col-sm-12 col-md-10 col-md-offset-1">
            <div className="alignedTitle">
            <strong><h1>Tus Productos</h1></strong>
            <p><strong>Abajo encontrarás tus productos y el importe total por tu compra</strong></p>
            </div>
            <table className="table table" id ='table-order'>
              <thead>
                <tr style={{backgroundColor:"#243B53"}}>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th className="text-center">Price</th>
                  <th className="text-center">Subtotal</th>
                  <th> </th>
                </tr>
              </thead>
              <tbody>
                {productos.map((product) => {
                  return (
                    <tr>
                      <td className="col-sm-8 col-md-6">
                        <div className="media">
                          <a className="thumbnail pull-left" href="#">
                            {" "}
                            <img
                              className="media-object"
                              src={product.img}
                              style={{ width: "72px", height: "72px" }}
                            />{" "}
                          </a>
                          <div className="media-body">
                            <h4 className="heading" onClick={() => history.push(`products/${product.id}`)}>
                              {product.name}
                            </h4>
                          </div>
                        </div>
                      </td>
                      <td
                        className="col-sm-1 col-md-1"
                        style={{ textAlign: "center" }}
                      >
                        <input
                          type="email"
                          className="form-control"
                          id="exampleInputEmail1"
                          value={product.cantidad}
                        />
                        <i id="input-plus" className="fas fa-plus" onClick={() => {
                            dispatch(addProduct({ id: product.id }));
                          }}></i>
                        <i id="input-minus" className="fas fa-minus" onClick={() => {
                            dispatch(removeProduct({ id: product.id }));
                          }}></i>
                      </td>
                      <td className="col-sm-1 col-md-1 text-center">
                        <strong>${product.price}</strong>
                      </td>
                      <td className="col-sm-1 col-md-1 text-center">
                        <strong>${product.price * product.cantidad}</strong>
                      </td>
                      <td className="col-sm-1 col-md-1">
                        <button
                          type="button"
                          className="btn btn"
                          style={{backgroundColor:"#C62828", color:"white"}}
                          onClick={() =>
                            dispatch(removeAllProduct({ id: product.id }))
                          }
                        >
                          <span className="glyphicon glyphicon-remove"></span>{" "}
                          Remove
                        </button>
                      </td>
                    </tr>
                  );
                })}
                <tr>
                  <td>   </td>
                  <td>   </td>
                  <td>   </td>

                  <td>
                    <h3>Total:</h3>
                  </td>
                  <td className="text-right">
                    <h3 style={{color:"#006644"}}>
                      <strong>
                        $
                        {productos.reduce(
                          (acc, item) => acc + item.price * item.cantidad,
                          0
                        )}
                      </strong>
                    </h3>
                  </td>
                </tr>

                <tr>
                  <td>   </td>
                  <td>   </td>
                  <td>   </td>
                  <td>
                    <button type="button" className="btn btn-customized" onClick={(() => history.push("/"))}>
                      Continue Shopping
                    </button>
                  </td>
                  <td>
                    <button type="button" className="btn btn-checkoutOrder" onClick = {() => history.push('/order/checkout')}>
                      Go to Checkout{" "}
                      <span className="glyphicon glyphicon-play"></span>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;
