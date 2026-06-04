import { 
  createSlice, 
  createAsyncThunk, 
  isPending, 
  isRejected, 
  isFulfilled 
} from '@reduxjs/toolkit';
import clienteApi from '../../utils/clienteApi';

export const fetchPagos = createAsyncThunk(
  'pagos/fetchPagos',
  async ({ mes, anio} = {}, { getState, rejectWithValue }) => {
    try {

      const respuesta = await clienteApi.get('', {
        params: {
          endpoint: 'pagos',
          operacion: 'listar_pagos_mes',
          mes:mes,
          anio:anio
        }
      });

      const json = respuesta.data;
      
      if (json.estatus) {
        return json.datos.map(item => ({
          id: item.id_pago,
          estado: item.estado,
          fecha: item.ultima_fecha ? item.ultima_fecha.split(' ')[0] : 'Sin fecha',
          monto: `${parseFloat(item.monto_total || 0).toFixed(2)} Bs.`,
          mensualidad: item.periodos || 'Varias mensualidades',
          apartamento: item.apartamento || 'No asignado',
          tipo_pago: item.tipo_pago_predominante,
          banco: 'Ver detalles',
          referencia: 'Ver detalles',
          imagen: null 
        }));
      } else {
        return rejectWithValue(json.mensaje);
      }
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchEstadoCuenta = createAsyncThunk(
  'pagos/fetchEstadoCuenta',
  async (_, { rejectWithValue }) => {
    try {
      const respuesta = await clienteApi.get('', {
        params: { endpoint: 'pagos', operacion: 'consultar_estado_cuenta' }
      });
      if (respuesta.data.estatus) {
        return respuesta.data.datos;
      } else {
        return rejectWithValue(respuesta.data.mensaje);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const registrarPagoServidor = createAsyncThunk(
  'pagos/registrarPagoServidor',
  async ({ datosVisuales, formData }, { rejectWithValue }) => {
    try {
      const respuesta = await clienteApi.post('', formData, {
        params: { endpoint: 'pagos' }
      });

      const json = respuesta.data;
      
      if (json.estatus) {
        return {
          ...datosVisuales,
          id: json.id 
        };
      } else {
        return rejectWithValue(json.mensaje || 'Error al registrar el pago');
      }
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const actualizarEstadoPagoServidor = createAsyncThunk(
  'pagos/actualizarEstado',
  async ({ id_pago, nuevoEstado }, { rejectWithValue }) => {
    try {
      // Usamos FormData para que PHP lo reciba correctamente en $_POST
      const formData = new FormData();
      formData.append('operacion', 'cambiar_estado_pago');
      formData.append('id_pago', id_pago);
      formData.append('estado', nuevoEstado);
      formData.append('_method', 'PUT');

      const respuesta = await clienteApi.post('', formData, {
        params: { endpoint: 'pagos' },
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (respuesta.data.estatus) {
        return { id: id_pago, estado: nuevoEstado };
      }
      
      return rejectWithValue(respuesta.data.mensaje);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const pagosSlice = createSlice({
  name: 'pagos',
  initialState: {
    listaPagos: [],
    listaDeudas: [],
    totalDeuda: 0,
    loadingDeudas: false,
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPagos.fulfilled, (state, action) => {
        state.loading = false;
        state.listaPagos = action.payload;
      })
      .addCase(registrarPagoServidor.fulfilled, (state, action) => {
        // Agregamos el nuevo pago al inicio de la lista
        state.listaPagos.unshift(action.payload);
      })
      .addCase(fetchEstadoCuenta.fulfilled, (state, action) => {
        state.loadingDeudas = false;
        state.listaDeudas = action.payload;
        // Calculamos el total de la deuda sumando los montos pendientes
        state.totalDeuda = action.payload.reduce((total, item) => total + parseFloat(item.pendiente), 0);
      })
      .addCase(actualizarEstadoPagoServidor.fulfilled, (state, action) => {
        // Solo si el backend responde con éxito, actualizamos la vista
        const pago = state.listaPagos.find(p => p.id === action.payload.id);
        if (pago) {
          pago.estado = action.payload.estado;
        }
      })
      .addMatcher(
        isPending(fetchPagos, fetchEstadoCuenta, actualizarEstadoPagoServidor),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      // Apaga el "loading" cuando cualquiera de estos termina con éxito
      .addMatcher(
        isFulfilled(fetchPagos, fetchEstadoCuenta, actualizarEstadoPagoServidor),
        (state) => {
          state.loading = false;
        }
      )
      // Atrapa los errores SOLO si provienen de estos thunks específicos
      .addMatcher(
        isRejected(fetchPagos, fetchEstadoCuenta, actualizarEstadoPagoServidor),
        (state, action) => {
          state.loading = false;
          if (action.payload && typeof action.payload === 'object' && action.payload.mensaje) {
            state.error = action.payload.mensaje;
          } else if (typeof action.payload === 'string') {
            state.error = action.payload;
          } else {
            state.error = 'Ocurrió un error de conexión o validación.';
          }
        }
      );
  }
});

export const { cambiarEstadoPago } = pagosSlice.actions;
export default pagosSlice.reducer;