import {
    CREAR_USUARIO,
    EDITAR_FOTO,
    EDITAR_FOTO_EXITO,
    LOGIN_USER,
    LOGOUT_USER,
    OBTENER_TODOS_LOS_USUARIOS,
    DESCARGA_USER,
    DESCARGA_USER_EXITO,
    DESCARGA_USER_ERROR
} from "../types/Users.js";

//cada reducer tiene su propio state
const initialState = {
    users: [],
    userAUTH: [],
    recuperacion: [],
    newImage: null,
    isAuthenticated: false,
    token: "",
    error: null,
    loading: false,
    productoeliminar: null,
    productoeditar: null
}

export default function (state = initialState, action) {
    switch (action.type) {
        case CREAR_USUARIO:
            return {
                ...state,
                categorias: action.payload
            }
        case LOGIN_USER:
            return {
                ...state,
                userAUTH: action.payload,
                token: action.payload.token,
                isAuthenticated: true
            }
        case LOGOUT_USER:
            return {
                ...state,
                userAUTH: action.payload,
                isAuthenticated: false
            }
        case OBTENER_TODOS_LOS_USUARIOS:
            return {
                ...state,
                recuperacion: action.payload
            }
        case EDITAR_FOTO:
            return {
                ...state,
                newImage: action.payload,

            }
        case EDITAR_FOTO_EXITO:
            return {
                ...state,
                userAUTH: { ...state.userAUTH, photoURL: state.newImage }
            }
        case DESCARGA_USER:
            return {
                ...state,
                users: action.payload
            }
        case DESCARGA_USER_EXITO:
            return {
                ...state,
                loading: false,
                error: null,
                users: action.payload
            }
        case DESCARGA_USER_ERROR:
            return {
                ...state,
                loading: false,
                users: action.payload
            }

        default:
            return state;
    }
}
