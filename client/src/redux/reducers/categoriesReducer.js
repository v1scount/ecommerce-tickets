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

//cada reducer tiene su propio state
const initialState = {
    categorias: [],
    error: null,
    loading: false,
    categoriasagregar: null,
    categoriaeditar: null,
    productoeliminar: null,
    productoeditar: null
}

export default function (state = initialState, action) {
    switch (action.type) {
        case DESCARGA_CATEGORIA:
        case AGREGAR_CATEGORIA:
            return {
                ...state,
                categoriasagregar: action.payload
            }
        case AGREGAR_CATEGORIA_EXITO:
            return {
                ...state,
                categoriasagregar: null,
                categorias: state.categorias.concat (state.categoriasagregar)
            }
        case DESCARGA_CATEGORIA_ERROR:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        case DESCARGA_CATEGORIA_EXITO:
            return {
                ...state,
                loading: false,
                error: null,
                categorias: action.payload
            }

        case ELIMINAR_CATEGORIA:
          return {
            ...state,
            categoriaeliminar: action.payload
          }
        case ELIMINAR_CATEGORIA_EXITO:
        return {
            ...state,
            categorias: state.categorias.filter(categoria => categoria.id !== state.categoriaeliminar)
          }
        case EDITAR_CATEGORIA:
        return {
            ...state,
            categoriaeditar: action.payload,
            categorias: state.categorias.filter(categoria => categoria.id !== action.payload.id)
        }
        case EDITAR_CATEGORIA_EXITO:
        return {
            ...state,
            categorias: state.categorias.concat (state.categoriaeditar)
        }
        default:
            return state;
    }
}
