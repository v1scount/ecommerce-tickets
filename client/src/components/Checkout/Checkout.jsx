import React, { useState, useEffect } from "react";
import "./Checkout.css";
import styles from "./checkout.module.css";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  getUserOrderDetail,
  editOrder,
} from "../../redux/actions/orderActions.js";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import clienteAxios from "../../config/axios";
import Swal from "sweetalert2";
import spinner from "../Spinner";
import {
  clearCar
}from "../../redux/reducers/carritoReducer";

// Esto es la key para poder conectar la app a Stripe y poder registrar los pagos
const stripePromise = loadStripe(
  "pk_test_51I9eUyAGbg8RF4WLkKsRgGfWIgR9wIoW4KC4kSdb2E81C1FXYgl3pn3SveppX9HipsVD2AEAKkvdPHlV9KvzQcr800h6zYpCtE",
  { locale: "es" }
);

const ElementCheckout = () => {
  const orderProducts = [];
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [state, setState] = useState(0);
  const orden = useSelector((state) => state.order.orden);
  const dispatch = useDispatch();
  const history = useHistory();
  orden.map((productsOrder) =>
    productsOrder.products.map((lineOrder) => orderProducts.push(lineOrder))
  );
  const totalProductsPrice = orderProducts.reduce(
    (acc, item) => acc + item.lineOrder.price * item.lineOrder.cantidad,
    0
  );
  // En esta variable almaceno los nombres de los productos almacenados en el carrito de la orden
  let productList = orderProducts.map((productsName) => productsName.name);
  // Esta función es para obtener todos los productos en una sola línea separados por "," y mandarlos a la ruta de pago
  let productListNames = Object.keys(productList)
    .map(function (key) {
      return productList[key];
    })
    .join(", ");

  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
      billing_details: {
        name: username.nameUser,
        email: email.email,
      },
    });
    setLoading(true);
    if (!error) {
      const { id } = paymentMethod;
      try {
        const { data } = await clienteAxios.post("/payment/api/checkout", {
          id,
          amount: totalProductsPrice * 100,
          description: productListNames,
        });
        elements.getElement(CardElement).clear();
        await Swal.fire({
          icon: "success",
          title: `Tu pago ha sido realizado con exito`,
          text:
            "Te estaremos enviando los siguientes pasos a seguir a tu email, gracias por elegirnos",
          showConfirmButton: true,
          background: "#19191a",
        });

        // Cambia el estado de la orden a creada
        dispatch(editOrder({ state: "creada" }, orden[0].id));
        setState(state + 1);
        

        const { data2 } = await clienteAxios.post("/email/send-emailCheckout", {
          email: email.email,
          username: username.nameUser,
          price: totalProductsPrice,
          products: productListNames,
        });
        dispatch(editOrder({ state: "completada" }, orden[0].id));
        console.log(data2);
      } catch (err) {
        console.log("message", error);
      }
      setLoading(false);
    } else {
      await Swal.fire({
        title: "Error",
        text: "error",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    }
    dispatch(clearCar());
  };

  useEffect(() => {
    // Cuando se submitea la orden, el valor del estado pasa de 0 a 1, es para redireccionar a Home,
    // Igualmente si está la orden creada o en un estado distinto a carrito, ya no se puede entrar a hacer el checkout
    if (state > 0 ) {
      history.push("/");
    }
  }, [state]);

  const handleEmailUser = (e) => {
    setEmail({ ...email, email: e.target.value });
  };

  const handleCardName = (e) =>
    setUsername({ ...username, nameUser: e.target.value });

  return (
    <form className={`${styles.form} form-group`} onSubmit={handleSubmit}>
      <div className="form-group">
        <div className={styles.iconInputEmail}>
          <i class="fa fa-envelope"></i>
        </div>
        <span className={styles.spanEmail}>Email:</span>{" "}
        <input
          className={styles.inputEmail}
          placeholder="usuario@gmail.com"
          onChange={(e) => handleEmailUser(e)}
        />{" "}
        <div className={styles.iconInputName}>
          <i class="fas fa-money-check"></i>
        </div>
        <span className={styles.spanCardName}>Nombre en la tarjeta:</span>{" "}
        <input
          className={styles.inputName}
          placeholder="Elon Musk"
          onChange={(e) => handleCardName(e)}
        />{" "}
        <span className={styles.spanCardNumber}>Números de la tarjeta:</span>{" "}
        <CardElement
          className={styles.inputCardNumber}
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#424770",
                "::placeholder": {
                  color: "#aab7c4",
                },
              },
              invalid: {
                color: "#9e2146",
              },
            },
          }}
        />
      </div>
      <button className={styles.btn} disabled={!stripe}>
        {loading ? spinner() : "Pagar"}
      </button>
    </form>
  );
};

