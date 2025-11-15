import { StyleSheet } from 'react-native'

export const getEstilosListaPublicaciones = (colores) => StyleSheet.create({
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: colores.textTitle,
  },
  listContentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
});