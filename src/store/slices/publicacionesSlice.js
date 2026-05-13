import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import clienteApi from '../../utils/clienteApi';

export const fetchPublicaciones = createAsyncThunk(
  'publicaciones/fetchPublicaciones',
  async (_, { rejectWithValue }) => {
    try {
      const respuesta = await clienteApi.get('', {
        params: {
          endpoint: 'cartelera',
          operacion: 'consulta'
        }
      });

      const json = respuesta.data;

      if (json.estatus) {
        const URL_BASE = process.env.EXPO_PUBLIC_URL_BASE;
        
        // Retornamos los datos mapeados. Esto se convertirá en el action.payload
        return json.datos.map(item => ({
          id: item.id_cartelera,
          titulo: item.titulo,
          descripcion: item.descripcion,
          fecha: item.fecha, 
          tipo: item.prioridad == 1 ? 'aviso' : (item.prioridad == 2 ? 'evento' : 'noticia'),
          autor: item.nombre_usuario,
          imagen: item.imagen ? `${URL_BASE}/recursos/img/cartelera_virtual/${item.imagen}` : null
        }));
      } else {
        // Si el PHP dice estatus: false, disparamos un error controlado
        return rejectWithValue(json.mensaje);
      }
    } catch (error) {
      // Así es como se extrae el "chisme" completo que mandó PHP
      // console.log("=== ERROR DEL SERVIDOR ===");
      // console.log("Status:", error.response?.status);
      // console.log("Mensaje de la API:", error.response?.data?.mensaje);
      // console.log("Datos completos:", error.response?.data);
      // console.log("==========================");

      return rejectWithValue(
        error.response?.data?.mensaje || 'Error de conexión con el servidor'
      );
    }
  }
);

export const crearPublicacion = createAsyncThunk(
  'publicaciones/crearPublicacion',
  async ({ datosVisuales, formData }, { rejectWithValue }) => {
    try {
      const respuesta = await clienteApi.post('?endpoint=cartelera', formData);

      const json = respuesta.data;
      
      if (json.estatus) {
        return {
          ...datosVisuales,
          id: json.lastId, // El ID generado por MySQL
          fecha: new Date().toISOString().replace('T', ' ').split('.')[0] // Simulamos la fecha de hoy
        };
      } else {
        return rejectWithValue(json.mensaje);
      }
    } catch (error) {
      console.log("=== ERROR DEL SERVIDOR ===");
      console.log("Status:", error.response?.status);
      console.log("Mensaje de la API:", error.response?.data?.mensaje);
      console.log("Datos completos:", error.response?.data);
      console.log("err:", error);
      console.log("==========================");

      return rejectWithValue(
        error.response?.data?.mensaje || 'Error de conexión con el servidor'
      );
    }
  }
);

const publicacionesSlice = createSlice({
  name: 'publicaciones',
  initialState: {
    listaPublicaciones: [],
    cargando: false,
    error: null
  },
  reducers: {
    editarPublicacion: (state, action) => {
      const index = state.listaPublicaciones.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.listaPublicaciones[index] = action.payload;
      }
    },
    eliminarPublicacion: (state, action) => {
      state.listaPublicaciones = state.listaPublicaciones.filter(p => p.id !== action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPublicaciones.pending, (state) => {
        state.cargando = true;
        state.error = null;
      })
      .addCase(fetchPublicaciones.fulfilled, (state, action) => {
        state.cargando = false;
        state.listaPublicaciones = action.payload; 
      })
      .addCase(fetchPublicaciones.rejected, (state, action) => {
        state.cargando = false;
        state.error = action.payload; 
      })
      .addCase(crearPublicacion.fulfilled, (state, action) => {
        state.listaPublicaciones.unshift(action.payload);
      });
  }
});

export const { agregarPublicacion, editarPublicacion, eliminarPublicacion } = publicacionesSlice.actions;
export default publicacionesSlice.reducer;