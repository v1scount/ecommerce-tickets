import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./accountSettings.module.css";
import "./AccountSettings.css";
import { logoutAction } from "../../redux/actions/userActions";
import { clearCarrito } from "../../redux/reducers/carritoReducer";

export default function AccountSettings() {
  const [tab, setTab] = useState(false);
  const dispatch = useDispatch();
  const authUser = useSelector((state) => state.user.userAUTH);
  console.log(authUser);

  const handleTab = () => {
    if (tab === false) {
      setTab(true);
    } else {
      setTab(false);
    }
  };

  useState(() => {
    setTab(false);
  }, []);

  const handleLogout = async () => {
    //mandar llamar las action de user action
    dispatch(clearCarrito());
    const logoutUser = async () => dispatch(logoutAction());
    await logoutUser();

    //vaciar local storage
    await window.localStorage.clear();

    return;
  };

  return (
    <div className="profileAccountSettings">
      <div className="container bootdey">
        <div className="content-page">
          <div className="profile-banner">
            <div className="col-sm-3 avatar-container">
              <img
                src={authUser.photoURL}
                className="img-circle profile-avatar"
                alt="User avatar"
                style={{ borderRadius: "180px" }}
              />
            </div>
          </div>

          <div className="content" id="contentUserProfile">
            <div className="row">
              {/* <div className="col-sm-3">
                <div
                  className="text-center user-profile-2"
                  style={{ marginTop: "120px", color: "black" }}
                >
                  <ul className="list-group" id="listOptions">
                    <li className="list-group-item">
                      <h4>
                        <b>{authUser.givenName + " " + authUser.familyName}</b>
                      </h4>
                      <h5>{authUser.isAdmin === "true" ? `Admin` : null}</h5>
                    </li>
                    <Link to="account/me">
                    <li className="list-group-item">
                      <span>
                        <i className="fa fa-user"></i>
                      </span>{" "}
                        {" "}
                        Cuenta{" "}
                    </li>
                    </Link>
                    <Link to ='/account/me/privacity'>
                    <li className="list-group-item">
                      <span>
                        <i className="fa fa-pencil"></i>
                      </span>{" "}
                        {" "}
                        Editar Perfil{" "}
                    </li>
                    </Link>
                    <li className="list-group-item">
                      <span>
                        <i className="fa fa-lock"></i>
                      </span>{" "}
                      <a href="#mymessage" data-toggle="tab">
                        {" "}
                        Cambiar Contraseña{" "}
                      </a>
                    </li>
                    <li className="list-group-item">
                      <span>
                        <i className="fa fa-money"></i>{" "}
                      </span>
                      <a href="#user-activities" data-toggle="tab">
                        Mis Compras
                      </a>
                    </li>
                  </ul>
                </div>
              </div> */}
              <div className="col-sm-9" id="userPanelDiv">
                <div className="widget widget-tabbed">
                  <div className="tab-content">
                    <div
                      className="tab-pane animated active fadeInRight"
                      id="about"
                    >
                      {tab === true ? null : (
                        <div className="user-profile-content">
                          <h5>
                            <strong>Bienvenido {authUser.username}</strong>
                          </h5>
                          <hr />
                          <div className="row">
                            <div className="col-sm-6">
                              <address>
                                <strong>Nombre</strong>
                                <br />
                              </address>
                              <address>
                                <strong>Username </strong>
                                <br />
                              </address>
                              <address>
                                <strong>Email</strong>
                                <br />
                              </address>
                            </div>
                            <div className="col-sm-6">
                              <p>
                                {authUser.givenName + " " + authUser.familyName}
                              </p>
                              <p>{authUser.username}</p>
                              <p>{authUser.email}</p>
                            </div>
                          </div>
                        </div>
                      )}
                      <button className="buttonLogout" type="submit" onClick = {handleLogout}>
                        {" "}
                        Salir
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

{
  /* <div className = {styles.containerDiv}>
					<div className = {styles.titleDiv}> <i className="fa fa-user-circle-o" aria-hidden="true"></i> Mi cuenta </div>
					<div className = {styles.optionDiv}> username: {authUser.username}</div>
					<div className = {styles.optionDiv}> Nombre y apellido: {authUser.givenName +" "+ authUser.familyName } </div>
					<div className = {styles.optionDiv}> Email: {authUser.email} </div>
					</div> */
}
