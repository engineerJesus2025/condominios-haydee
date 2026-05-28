import { 
  createSlice, 
  createAsyncThunk, 
  isPending, 
  isRejected, 
  isFulfilled 
} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import clienteApi from '../../utils/clienteApi';

export const loginUsuario = createAsyncThunk(
  'usuario/login',
  async (credenciales, { rejectWithValue }) => {
    try {
      const respuesta = await clienteApi.post('', 
        {
          correo: credenciales.correo,
          contra: credenciales.contra
        },
        {
          params: {
            endpoint: 'login'
          }
        }
      );

      const json = respuesta.data;
      if (json.estatus) {
        const { datos, token_jwt } = json;
        await AsyncStorage.setItem('userToken', token_jwt);
        await AsyncStorage.setItem('userData', JSON.stringify(datos));
        return datos;
      }
      return rejectWithValue({ tipo: 'LOGICA', mensaje: json.mensaje });
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const usuarioSlice = createSlice({
  name: 'usuario',
  initialState: {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  },
  reducers: {
    restaurarSesion: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      AsyncStorage.multiRemove(['userToken', 'userData']);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUsuario.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addMatcher(
        isPending(loginUsuario),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      // Apaga el "loading" cuando cualquiera de estos termina con éxito
      .addMatcher(
        isFulfilled(loginUsuario),
        (state) => {
          state.loading = false;
        }
      )
      // Atrapa los errores SOLO si provienen de estos thunks específicos
      .addMatcher(
        isRejected(loginUsuario),
        (state, action) => {
          state.loading = false;
          state.error = action.payload || 'Ocurrió un error inesperado.';
        }
      );
  }
});

export const { logout, restaurarSesion } = usuarioSlice.actions;
export default usuarioSlice.reducer;