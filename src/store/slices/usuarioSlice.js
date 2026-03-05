import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null, // Guardará { id, nombre, email, rol }
  isAuthenticated: false,
  loading: false,
  error: null,
};

const usuarioSlice = createSlice({
  name: 'usuario',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload; // Aquí guardamos los datos y el rol
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    }
  }
});

export const { loginStart, loginSuccess, loginFailure, logout } = usuarioSlice.actions;
export default usuarioSlice.reducer;