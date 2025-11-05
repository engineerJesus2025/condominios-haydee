import { configureStore } from '@reduxjs/toolkit'
import tareasReducer from './slices/tareasSlice'

export const store = configureStore({
  reducer: {
    tareas: tareasReducer
  }
})
