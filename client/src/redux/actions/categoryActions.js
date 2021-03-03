import { 
  AGREGAR_CATEGORIA,
  AGREGAR_CATEGORIA_EXITO,
  DESCARGA_CATEGORIA,
  DESCARGA_CATEGORIA_EXITO,
  DESCARGA_CATEGORIA_ERROR,
  ELIMINAR_CATEGORIA,
  ELIMINAR_CATEGORIA_EXITO,
  EDITAR_CATEGORIA,
  EDITAR_CATEGORIA_EXITO
 } from "../types/categories.js";
import clienteAxios from '../../config/axios.js';
import Swal from "sweetalert2";




export function addCategory(data) { //recibe la data pasada por el form de AddCategories
  return function (dispatch) {
    console.log("data", data)
    var accesToken =   localStorage.getItem("tokenLogin");
    //se le pasa por body a la url para añadir la categoria
    return clienteAxios.post('/categories', { name: data.name, description: data.description },{headers:{Authorization:`Bearer ${accesToken}` }})
      .then(res => {
        dispatch (agregarCategoria(res.data))
        dispatch(agregarCategoriaExito())
         Swal.fire({
                title: "Categoria agregada",
                text: 'La categoria ha sido agregada correctamente',
                icon: 'success',
                confirmButtonText: 'Aceptar'
            })
      })
  }
};

const agregarCategoria = category => ({
  type: AGREGAR_CATEGORIA,
  payload: category
});

const agregarCategoriaExito = category => ({
  type: AGREGAR_CATEGORIA_EXITO,
});





export function getCategoriesAdmin() {
  return async function (dispatch) {
    try {
      const respuesta = await clienteAxios.get('/categories');
      dispatch(descargaCategoriaExito(respuesta.data)) // si el get fue exitoso, se hace un dispatch al store de los productos que entran en el array del initialState 'productos', es un array vacío
    } catch (err) {
      console.log(err)
      dispatch(descargaCategoriaError())
    }
  }
}

export function getCategories() {
  return async function (dispatch) {
    dispatch(descargarCategorias())
    try {
      const respuesta = await clienteAxios.get('/categories');
      dispatch(descargaCategoriaExito(respuesta.data)) // si el get fue exitoso, se hace un dispatch al store de los productos que entran en el array del initialState 'productos', es un array vacío
    } catch (err) {
      console.log(err)
      dispatch(descargaCategoriaError())
    }
  }
}

export function getCategoriesName(nombreCat) {
  return async function (dispatch) {
    dispatch(descargarCategorias())
    try {
      const respuesta = await clienteAxios.get(`/products/category/${nombreCat}`)
      dispatch(descargaCategoriaExito(respuesta.data)) 
      console.log(respuesta.data)
    } catch (err) {
      console.log(err)
      dispatch(descargaCategoriaError())
    }
  }
}

const descargarCategorias = () => ({
  type: DESCARGA_CATEGORIA,
  payload: true
});

const descargaCategoriaExito = categoria => ({
  type: DESCARGA_CATEGORIA_EXITO,
  payload: categoria
})
const descargaCategoriaError = () => ({
  type: DESCARGA_CATEGORIA_ERROR,
  payload: true
});


export function deleteCategory(id) { //recibe la data pasada por el form de AddCategories
  return function (dispatch) {
    console.log("id", id)
    dispatch (eliminarCategoria(id))
    var accesToken =   localStorage.getItem("tokenLogin");
    //se le pasa por body a la url para añadir la categoria
    return clienteAxios.delete('/categories/' + id ,{headers:{Authorization:`Bearer ${accesToken}` }})
      .then(res => {
        console.log(res.data)
        dispatch(eliminarCategoriaExito())
      })
      .catch (err =>{
        console.log(err)
      })
  }
};

const eliminarCategoria = (id) => ({
  type: ELIMINAR_CATEGORIA,
  payload: id
})

const eliminarCategoriaExito = () => ({
  type: ELIMINAR_CATEGORIA_EXITO

})

export function editCategory (id, data) {
  console.log("id", id)
  console.log("data", data)
  return function (dispatch) {
    dispatch (editarCategoria({id: id, name: data.name, description: data.description}))
    var accesToken =   localStorage.getItem("tokenLogin");
    return clienteAxios.put ("/categories/" +id, {name: data.name, description: data.description},{headers:{Authorization:`Bearer ${accesToken}` }})
    .then (res => {
      console.log(res.data)
      dispatch (editarCategoriaExito())
    })
     .catch (err =>{
        console.log(err)
      })
  }
}

const editarCategoria = (data) => ({
  type: EDITAR_CATEGORIA,
  payload: data});

const editarCategoriaExito = () => ({
  type: EDITAR_CATEGORIA_EXITO})