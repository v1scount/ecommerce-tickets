import React, { useEffect, useContext, useState } from "react";
import "./SideBarRight.css";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useHistory } from "react-router-dom";
import {
  clearCar,
  removeProduct,
  addProduct,
  removeAllProduct,
  loadGuestCart,
} from "../../redux/reducers/carritoReducer";
import ProductItem from "../ProductItem/ProductItem";
import { Context } from "../../App";
import { Link } from "react-router-dom";
import { loadState } from "../../redux/maintainState/saveLoad";
import { fetchCart } from "../../redux/reducers/carritoReducer";
import clienteAxios from "../../config/axios";
import { getUserOrderDetail } from "../../redux/actions/orderActions.js";
import Swal from "sweetalert2";

export default function SideBarRight() {
  const { setRightBarOpen, isRightBarOpen } = useContext(Context);
  const dispatch = useDispatch();
  const location = useLocation();
  const productos = useSelector((state) => state.carrito.products);
  const products = useSelector((state) => state.products.productos);
  const url = window.location.pathname;
  const productsUrl = `/products/${products.id}`;
  const catalogueUrl = "/";
  const shoppingCount = productos.reduce(
    (prev, curr) => (prev ?? 0) + curr.cantidad,
    0
  );
  const userData = useSelector((state) => state.user);
  const userAUTH = useSelector((state) => state.user.userAUTH);
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const history = useHistory();

  useEffect(() => {
    if (productos.length > 0 && location.pathname === "/") {
      setRightBarOpen(true);
    }
  }, [productos]);

  useEffect(() => {
    const moverLocalABack = async (state, userId) => {
      const result = await clienteAxios.get(`orders/users/${userAUTH.id}/cart`);

      var data;
      if (Array.isArray(result.data)) {
        data = result.data[0].products;
      } else {
        data = result.data.products;
      }

      //pasar productos de state.carrito.products al back
      for (const localProduct of state) {
        if (typeof data !== "undefined") {
          var lineOrderBack = data.map((firstLoop) => firstLoop.lineOrder);
          var productBack = lineOrderBack.find(
            (x) => x.productId == localProduct.id
          );
        }

        if (productBack) {
          const result = await clienteAxios.put(
            `orders/users/${userAUTH.id}/cart`,
            {
              productId: localProduct.id,
              cantidad: productBack.cantidad + localProduct.cantidad,
            }
          );
        } else {
          const result = await clienteAxios.post(
            `orders/users/${userAUTH.id}/cart`,
            {
              productId: localProduct.id,
              cantidad: localProduct.cantidad,
            }
          );
        }
      }
      dispatch(fetchCart(userData.userAUTH.id));
    };
    if (userData.isAuthenticated) {
      const state = JSON.parse(localStorage.getItem("carritoGuest"), "[]");
      if (state && state.length > 0) {
        moverLocalABack(state, userData.userAUTH.id);
      } else if (productos.length > 0) {
        dispatch(fetchCart(userData.userAUTH.id));
      }
    } else {
      dispatch(loadGuestCart(0));
    }
  }, [userData]);

  const handleLogin = () => {
    if (!isAuthenticated) {
      Swal.fire({
        icon: "info",
        title: `Tienes que identificarte para concluir tu compra`,
        confirmButtonText: `Ok`,
        background: "#19191a",
      });
    }
    history.push("./login");
  };

  return (
    <div
      className="sidebarright-container"
      style={{
        right: isRightBarOpen ? "0px" : "-400px",
        // Si está en products/:id no cambia el margin top
        marginTop: url === productsUrl ? "0px" : null,
        // Si está en el catálogo o en products/:id se ve, si no, está escondido
        visibility:
          url === productsUrl
            ? "visible"
            : url === catalogueUrl
            ? "visible"
            : "hidden",
      }}
      id="cd-shadow-layer"
    >
      <div id="cd-cart">
        <div className="cd-btn">
          <button
            type="button"
            onClick={() => setRightBarOpen(false)}
            className="btn-close btn-close-white"
            aria-label="Close"
            id="close-btn"
          ></button>
        </div>
        <div className="cd-titles">
          <h2 className="cd-title">
            <strong>Carro ({shoppingCount})</strong>
            <p
              className="cd-empty"
              onClick={() => {
                dispatch(clearCar(userAUTH.id));
              }}
            >
              <strong>
                <a href="#0"> Vaciar </a>
              </strong>
              <i className="fas fa-trash-alt"></i>
            </p>
          </h2>
        </div>
        <ul className="cd-cart-items">
          {productos.map((producto) => (
            <li>
              <ProductItem
                key={producto.id}
                product={producto}
                onIncreaseCant={() => {
                  const pc = productos.find((x) => x.id == producto.id);
                  dispatch(
                    addProduct({
                      userId: isAuthenticated ? userAUTH.id : 0,
                      product: producto,
                      cantidadActual: pc ? pc.cantidad : 0,
                      cantidadAgregar: 1,
                    })
                  );
                }}
                onDecreaseCant={() => {
                  const pc = productos.find((x) => x.id == producto.id);
                  dispatch(
                    addProduct({
                      userId: isAuthenticated ? userAUTH.id : 0,
                      product: producto,
                      cantidadActual: pc ? pc.cantidad : 0,
                      cantidadAgregar: -1,
                    })
                  );
                }}
              />
            </li>
          ))}
        </ul>
        <div className="cd-bottom-div">
          <div className="cd-cart-total">
            <p>
              <strong>Total:</strong>{" "}
              {productos.reduce(
                (acc, item) => acc + item.price * item.cantidad,
                0
              )}
              $
            </p>
          </div>

          <Link
            to="/order/checkout"
            style={{ textDecoration: "none" }}
            className="cd-checkout-btn"
          >
            <p onClick={handleLogin}>Hacer checkout</p>
          </Link>

          <Link
            to="/order"
            style={{ textDecoration: "none" }}
            className="cd-go-to-cart"
          >
            Ver tu orden de compra
          </Link>
        </div>
      </div>
    </div>
  );
}
