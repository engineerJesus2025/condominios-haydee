import { StyleSheet } from 'react-native'

export const getEstilosMenuUsuario = (colores) => StyleSheet.create({
  dropdownContainer: {
    position: 'absolute',
    top: 85,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DEE2E6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
    zIndex: 1000
  },
  userMenuContainer: {
    right: 15,
    width: 140
  },
  userMenuItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderColor: '#F1F3F5',
    borderBottomWidth: 1,
  },
  userMenuText: {
    fontSize: 15,
    color: '#333'
  }
})
