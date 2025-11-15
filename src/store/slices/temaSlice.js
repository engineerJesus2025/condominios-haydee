import { createSlice } from '@reduxjs/toolkit'

const temaSlice = createSlice({
  name: 'tema',
  initialState: {
    modoOscuro: false
  },
  reducers: {
    cambiarTema: (state) => {
      state.modoOscuro = !state.modoOscuro
    }
  }
})

export const { cambiarTema } = temaSlice.actions
export default temaSlice.reducer
