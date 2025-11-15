import { configureStore } from '@reduxjs/toolkit'
import publicaccionesReducer from '../store/slices/publicacionesSlice'
import temaReducer from '../store/slices/temaSlice'
import usuarioReducer from '../store/slices/usuarioSlice'

export const store = configureStore({
  reducer: {
    publicaciones: publicaccionesReducer,
    tema: temaReducer,
    usuario: usuarioReducer,
  }
})

