import { StyleSheet } from 'react-native'

export const getEstilosFooter = (colores) => StyleSheet.create({
  footer: {
    position: 'absolute',

    left: 0,
    right: 0,
    backgroundColor: colores.navigation,
    paddingVertical: 12,
    alignItems: 'center'
  },
  footerText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600'
  }
})
