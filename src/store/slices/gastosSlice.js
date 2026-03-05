import { createSlice } from '@reduxjs/toolkit';
import { DATA_GASTOS } from '../../utils/Data'; 

const gastosSlice = createSlice({
  name: 'gastos',
  initialState: {
    listaGastos: DATA_GASTOS,
    loading: false,
    error: null,
    // Podríamos guardar un total calculado del mes actual
    totalGastadoMes: 450.50 
  },
  reducers: {
    registrarGasto: (state, action) => {
      const nuevoGasto = {
        id: Date.now().toString(),
        fecha: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }),
        monto: `${action.payload.monto} Bs.`,
        tipo: action.payload.tipo, // Fijo o Variable
        tipo_gasto: action.payload.categoria, 
        proveedor: action.payload.proveedor,
        descripcion: action.payload.descripcion,
        comprobante: action.payload.comprobante // URI de la foto de la factura
      };
      
      state.listaGastos.unshift(nuevoGasto);
      // Aquí sumaríamos el nuevo monto al totalGastadoMes lógicamente
    }
  }
});

export const { registrarGasto } = gastosSlice.actions;
export default gastosSlice.reducer;