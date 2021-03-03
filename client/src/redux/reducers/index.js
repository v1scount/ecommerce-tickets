import { combineReducers } from "redux";
import productosReducer from "./productsReducer";
import categoriesReducer from "./categoriesReducer";
import { carritoReducer } from "./carritoReducer";
import { toastReducer } from "./toastReducer";
import userReducer from "./userReducer";
import alertaReducer from "./alertaReducer";
import orderReducer from './orderReducer';
import reviewReducer from './reviewReducer';

export default combineReducers({
    products: productosReducer,
    carrito: carritoReducer,
    toast: toastReducer,
    user : userReducer,
    categories : categoriesReducer,
    alerta: alertaReducer,
    order: orderReducer,
    review: reviewReducer
});

