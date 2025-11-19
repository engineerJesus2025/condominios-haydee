import { StyleSheet } from 'react-native'

export const getEstilosHeader = (colores) => StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    zIndex: 500
  },
  appHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: colores.navigation,
    borderBottomWidth: 1,
    borderColor: '#3E4756',
    zIndex: 10
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center'
  }
})
