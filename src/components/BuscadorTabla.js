import React from 'react'
import { Searchbar } from 'react-native-paper'

const BuscadorTabla = ({ 
  searchQuery, 
  setSearchQuery, 
  estilos, 
  colores,
  mostrarBusqueda 
}) => {
  if (!mostrarBusqueda) return null

  return (
    <Searchbar
      placeholder='Buscar...'
      onChangeText={setSearchQuery}
      value={searchQuery}
      style={estilos.busqueda}
      placeholderTextColor={colores.text}
      iconColor={colores.text}
      inputStyle={{ color: colores.text }}
    />
  )
}

export default BuscadorTabla