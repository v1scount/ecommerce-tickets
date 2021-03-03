import React, { useState, useEffect, useContext } from "react";
import "./Nav.css";
import SearchArtist from "../../redux/actions/searchActions.js";
import { connect } from "react-redux";
import { Link, Redirect, withRouter } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import { logoutAction } from "../../redux/actions/userActions";
import { clearCarrito } from "../../redux/reducers/carritoReducer";
import { useDispatch, useSelector } from "react-redux";
import { Context } from "../../App";

function SearchBar(props) {
  const { history } = props;
  const { dropdownSideBar, setDropdownSideBar } = useContext(Context);
  const dispatch = useDispatch();
  const authUser = useSelector((state) => state.user.userAUTH);
  const user = useSelector((state) => state.user);
  const [data, setData] = useState({
    name: "",
  });
  let acumulador = 0;
  const handleChange = (event) => {
    setData({ name: event.target.value });
  };
  const handleSubmit = (event) => {
    history.push("/");
    var name2 = data.name.split(" ");
    for (let i = 0; i < name2.length; i++) {
      name2[i] = name2[i][0].toUpperCase() + name2[i].substr(1);
    }
    var name3 = name2.join(" ");
    event.preventDefault();
    props.SearchArtist(encodeURIComponent(name3));
    while (acumulador < 1) {
      setTimeout(() => {
        handleSubmit(event);
      }, 0);
      acumulador++;
    }
  };

  const handleLogout = async () => {
    //mandar llamar las action de user action
    dispatch(clearCarrito());
    const logoutUser = async () => dispatch(logoutAction());
    await logoutUser();
    //vaciar local storage
    await window.localStorage.clear();
    return;
  };

  const handleDropDown = () => {
    if (dropdownSideBar === 'x') {
      setDropdownSideBar('y');
    } else if (dropdownSideBar === 'y') {
      setDropdownSideBar('z');
    }
    else if (dropdownSideBar === 'z') {
      setDropdownSideBar('y');
    }
  };


  return (
    <nav className="navbar navbar-custom">
      <div className="container-fluid">
        <form
          className="d-flex" /* onSubmit={(event) => handleSubmit(event)} */
        >
          <i
            style={{ cursor: "pointer" }}
            onClick={handleDropDown}
            className="fas fa-list-ul"
            id="icon-responsive"
          ></i>
          <input
            className="form-control me-2"
            type="search"
            placeholder="Buscar"
            aria-label="Search"
            onChange={(event) => handleChange(event)}
            value={data.name}
            id="input-search"
          />
          <div className="icon-div">
            <i
              className="fa fa-search"
              id="icon-search"
              onClick={handleSubmit}
            ></i>
          </div>
         
        </form>
        {user.isAuthenticated === false ? null  :
        <Dropdown className="dropDownProfileUser">
            <Dropdown.Toggle variant="" className="dropdown-basic" /* className="dropdown-basic" */>
              <img src={authUser.photoURL} className="imgProfileNav" />
            </Dropdown.Toggle>
            <Dropdown.Menu
              className="dropdownButtonNav"
              title={authUser.username}
            >
              <Dropdown.Item href="/account/me" className = "listDropdownNav">{authUser.username}</Dropdown.Item>
              <hr style={{color: "#aab7c4"}}/>
              <Dropdown.Item href="/account/me/orders" className = "listDropdownNav" >Compras</Dropdown.Item>
              <Dropdown.Item href="/account/me/privacity" className = "listDropdownNav">
                Privacidad
              </Dropdown.Item>
              <Dropdown.Item href="/" onClick={handleLogout} className = "listDropdownNav" >
                Salir
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          }
      </div>
    </nav>
  );
}

function mapDispatchToProps(dispatch) {
  return {
    SearchArtist: (name) => dispatch(SearchArtist(name)),
  };
}

export default connect(null, mapDispatchToProps)(SearchBar);