const Checkout = () => {
  const [orders, setOrders] = useState([]);
  const productos = useSelector((state) => state.carrito.products);
  const orden = useSelector((state) => state.order.orden);
  const dispatch = useDispatch();
  const shoppingCount = productos.reduce(
    (prev, curr) => (prev ?? 0) + curr.cantidad,
    0
  );
  const idUser = useSelector((state) => state.user.userAUTH);
  const userData = useSelector((state) => state.user);

  useEffect(() => {
    if (orden.state === "carrito" && userData.isAuthenticated) {
        const obtenerUserOrden = () => dispatch(getUserOrderDetail(idUser.id));
        obtenerUserOrden();
    }
  }, []);

  useEffect(() => {
    let allOrders = [];
    orden.map((orderProducts) => {
      orderProducts.products.map((lineOrders) => {
        allOrders.push(lineOrders);
      });
    });
    setOrders(allOrders);
  }, []);

  return (
    <Elements stripe={stripePromise}>
      <div className={styles.cardParent}>
        <div className={styles.card}>
          <div className={styles.cardBody}>
            <div className={`row`} id={styles.row}>
              <div className={styles.divTitle}>
                <h1>Orden de Compra</h1>
              </div>
              <div className="col-md-7">
                <div className={`${styles.left} border`}>
                  <div className="row">
                    <h2>Datos de Facturación</h2>{" "}
                    <span className={styles.header}>Métodos de Pago</span>
                    <div className={styles.icons}>
                      {" "}
                      <img
                        src="https://i.ibb.co/2tnzSMb/kisspng-credit-card-e-commerce-visa-payment-mastercard-visa-5abe3402f09681-0399249915224145949855.png"
                        alt="kisspng-credit-card-e-commerce-visa-payment-mastercard-visa-5abe3402f09681-0399249915224145949855"
                        border="0"
                      />{" "}
                      <img src="https://img.icons8.com/color/48/000000/mastercard-logo.png" />{" "}
                      <img
                        src="https://i.ibb.co/jM9ym3V/pngegg.png"
                        alt="pngegg"
                        border="0"
                      />
                      <img
                        src="https://i.ibb.co/VW4X5YD/pngwing-com.png"
                        border="0"
                      />
                      <img
                        src="https://i.ibb.co/9vDSFMS/pngwing-com-3.png"
                        alt="pngwing-com-3"
                        border="0"
                      />
                      <img
                        src="https://i.ibb.co/QNhtgPP/pnghut-jcb-co-ltd-logo-payment-industry-mastercard-jcb-images.png"
                        alt="pnghut-jcb-co-ltd-logo-payment-industry-mastercard-jcb-images"
                        border="0"
                      />
                    </div>
                  </div>

                  <form className={styles.form}>
                    <div className={`row`} id={styles.row}>
                      <div className={styles.col4}>
                        <ElementCheckout />
                      </div>
                      <div className={styles.col4}></div>
                    </div>{" "}
                  </form>
                </div>
              </div>
              <div className="col-md-5">
                <div className={`${styles.right} border`}>
                  <div className={styles.header}>Tus productos</div>
                  <p>
                    {shoppingCount === 0 ? (
                      <p>No hay productos</p>
                    ) : shoppingCount < 2 ? (
                      <p>{shoppingCount} producto</p>
                    ) : (
                      <p>{shoppingCount} productos</p>
                    )}
                  </p>
                  {orders.map((product) => {
                    return (
                      <div>
                        <div className={`row item`} id={styles.row}>
                          <div className={`col-4 align-self-center`}>
                            <img
                              id={styles.imgOrder}
                              className="img-fluid"
                              src={product.img}
                            />
                          </div>
                          <div className="col-8">
                            <div className={`row`} id={styles.row}>
                              <b>
                                $ {product.price * product.lineOrder.cantidad}
                              </b>
                            </div>
                            <div className={`row text-muted`} id={styles.row}>
                              <p>{product.name}</p>
                            </div>
                            <div className={`row`} id={styles.row}>
                              <p>Cantidad: {product.lineOrder.cantidad}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <hr />
                  <div className={`row lower`}>
                    <div>
                      <div className="col text-center">
                        <b>Total a pagar</b>
                      </div>
                      <div className="col text-center">
                        <b>
                          ${" "}
                          {productos.reduce(
                            (acc, item) => acc + item.price * item.cantidad,
                            0
                          )}
                        </b>
                      </div>
                    </div>
                  </div>
                  <div className={`${styles.row} row lower`}>
                    <div className="col text-left"></div>
                  </div>{" "}
                </div>
              </div>
            </div>
          </div>
          <div> </div>
        </div>
      </div>
    </Elements>
  );
};

export default Checkout;
