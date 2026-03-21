import { createSlice } from '@reduxjs/toolkit';
import { DATA_PUBLICACIONES } from '../../utils/Data'; 

const publicacionesSlice = createSlice({
  name: 'publicaciones',
  initialState: {
    listaPublicaciones: DATA_PUBLICACIONES, 
    loading: false,
    error: null
  },
  reducers: {
    agregarPublicacion: (state, action) => {
      state.listaPublicaciones.unshift(action.payload);
    },
    editarPublicacion: (state, action) => {
      const index = state.listaPublicaciones.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.listaPublicaciones[index] = action.payload;
      }
    },
    eliminarPublicacion: (state, action) => {
      state.listaPublicaciones = state.listaPublicaciones.filter(p => p.id !== action.payload);
    }
  }
});

export const { agregarPublicacion, editarPublicacion, eliminarPublicacion } = publicacionesSlice.actions;
export default publicacionesSlice.reducer;