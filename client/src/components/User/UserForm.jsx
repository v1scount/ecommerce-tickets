import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "./UserForm.css";
import styles from "../Admin/Product/productos-form.module.css";
import { connect } from "react-redux";
import CreateUser from "../../redux/actions/userActions";
import { useSelector } from "react-redux";
import { Redirect, useHistory } from "react-router-dom";
import Swal from "sweetalert2";

export function validate(input) {
  let errors = {};
  if (!input.username) {
    errors.username = "User name is required";
  } else if (!/\S/.test(input.username)) {
    errors.username = "Username is invalid";
  }

  if (!input.password) {
    errors.password = "Password is required";
  } else if (!/(?=.*[0-9])/.test(input.password)) {
    errors.password = "Password is invalid";
  }
  if (!input.email) {
    errors.email = "email is required";
  } else if (!/\S+@\S+\.\S+/.test(input.email)) {
    errors.email = "Email is invalid";
  }
  return errors;
}

const UserForm = (props) => {
  const [errors, setErrors] = useState({});
  const [imgURL, setImgURl] = useState("");
  const [file, setFile] = useState("");
  const [modoEdit, setModoEdit] = useState(false);
  const [ImgUrl, setImgUrl] = useState(
    "http://localhost:3001/img/producto-sin-foto.jpg"
  );
  const history = useHistory();
  const [data, setData] = useState({
    username: "",
    givenName: "",
    familyName: "",
    email: "",
    password: "",
    photoURL: "",
    securityQuestion:""
  });

  const handleChange = (event) => {
    setErrors(validate({ ...data, [event.target.name]: event.target.value }));
    setData({ ...data, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    /* usuarioData.append('photoURL',data.photoURL) */
    Swal.fire({
      icon: "success",
      title: `Usuario creado con éxito`,
      showConfirmButton: true,
      background: "#19191a",
    });
    history.push("./login");
    props.CreateUser(file, data);
  };

  const obtenerFileImg = async (e) => {
    return e.target.files[0];
  };

  const handleimage = async (e) => {
    const file = await obtenerFileImg(e);

    await setFile(file);
    let reader = new FileReader();
    if (file) {
      reader.onload = (e) => {
        if (reader.readyState === 2) {
          setImgURl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Manejador de imagen obtenida en el input
  const imageHandler = async (e) => {
    const file = await obtenerFileImg(e);
    await setFile(file);
    let reader = new FileReader();
    if (file) {
      reader.onload = (e) => {
        if (reader.readyState === 2) {
          setImgUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

  if (isAuthenticated) {
    return <Redirect to="/" />;
  }

  return (
    <div className="container-main">
      <div className="form-div">
        <Form onSubmit={handleSubmit}>
          <legend>Formulario de Registro</legend>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Nombre de usuario *</Form.Label>
            <Form.Control
              name="username"
              value={data.username}
              onChange={handleChange}
              type="text"
              placeholder="Ingresá tu usuario"
            />
            {errors.username && <p className="danger">{errors.username}</p>}
            <Form.Label>Nombre *</Form.Label>
            <Form.Control
              required
              name="givenName"
              value={data.givenName}
              onChange={handleChange}
              type="text"
              placeholder="Ingresá tu nombre"
            />
            {errors.username && <p className="danger">{errors.givenName}</p>}
            <Form.Label>Apellido *</Form.Label>
            <Form.Control
              name="familyName"
              value={data.familyName}
              onChange={handleChange}
              type="text"
              placeholder="Ingresá tus apellidos"
            />
            {errors.username && <p className="danger">{errors.familyName}</p>}
            <Form.Label>Email address *</Form.Label>
            <Form.Control
              name="email"
              value={data.email}
              onChange={handleChange}
              type="email"
              placeholder="Ingresá tu email"
            />
            {errors.username && <p className="danger">{errors.email}</p>}
            <Form.Label>Imagen de Perfil *</Form.Label>
            <br></br>
            <img src={ImgUrl} id="" alt="" className={styles.img} />
            {/*    <Form.Control
              name="photoURL"
              value={data.photoURL}
              onChange={handleimage}
              type="file"
            /> */}
            {modoEdit ? (
              <input
                type="file"
                className="form-control form-control-lg"
                className={styles.input}
                name="img"
                accept="image/x-png,image/jpeg,image/jpg"
                onChange={imageHandler}
              />
            ) : (
              <input
                type="file"
                className="form-control form-control-lg"
                className={styles.input}
                name="img"
                accept="image/x-png,image/jpeg,image/jpg"
                onChange={imageHandler}
                required
              />
            )}
            <br></br>
            <Form.Text className="text-muted">
              Jamás compartiremos tu información
            </Form.Text>
          </Form.Group>
          <Form.Group controlId="formBasicPassword">
            <Form.Label>Password *</Form.Label>
            <Form.Control
              name="password"
              value={data.password}
              onChange={handleChange}
              type="password"
              placeholder="Password"
            />
            {errors.username && <p className="danger">{errors.password}</p>}
          </Form.Group>
          <Form.Group controlId="formBasicCheckbox"></Form.Group>
          <Form.Group >
          <Form.Label>Pregunta de seguridad *</Form.Label>
            <Form.Control
              required
              name="securityQuestion"
              value={data.securityQuestion}
              onChange={handleChange}
              type="text"
              placeholder="ingresa el nombre de tu primer mascota"
            />
            </Form.Group>
          <Button variant="success" type="submit" className="button" style={{backgroundColor:"#334E68", border:"1px solid #313131", fontWeight: "600"}}>
            Enviar
          </Button>
        </Form>

        <Button variant="danger" type="submit" className="button" style={{marginBottom:"20px", backgroundColor: "#C62828", fontWeight: "600"}}>
          <a href="http://localhost:3001/login/auth/google" style={{color:"white"}}>
            {" "}
            Registrate con <img src="https://img.icons8.com/color/50/000000/google-logo.png" className="googleIcon"/>
          </a>
        </Button>
      </div>
    </div>
  );
};
function mapDispatchToProps(dispatch) {
  return {
    CreateUser: (file, data) => dispatch(CreateUser(file, data)),
  };
}

export default connect(null, mapDispatchToProps)(UserForm);
