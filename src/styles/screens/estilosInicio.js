import { StyleSheet } from 'react-native'

export const getEstilosInicio = (colores) => StyleSheet.create({
  mainContentContainer: {
    flex: 1,
    backgroundColor: colores.background,
    padding: 14
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colores.textTitle,
    marginBottom: 16,
    paddingHorizontal: 4
  }
})
