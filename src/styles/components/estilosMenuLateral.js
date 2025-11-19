import { StyleSheet } from 'react-native'

export const getEstilosMenuLatelal = (colores) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colores.navigation
  },
  header: {
    backgroundColor: colores.navigation,
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: colores.border
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  logoText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10
  },
  menuList: {
    flex: 1,
    paddingVertical: 10
  },
  footer: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#dee2e6',
    alignItems: 'center'
  },
  footerText: {
    color: '#6c757d',
    fontSize: 12
  }
})
