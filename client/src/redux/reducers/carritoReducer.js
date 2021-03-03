import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import clienteAxios from "../../config/axios";

const initialState = {
  products: []
}

export const fetchCart = createAsyncThunk(
  'carrito/fetchCart',
  async (userId, thunkAPI) => {
    const result = await clienteAxios.get(
      `orders/users/${userId}/cart`
    );

    var data;
    if (Array.isArray(result.data)) {
      data = result.data[0]
    } else {
      data = result.data;
    }
    return data;
    // const productsBack = data.find((x) => x.productId == products.id);
    // return productsBack;
  }
)


export const loadGuestCart = createAsyncThunk(
  'carrito/loadGuestCart',
  async (userId, thunkAPI) => {
    const productos = JSON.parse(localStorage.getItem('carritoGuest') ?? '[]');
    return productos;
  }
)
/*
addProduct(state, action) {
            //Controlar el ingreso del prodcuto al carro
            const existe = state.products.find(x => x.id == action.payload.id);
            const product = existe ? existe : { id: action.payload.id, name: action.payload.name, cantidad: 1, price: action.payload.price, img: action.payload.img }
            product.cantidad += existe ? 1 : 0;
            if (!existe) state.products.push(product)
        },
*/

export const addProduct = createAsyncThunk(
  'carrito/addProduct',
  async ({ userId, product, cantidadActual, cantidadAgregar }, thunkAPI) => {

    if (userId > 0) {
      const result = await clienteAxios.get(
        `orders/users/${userId}/cart`
      );

      var data;
      var primerProduct;
      if (Array.isArray(result.data)) {
        data = result.data[0].products;
        primerProduct = await result.data[1]
      } else {
        data = result.data.products;
      }

      if (primerProduct !== true) {
        const lineOrderBack = await data.map(lineOrder => lineOrder.lineOrder)
        var productBack = await lineOrderBack.find((x) => x.productId == product.id);
      }

      if (productBack) {//Quitar producto
        if (productBack.cantidad + cantidadAgregar <= 0) {
          console.error('quitar producto del carrito');
        }
        var resultPut = await clienteAxios.put(
          `orders/users/${userId}/cart`,
          { productId: product.id, cantidad: productBack.cantidad + cantidadAgregar }
        );
        return {
          ...product,
          cantidad: productBack.cantidad + cantidadAgregar,
        }

      } else {
        var resultPost = await clienteAxios.post(
          `orders/users/${userId}/cart`,
          { productId: product.id, cantidad: cantidadAgregar }
        );
        //console.log(resultPost)

        return {
          ...product,
          id: resultPost.data.product.id,
          name: resultPost.data.product.name,
          cantidad: resultPost.data.lineOrder.cantidad,
          price: resultPost.data.lineOrder.price,
          img: resultPost.data.product.img,
        }
      }
    } else {
      return {
        ...product,
        cantidad: cantidadActual + cantidadAgregar,
      }
    }
  }
)

export const clearCar = createAsyncThunk(
  'carrito/clearCarrito',
  async (userId, thunkAPI) => {
    //const productos = JSON.parse(localStorage.getItem('carritoGuest') ?? '[]');
    //return productos;
    if(userId){    const result = await clienteAxios.delete(`orders/users/${userId}/cart`);
      return result.status == 200;
    }

    localStorage.removeItem("carritoGuest")  

  }
)

const carritoSlice = createSlice({
  name: 'carrito',
  initialState,
  reducers: {
    removeProduct(state, action) {
      //Controlar el ingreso del prodcuto al carro
      const index = state.products.findIndex(x => x.id == action.payload.id);
      if (index >= 0) {
        const product = state.products[index];
        product.cantidad -= 1;
        if (product.cantidad <= 0) state.products.splice(index, 1);
      }
    },
    clearCarrito(state, action) {
      state.products = []; //.splice(0, state.products.length)
    },
    removeAllProduct(state, action) {
      const index = state.products.findIndex(x => x.id == action.payload.id);
      if (index >= 0) {
        const product = state.products[index];
        state.products.splice(index, 1);
      }
    }
  },
  extraReducers: {
    [fetchCart.fulfilled]: (state, action) => {
      state.products = [];

      if (Array.isArray(action.payload.products)) {
        for (const product of action.payload.products) {

          const _product = { id: product.lineOrder.productId, name: product.name, cantidad: product.lineOrder.cantidad, price: product.lineOrder.price, img: product.name }
          state.products.push(_product)
        }
      }
      // Add user to the state array
      //state.entities.push(action.payload)

      localStorage.removeItem("carritoGuest")

    },

    [loadGuestCart.fulfilled]: (state, action) => {
      state.products = [];
      for (const product of action.payload) {
        const _product = { id: product.id, name: product.name, cantidad: product.cantidad, price: product.price, img: product.img }
        state.products.push(_product)
      }
    },

    [addProduct.fulfilled]: (state, action) => {
      const _producto = action.payload
      const existe = state.products.find(x => x.id === action.payload.id);
      const producto = existe ? existe : { id: _producto.id, name: _producto.name, cantidad: _producto.cantidad, price: _producto.price, img: _producto.img }
      producto.cantidad = _producto.cantidad;
      if (!existe) state.products.push(producto)
    },
    /* [addProduct.rejected]: (state, action) => {
        console.log(action);
    },
    [clearCarrito.fulfilled]: (state, action) => {
        state.products = [];
    } */

    [clearCar.fulfilled]: (state, action) => {
      state.products = [];
    }
  }
},
)

export const { removeProduct, clearCarrito, removeAllProduct } = carritoSlice.actions;

export const carritoReducer = carritoSlice.reducer;