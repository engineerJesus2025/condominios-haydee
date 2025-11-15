import React from 'react'
import { Searchbar } from 'react-native-paper'
import { useTema } from '../hooks/useTema'

const BuscadorTabla = ({ 
  searchQuery, 
  setSearchQuery,
  mostrarBusqueda 
}) => {
  if (!mostrarBusqueda) return null

  const { colores } = useTema()
  const estilosBuscador = getEstilosBuscador(colores)

  return (
    <Searchbar
      placeholder='Buscar...'
      onChangeText={setSearchQuery}
      value={searchQuery}
      style={estilosBuscador.busqueda}
      placeholderTextColor={colores.text}
      iconColor={colores.text}
      inputStyle={{ color: colores.text }}
    />
  )
}

export default BuscadorTabla

import { StyleSheet, Dimensions } from 'react-native'

const { width } = Dimensions.get('window')

export const getEstilosBuscador = (colores) => StyleSheet.create({
  busqueda: {
    marginBottom: 8,
    backgroundColor: colores.inputBackground,
  }
})