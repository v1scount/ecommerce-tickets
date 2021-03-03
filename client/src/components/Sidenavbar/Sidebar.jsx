import React, { Fragment, useContext, useEffect, useState } from "react";
import "./Sidebar.css";
import { Link, useHistory, Redirect } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import { useSelector, useDispatch } from "react-redux";
import {
  getCategories,
  getCategoriesName,
} from "../../redux/actions/categoryActions";
import { getProducts } from "../../redux/actions/productActions";
import { Context } from "../../App";
import Collapse from "react-bootstrap/Collapse";

export default function SideBar() {
  //este es el set de la acción que se va a modificar en catálogo
  const {
    currentCategory,
    setCurrentCategory,
    setRightBarOpen,
    isRightBarOpen,
    dropdownSideBar,
    setDropdownSideBar,
  } = useContext(Context);
  const history = useHistory();
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.categories.categorias);
  const productos = useSelector((state) => state.carrito.products);
  const [windowSize, setWindowSize] = useState(window.innerWidth);
  const shoppingCount = productos.reduce(
    (prev, curr) => (prev ?? 0) + curr.cantidad,
    0
  );

  // este handleClick es para que al hacer click al carrito se abra y se cierre
  const handleClick = () => {
    if (currentCategory === "All" && isRightBarOpen === false) {
      setRightBarOpen(true);
    } else if (currentCategory === "Outside") {
      history.push("/order");
    } else {
      setRightBarOpen(false);
    }
  };

  const handleCategory = () => {
    setCurrentCategory("Outside");
  };

  const handleResize = () => {
    setWindowSize(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    window.addEventListener("resize2", handleResize);
  });

  useEffect(() => {
    if (windowSize > 810) {
      setDropdownSideBar("x");
    }
  });

  useEffect(() => {
    if (windowSize < 810) {
      setDropdownSideBar("z");
    }
  }, []);

  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const userAuthenticated = useSelector((state) => state.user.userAUTH);

  return (
    <div className="parent-bar">
      <div
        className="sidebar-container"
        style={{
          visibility:
            dropdownSideBar === "y"
              ? "visible"
              : dropdownSideBar === "z"
              ? "hidden"
              : null,
          /* display: dropdownSideBar === 'z' ? 'none': 'inline-block', */
          marginTop:
            dropdownSideBar === "y"
              ? "74px"
              : dropdownSideBar === "z"
              ? "72px"
              : null,
          transition:
            dropdownSideBar === "y"
              ? "all 0.5s"
              : dropdownSideBar === "z"
              ? "all 0.5s"
              : null,
          height:
            dropdownSideBar === "y"
              ? "400px"
              : dropdownSideBar === "z"
              ? "0px"
              : null,
          position: dropdownSideBar === "y" ? "absolute" : null,
        }}
      >
        <ul className="sidebar-navigation">
          <li className="header">
            <Link to={`/`} onClick={() => dispatch(getProducts())}>
                <img
                src="https://bit.ly/37jca0M"
                onClick={() => dispatch(getProducts())}
                alt=""
                style={{
                  display:
                    dropdownSideBar === "y"
                      ? "none"
                      : dropdownSideBar === "z"
                      ? "none"
                      : "block",
                }}
                width="38"
                height="38"
                /* className="d-inline-block align-top" */
              />
            </Link>
          </li>
          {/* este boton lleva a home y setea la categoría a All, si la categoría es "All", todos los productos se muestran */}
          <li onClick={() => setCurrentCategory("All")}>
            {/* este dispatch de getProducts es porque cuando busco un nombre en la Searchbar y doy en Home se tiene que renderizar todo de nuevo */}
            <Link to={`/`} onClick={() => dispatch(getProducts())}>
              <i className="fa fa-home" aria-hidden="true"></i> Inicio
            </Link>
          </li>
          <li>
            {/* este onClick a getCategories es para que siempre me imprima los nombres de las categorías al renderizar el dropdown */}
            <Dropdown
              className="nav-dropdown"
              onClick={() => dispatch(getCategories())}
            >
              <Dropdown.Toggle variant="" className="dropdown-basic">
                <i className="fa fa-headphones-alt" aria-hidden="true" />{" "}
                Categorías
              </Dropdown.Toggle>
              <Dropdown.Menu className="nav-dropdown-list">
                {Array.isArray(categories) &&
                  categories.map((category) => {
                    return (
                      // aquí seteo el currentCategory con el nombre al que se le haga click en la lista
                      <Dropdown.Item
                        onClick={() => setCurrentCategory(category.name)}
                      >
                        <div key={category.id}>
                          <ul>
                            <li className="list-categories">
                              {/*con este dispatch a categoriesName hago un get al nombre de la categoría que esté en la lista, hace el get a /products/category/:nameCat*/}
                              <p
                                onClick={() =>
                                  dispatch(getCategoriesName(category.name))
                                }
                              >
                                {category.name}
                              </p>
                            </li>
                          </ul>
                        </div>
                      </Dropdown.Item>
                    );
                  })}
              </Dropdown.Menu>
            </Dropdown>
          </li>
          <li onClick={handleClick} className="shopping-icon">
            <Link to={`#`}>
              <i className="fa fa-shopping-cart" aria-hidden="true"></i>
              <span className="badge badge-warning" id="lblCartCount">
                {/* si no hay productos, no se va a mostrar el icono de la cuenta de productos */}
                {productos.length > 0 ? shoppingCount : null}
              </span>
              Carro de Compras
            </Link>
          </li>

          {!userAuthenticated ? null : userAuthenticated.isAdmin === "true" ? (
            <li>
              <Dropdown className="nav-dropdown">
                <Dropdown.Toggle variant="" className="dropdown-basic">
                  <span>
                    <i
                      className="fa fa-user-cog"
                      aria-hidden="true"
                      style={{ paddingRight: "4px" }}
                    ></i>
                    Admin
                  </span>
                </Dropdown.Toggle>
                <Dropdown.Menu className="nav-dropdown-list">
                  <Dropdown.Item>
                    <ul onClick={handleCategory}>
                      <li
                        className="listCategories"
                        onClick={() => history.push("/admin")}
                      >
                        {" "}
                        <i class="fa fa-business-time" aria-hidden="true"></i>
                        Dashboard
                      </li>
                    </ul>
                  </Dropdown.Item>
                  <Dropdown.Item>
                    <ul onClick={handleCategory}>
                      <li
                        className="listCategories"
                        onClick={() => history.push("/admin/products")}
                      >
                        {" "}
                        <i class="fa fa-table" aria-hidden="true"></i>
                        Productos
                      </li>
                    </ul>
                  </Dropdown.Item>
                  <Dropdown.Item>
                    <ul onClick={handleCategory}>
                      <li
                        onClick={() => history.push("/admin/categories")}
                        className="listCategories"
                      >
                        <i class="fa fa-columns" aria-hidden="true"></i>
                        Categorías
                      </li>
                    </ul>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </li>
          ) : null}
          {!isAuthenticated ? (
            <Fragment>
              <li onClick={handleCategory}>
                <Link to={`/user`}>
                  <i
                    className="fas fa-user-plus"
                    style={{ paddingRight: "3px" }}
                    aria-hidden="true"
                  ></i>{" "}
                  Regístrate
                </Link>
              </li>
              <li onClick={handleCategory}>
                <Link to={`/login`}>
                  <i className="fa fa-user" aria-hidden="true"></i> Log In
                </Link>
              </li>
            </Fragment>
          ) : (
            <li>
              <Dropdown className="nav-dropdown">
                <Dropdown.Toggle variant="" className="dropdown-basic">
                  <i class="fa fa-user-circle-o" aria-hidden="true"></i> Mi Cuenta
                  
                </Dropdown.Toggle>
                <Dropdown.Menu className="nav-dropdown-list">
                  <Dropdown.Item>
                    <ul onClick={handleCategory}>
                      <li
                        className="list-categories"
                        onClick={() => history.push("/account/me")}
                      >
                        {" "}
                        <i
                          class="fa fa-user-circle-o"
                          aria-hidden="true"
                          style={{ marginLeft: "-25px" }}
                        ></i>
                        Mi Perfil
                      </li>
                    </ul>
                  </Dropdown.Item>
                  <Dropdown.Item>
                    <ul onClick={handleCategory}>
                      <li
                        onClick={() => history.push("/account/me/privacity")}
                        className="list-categories"
                      >
                        <i
                          class="fa fa-user-edit"
                          aria-hidden="true"
                          style={{ marginLeft: "-25px" }}
                        ></i>
                        Editar Perfil
                      </li>
                    </ul>
                  </Dropdown.Item>
                  <Dropdown.Item>
                    <ul onClick={handleCategory}>
                      <li
                        onClick={() => history.push("/account/me/orders")}
                        className="list-categories"
                      >
                        <i
                          class="fa fa-shopping-basket"
                          aria-hidden="true"
                          style={{ marginLeft: "-25px" }}
                        ></i>
                        Mis Compras
                      </li>
                    </ul>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
