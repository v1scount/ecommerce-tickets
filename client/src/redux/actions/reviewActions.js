import {
  AGREGAR_REVIEW,
  AGREGAR_REVIEW_EXITO,
  AGREGAR_REVIEW_ERROR,
  DESCARGA_REVIEW,
  DESCARGA_REVIEW_EXITO,
  DESCARGA_REVIEW_ERROR,
  ELIMINAR_REVIEW,
  ELIMINAR_REVIEW_EXITO,
  EDITAR_REVIEW,
  EDITAR_REVIEW_EXITO
} from "../types/reviews.js";
import clienteAxios from '../../config/axios.js';
import Swal from 'sweetalert2';

export function addReview(data, id) {
  return async (dispatch) => {
    dispatch(agregarReview(id));
    try {
      await clienteAxios.post(`/products/${id}/review`, { description: data.description, rating: data.rating, userId: data.userId });
      dispatch(agregarReviewExito(data))
      console.log(data)
      await Swal.fire({
        title: "Gracias por tus comentarios",
        imageUrl: "https://img.icons8.com/emoji/48/000000/smiling-face-with-sunglasses.png",
        icon: "success",
        confirmButtonText: 'Aceptar'
      });
    } catch (error) {
      console.log(error);
      dispatch(agregarReviewError(true))
      await Swal.fire({
        icon: 'error',
        title: 'Hubo un error',
        text: 'Hubo un error, intenta de nuevo'
      });
    }
  }
}

const agregarReview = () => ({
  type: AGREGAR_REVIEW,
  payload: true
})

// si el Review se guarda en la base de datos
const agregarReviewExito = review => ({
  type: AGREGAR_REVIEW_EXITO,
  payload: review
})

// si hubo un error
const agregarReviewError = estado => ({
  type: AGREGAR_REVIEW_ERROR,
  payload: estado
});

export function getReviews(id) {
  return async function (dispatch) {
    dispatch(descargarReviews())
    try {
      const respuesta = await clienteAxios.get(`products/${id}/reviews`);
      dispatch(descargaReviewsExitosa(respuesta.data))
    } catch (err) {
      console.log(err)
      dispatch(descargaReviewsError())
    }
  }
}

export function getAllReviews() {
  return async function (dispatch) {
    dispatch(descargarReviews())
    try {
      const respuesta = await clienteAxios.get(`/reviews`);
      dispatch(descargaReviewsExitosa(respuesta.data))
    } catch (err) {
      console.log(err)
      dispatch(descargaReviewsError())
    }
  }
}


const descargarReviews = () => ({
  type: DESCARGA_REVIEW,
  payload: true
});

const descargaReviewsExitosa = review => ({
  type: DESCARGA_REVIEW_EXITO,
  payload: review
})
const descargaReviewsError = () => ({
  type: DESCARGA_REVIEW_ERROR,
  payload: true
});
