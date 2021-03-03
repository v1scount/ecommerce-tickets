import React, { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import "./UserOrdersDetail.css";
import Pagination from "../../Pagination/Pagination";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";
import { getUserOrderDetail } from "../../../redux/actions/orderActions";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from 'react-router-dom';
import spinner from "../../Spinner";

const UserOrdersDetail = () => {
  const [orders, setOrders] = useState([]);
  const [checkbox, setCheckbox] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [productPerPage, setProductPerPage] = useState(8);
  const indexOfLastProduct = currentPage * productPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productPerPage;
  const paginate = (pageNum) => setCurrentPage(pageNum);
  const nextPage = () => setCurrentPage(currentPage + 1);
  const prevPage = () => setCurrentPage(currentPage - 1);
  const dispatch = useDispatch();
  const order = useSelector((state) => state.order.orden);
  let url = window.location.pathname;
  let id = url.substring(url.lastIndexOf("/") + 1);
  const history = useHistory();

  let currentOrder =
    Array.isArray(orders) &&
    orders.slice(indexOfFirstProduct, indexOfLastProduct);

  useEffect(() => {
    if (!order) return spinner();
    const cargarOrdenes = () => dispatch(getUserOrderDetail(id));
    setOrders(cargarOrdenes());
  }, []);

  useEffect(() => {
    setOrders(order);
  });

  /*  const getId = (id) => {
    const checkboxId = orders.find((order) => id === order.id);
    setCheckbox(checkboxId);
  };

  const removeData = (id) => {
    const deleteOrder = Array.isArray(orders) && orders.filter((c) => id !== c.id);
    setOrders(deleteOrder);
  }; */

  return (
    <div className="table-parent">
      <div className="row">
        {/*  <div className="button-groups">
          <ButtonGroup aria-label="Basic example" id="button-group">
            <Button variant="primary">Edit</Button>
            <Button
              variant="danger"  onClick={() => removeData(checkbox)}
            >
              Delete
            </Button>
            <Button variant="success">Download</Button>
            <div className="navSearch">
              <div class="form-group has-search">
                <span
                  class="fa fa-search form-control-feedback"
                  id="icon-search"
                ></span>
                <input
                  type="text"
                  class="form-control"
                  placeholder="Search"
                  id="input-search"
                />
              </div>
            </div>
          </ButtonGroup>
        </div> */}
        <Table responsive="lg" striped bordered hover variant="dark">
          <thead>
            <tr>
              {/*   <th>
                <input type="checkbox" />
              </th> */}
              <th>Order ID</th>
              <th>State</th>
            </tr>
          </thead>
          <tbody>
            {!currentOrder
              ? spinner()
              : Array.isArray(currentOrder) &&
                currentOrder.map((allOrder) => {
                    return (
                      <tr key={orders.id}>
                        {/*   <th>
                          <input
                            type="checkbox" onClick={() => getId(order.id)}
                          />
                        </th> */}
                        <td style = {{cursor: 'pointer'}} onClick = {() => history.push(`/admin/orders/${allOrder.id}`)}>{allOrder.id}</td>
                        <td>{allOrder.state}</td>
                      </tr>
                    );
                })}
          </tbody>
        </Table>
      </div>
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
    </div>
  );
};

export default UserOrdersDetail;
