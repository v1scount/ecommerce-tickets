import {
    AGREGAR_PRODUCTO,
    AGREGAR_PRODUCTO_EXITO,
    AGREGAR_PRODUCTO_ERROR,
    COMENZAR_DESCARGA_PRODUCTOS,
    DESCARGA_PRODUCTOS_EXITO,
    DESCARGA_PRODUCTOS_ERROR,
    OBTENER_PRODUCTO_ELIMINAR,
    PRODUCTO_ELIMINADO_EXITO,
    PRODUCTO_ELIMINADO_ERROR,
    OBTENER_PRODUCTO_EDITAR,
    COMENZAR_EDICION_PRODUCTO,
    PRODUCTO_EDITADO_EXITO,
    PRODUCTO_EDITADO_ERROR
} from '../types/products';
import clienteAxios from '../../config/axios.js';
import Swal from 'sweetalert2';




 // Función que descarga los productos de la base de datos
export function obtenerProductosAction() {
    
    return async (dispatch) => {
        dispatch( descargarProductos() );
        try {
            const respuesta = await clienteAxios.get('/products');
            dispatch( descargaProductosExitosa(respuesta.data) )
        } catch (error) {
            console.log(error);
            dispatch( descargaProductosError() )
        }
    }
}

export function getProducts() {
  return async function(dispatch) {
    dispatch(descargarProductos())
    try {
    const respuesta = await clienteAxios.get('/products');
    dispatch(descargaProductosExitosa(respuesta.data)) // si el get fue exitoso, se hace un dispatch al store de los productos que entran en el array del initialState 'productos', es un array vacío
    } catch(err) {
      console.log(err)
      dispatch(descargaProductosError())
    }
  }
}
 
export function getProductId(id) {
  return async function(dispatch) {
    dispatch(descargarProductos())
    try {
    const respuesta = await clienteAxios.get(`/products/${id}`);
    dispatch(descargaProductosExitosa(respuesta.data)) 
    } catch(err) {
      console.log(err)
      dispatch(descargaProductosError())
    }
  }
}


const descargarProductos = () => ({
    type: COMENZAR_DESCARGA_PRODUCTOS,
    payload: true
});

const descargaProductosExitosa = productos => ({
    type: DESCARGA_PRODUCTOS_EXITO,
    payload: productos
})
const descargaProductosError = () => ({
    type: DESCARGA_PRODUCTOS_ERROR, 
    payload: true
});


//funcion para crear nuevo producto
export function crearNuevoProductoAction(producto){
  return async (dispatch) => {
      dispatch(agregarproducto());
      try {
          //insertar en base de datos
          var accesToken =   localStorage.getItem("tokenLogin");
          await clienteAxios.post('/products',producto,{headers:{Authorization:`Bearer ${accesToken}` }});
          //si todo sale bien, actualizar el state
          dispatch(agregarProductoExito(producto))
          //alerta
          await Swal.fire(
            'Correcto',
            'El producto se agregó correctamente',
            'success'
          );
      } catch (error) {
          console.log(error);
          //si hay error cambiar el state
          dispatch(agregarProductoError(true ))
          //Alerta de error
          await Swal.fire({
            icon:'error',
            title:'Hubo un error',
            text:'Hubo un error, intenta de nuevo'
          });
      }
  }
}

const agregarproducto = ()=>({
  type: AGREGAR_PRODUCTO,
  payload:true
})

// si el producto se guarda en la base de datos
const agregarProductoExito = producto => ({
  type: AGREGAR_PRODUCTO_EXITO,
  payload: producto
})

// si hubo un error
const agregarProductoError = estado => ({
  type: AGREGAR_PRODUCTO_ERROR,
  payload: estado
});


// Selecciona y elimina el producto
export function borrarProductoAction(id) {
  return async (dispatch) => {
      dispatch(obtenerProductoEliminar(id) );
    
      try {
          var accesToken =   localStorage.getItem("tokenLogin");
          await clienteAxios.delete(`/products/${id}`,{headers:{Authorization:`Bearer ${accesToken}` }});
          dispatch( eliminarProductoExito() );

          // Si se elimina, mostrar alerta
          await Swal.fire(
              'Eliminado',
              'El producto se eliminó correctamente',
              'success'
          )
      } catch (error) {
          console.log(error);
          dispatch( eliminarProductoError() );
      }
  }
}

const obtenerProductoEliminar = id => ({
  type: OBTENER_PRODUCTO_ELIMINAR,
  payload: id
});
const eliminarProductoExito = () => ({
  type: PRODUCTO_ELIMINADO_EXITO
})
const eliminarProductoError = () => ({
  type: PRODUCTO_ELIMINADO_ERROR,
  payload: true
});

 

// Colocar producto en edición
export function obtenerProductoEditar(producto) {
  return (dispatch) => {
      dispatch( obtenerProductoEditarAction(producto) )
  }
}

const obtenerProductoEditarAction = producto => ({
  type: OBTENER_PRODUCTO_EDITAR,
  payload: producto
})


// Edita un registro en la api y state
export function editarProductoAction(producto,id) {
  return async (dispatch) => {
      dispatch( editarProducto() );

      try {
          var accesToken =   localStorage.getItem("tokenLogin");
          await clienteAxios.put(`/products/${id}`, producto,{headers:{Authorization:`Bearer ${accesToken}` }});    
          dispatch( editarProductoExito(producto) );
           //alerta
          await Swal.fire(
            'Correcto',
            'El producto se actualizó correctamente',
            'success'
          );
      } catch (error) {
          dispatch( editarProductoError() );
      }
  }
}
const editarProducto = () => ({
  type: COMENZAR_EDICION_PRODUCTO
});

const editarProductoExito = producto => ({
  type: PRODUCTO_EDITADO_EXITO,
  payload: producto
});

const editarProductoError = () => ({
  type: PRODUCTO_EDITADO_ERROR,
  payload: true
})
