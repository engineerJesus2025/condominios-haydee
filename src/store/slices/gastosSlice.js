import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import clienteApi from '../../utils/clienteApi';

// Thunk para consultar la lista general
export const fetchGastos = createAsyncThunk(
  'gastos/fetchGastos',
  async (_, { rejectWithValue }) => {
    try {
      const respuesta = await clienteApi.get('', {
        params: {
          endpoint: 'gastos',
          operacion: 'consulta'
        }
      });

      const json = respuesta.data;
      
      if (json.estatus) {
        return json.datos; // Retornamos los datos crudos de MySQL
      } else {
        return rejectWithValue(json.mensaje);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchCatalogosGastos = createAsyncThunk(
  'gastos/fetchCatalogos',
  async (_, { rejectWithValue }) => {
    try {
      const respuesta = await clienteApi.get('', {
        params: { endpoint: 'gastos', operacion: 'obtener_catalogos' }
      });
      if (respuesta.data.estatus) {
        return respuesta.data.datos;
      }
      return rejectWithValue(respuesta.data.mensaje);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const crearGasto = createAsyncThunk(
  'gastos/crearGasto',
  async ({ datosVisuales, formData }, { rejectWithValue }) => {
    try {
      const respuesta = await clienteApi.post('', formData, {
        params: { endpoint: 'gastos' }
      });

      const json = respuesta.data;
      
      if (json.estatus) {
        return {
          ...datosVisuales,
          id: json.id || Date.now().toString() // Si tu PHP devuelve el ID generado, lo usamos
        };
      } else {
        // Si hay errores de validación de tu clase Validador, los formateamos
        const errorMsg = json.mensaje || (json.errores ? Object.values(json.errores)[0] : 'Error al registrar');
        return rejectWithValue(errorMsg);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const gastosSlice = createSlice({
  name: 'gastos',
  initialState: {
    listaGastos: [],
    catalogos: { proveedores: [], bancos: [], solicitudes: [], tipos_gasto: [] },
    loading: false,
    error: null,
    totalGastadoMes: "0.00" 
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGastos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGastos.fulfilled, (state, action) => {
        state.loading = false;
        
        // Mapeamos los datos de MySQL a lo que espera la GastoCard
        state.listaGastos = action.payload.map(item => ({
          id: item.id_gasto,
          // Formateamos la fecha (viene como YYYY-MM-DD HH:MM:SS)
          fecha: item.ultima_fecha ? item.ultima_fecha.split(' ')[0] : 'Sin fecha',
          monto: `${parseFloat(item.monto_total || 0).toFixed(2)} Bs.`, // Formato de moneda
          tipo: item.clasificacion || 'Variable', // Fijo o Variable
          tipo_gasto: item.tipo || 'General',     // Categoría
          proveedor: item.proveedor || 'No especificado',
          descripcion: item.descripcion_gasto,
          // Nota: La consulta general no trae la imagen, se pediría al abrir el detalle
          comprobante: null 
        }));

        // Calculamos el total (Sumamos todos los montos de la lista actual)
        const total = action.payload.reduce((sum, item) => sum + parseFloat(item.monto_total || 0), 0);
        state.totalGastadoMes = total.toFixed(2);
      })
      .addCase(fetchGastos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(crearGasto.fulfilled, (state, action) => {
        // Agregamos el gasto a la lista visible
        state.listaGastos.unshift(action.payload);
        
        // Sumamos el monto crudo al Total del Mes
        const nuevoTotal = parseFloat(state.totalGastadoMes) + parseFloat(action.payload.montoCrudo || 0);
        state.totalGastadoMes = nuevoTotal.toFixed(2);
      })
      .addCase(fetchCatalogosGastos.fulfilled, (state, action) => {
        state.catalogos = action.payload;
      });
  }
});

export default gastosSlice.reducer;
