import { StyleSheet } from 'react-native'

export const getEstilosInicio = (colores) => StyleSheet.create({
  mainContentContainer: {
    flexGrow: 1,
    paddingBottom: 20,
    padding: 14,
    paddingBottom: 40
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colores.textTitle,
    marginBottom: 16,
    paddingHorizontal: 4
  }
})
