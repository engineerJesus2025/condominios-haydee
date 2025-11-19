import { StyleSheet, Dimensions } from 'react-native'

const { width } = Dimensions.get('window')

export const getEstilosTablaDinamica = (colores) => StyleSheet.create({
  scrollVertical: {
    flex: 1,
    maxHeight: 400
  },
  contenedor: {
    flex: 1,
    padding: 6,
    marginBottom: 20
  },
  tabla: {
    maxWidth: width - 16,
    backgroundColor: colores.backgroundTabla,
    flex: 1
  },
  noResults: {
    color: colores.text
  }
})
