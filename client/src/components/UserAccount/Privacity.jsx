import React, { Fragment, useState, useEffect } from "react";
import NavBar from "./NavBar.jsx";
import { useDispatch, useSelector } from "react-redux";
import styles from "./privacity.module.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {
  updateUser,
  resetPassword,
  logoutAction,
  editUserImage,
} from "../../redux/actions/userActions.js";
import { clearCarrito } from "../../redux/reducers/carritoReducer";
import Modal from "react-bootstrap/Modal";
import { Switch, useHistory } from "react-router-dom";
import Swal from "sweetalert2";
import clienteAxios from "axios";
import { Link } from "react-router-dom";

export default function UserPrivacity() {
  const history = useHistory();
  const dispatch = useDispatch();
  const authUser = useSelector((state) => state.user.userAUTH);
  const verifyImg = useSelector((state) => state.user);
  const [data, setData] = useState({
    givenName: authUser.givenName,
    familyName: authUser.familyName,
    username: authUser.username,
    email: authUser.email,
  });

  const [password, setPassword] = useState("");
  const [input, setInput] = useState(false);
  const [infoType, setInfoType] = useState(null);
  const [photoURL, setphotoURL] = useState(authUser.photoURL);
  const [file, setFile] = useState("");
  const [ImgUrl, setImgUrl] = useState(
    "http://localhost:3001/img/producto-sin-foto.jpg"
  );
  const [imagenCargada, setimagenCargada] = useState ("")
  const [buttonStyle, setbuttonStyle] = useState ("btn btn-outline-success")

  console.log(photoURL);

  //Handle para poder habilitar el input de editar
  const handleInput = function (infoType) {
    setInput(!input);
    setInfoType(infoType);
  };

  //Handle para modificar el change del form
  const handleChange = function (e) {
    e.preventDefault();
    setData({ ...data, [e.target.name]: e.target.value });
  };

  console.log(data);
  console.log(password);
  console.log(infoType);
  console.log(authUser.id);

  const handleChangePassword = function (e) {
    setPassword(e.target.value);
  };

  const handleSubmit = function (e) {
    e.preventDefault();

    if (
      data.username === authUser.username &&
      data.givenName === authUser.givenName &&
      data.familyName === authUser.familyName &&
      data.email === authUser.email
    ) {
      if (password) {
        console.log(password, authUser.id);
        dispatch(resetPassword({ password: password, id: authUser.id }));
        Swal.fire({
          title: "Cambios guardados correctamente",
          text: "Inicie sesion nuevamente para ver los cambios",
          icon: "success",
          confirmButtonText: "Salir ahora",
          showCancelButton: true,
          cancelButtonText: "Cerrar",
          background: "#19191a",
        }).then((res) => {
          if (res.isConfirmed) {
            handleLogout();
          }
        });
      }
      return;
    }
    dispatch(updateUser(authUser.id, data));

    Swal.fire({
      title: "Cambios guardados correctamente",
      text: "Inicie sesion nuevamente para ver los cambios",
      icon: "success",
      confirmButtonText: "Salir ahora",
      showCancelButton: true,
      cancelButtonText: "Cerrar",
      background: "#19191a",
    }).then((res) => {
      if (res.isConfirmed) {
        handleLogout();
      }
    });
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

  const options = function (infoType) {
    switch (infoType) {
      case 1: {
        if (data.givenName === "") {
          Swal.fire({
            title: "Error",
            text: "El campo está vacio",
            icon: "error",
            width: 300,
            showConfirmButton: false,
            timer: 1000,
            background: "#19191a",
          });
          data.givenName = authUser.givenName;
        }
        return;
      }

      case 2: {
        if (data.familyName === "") {
          Swal.fire({
            title: "Error",
            text: "El campo está vacio",
            icon: "error",
            width: 300,
            showConfirmButton: false,
            timer: 1000,
            background: "#19191a",
          });
          data.familyName = authUser.familyName;
        }
        return;
      }

      case 3: {
        if (data.username === "") {
          Swal.fire({
            title: "Error",
            text: "El campo está vacio",
            icon: "error",
            width: 300,
            showConfirmButton: false,
            timer: 1000,
            background: "#19191a",
          });
          data.username = authUser.username;
        }
        return;
      }

      case 4: {
        if (data.email === "") {
          Swal.fire({
            title: "Error",
            text: "El campo está vacio",
            icon: "error",
            width: 300,
            showConfirmButton: false,
            timer: 1000,
            background: "#19191a",
          });
          data.email = authUser.email;
        }
        return;
      }
    }
  };

  const handleAlert = function () {
    options(infoType);
  };

  const imageHandler = async (e) => {
    e.preventDefault();
    const file = await obtenerFileImg(e);
    await setFile(file);
    console.log(file);
    let reader = new FileReader();
    console.log("reader", reader);
    console.log("reader.result", reader.result);
    if (file) {
      reader.onload = (e) => {
        if (reader.readyState === 2) {
          setImgUrl(reader.result);
          setbuttonStyle("btn btn-success")
          setimagenCargada("Imagen subida")
        }
      };
      reader.readAsDataURL(file);
    }
  };

  //Obtener imagen local ddada por el usuario
  const obtenerFileImg = async (e) => {
    console.log("e.target.files", e.target.files);
    return e.target.files[0];
  };

  const imageSubmitHandle = function (e) {
    e.preventDefault();

  


    const data = new FormData();
    data.append("file", file);
    dispatch(editUserImage(data, authUser.id));
    setphotoURL(verifyImg.newImage);

    Swal.fire ({
      text: "La imagen ha sido guardada correctamente",
      icon: "success",
      width: 500,
      timer: 1000,
      showConfirmButton: false,
      background: "#19191a"
    })
    setbuttonStyle ("btn btn-outline-success")
    setimagenCargada("")
  };

  return (
    <div>
      <div className={styles.profileAccountSettings}>
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

            <div className="content" id={styles.contentUserProfile}>
              <div className="row">
                <div className="col-sm-9" id="userPanelDiv">
                  <div className="widget widget-tabbed">
                    <div className="tab-content">
                      <div
                        className="tab-pane animated active fadeInRight"
                        id="about"
                      >
                        <div className="d-flex justify-content-center" id={styles.editProfile}>
                          <h5>
                            <strong>Editar Perfil</strong>
                          </h5>
                        </div>

                        <div class="container">
                          <div class="row flex-lg-nowrap">
                            <div class="col">
                              <div class="row">
                                <div class="col mb-3">
                                  <div class="card1">
                                    <div class="card1-body">
                                      <div class="e-profile">
                                        <ul
                                          class="nav nav-tabs"
                                          id={styles.navTabs}
                                        >
                                          <li class="nav-item"></li>
                                        </ul>
                                        <div class="tab-content pt-3">
                                          <div class="tab-pane active">
                                            <form
                                              class={styles.form}
                                              novalidate=""
                                            >
                                              <div class="row">
                                                <div class="col">
                                                  <div class="row">
                                                    {/*   <div class="col"> */}

                                                    <div class="form-group">
                                                      {input === true &&
                                                      infoType === 1 ? (
                                                        <Fragment>
                                                          <label>Nombre </label>
                                                          <button
                                                            className={
                                                              styles.button
                                                            }
                                                            onClick={() => {
                                                              handleInput();
                                                              handleAlert();
                                                            }}
                                                          >
                                                            <i
                                                              className="fa fa-check"
                                                              style={{
                                                                fontSize:
                                                                  "11px",
                                                                marginLeft:
                                                                  "20px",
                                                                color:
                                                                  "#1CD51C",
                                                              }}
                                                            ></i>
                                                          </button>

                                                          <input
                                                            id={styles.inputs}
                                                            class="form-control"
                                                            type="text"
                                                            name="givenName"
                                                            placeholder="nuevo nombre..."
                                                            value={
                                                              data.givenName
                                                            }
                                                            onChange={
                                                              handleChange
                                                            }
                                                          />
                                                        </Fragment>
                                                      ) : (
                                                        <Fragment>
                                                          <label>
                                                            Nombre{" "}
                                                            <button
                                                              className={
                                                                styles.button
                                                              }
                                                              onClick={() => {
                                                                handleInput(1);
                                                              }}
                                                            >
                                                              <i
                                                                className="fa fa-pencil"
                                                                style={{
                                                                  fontSize:
                                                                    "11px",
                                                                  marginLeft:
                                                                    "20px",
                                                                  color:
                                                                    "white",
                                                                }}
                                                              ></i>
                                                            </button>
                                                          </label>

                                                          <input
                                                            id={styles.inputs}
                                                            class="form-control"
                                                            type="text"
                                                            name="name"
                                                            value={
                                                              data.givenName
                                                            }
                                                            readOnly
                                                          />
                                                        </Fragment>
                                                      )}
                                                    </div>

                                                    <div class="form-group">
                                                      {input === true &&
                                                      infoType === 2 ? (
                                                        <Fragment>
                                                          <label>
                                                            Apellido{" "}
                                                          </label>
                                                          <button
                                                            className={
                                                              styles.button
                                                            }
                                                            onClick={() => {
                                                              handleInput();
                                                              handleAlert();
                                                            }}
                                                          >
                                                            <i
                                                              className="fa fa-check"
                                                              style={{
                                                                fontSize:
                                                                  "11px",
                                                                marginLeft:
                                                                  "15px",
                                                                color:
                                                                  "#1CD51C",
                                                              }}
                                                            ></i>
                                                          </button>

                                                          <input
                                                            id={styles.inputs}
                                                            class="form-control"
                                                            type="text"
                                                            name="familyName"
                                                            placeholder="nuevo nombre..."
                                                            value={
                                                              data.familyName
                                                            }
                                                            onChange={
                                                              handleChange
                                                            }
                                                          />
                                                        </Fragment>
                                                      ) : (
                                                        <Fragment>
                                                          <label>
                                                            Apellido{" "}
                                                            <button
                                                              className={
                                                                styles.button
                                                              }
                                                              onClick={() => {
                                                                handleInput(2);
                                                              }}
                                                            >
                                                              <i
                                                                className="fa fa-pencil"
                                                                style={{
                                                                  fontSize:
                                                                    "11px",
                                                                  marginLeft:
                                                                    "15px",
                                                                  color:
                                                                    "white",
                                                                }}
                                                              ></i>
                                                            </button>
                                                          </label>

                                                          <input
                                                            id={styles.inputs}
                                                            class="form-control"
                                                            type="text"
                                                            name="name"
                                                            value={
                                                              data.familyName
                                                            }
                                                            readOnly
                                                          />
                                                        </Fragment>
                                                      )}
                                                    </div>

                                                    {/* </div> */}
                                                    {/*  <div class="row"> */}

                                                    <div class="col">
                                                      <div class="form-group">
                                                        {input === true &&
                                                        infoType === 3 ? (
                                                          <Fragment>
                                                            <label>
                                                              Username{" "}
                                                            </label>
                                                            <button
                                                              className={
                                                                styles.button
                                                              }
                                                              onClick={() => {
                                                                handleInput();
                                                                handleAlert();
                                                              }}
                                                            >
                                                              <i
                                                                className="fa fa-check"
                                                                style={{
                                                                  fontSize:
                                                                    "11px",
                                                                  marginLeft:
                                                                    "4px",
                                                                  color:
                                                                    "#1CD51C",
                                                                }}
                                                              ></i>
                                                            </button>

                                                            <input
                                                              id={styles.inputs}
                                                              class="form-control"
                                                              type="text"
                                                              name="username"
                                                              placeholder="nuevo nombre..."
                                                              value={
                                                                data.username
                                                              }
                                                              onChange={
                                                                handleChange
                                                              }
                                                            />
                                                          </Fragment>
                                                        ) : (
                                                          <Fragment>
                                                            <label>
                                                              Username{" "}
                                                              <button
                                                                className={
                                                                  styles.button
                                                                }
                                                                onClick={() =>
                                                                  handleInput(3)
                                                                }
                                                              >
                                                                <i
                                                                  className="fa fa-pencil"
                                                                  style={{
                                                                    fontSize:
                                                                      "11px",
                                                                    marginLeft:
                                                                      "4px",
                                                                    color:
                                                                      "white",
                                                                  }}
                                                                ></i>
                                                              </button>
                                                            </label>

                                                            <input
                                                              id={styles.inputs}
                                                              class="form-control"
                                                              type="text"
                                                              name="name"
                                                              value={
                                                                data.username
                                                              }
                                                              readOnly
                                                            />
                                                          </Fragment>
                                                        )}
                                                      </div>

                                                      {/*   </div> */}
                                                    </div>
                                                  </div>
                                                  {/* </div> */}
                                                  {/*  <div class="row"> */}

                                                  <div class="col">
                                                    <div class="form-group">
                                                      {input === true &&
                                                      infoType === 4 ? (
                                                        <Fragment>
                                                          <label>Email </label>
                                                          <button
                                                            className={
                                                              styles.button
                                                            }
                                                            onClick={() => {
                                                              handleInput();
                                                              handleAlert();
                                                            }}
                                                          >
                                                            <i
                                                              className="fa fa-check"
                                                              style={{
                                                                fontSize:
                                                                  "11px",
                                                                marginLeft:
                                                                  "40px",
                                                                color:
                                                                  "#1CD51C",
                                                              }}
                                                            ></i>
                                                          </button>

                                                          <input
                                                            id={styles.inputs}
                                                            class="form-control"
                                                            type="text"
                                                            name="email"
                                                            placeholder="..."
                                                            value={data.email}
                                                            onChange={
                                                              handleChange
                                                            }
                                                          />
                                                        </Fragment>
                                                      ) : (
                                                        <Fragment>
                                                          <label>
                                                            Email
                                                            <button
                                                              className={
                                                                styles.button
                                                              }
                                                              onClick={() =>
                                                                handleInput(4)
                                                              }
                                                            >
                                                              <i
                                                                className="fa fa-pencil"
                                                                style={{
                                                                  fontSize:
                                                                    "11px",
                                                                  marginLeft:
                                                                    "40px",
                                                                  color:
                                                                    "white",
                                                                }}
                                                              ></i>
                                                            </button>
                                                          </label>

                                                          <input
                                                            id={styles.inputs}
                                                            class="form-control"
                                                            type="text"
                                                            name="name"
                                                            value={data.email}
                                                            readOnly
                                                          />
                                                        </Fragment>
                                                      )}
                                                    </div>

                                                    {/* </div> */}
                                                    {/*  <div class="row"> */}

                                                    <div class="col">
                                                      <div class="form-group">
                                                        {input === true &&
                                                        infoType === 5 ? (
                                                          <Fragment>
                                                            <label>
                                                              Password{" "}
                                                            </label>
                                                            <button
                                                              className={
                                                                styles.button
                                                              }
                                                              onClick={() => {
                                                                handleInput();
                                                                handleAlert();
                                                              }}
                                                            >
                                                              <i
                                                                className="fa fa-check"
                                                                style={{
                                                                  fontSize:
                                                                    "11px",
                                                                  marginLeft:
                                                                    "4px",
                                                                  color:
                                                                    "#1CD51C",
                                                                }}
                                                              ></i>
                                                            </button>

                                                            <input
                                                              id={styles.inputs}
                                                              class="form-control"
                                                              type="password"
                                                              placeholder="Ingresa tu nueva contraseña..."
                                                              value={password}
                                                              onChange={
                                                                handleChangePassword
                                                              }
                                                            />
                                                          </Fragment>
                                                        ) : (
                                                          <Fragment>
                                                            <label>
                                                              Password{" "}
                                                              <button
                                                                className={
                                                                  styles.button
                                                                }
                                                                onClick={() =>
                                                                  handleInput(5)
                                                                }
                                                              >
                                                                <i
                                                                  className="fa fa-pencil"
                                                                  style={{
                                                                    fontSize:
                                                                      "11px",
                                                                    marginLeft:
                                                                      "4px",
                                                                    color:
                                                                      "white",
                                                                  }}
                                                                ></i>
                                                              </button>
                                                            </label>

                                                            <input
                                                              id={styles.inputs}
                                                              class="form-control"
                                                              type="text"
                                                              name="name"
                                                              placeholder="************"
                                                              readOnly
                                                            />
                                                          </Fragment>
                                                        )}
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="d-flex justify-content-center">
                                                <div
                                                  className={styles.photoInput}
                                                >
                                                  <div class="col-md-5">
                                                    <div class="col-md-5">
                                                      <div
                                                        className={
                                                          styles.editimg
                                                        }
                                                      >
                                                        <form>
                                                          <label
                                                            class="custom-file-upload"
                                                            id={
                                                              styles.customFileUpload
                                                            }
                                                          >
                                                            <img
                                                              src={
                                                                authUser.photoURL
                                                              }
                                                              className={
                                                                styles.img
                                                              }
                                                            />
                                                            <input
                                                              type="file"
                                                              id="file-upload"
                                                              className="form-control form-control-lg"
                                                              onChange={
                                                                imageHandler
                                                              }
                                                              className={
                                                                styles.input
                                                              }
                                                              name="img"
                                                              accept="image/x-png,image/jpeg,image/jpg"
                                                            />
                                                            <i class="fa fa-cloud-upload"></i>{" "}
                                                            Subir imagen
                                                          </label>
                                                          <button
                                                            className={`${styles.btnChanges} ${buttonStyle}`}
                                                            onClick={
                                                              imageSubmitHandle
                                                            }
                                                          >
                                                            Cargar
                                                          </button>
                                                          <div>{imagenCargada}</div>
                                                        </form>
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>

                                              <div class="row">
                                                <div class="col d-flex justify-content-center">
                                                  <button
                                                    class="btn btn-dark"
                                                    id={styles.btnSaveLoad}
                                                    onClick={handleSubmit}
                                                  >
                                                    Guardar Cambios
                                                  </button>
                                                </div>
                                              </div>
                                            </form>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
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
  /*  <div className = {styles.containerDiv}>
		    <div className = {styles.titleDiv}> <i className="fa fa-cogs" aria-hidden="true"></i> Ajustes de privacidad </div>
                <hr/>

            


            <div className={styles.formdiv}>
            <Form onSubmit = {handleSubmit}>

            <div className = {styles.editInfo}>
            <Form.Label className = {styles.labelstyles}> Nombre: </Form.Label> 
            <Form.Control  type="text" name = "givenName" column = "lg" size = "sm" value= {authUser.givenName} readOnly/> 
            <Button onClick = {()=>{handleShow("givenName")}} variant = "link">modificar</Button>            
            </div>

            <div className = {styles.editInfo}> 
            <Form.Label className = {styles.labelstyles}> Apellido: </Form.Label>
	 		<Form.Control  type="text" name = "familyName" column = "sm" size = "sm"  value = {authUser.familyName} readOnly/>
             <Button onClick = {()=>{handleShow("familyName")}} variant = "link">modificar</Button>      
             </div>

             <div className = {styles.editInfo}> 
            <Form.Label className = {styles.labelstyles}> Email: </Form.Label>
	 		<Form.Control type="text" name = "email" column = "sm" size = "sm"  value = {authUser.email} readOnly/>
             <Button onClick = {()=>{handleShow("email")}} variant = "link">modificar</Button>      
             </div>

             <div className = {styles.editInfo}> 
            <Form.Label className = {styles.labelstyles}> Username: </Form.Label>
	 		<Form.Control  type="text" name = "username" column = "sm" size = "sm"  value = {authUser.username} readOnly/>      
             <Button onClick = {()=>{handleShow("username")}} variant = "link">modificar</Button>      
             </div>

             <div className = {styles.editInfo}> 
            <Form.Label className = {styles.labelstyles}> Password: </Form.Label>
	 		<Form.Control  type="text" name = "password" column = "sm" size = "sm"  value = {"****************"} readOnly/>      
             <Button onClick = {()=>{handleShow("password")}}  variant = "link">modificar</Button>      
             </div>
             <div className = {styles.editimg}>
                <div className="custom-file" id = {styles.divCustomFile}>
                    <form onSubmit = {imageSubmitHandle}>
                    <label for="file-upload" className="custom-file-upload" id= {styles.customFileUpload} >
                    <img src="https://img.icons8.com/ios-filled/50/000000/compact-camera.png"/>
                    </label>
                    <input type="file" id = "file-upload" className="form-control form-control-lg" onChange={imageHandler} className={styles.input} 
                     name="img"  accept="image/x-png,image/jpeg,image/jpg"  />
                    <button type="submit" className={`${styles.btnChange} btn btn-success`}>Cargar</button>
                    </form>
                </div>
        </div>
            </Form>
             </div>   
            </div>
               
           
            <Modal show={show} onhide = {handleClose} infoType = {infoType}>

            {infoType[0] === "password" ? 
                        (<Fragment>
                         <Modal.Header className = {styles.modal}>
                         <Modal.Title>Modificar {infoType[1]}</Modal.Title>
                        </Modal.Header>
                
                        <Modal.Body className = {styles.modal}>
                        <Form>
                        <Form.Label className = {styles.labelstyles}> Ingrese la nueva contraseña: </Form.Label>
                        <Form.Control type="password" name = {infoType[0]} column = "sm" size = "sm"
                        onChange = {passwordHandleChange} placeholder = {password} value = {authUser.infoType}/>
                        </Form>
                        </Modal.Body>
                        <Button variant="primary" type = "submit" onClick={passwordHandleSubmit}>Guardar contraseña</Button>
                        <Button variant="secondary" onClick={handleClose}>Cerrar</Button>
                        </Fragment> 
                        
                        ) : (

                        <Fragment>
                        <Modal.Header className = {styles.modal}>
                        <Modal.Title>Modificar {infoType[1]}</Modal.Title>
                        </Modal.Header>
                
                        <Modal.Body className = {styles.modal}>
                        <Form>
                        <Form.Label className = {styles.labelstyles}> Nuevo {infoType[1]}: </Form.Label>
                        <Form.Control type="text" name = {infoType[0]} column = "sm" size = "sm"
                         onChange = {handleChange} placeholder = {password} value = {authUser.infoType}/>
                          </Form>
                        </Modal.Body>
                        <Button variant="primary" type = "submit" onClick={handleSubmit}>Guardar</Button>
                        <Button variant="secondary" onClick={handleClose}>Cerrar</Button>
            
                         </Fragment>)}
                         </Modal>
 */
}
