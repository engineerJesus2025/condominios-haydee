import { createSlice } from '@reduxjs/toolkit';
import { DATA_PAGOS } from '../../utils/Data'; 

const pagosSlice = createSlice({
  name: 'pagos',
  initialState: {
    listaPagos: DATA_PAGOS, // Inicializamos con los datos estáticos
    loading: false,
    error: null
  },
  reducers: {
    registrarPago: (state, action) => {
      // action.payload traerá la data del formulario
      const nuevoPago = {
        id: Date.now().toString(), // Generamos un ID único simulado
        fecha: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }),
        monto: `${action.payload.monto} Bs.`,
        mensualidad: action.payload.mensualidad,
        estado: 'Pendiente', // Por defecto, todo pago entra a revisión
        apartamento: 'Nro: 1-1', // En la vida real, esto vendría del usuario logueado
        referencia: action.payload.referencia,
        banco: action.payload.banco,
        comprobante: action.payload.comprobante // URI de la imagen
      };
      
      // Añadimos el nuevo pago al principio de la lista
      state.listaPagos.unshift(nuevoPago);
    },
    // los administradores usarán esta acción para aprobar (algun dia mano)
    cambiarEstadoPago: (state, action) => {
      const { id, nuevoEstado } = action.payload;
      const pago = state.listaPagos.find(p => p.id === id);
      if (pago) {
        pago.estado = nuevoEstado;
      }
    }
  }
});

export const { registrarPago, cambiarEstadoPago } = pagosSlice.actions;
export default pagosSlice.reducer;