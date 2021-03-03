import React, { useState, useEffect } from "react";
import "./Admin.css";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getUsers } from "../../../redux/actions/userActions";
import spinner from "../../Spinner";
import { useHistory } from "react-router-dom";
import Table from "react-bootstrap/Table";
import Pagination from "../../Pagination/Pagination";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";
import {
  getOrder,
  editOrder,
  getOrderDetail,
  selectOrder
} from "../../../redux/actions/orderActions";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Swal from "sweetalert2";
import Modal from "react-bootstrap/Modal";
import { getAllReviews } from "../../../redux/actions/reviewActions";
import { getProducts } from "../../../redux/actions/productActions";

export const Admin = () => {
  const [orders, setOrders] = useState([]);
  const [ordersDetail, setOrdersDetail] = useState([]);
  const [users, setUsers] = useState([]);
  const user = useSelector((state) => state.user.users);
  const [currentPage, setCurrentPage] = useState(1);
  const [productPerPage, setProductPerPage] = useState(8);
  const indexOfLastProduct = currentPage * productPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productPerPage;
  const paginate = (pageNum) => setCurrentPage(pageNum);
  const nextPage = () => setCurrentPage(currentPage + 1);
  const prevPage = () => setCurrentPage(currentPage - 1);
  const dispatch = useDispatch();
  const order = useSelector((state) => state.order.orden);
  const ordersId = order.map((orders) => orders.id);
  const ordenEditar = useSelector((state) => state.order.ordenEditar);
  const ordenSeleccionada = useSelector((state)=> state.order.ordenseleccionada)
  console.log(ordenSeleccionada)
  const history = useHistory();
  const [reviewProducts, setReviewProducts] = useState([]);
  const reviews = useSelector((state) => state.review.review);
  const [productos, setProductos] = useState([]);
  const products = useSelector((state) => state.products.productos);
  const [filter, setFilter] = useState("none");
  const [checked, setChecked] = useState(false);
  const [checkbox, setcheckbox] = useState({
    carrito: false,
    creada: false,
    procesando: false,
    cancelada: false,
    completada: false,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [show, setShow] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [stateName, setStateName] = useState(null);

  let currentOrder =
    Array.isArray(orders) &&
    orders.slice(indexOfFirstProduct, indexOfLastProduct);

  useEffect(() => {
    const cargarOrdenes = () => dispatch(getOrder());
    setOrders(cargarOrdenes());
  }, [ordenEditar]);

  useEffect(() => {
    setOrders(order);
  });

  useEffect(() => {
    const cargarProductos = () => dispatch(getProducts());
    setProductos(cargarProductos());
  }, []);

  useEffect(() => {
    setProductos(products);
  });

  useEffect(() => {
    setUsers(user);
  }, []);

  useEffect(() => {
    const getReviews = () => dispatch(getAllReviews());
    getReviews();
  }, []);

  useEffect(() => {
    if (!reviews) return spinner();
    setReviewProducts(reviews);
  });

  console.log(ordersId);

  const handleCheckbox = (e) => {
    var elemento = e.target.name;
    var checkboxes = checkbox;
    if (checkbox[elemento] === false) {
      for (let key in checkboxes) {
        checkboxes[key] = false;
      }
      checkboxes[e.target.name] = true;
    } else {
      const checkboxes = checkbox;
      for (let key in checkboxes) {
        checkboxes[key] = false;
      }
    }

    setcheckbox(checkboxes);

    if (filter === e.target.value) setFilter("none");
    else {
      setFilter(e.target.value);
      setChecked(true);
    }
  };

  const lista = () => {
    return currentOrder.filter((item) => {
      const state = item.state.toString().toLowerCase();
      if (state === filter) {
        return state.includes(filter);
      } else if (filter === "none") {
        return currentOrder;
      }
    });
  };

  const handleState = function (orderId, stateName) {
    setOrderId(orderId);
    setStateName(stateName);
    setShow(true);
  };

  const handleOrderDetail = (orderId) => {
    dispatch(selectOrder(orderId))
    setShowDetail(true);
  };

  const handleClose = function () {
    setShow(false);
    setShowDetail(false);
  };

  const handleChangeState = function () {
    dispatch(editOrder({ state: stateName }, orderId));
    Swal.fire({
      title: "Estado actualizado",
      icon: "success",
      confirmButtonTex: "Aceptar",
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.reload();
        setShow(false);
      } else {
        window.location.reload();
      }
    });
  };

  const states = ["carrito", "creada", "procesando", "cancelada", "completada"];

  let finishedOrders = [];
  Array.isArray(orders) &&
    orders.forEach((order) => {
      return order.state === "creada" ? finishedOrders.push(order) : null;
    });

  let totalProducts = 0;
  Array.isArray(productos) &&
    productos.map((cantidad) => {
      totalProducts += cantidad.stock;
    });
  
    console.log(user);

  return (
    <div class="mainAdmin">
      <div class="row">
        <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
          <div class="white-box">
            <div class="col-in row">
              <div class="col-md-6 col-sm-6 col-xs-6">
                {" "}
                <i data-icon="E" class="linea-icon linea-basic"></i>
                <h5 class="text-muted vb">USUARIOS</h5>
              </div>
              <div class="col-md-6 col-sm-6 col-xs-6">
              <h3
                  class="counter text-right m-t-15" style={{color: "#627D9B"}}
                  id="textCounter"
                >
                  {users.length}
                </h3>
              </div>
              <div class="col-md-12 col-sm-12 col-xs-12">
                <div class="progress">
                  <div
                    class="progress-bar progress-bar-danger"
                    role="progressbar"
                    aria-valuenow="40"
                    aria-valuemin="0"
                    aria-valuemax="100"
                    style={{ width: "40%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
          <div class="white-box">
            <div class="col-in row">
              <div class="col-md-6 col-sm-6 col-xs-6">
                {" "}
                <i class="linea-icon linea-basic" data-icon="&#xe01b;"></i>
                <h5 class="text-muted vb">ORDENES</h5>
              </div>
              <div class="col-md-6 col-sm-6 col-xs-6">
              <h3
                  class="counter text-right m-t-15 text-megna"
                  id="textCounter" style={{color:"#BCCCDC"}}
                >
                  {orders.length}
                </h3>
              </div>
              <div class="col-md-12 col-sm-12 col-xs-12">
                <div class="progress">
                  <div
                    class="progress-bar progress-bar-megna"
                    role="progressbar"
                    aria-valuenow="40"
                    aria-valuemin="0"
                    aria-valuemax="100"
                    style={{ width: "40%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
          <div class="white-box">
            <div class="col-in row">
              <div class="col-md-6 col-sm-6 col-xs-6">
                {" "}
                <i class="linea-icon linea-basic" data-icon="&#xe00b;"></i>
                <h5 class="text-muted vb">PRODUCTOS</h5>
              </div>
              <div class="col-md-6 col-sm-6 col-xs-6">
              <h3
                  class="counter text-right m-t-15"
                  id="textCounter" style={{color:"#9FB3C8"}}
                >
                  {" "}
                  {totalProducts}
                </h3>
              </div>
              <div class="col-md-12 col-sm-12 col-xs-12">
                <div class="progress">
                  <div
                    class="progress-bar progress-bar-primary"
                    role="progressbar"
                    aria-valuenow="40"
                    aria-valuemin="0"
                    aria-valuemax="100"
                    style={{ width: "40%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-sm-12">
          <div class="white-box">
            <h3 class="box-title">
              Ordenes
              <div
                className="d-flexsearch form-check form-check-inline mb-3 col-3"
                style={{ width: "300px" }}
              >
                <input
                  class="form-control me-2"
                  type="search"
                  placeholder="Buscar por estado"
                  aria-label="Search"
                  id="input-filtersearch"
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                  }}
                  data-toggle="tooltip"
                  data-placement="top"
                  title="Buscar por email o estado"
                />
              </div>
              <hr
                className="lineTableOrders"
              />
              <div class="col-md-2 col-sm-4 col-xs-12 pull-right">
                <select
                  class="form-control pull-right row b-none"
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                  }}
                >
                  <option>Carrito</option>
                  <option>Creada</option>
                  <option>Procesando</option>
                  <option>Cancelada</option>
                  <option>Completada</option>
                </select>
              </div>
            </h3>
            <div class="table-responsive">
              <table class="table ">
                <thead>
                  <tr>
                    <th>Número de orden</th>
                    <th>Status</th>
                    <th>Email del cliente</th>
                    <th>Fecha</th>
                    <th>Precio</th>
                    <th>Ver Detalle</th>
                  </tr>
                </thead>
                <tbody>
                  {!lista()
                    ? spinner()
                    : Array.isArray(lista()) &&
                      lista()
                        .filter((val) => {
                          if (searchTerm == "") {
                            return val;
                          } else if (
                            val.state
                              .toLowerCase()
                              .includes(searchTerm.toLowerCase()) ||
                            val.user.email
                              .toLowerCase()
                              .includes(searchTerm.toLowerCase())
                          ) {
                            return val;
                          }
                        })
                        .map((allOrder) => {
                          return (
                            <tr key={orders.id}>
                              <td
                                class="txt-oflo"
                                style={{ textAlign: "center" }}
                              >
                                {allOrder.id}
                              </td>
                              <td>
                                {allOrder.state + " "}
                                <i
                                  class="fa fa-cog"
                                  onClick={() => {
                                    handleState(allOrder.id, allOrder.state);
                                  }}
                                  style={{ cursor: "pointer" }}
                                ></i>
                              </td>

                              <td class="txt-oflo">{allOrder.user.email}</td>
                              <td class="txt-oflo">
                                {allOrder.updatedAt.substr(0, 10)}
                              </td>

                              <td>
                                <span class="txt-oflo">
                                  {allOrder.products.reduce(
                                    (acc, item) =>
                                      acc +
                                      item.price * item.lineOrder.cantidad,
                                    0
                                  )}
                                  ,00$
                                </span>
                              </td>
                              <td
                                class="txt-oflo"
                                style={{ textAlign: "center" }}
                              >
                                {/* {Acá debería tomarme el id de la orden} */}
                                <i
                                  class="fas fa-eye"
                                  style={{ cursor: "pointer" }}
                                  onClick={() => handleOrderDetail(allOrder.id)}
                                ></i>
                              </td>
                            </tr>
                          );
                        })}
                </tbody>
              </table>{" "}
              <div className="pag">
                <div className="pagnation">
                  <Pagination
                    productPerPage={productPerPage}
                    totalproduct={order.length}
                    paginate={paginate}
                    nextPage={nextPage}
                    prevPage={prevPage}
                    currentPage={currentPage}
                  />
                </div>
              </div>
              {/* Modal Cambio de estado */}
              <Modal show={show} size="sm" onhide={handleClose}>
                <Modal.Header id="modal">
                  <Modal.Title id="modal.title">
                    <h4>Modificar estado</h4>
                  </Modal.Title>
                  <Button variant="danger" size="sm" onClick={handleClose}>
                    X
                  </Button>
                </Modal.Header>

                <Modal.Body id="modal">
                  <DropdownButton
                    size="sm"
                    id="dropdownButton"
                    title={stateName}
                    variant="secondary"
                  >
                    {states.map((el) => {
                      return (
                        <Dropdown.Item
                          onClick={() => {
                            setStateName(el);
                          }}
                        >
                          {el}
                        </Dropdown.Item>
                      );
                    })}
                  </DropdownButton>
                </Modal.Body>
                <Modal.Footer id="modal">
                  <Button variant="primary" onClick={handleChangeState}>
                    Guardar cambios
                  </Button>
                </Modal.Footer>

                {/* Modal detalle de orden */}
              </Modal>
              <Modal show={showDetail} size="sm" onhide={handleClose}>
                <Modal.Header id="modal" style={{ width: "500px" }}>
                  <Modal.Title id="modal.title" style={{ width: "500px" }}>
                    <h4>Detalle de ordenes</h4>
                  </Modal.Title>
                  <Button variant="danger" size="sm" onClick={handleClose}>
                    X
                  </Button>
                </Modal.Header>

                <Modal.Body id="modal" style={{ width: "500px" }}>
                  <div class="table-responsive">
                    <table class="table ">
                      <thead>
                        <tr>
                          <th>ID del Producto</th>
                          <th>Producto</th>
                          <th>Unidades</th>
                          <th>Precio</th>
                          <th>Stock</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ordenSeleccionada.map((allOrder) => {
                            return allOrder.products.map((productOrder) => {
                              return (
                                <tr key={orders.id}>
                                  <td
                                    class="txt-oflo"
                                    style={{ textAlign: "center" }}
                                  >
                                    {productOrder.id}
                                  </td>

                                  <td class="txt-oflo">{productOrder.name}</td>
                                  <td class="txt-oflo">
                                    {productOrder.lineOrder.cantidad}
                                  </td>

                                  <td>
                                    <span class="txt-oflo">
                                      {productOrder.lineOrder.price}
                                    </span>
                                  </td>
                                  <td
                                    class="txt-oflo"
                                    style={{ textAlign: "center" }}
                                  >
                                    {productOrder.stock}
                                  </td>
                                </tr>
                              );
                            });
                          })}
                      </tbody>
                    </table>{" "}
                  </div>
                </Modal.Body>
                <Modal.Footer id="modal" style={{ width: "500px" }}>
                  <Button variant="danger" onClick={handleClose}>
                    Cerrar
                  </Button>
                </Modal.Footer>
              </Modal>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-12 col-lg-6 col-sm-12">
          <div class="white-box">
            <h3 class="box-title">Reviews de los usuarios</h3>
            <div class="comment-center">
              <div class="comment-body">
                {reviewProducts.map((productReviews) => {
                  return (
                    <div>
                      <div class="user-img">
                        <img
                          src={productReviews.user.photoURL}
                          style={{ borderRadius: "200px" }}
                        />
                      </div>

                      <div class="mail-contnet">
                        <h5>
                          {productReviews.user.username} sobre{" "}
                          {!productReviews.product.name
                            ? spinner()
                            : productReviews.product.name}
                        </h5>{" "}
                        <span class="mail-desc">
                          {productReviews.description}
                        </span>
                        <a href="javacript:void(0)" class="action">
                          <i class="ti-close text-danger"></i>
                        </a>{" "}
                        <a href="javacript:void(0)" class="action">
                          <i class="ti-check text-success"></i>
                        </a>
                        <span
                          class="time pull-right"
                          style={{ marginLeft: "350px", color: "white" }}
                        >
                          {productReviews.updatedAt.substr(0, 10)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
