import {loadState, saveState} from './maintainState/saveLoad'
import { createStore,applyMiddleware,compose } from "redux";
import thunk from "redux-thunk";
import reducer from "./reducers";


const initialData = loadState() || {}   //variable que guarda los datos que 

const store = createStore(
    reducer,
    initialData,
    compose(applyMiddleware(thunk),
        typeof window === 'object' &&
            typeof window.__REDUX_DEVTOOLS_EXTENSION__ !== 'undefined' ?
                 window.__REDUX_DEVTOOLS_EXTENSION__() : f=>f
    ),

);


store.subscribe( function () {
    saveState(store.getState())
}) 

export default store;
