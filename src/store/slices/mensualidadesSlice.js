import { createSlice } from '@reduxjs/toolkit';
import { DATA_MENSUALIDAD } from '../../utils/Data'; 

const mensualidadesSlice = createSlice({
  name: 'mensualidades',
  initialState: {
    listaMensualidades: DATA_MENSUALIDAD, // Inicializamos con los datos estáticos de los meses
    loading: false,
    error: null
  },
  reducers: {
    // Acción para simular que un administrador publicó un nuevo mes
    agregarMensualidad: (state, action) => {
      state.listaMensualidades.unshift(action.payload);
    },
    // Acción que conectaremos luego: cuando se aprueba un pago, la deuda baja
    actualizarDeudaMensualidad: (state, action) => {
      const { id, nuevoRestante } = action.payload;
      const mes = state.listaMensualidades.find(m => m.id === id);
      if (mes) {
        mes.restante = nuevoRestante;
      }
    }
  }
});

export const { agregarMensualidad, actualizarDeudaMensualidad } = mensualidadesSlice.actions;
export default mensualidadesSlice.reducer;