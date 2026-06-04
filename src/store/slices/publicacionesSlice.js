import { 
  createSlice, 
  createAsyncThunk, 
  isPending, 
  isRejected, 
  isFulfilled 
} from '@reduxjs/toolkit';
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
      // Extraemos solo el mensaje para que Redux sea feliz
      return rejectWithValue(error.message || 'Error de red al cargar publicaciones');
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
          id: json.lastId, 
          fecha: new Date().toISOString().replace('T', ' ').split('.')[0] // Simulamos la fecha de hoy
        };
      } else {
        return rejectWithValue(json.mensaje);
      }
    } catch (error) {
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
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPublicaciones.fulfilled, (state, action) => {
        state.cargando = false;
        if (action.payload.recargar || action.payload.pagina === 1) {
          // Si es recarga o página 1, reemplazamos la lista entera
          state.listaPublicaciones = action.payload.datos;
        } else {
          // Si es paginación, concatenamos evitando duplicados por seguridad
          const idsExistentes = new Set(state.listaPublicaciones.map(p => p.id));
          const nuevos = action.payload.datos.filter(nuevo => !idsExistentes.has(nuevo.id));
    
          state.listaPublicaciones = [...state.listaPublicaciones, ...nuevos];
        }

        state.paginaActual = action.payload.pagina;
        
        // Si el servidor nos devolvió menos datos que el límite, significa que ya no hay más páginas
        state.hayMas = action.payload.datos.length === action.payload.limite; 
      })
      .addCase(crearPublicacion.fulfilled, (state, action) => {
        state.listaPublicaciones.unshift(action.payload);
      })
      .addMatcher(
        isPending(fetchPublicaciones),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      // Apaga el "loading" cuando cualquiera de estos termina con éxito
      .addMatcher(
        isFulfilled(fetchPublicaciones, crearPublicacion),
        (state) => {
          state.loading = false;
        }
      )
      // Atrapa los errores SOLO si provienen de estos thunks específicos
      .addMatcher(
        isRejected(fetchPublicaciones, crearPublicacion),
        (state, action) => {
          state.loading = false;
          state.error = action.payload || 'Ocurrió un error inesperado.';
        }
      );
  }
});

export const { agregarPublicacion, editarPublicacion, eliminarPublicacion } = publicacionesSlice.actions;
export default publicacionesSlice.reducer;