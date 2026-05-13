import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import clienteApi from '../../utils/clienteApi';

// Historial de Mensualidades (Lista)
export const fetchMensualidades = createAsyncThunk(
  'mensualidades/fetchMensualidades',
  async (_, { rejectWithValue }) => {
    try {
      const respuesta = await clienteApi.get('', {
        params: { endpoint: 'mensualidades', operacion: 'consultarPorMeses' }
      });
      if (respuesta.data.estatus) return respuesta.data.datos;
      return rejectWithValue(respuesta.data.mensaje);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Resumen Financiero (KPIs)
export const fetchResumenFinanciero = createAsyncThunk(
  'mensualidades/fetchResumenFinanciero',
  async (_, { rejectWithValue }) => {
    try {
      const respuesta = await clienteApi.get('', {
        params: { endpoint: 'mensualidades', operacion: 'consultar_kpis' }
      });
      if (respuesta.data.estatus) return respuesta.data.datos;
      return rejectWithValue(respuesta.data.mensaje);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchDetalleMensualidad = createAsyncThunk(
  'mensualidades/fetchDetalleMensualidad',
  async ({ id, mes, anio }, { rejectWithValue }) => {
    try {
      const respuesta = await clienteApi.get('', {
        params: { 
          endpoint: 'mensualidades', 
          operacion: 'consultar_mensualidades_apartamentos', 
          mes: mes,
          anio: anio 
        }
      });

      if (respuesta.data.estatus) {
        return { id, apartamentos: respuesta.data.datos };
      }
      return rejectWithValue(respuesta.data.mensaje);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const mensualidadesSlice = createSlice({
  name: 'mensualidades',
  initialState: {
    listaMensualidades: [],
    resumen: {
      deudaTotal: 0,
      gastado: 0,
      presupuestoTotal: 0
    },
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMensualidades.pending, (state) => { state.loading = true; })
      .addCase(fetchMensualidades.fulfilled, (state, action) => {
        state.loading = false;
        const nombresMeses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        
        state.listaMensualidades = action.payload.map(item => {
          const montoTotal = parseFloat(item.monto || 0);
          const pagado = parseFloat(item.pagado || 0);
          return {
            id: item.ids ? item.ids.split(',')[0] : Math.random().toString(),
            mes: `${nombresMeses[item.mes - 1]} ${item.anio}`,
            mes_raw: item.mes,  
            anio_raw: item.anio,
            total: `${montoTotal.toFixed(2)} Bs.`,
            restante: `${(montoTotal - pagado).toFixed(2)} Bs.`,
            tasa: item.tasa_dolar,
            apartamentos: null
          };
        });
      })
      .addCase(fetchDetalleMensualidad.fulfilled, (state, action) => {
         const { id, apartamentos } = action.payload;
         const mensualidad = state.listaMensualidades.find(m => m.id === id);
         if (mensualidad) {
           mensualidad.apartamentos = apartamentos;
         }
      })
      .addCase(fetchResumenFinanciero.fulfilled, (state, action) => {
        const deuda = parseFloat(action.payload.deuda_total || 0);
        const recaudado = parseFloat(action.payload.recaudado_mes || 0);
        state.resumen = {
          deudaTotal: deuda,
          gastado: recaudado,
          presupuestoTotal: deuda + recaudado
        };
      })
      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  }
});

export default mensualidadesSlice.reducer;