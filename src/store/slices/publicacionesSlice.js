import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// Por si me da por procesar la imagen antes de guardarla
export const processImage = createAsyncThunk(
  'publicacion/processImage',
  async (imageUri) => {
    // agregar lógica para procesar la imagen si es necesario (si me da)
    return imageUri
  }
)

const publicacionesSlice = createSlice({
  name: 'publicaciones',
  initialState: {
    publicacion: [],
    loading: false,
    error: null
  },
  reducers: {
    agregarPublicacion: (state, action) => {
      state.publicacion.unshift({
        ...action.payload,
        id: action.payload.id || Date.now().toString()
      })
    },
    editarPublicacion: (state, action) => {
      const { id, ...datosActualizados } = action.payload
      const index = state.publicacion.findIndex(pub => pub.id === id)
      if (index !== -1) {
        state.publicacion[index] = { ...state.publicacion[index], ...datosActualizados }
      }
    },
    eliminarPublicacion: (state, action) => {
      const id = action.payload
      state.publicacion = state.publicacion.filter(pub => pub.id !== id)
    },
    clearPublicaciones: (state) => {
      state.publicacion = []
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(processImage.pending, (state) => {
        state.loading = true
      })
      .addCase(processImage.fulfilled, (state, action) => {
        state.loading = false
      })
      .addCase(processImage.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  }
})

export const {
  agregarPublicacion,
  editarPublicacion,
  eliminarPublicacion,
  clearPublicaciones
} = publicacionesSlice.actions
export default publicacionesSlice.reducer
