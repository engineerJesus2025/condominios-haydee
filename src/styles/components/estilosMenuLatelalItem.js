import { StyleSheet } from 'react-native'

export const getEstilosMenuLatelalItem = (colores) => StyleSheet.create({
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginVertical: 2
  },
  activeMenuItem: {
    backgroundColor: '#4545b9',
    borderRadius: 5
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#ddd',
    marginLeft: 10
  },
  activeMenuText: {
    color: '#fff',
    fontWeight: '600'
  },
  childText: {
    fontSize: 14,
    color: '#000'
  },
  submenu: {
    backgroundColor: '#e9ecef',
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 4,
    marginVertical: 2
  },
  icon: {
    width: 24
  },
})