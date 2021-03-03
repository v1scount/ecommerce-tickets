import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getUserOrderDetail,
  getOrderDetail,
} from "../../redux/actions/orderActions.js";
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
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import spinner from "../Spinner";

export default function UserOrders() {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const res = useSelector((state) => state.order.ordenseleccionada);
  const idUser = useSelector((state) => state.user.userAUTH.id);
  const idOrder = useSelector ((state)=> state.order.idordenseleccionada);


  let url = window.location.pathname;
  let id = url.substring(url.lastIndexOf("/") + 1);
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
  const [open, setOpen] = useState(false);

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

  useEffect(() => {
    if (!res) return spinner();
    const cargarOrdenes = () => dispatch(getOrderDetail(id));
    cargarOrdenes();
  }, []);

  return (
    <div>
      <div className={styles.table}>
        <h1>Detalle de la orden #{res[0].id}</h1>
        <hr />
        <Table  variant="">
          <tbody>
    
                <tr style={{lineHeight: "1.5"}}>
                  <div>
                    <div className={styles.divRow}>
                      <div>
                      <Row className="align-items-center" id = {styles.rowOrder} style={{borderTop: "1px groove #9098a0"}}>
                        <Col>
                          <h6><strong>Fecha Creada/Actualizada</strong></h6>
                        </Col>
                        <Col>
                          <h6>{res[0].updatedAt}</h6>
                        </Col>
                      </Row>
                    </div>
                    </div>
                    <Row className="align-items-center" id = {styles.rowOrder2}>
                      <Col>
                        <h6><strong>Número de orden</strong></h6>
                      </Col>
                      <Col>
                        <h6><strong>{res[0].id}</strong></h6>
                      </Col>
                    </Row>
                    <Row className="align-items-center" id = {styles.rowOrder}>
                      <Col>
                        <h6><strong>Productos</strong></h6>
                      </Col>
                      <Col>
                      <Dropdown> 
                      <Dropdown.Toggle variant="" className={styles.navDropdownList}>
                      Selecciona un producto
                      </Dropdown.Toggle >
                        <Dropdown.Menu  style= {{marginTop: "0px"}}>
                        {res[0].products.map((product) => {
                        return (
                          <Dropdown.Item
                            onClick={() =>
                              handleProduct(res[0].products.indexOf(product), res[0].id)
                            }
                          >
                            {product.name}
                              </Dropdown.Item>
                            );
                          })}
                        </Dropdown.Menu>
                        </Dropdown>
                      </Col>
                    </Row>
                    <Row className="align-items-center" id = {styles.rowOrder2}>
                      <Col>
                        <h6><strong>Descripción</strong></h6>
                      </Col>
                      <Col>
                        <h6>
                          {res[0].products[window.index] && window.orderId === res[0].id
                            ? res[0].products[window.index].description
                            : ""}
                        </h6>
                      </Col>
                    </Row>
                    <Row className="align-items-center" id = {styles.rowOrder}>
                      <Col>
                        <h6><strong>Cantidad</strong></h6>
                      </Col>
                      <Col>
                        <h6>
                          {" "}
                          {res[0].products[window.index] && window.orderId === res[0].id
                            ? res[0].products[window.index].lineOrder.cantidad
                            : ""}{" "}
                        </h6>{" "}
                      </Col>
                    </Row>
                    <Row className="align-items-center" id = {styles.rowOrder2}>
                      <Col>
                        <h6><strong>Precio</strong></h6>
                      </Col>
                      <Col>
                        <h6>
                          {res[0].products[window.index] && window.orderId === res[0].id
                            ? res[0].products[window.index].price
                            : ""}
                          ,00$
                        </h6>
                      </Col>
                    </Row>
                   {res[0].state === "completada"?
                    <Row className="align-items-center" id = {styles.rowOrder}>
                    <Col>
                      <h6><strong>Review</strong></h6>
                    </Col>
                    <Col>
                      <p
                        onClick={handleShow}
                        className={styles.titleReviewFormUser}
                        variant="dark"
                        style = {{pointer:"cursor"}}
                      >
                        Si te gustó podés dejarnos una reseña!
                      </p>
                      <Modal
                        show={show}
                        onHide={handleClose}
                        backdrop="static"
                        keyboard={false}
                        className={styles.modalContainer}
                      >
                        <Modal.Header
                          closeButton
                          className={styles.modalStyle}
                        >
                          <Modal.Title className={styles.modalStyle}>
                            En{" "}
                            <img
                              src="https://bit.ly/37jca0M"
                              style={{ height: "20px" }}
                            />{" "}
                            nos importa lo que tenés para decir!
                          </Modal.Title>
                        </Modal.Header>
                        <Form
                          onSubmit={(e) => {
                            e.preventDefault();
                            dispatch(
                              addReview(data, res[0].products[window.index].id)
                            );
                            history.push("/");
                          }}
                        >
                          <Modal.Body className={styles.modalStyle}>
                            <Form.Group controlId="formBasicEmail">
                              <Form.Label className={styles.labelDescription}>
                                Cuéntanos que te pareció{" "}
                                {res[0].products[window.index] &&
                                window.orderId === res[0].id
                                  ? res[0].products[window.index].name
                                  : ""}
                              </Form.Label>
                            </Form.Group>

                            <textarea
                              className={styles.inputDescription}
                              onChange={(e) => handleChange(e)}
                              maxlength={1000}
                              value={data.description}
                            />
                            <p className={styles.countCharacters}>
                              {data.count}/1000
                            </p>
                            <Form.Group controlId="formBasicPassword">
                              <Form.Label className={styles.labelDescription}>
                                ¿Cómo calificarías tu experiencia?
                              </Form.Label>
                            </Form.Group>

                            <div
                              class="starrating risingstar d-flex justify-content-center flex-row-reverse"
                              id="divStars"
                            >
                              <input
                                type="radio"
                                id="star5"
                                name="rating"
                                value={data.rating}
                                onClick={() =>
                                  setData({ ...data, rating: 5 })
                                }
                              />
                              <label for="star5" title="5 star"></label>
                              <input
                                type="radio"
                                id="star4"
                                name="rating"
                                value={data.rating}
                                onClick={() =>
                                  setData({ ...data, rating: 4 })
                                }
                              />
                              <label for="star4" title="4 star"></label>
                              <input
                                type="radio"
                                id="star3"
                                name="rating"
                                value={data.rating}
                                onClick={() =>
                                  setData({ ...data, rating: 3 })
                                }
                              />
                              <label for="star3" title="3 star"></label>
                              <input
                                type="radio"
                                id="star2"
                                name="rating"
                                value={data.rating}
                                onClick={() =>
                                  setData({ ...data, rating: 2 })
                                }
                              />
                              <label for="star2" title="2 star"></label>
                              <input
                                type="radio"
                                id="star1"
                                name="rating"
                                value={data.rating}
                                onClick={() =>
                                  setData({ ...data, rating: 1 })
                                }
                              />
                              <label for="star1" title="1 star"></label>
                            </div>
                          </Modal.Body>
                          <Modal.Footer className={styles.modalStyle}>
                            <Button variant="danger" onClick={handleClose}>
                              Close
                            </Button>
                            <Button variant="success" type="submit">
                              Enviar
                            </Button>
                          </Modal.Footer>
                        </Form>
                      </Modal>
                    </Col>
                  </Row>
                  :
                  console.log("")}
                  </div>
                </tr>
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
