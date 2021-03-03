import { 
    AGREGAR_REVIEW,
    AGREGAR_REVIEW_EXITO,
    DESCARGA_REVIEW,
    DESCARGA_REVIEW_EXITO,
    DESCARGA_REVIEW_ERROR,
    ELIMINAR_REVIEW,
    ELIMINAR_REVIEW_EXITO,
    EDITAR_REVIEW,
    EDITAR_REVIEW_EXITO
   } from "../types/reviews.js";

  const initialState = {
    review: [],
    error: null,
    loading: false,
    reviewagregar: null,
    revieweliminar: null,
    revieweditar: null
}

export default function (state = initialState, action) {
    switch (action.type) {
        case DESCARGA_REVIEW:
        case AGREGAR_REVIEW:
            return {
                ...state,
                loading: action.payload
            }
        case AGREGAR_REVIEW_EXITO:
            return {
                ...state,
                loading: false,
                review: [...state.review, action.payload]
            }
        case DESCARGA_REVIEW_ERROR:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        case DESCARGA_REVIEW_EXITO:
            return {
                ...state,
                loading: false,
                error: null,
                review: action.payload
            }

        case ELIMINAR_REVIEW:
          return {
            ...state,
            revieweliminar: action.payload
          }
        case ELIMINAR_REVIEW_EXITO:
        return {
            ...state,
            review: state.review.filter(review => review.id !== state.revieweliminar)
          }
        case EDITAR_REVIEW:
        return {
            ...state,
            revieweditar: action.payload,
            review: state.review.filter(review => review.id !== action.payload.id)
        }
        case EDITAR_REVIEW_EXITO:
        return {
            ...state,
            review: state.review.concat (state.revieweditar)
        }
        default:
            return state;
    }
}