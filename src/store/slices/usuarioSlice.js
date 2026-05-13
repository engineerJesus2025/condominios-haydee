import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
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
        const { datos, token } = json;
        // Persistimos el token y los datos básicos
        await AsyncStorage.setItem('userToken', token);
        await AsyncStorage.setItem('userData', JSON.stringify(datos));
        return datos;
      }
      return rejectWithValue(json.mensaje);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.mensaje || 'Error de conexión con el servidor'
      );
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
      .addCase(loginUsuario.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUsuario.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(loginUsuario.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { logout, restaurarSesion } = usuarioSlice.actions;
export default usuarioSlice.reducer;