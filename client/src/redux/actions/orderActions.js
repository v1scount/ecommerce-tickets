import { 
  AGREGAR_ORDEN,
  AGREGAR_ORDEN_EXITO,
  DESCARGA_ORDEN,
  DESCARGA_ORDEN_EXITO,
  DESCARGA_ORDEN_ERROR,
  ELIMINAR_ORDEN,
  ELIMINAR_ORDEN_EXITO,
  EDITAR_ORDEN,
  EDITAR_ORDEN_EXITO,
  EDITAR_ORDEN_ERROR,
  VER_ORDEN,
  VER_ORDEN_EXITO
 } from "../types/orders.js";
import clienteAxios from '../../config/axios.js';

export function addOrder(data) { //recibe la data pasada por el form de Addorders
  return function (dispatch) {
    console.log("data", data)
    //se le pasa por body a la url para añadir la Orden
    var accesToken =   localStorage.getItem("tokenLogin");
    
    return clienteAxios.post('/orders', { name: data.name, description: data.description },{headers:{Authorization:`Bearer ${accesToken}` }})
      .then(res => {
        dispatch (agregarOrden(res.data))
        dispatch(agregarOrdenExito())
      })
  }
};

const agregarOrden = order => ({
  type: AGREGAR_ORDEN,
  payload: order
});

const agregarOrdenExito = order => ({
  type: AGREGAR_ORDEN_EXITO,
});

export function getOrder() {
  return async function (dispatch) {
    dispatch(descargarOrden())
    try {
      const respuesta = await clienteAxios.get('/orders');
      dispatch(descargaOrdenExito(respuesta.data)) // si el get fue exitoso, se hace un dispatch al store de los productos que entran en el array del initialState 'productos', es un array vacío
    } catch (err) {
      console.log(err)
      dispatch(descargaOrdenError())
    }
  }
}

export function getOrderDetail(id) {
  return async function (dispatch) {
    dispatch(descargarOrden())
    try {
      const respuesta = await clienteAxios.get(`/orders/${id}`);
      dispatch(descargaOrdenExito(respuesta.data)) // si el get fue exitoso, se hace un dispatch al store de los productos que entran en el array del initialState 'productos', es un array vacío
    } catch (err) {
      console.log(err)
      dispatch(descargaOrdenError())
    }
  }
}

export function getUserOrderDetail(id) {
  return async function (dispatch) {
    dispatch(descargarOrden())
    try {
      const respuesta = await clienteAxios.get(`/orders/users/${id}`);
      dispatch(descargaOrdenExito(respuesta.data)) // si el get fue exitoso, se hace un dispatch al store de los productos que entran en el array del initialState 'productos', es un array vacío
    } catch (err) {
      console.log(err)
      dispatch(descargaOrdenError())
    }
  }
}

const descargarOrden = () => ({
  type: DESCARGA_ORDEN,
  payload: true
});

const descargaOrdenExito = orden => ({
  type: DESCARGA_ORDEN_EXITO,
  payload: orden
})
const descargaOrdenError = () => ({
  type: DESCARGA_ORDEN_ERROR,
  payload: true
});


export function deleteOrder(id) {
  return function (dispatch) {
    console.log("id", id)
    dispatch (eliminarOrden(id))
    //se le pasa por body a la url para añadir la Orden
    var accesToken =   localStorage.getItem("tokenLogin");
    return clienteAxios.delete('/orders/' + id,{headers:{Authorization:`Bearer ${accesToken}` }})
      .then(res => {
        console.log(res.data)
        dispatch(eliminarOrdenExito())
      })
      .catch (err =>{
        console.log(err)
      })
  }
};

const eliminarOrden = (id) => ({
  type: ELIMINAR_ORDEN,
  payload: id
})

const eliminarOrdenExito = () => ({
  type: ELIMINAR_ORDEN_EXITO

})

export function editOrder(data, id) {
  return async (dispatch) => {
    dispatch(editarOrden());

    try {
      var accesToken =   localStorage.getItem("tokenLogin");
      await clienteAxios.put(`/orders/${id}`, data,{headers:{Authorization:`Bearer ${accesToken}` }});
      dispatch(editarOrdenExito(data));
      console.log(data)
    } catch (error) {
      console.log(error)
      dispatch(editarOrdenError());
    }
  }
}

const editarOrden = () => ({
  type: EDITAR_ORDEN
});

const editarOrdenExito = (data) => ({
  type: EDITAR_ORDEN_EXITO,
  payload: data
})

const editarOrdenError = () => ({
  type: EDITAR_ORDEN_ERROR,
  payload: true
})

export function selectOrder (id) {
  return async (dispatch) => {
  dispatch (verOrden (id))
  dispatch (verOrdenExito())
}
}

const verOrden = (id) => ({
  type: VER_ORDEN,
  payload: id
})

const verOrdenExito = () => ({
  type: VER_ORDEN_EXITO
})