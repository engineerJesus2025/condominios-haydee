import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import clienteApi from '../../utils/clienteApi';


export const fetchPagos = createAsyncThunk(
  'pagos/fetchPagos',
  async (_, { getState, rejectWithValue }) => {
    try {
      
      const { user } = getState().usuario;
      const esAdmin = user?.rol.toLowerCase() === 'administrador' || user?.rol.toLowerCase() === 'presidente';

      const respuesta = await clienteApi.get('', {
        params: {
          endpoint: 'pagos',
          operacion: 'consulta',
          es_propietario: esAdmin ? 0 : 1, 
          correo: user?.correo || ''       
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
          // La consulta general no trae el detalle bancario (referencia, imagen)
          // Eso lo pediremos luego al abrir el detalle
          banco: 'Ver detalles',
          referencia: 'Ver detalles',
          comprobante: null 
        }));
      } else {
        return rejectWithValue(json.mensaje);
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
      const respuesta = await clienteApi.post('?endpoint=pagos', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const json = respuesta.data;
      
      if (json.estatus) {
        return {
          ...datosVisuales,
          id: json.id || Date.now().toString() // ID real de MySQL
        };
      } else {
        return rejectWithValue(json.mensaje || 'Error al registrar el pago');
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const pagosSlice = createSlice({
  name: 'pagos',
  initialState: {
    listaPagos: [],
    loading: false,
    error: null
  },
  reducers: {
    registrarPago: (state, action) => {
      
      const nuevoPago = {
        id: Date.now().toString(), 
        fecha: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }),
        monto: `${action.payload.monto} Bs.`,
        mensualidad: action.payload.mensualidad,
        estado: 'Pendiente', 
        apartamento: 'Nro: 1-1', // En la vida real, esto vendría del usuario logueado
        referencia: action.payload.referencia,
        banco: action.payload.banco,
        comprobante: action.payload.comprobante // URI de la imagen
      };
      
      
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPagos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPagos.fulfilled, (state, action) => {
        state.loading = false;
        state.listaPagos = action.payload;
      })
      .addCase(fetchPagos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      }).addCase(registrarPagoServidor.fulfilled, (state, action) => {
        state.listaPagos.unshift(action.payload);
      });
  }
});

export const { cambiarEstadoPago } = pagosSlice.actions;
export default pagosSlice.reducer;