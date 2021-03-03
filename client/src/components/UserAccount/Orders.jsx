import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserOrderDetail, getOrderDetail, selectOrder } from "../../redux/actions/orderActions.js";
import { useHistory } from "react-router-dom";
import { addReview } from "../../redux/actions/reviewActions";
import NavBar from "./NavBar.jsx";
import styles from "./orders.module.css";
import "./closeBtn.css";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Table from "react-bootstrap/Table";


export default function UserOrders() {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const res = useSelector((state) => state.order.orden);
  const idUser = useSelector((state) => state.user.userAUTH.id);
  const productos = useSelector((state) => state.carrito.products);
  //Para manejar el Review
  const history = useHistory();
  const [data, setData] = useState({
    description: "",
    rating: 0,
    count: 0,
    userId: idUser,
    clicked: false,
  });

  const [state, setState] = useState(0); //Estado solamente para que el useEffect reconozca
  //un cambio en el componente y lo vuelva a renderizar
  useEffect(() => {
    const obtenerUserOrden = () => dispatch(getUserOrderDetail(idUser));
    obtenerUserOrden();
  }, [state]);

  //handle para pasar el indice del producto a la tabla y que se rendericen
  //los datos de el producto que el usuario eliga
  function handleProduct(productIdIndex, orderId) {
    window.index = productIdIndex;
    window.orderId = orderId;
    setState(state + 1);
  }

  // Para obtener los cambios del review
  const handleChange = (e) =>
    setData({
      ...data,
      count: e.target.value.length,
      description: e.target.value,
    });

  return (
    <div>
      <div className={styles.table}>
        <h1>Detalle de tus compras</h1>
        <hr />
        <Table  id={styles.headerTable}>
        <thead style={{borderTop: "1px groove #9098a0"}}>
            <tr>
              <th scope="col">Creada/Actualizada</th>
              <th scope="col">Numero de orden</th>
              <th scope="col">Total</th>
              <th scope="col">Estado</th>
              <th scope="col"> </th>
            </tr>
          </thead>

          <tbody className = {styles.headerTable}>
            {res.map((el) => {
              return (
                <tr>
                  <td>{el.updatedAt}</td>
                  <th 
                    scope="row"
                    
                  >
                    {el.id}
                  </th>
                  <td>
                    {el.products.reduce(
                      (acc, item) => acc + item.price * item.lineOrder.cantidad,
                      0
                    )},00$
                  </td>
                  <td>{el.state}</td>
                  <td onClick={() => {
                    dispatch(getOrderDetail(el.id))
                    dispatch (selectOrder (el.id))
                    history.push(`/account/me/orders/${el.id}`)}} style={{cursor:"pointer"}}><h6><strong>Ver</strong></h6></td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    </div>
  );
}
{
  /* <i
  onClick={() => {
    setData({ ...data, rating: i + 1 });
    starsHandler();
  }}
  style={{
    color: starClicked.clicked === true ? "yellow" : "white",
    cursor: "pointer",
  }}
  className="fas fa-star"
  value={data.rating}
  id={styles.starsFormRating}
></i>;
 */
}
