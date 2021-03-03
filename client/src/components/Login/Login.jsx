import React, { useState, useEffect } from "react";
import "./Login.css";
import { Link, Redirect } from "react-router-dom";
import {
  GetUsers,
  getAllUsers,
  resetPassword,
} from "../../redux/actions/userActions";
import { getProducts } from "../../redux/actions/productActions";
import { useDispatch, useSelector, useStore } from "react-redux";
import { useHistory } from "react-router-dom";
import Swal from "sweetalert2";
import GoogleLogin from "react-google-login";
import bcrypt from "bcryptjs";
import Modal from "react-bootstrap/Modal";
function Login(props) {
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [userName, setUsername] = useState([]);
  const [userEmail, setUserEmail] = useState({
    email: "",
    securityQuestion: "",
  });
  const [userValido, setUserValido] = useState({
    valido: false,
  });

  const [newPassword, setNewPassword] = useState({
    password: "",
    id: "",
  });

  const history = useHistory();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.userAUTH);
  const recuperado = useSelector((state) => state.user.recuperacion);
  const loginUser = async (data) => dispatch(GetUsers(data));
  const emailUser = async (data) => dispatch(getAllUsers(data));
  const passwordActualizada = async (data) => dispatch(resetPassword(data));
  const validacion = () => {
    if (
      recuperado.email === userEmail.email &&
      recuperado.securityQuestion === userEmail.securityQuestion
    ) {
      setUserValido.valido = true;
    } else {
      console.log("incorrecto");
    }
  };

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleChange = (event) => {
    setData({ ...data, [event.target.name]: event.target.value });
  };
  const handleChange2 = (event) => {
    setUserEmail({ ...userEmail, [event.target.name]: event.target.value });
  };
  const handleChange3 = (event) => {
    setNewPassword({
      ...newPassword,
      password: event.target.value,
      id: recuperado.id,
    });
  };

  useEffect(() => {
    setUsername(user);
  });
  /* console.log(userName.username) */

  const handleSubmit = async (event) => {
    event.preventDefault();
    await loginUser(data);
    await Swal.fire({
      icon: "success",
      title: `Bienvenido`,
      showConfirmButton: true,
      background: "#19191a",
    });
    history.push("./account/me");
  };
  const handleSubmit2 = async (event) => {
    event.preventDefault();
    emailUser(userEmail.email);
    validacion();
    if (setUserValido.valido === true) {
      await Swal.fire({
        icon: "success",
        title: "Validación exitosa",
        showConfirmButton: true,
        background: "#19191a",
      });
    } else {
      await Swal.fire({
        icon: "error",
        title: `Datos invalidos`,
        showConfirmButton: true,
        background: "#19191a",
      });
    }
  };
  const handleSubmit3 = async (event) => {
    event.preventDefault();
    await passwordActualizada(newPassword);
    await Swal.fire({
      icon: "success",
      title: `Contraseña actualizada`,
      showConfirmButton: true,
      background: "#19191a",
    });
  };

  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

  if (isAuthenticated) {
    return <Redirect to="./" />;
  }

  const responseGoogle = async (res) => {
    try {
    setData({
      ...data,
      email: res.profileObj.email,
      password: res.profileObj.googleId,
    });
    await loginUser(data);
    await Swal.fire({
      icon: "success",
      title: `Bienvenido`,
      showConfirmButton: true,
      background: "#19191a",
    });
  }catch(error){console.log(error)}
}

  return (
    <div className="main-div">
      <div className="login">
        <div className="img"></div>
        <div className="form">
          <form onSubmit={handleSubmit}>
            <legend className="legend">Bienvenido</legend>
            <div>
              <i className="fas fa-user" id="iconUser"></i>
              <input
                placeholder="Ingrese su usuario"
                type="text"
                name="email"
                value={data.email}
                className="name-user"
                onChange={handleChange}
              ></input>
            </div>
            <br></br>
            <div>
              <i className="fas fa-lock" id="iconPassword"></i>
              <input
                placeholder="Ingrese su contraseña"
                type="password"
                name="password"
                value={data.password}
                className="passwordUser"
                onChange={handleChange}
              ></input>
            </div>
            <div>
              <Link to={"#"}>
                <a onClick={handleShow}>
                  <p className="link">¿Olvidaste tu contraseña?</p>
                </a>
                <Modal className="modal" show={show} onHide={handleClose}>
                  <Modal.Header closeButton className="modalPassword">
                    <Modal.Title className="modalPassword">
                      No te preocupes, te ayudaremos a restablecer tu contraseña
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body className="modalPassword">
                    <form>
                    <div className = "modalInputPassword">
                      <label style={{marginLeft: "30px", marginBottom: "5px"}}>Introduce tu Email</label>
                      <br></br>
                      <input
                        type="text"
                        name="email"
                        value={userEmail.email}
                        onChange={handleChange2}
                      />
                      <br></br>
                      <label style={{marginLeft:"-60px", marginTop:"30px", marginBottom: "5px"}}>¿Como se llamaba tu mascota de la infancia?</label>
                      <br></br>
                      <input
                        type="text"
                        name="securityQuestion"
                        value={userEmail.securityQuestion}
                        onChange={handleChange2}
                      />
                      </div>
                    </form>
                    <br></br>
                    {setUserValido.valido ? (
                      <form>
                        <div className = "modalInputPassword">
                        <label style={{marginLeft: "15px", marginBottom: "5px"}}>Actualiza tu contraseña</label>
                        <br></br>
                        <input
                          type="password"
                          name="newPassword"
                          value={newPassword.password}
                          onChange={handleChange3}
                          style={{marginBottom:"5px"}}
                        ></input>
                        <br></br>
                        <button className ="btn btn" id="btnVerifiedPassword" onClick={handleSubmit3}>
                          Actualizar contraseña
                        </button>
                        </div>
                      </form>
                    ) : (
                      console.log("email o respuesta invalida")
                    )}
                  </Modal.Body>
                  <Modal.Footer className="modalPassword">
                    <button
                      className="btn btn"
                      variant="secondary"
                      onClick={handleClose}
                      id="btnEditCustomized"
                      id="btnDeleteCustomized"
                    >
                      Cerrar
                    </button>
                    <button
                      className="btn btn"
                      variant="primary"
                      onClick={handleSubmit2}
                      id="btnEditCustomized"
                    >
                      Verificar
                    </button>
                  </Modal.Footer>
                </Modal>
              </Link>
            </div>
            <button className="buttonLogin" type="submit">
              {" "}
              Iniciar sesión
            </button>
          </form>
          <GoogleLogin
            clientId="62493798452-akjoostfaul0rmoqbfjfvbusiqnbj9u3.apps.googleusercontent.com"
            render={(renderProps) => (
              <button
                onClick={renderProps.onClick}
                className="buttonGoogleLogin"
              >
                Iniciar sesión con{" "}
                <img src="https://img.icons8.com/officel/16/000000/google-logo.png" />
              </button>
            )}
            buttonText="Login"
            onSuccess={responseGoogle}
            onFailure={responseGoogle}
            cookiePolicy={"single_host_origin"}
            isSignedIn={true}
          />
          <div>
            <Link to={"/user"}>
              <button className="registro">
                ¿No tienes cuenta? ¡Registrate!
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
