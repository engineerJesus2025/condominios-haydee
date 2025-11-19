import { createSlice } from '@reduxjs/toolkit'

const usuarioSlice = createSlice({
  name: 'usuario',
  initialState: {
    user: null,
    isLogueado: false
  },
  reducers: {
    login: (state, action) => {
      console.log('login', action)
      state.user = action.payload
      state.isLogueado = true
    },
    logout: (state) => {
      state.user = null
      state.isLogueado = false
    }
  }
})

export const { login, logout } = usuarioSlice.actions
export default usuarioSlice.reducer
