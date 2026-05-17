import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import clienteApi from '../../utils/clienteApi';

export const fetchPublicaciones = createAsyncThunk(
  'publicaciones/fetchPublicaciones',
  async ({ pagina = 1, limite = 10, recargar = false } = {}, { rejectWithValue }) => {
    try {
      const respuesta = await clienteApi.get('', {
        params: {
          endpoint: 'cartelera',
          operacion: 'consulta',
          pagina, 
          limite
        }
      });

      const json = respuesta.data;

      if (json.estatus) {
        const URL_BASE = process.env.EXPO_PUBLIC_URL_BASE;
        
        const datosMapeados = json.datos.map(item => ({
          id: item.id_cartelera,
          titulo: item.titulo,
          descripcion: item.descripcion,
          fecha: item.fecha, 
          tipo: item.prioridad == 1 ? 'aviso' : (item.prioridad == 2 ? 'evento' : 'noticia'),
          autor: item.nombre_usuario,
          imagen: item.imagen ? `${URL_BASE}/recursos/img/cartelera_virtual/${item.imagen}` : null
        }));

        // Retornamos los datos junto con la metadata de la página
        return { datos: datosMapeados, recargar, pagina, limite };
      } else {
        return rejectWithValue(json.mensaje);
      }
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const crearPublicacion = createAsyncThunk(
  'publicaciones/crearPublicacion',
  async ({ datosVisuales, formData }, { rejectWithValue }) => {
    try {
      const respuesta = await clienteApi.post('', formData, {
        params: { endpoint: 'cartelera' }
      });

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

      return rejectWithValue(error);
    }
  }
);

const publicacionesSlice = createSlice({
  name: 'publicaciones',
  initialState: {
    listaPublicaciones: [],
    cargando: false,
    error: null,
    paginaActual: 1,
    hayMas: true
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
      .addCase(fetchPublicaciones.pending, (state, action) => {
        if (!action.meta.arg || action.meta.arg.recargar) {
           state.cargando = true;
        }
        state.error = null;
      })
      .addCase(fetchPublicaciones.fulfilled, (state, action) => {
        state.cargando = false;
        if (action.payload.recargar || action.payload.pagina === 1) {
          // Si es recarga o página 1, reemplazamos la lista entera
          state.listaPublicaciones = action.payload.datos;
        } else {
          // Si es paginación, concatenamos evitando duplicados por seguridad
          const nuevos = action.payload.datos.filter(
            nuevo => !state.listaPublicaciones.some(existente => existente.id === nuevo.id)
          );
          state.listaPublicaciones = [...state.listaPublicaciones, ...nuevos];
        }

        state.paginaActual = action.payload.pagina;
        
        // Si el servidor nos devolvió menos datos que el límite, significa que ya no hay más páginas
        state.hayMas = action.payload.datos.length === action.payload.limite; 
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