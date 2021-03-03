import React from "react";
import "./product.css";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addProduct } from "../../redux/reducers/carritoReducer";
import { addToast } from "../../redux/reducers/toastReducer";

export const Product = ({
  id,
  image,
  name,
  description,
  price,
  stock,
  sold_out,
}) => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user);
  const productosCarrito = useSelector((state) => state.carrito.products);

  if (sold_out === false) {
    return (
      <div className="cardProduct">
      <div className="card">
        <Link to={`/products/${id}`}>
          <img src={image} className="card-img-top" alt={name} />
        </Link>
        <div className="div-h2">
          <h2 className="card-h2">
            <strong className="productNameCardCatalogue">{name}</strong>
            <br />
            <p
            className="productDescriptionCardCatalogue">{description}</p>
          </h2>
        </div>
        <div className="div-button">
          <button
            className="button-card"
            type="button"
            onClick={() => {
              const pc = productosCarrito.find((x) => x.id == id);
              dispatch(
                addProduct({
                  userId: currentUser.isAuthenticated
                    ? currentUser.userAUTH.id
                    : 0,
                  product: {
                    id,
                    image,
                    name,
                    description,
                    price,
                    stock,
                    img: image,
                  },
                  cantidadActual: pc ? pc.cantidad : 0,
                  cantidadAgregar: 1
                })
              );

              dispatch(
                addToast({
                  type: "success",
                  content: "Producto agregado!!!",
                })
              );
            }}
          >
            Comprar
          </button>
        </div>
      </div>
      </div>
    );
  } else {
    return (
      <div className="cardProduct">
      <div className="card">
        <div class="ribbon">
          <span>AGOTADO</span>{" "}
        </div>
        <Link to={`/products/${id}`}>
          <img src={image} className="card-img-top" alt={name} />
        </Link>
        <div className="div-h2">
          <h2 className="card-h2">
            {name}
            <br />
            {description}
          </h2>
        </div>
      </div>
      </div>
    );
  }
};

export default Product;
