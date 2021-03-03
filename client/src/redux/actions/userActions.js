import {
  CREAR_USUARIO,
  LOGIN_USER,
  LOGOUT_USER,
  ACTUALIZAR_USUARIO,
  ACTUALIZAR_CONTRASEÑA,
  EDITAR_FOTO,
  EDITAR_FOTO_EXITO,
  OBTENER_TODOS_LOS_USUARIOS,
  DESCARGA_USER,
  DESCARGA_USER_EXITO,
  DESCARGA_USER_ERROR
} from '../types/Users';
import clienteAxios from '../../config/axios.js';
import jsonWebToken from 'jsonwebtoken';
import Swal from "sweetalert2";

export default function CreateUser(file, data) {
  console.log("data del user",data)
  const usuarioData = new FormData();
  usuarioData.append('username', data.username)
  usuarioData.append('givenName', data.givenName)
  usuarioData.append('familyName', data.familyName)
  usuarioData.append('email', data.email)
  usuarioData.append('password', data.password)
  usuarioData.append('securityQuestion', data.securityQuestion)
  usuarioData.append('file', file)
  return function (dispatch) {
    return clienteAxios.post("/user", usuarioData)
      .then(res => dispatch({ type: CREAR_USUARIO, payload: res.file }),
        Swal.fire({
          icon: "success",
          title: `Usuario creado con éxito`,
          showConfirmButton: true,
          background: "#19191a",
        })
      );
  };
}

export function GetUsers(credencial) {
  return async function (dispatch) {
    const respuesta = await clienteAxios.post("/login", credencial)
    localStorage.setItem("tokenLogin", respuesta.data.token)
    const tokenDecode = jsonWebToken.decode(respuesta.data.token)
    await dispatch(loginUser(tokenDecode.user))
   // console.log(respuesta.data.token)

  };
}
const loginUser = (user) => (
  { type: LOGIN_USER, payload: user }
)

//logout
export function logoutAction() {
  return async function (dispatch) {
    await window.localStorage.removeItem("tokenLogin");
    await window.localStorage.removeItem("state");
    await dispatch(logoutUser())
  };
}

const logoutUser = () => (
  { type: LOGOUT_USER, payload: null }


)
export function GetUsersGoogle() {
  return async function (dispatch) {
    const respuesta = await clienteAxios.get("/login/auth/google")
    /* const tokenDecode = jsonWebToken.decode(respuesta.data.token) */
    /* await dispatch(loginUser(tokenDecode.user)) */
    /* window.localStorage.setItem("tokenLogin",respuesta.data.token) */
    console.log("RESPUESTA", respuesta)
    // const tokenDecode = jsonWebToken.decode(respuesta.data.token)
    // await dispatch(setUsers(tokenDecode))
  };
}

//actualizar info de usuario

export function updateUser(id, data) {
  return async function (dispatch) {
    dispatch(editarUsuario(data))
    var accesToken =   localStorage.getItem("tokenLogin");
    return clienteAxios.put("/user/" + id, { username: data.username, givenName: data.givenName, familyName: data.familyName, email: data.email },{headers:{Authorization:`Bearer ${accesToken}` }})
  }
}

const editarUsuario = function (data) {
  return ({
    type: ACTUALIZAR_USUARIO,
    payload: data
  });
}

export function resetPassword({password,id}) {
  console.log(password, id)
  return async function (dispatch) {
    dispatch(actualizarContraseña(password))
    return clienteAxios.post("/user/" + id + "/passwordReset", { password: password })
  }
}

const actualizarContraseña = function (password) {
  return ({
    type: ACTUALIZAR_CONTRASEÑA,
    payload: password
  })
}

export  function  getAllUsers(email) {
  
  return async function(dispatch) {
   const res = await clienteAxios.get('/user/' + email)
   dispatch(dataUser(res.data))
   
  }
} 
const dataUser = function (data) {
  return ({
    type: OBTENER_TODOS_LOS_USUARIOS,
    payload: data
  })
}

export function editUserImage(file, id) { //recibe la data pasada por el form de AddCategories
  return function (dispatch) {
    //se le pasa por body a la url para añadir la categoria
    return clienteAxios.put("/user/" + id + "/image", file)
      .then(res => {
        console.log(res.data)
        dispatch(editarFoto(res.data))
        dispatch(editarFotoExito())
      })
      .catch(err => {
        console.log(err)
      })
  }
};

const editarFoto = function (url) {
  return {
    type: EDITAR_FOTO,
    payload: url
  }
}

const editarFotoExito = function () {
  return { type: EDITAR_FOTO_EXITO }
}

export function getUsers() {
  return async function (dispatch) {
    dispatch(descargarUsers())
    try {
      const respuesta = await clienteAxios.get(`/user`);
      dispatch(descargaUsersExitosa(respuesta.data))
    } catch (err) {
      console.log(err)
      dispatch(descargaUsersError())
    }
  }
}

const descargarUsers = () => ({
  type: DESCARGA_USER,
  payload: true
});

const descargaUsersExitosa = review => ({
  type: DESCARGA_USER_EXITO,
  payload: review
})
const descargaUsersError = () => ({
  type: DESCARGA_USER_ERROR,
  payload: true
});