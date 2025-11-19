import { Searchbar } from 'react-native-paper'
import { useTema } from '../hooks/useTema'

import { StyleSheet } from 'react-native'

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

export const getEstilosBuscador = (colores) => StyleSheet.create({
  busqueda: {
    marginBottom: 8,
    backgroundColor: colores.inputBackground
  }
})
