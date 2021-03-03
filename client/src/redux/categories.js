import {createSlice, configureStore} from '@reduxjs/toolkit'
 
const categoriesSlice = createSlice({
    name: 'genre',
    initialState: {
        current:null
    },
    reducers: {
      select:(state, {payload}) =>{
          state.current = payload
      }
    }
  })


  export const { select } = categoriesSlice.actions

  export const store = configureStore({
    reducer: categoriesSlice.reducer
  })
  