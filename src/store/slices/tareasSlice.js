import { createSlice } from '@reduxjs/toolkit'

const tareasSlice = createSlice({
  name: 'tareas',
  initialState: {
    tarea: []
  },
  reducers: {
    agregarTarea: (state, action) => {
      state.tarea.push({
        id: Date.now().toString(),
        ...action.payload
      })
    },
    editarTarea: (state, action) => {
      const index = state.tarea.findIndex(task => task.id === action.payload.id)
      if (index !== -1) {
        state.tarea[index] = action.payload
      }
    },
    borrarTarea: (state, action) => {
      state.tarea = state.tarea.filter(task => task.id !== action.payload)
    },
    cambiarEstado: (state, action) => {
      const task = state.tarea.find(task => task.id === action.payload)
      if (task) {
        task.estado = !task.estado
      }
    }
  }
})

export const { agregarTarea, editarTarea, borrarTarea, cambiarEstado } = tareasSlice.actions
export default tareasSlice.reducer
