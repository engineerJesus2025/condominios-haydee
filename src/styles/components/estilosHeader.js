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
    zIndex: 10,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  notificationBtn: {
    marginRight: 16
  },
  notificationBadge: {
    position: 'absolute',
    right: -8,
    top: -5,
    backgroundColor: '#DC3545',
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center'
  },
  notificationText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold'
  },
  userMenuButton: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  userInfo: {
    alignItems: 'flex-end',
    marginRight: 5
  },
  userName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600'
  },
  userRole: {
    color: '#E0E0E0',
    fontSize: 11
  }
})
