import {
  View, Text, TouchableOpacity, StyleSheet, Pressable
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'

import MenuNotificaciones from '../components/MenuNotificaciones'
import MenuUsuario from '../components/MenuUsuario'

import { useNavigation } from '@react-navigation/native'

import useHeader from '../hooks/useHeader'


export default function AppHeader () {
  const navigation = useNavigation()

  const [notificationsVisible, userMenuVisible, toggleNotifications, toggleUserMenu, closeMenus] = useHeader()

  return (
    <>
      <View style={estilosHeader.appHeader}>
        <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.toggleDrawer()}>
          <Icon name='menu' size={26} color='#fff' />
        </TouchableOpacity>

        <View style={estilosHeader.headerRight}>
          <TouchableOpacity
            style={estilosHeader.notificationBtn}
            onPress={toggleNotifications}
            activeOpacity={0.8}
          >
            <Icon name='notifications' size={22} color='#fff' />
            <View style={estilosHeader.notificationBadge}>
              <Text style={estilosHeader.notificationText}>78</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={estilosHeader.userMenuButton}
            onPress={toggleUserMenu}
            activeOpacity={0.8}
          >
            <View style={estilosHeader.userInfo}>
              <Text style={estilosHeader.userName}>Hola, jesus</Text>
              <Text style={estilosHeader.userRole}>(Administrador Global)</Text>
            </View>
            <Icon name='caret-down' size={12} color='#fff' style={{ marginLeft: 4 }} />
          </TouchableOpacity>
        </View>
      </View>

      {(notificationsVisible || userMenuVisible) && (
        <Pressable
          style={estilosHeader.overlay}
          onPress={closeMenus}
        />
      )}
      {notificationsVisible && <MenuNotificaciones />}
      {userMenuVisible && <MenuUsuario />}
    </>
  )
}

const estilosHeader = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    zIndex: 500
  },
  appHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: '#3939a9',
    borderBottomWidth: 1,
    borderColor: '#3E4756',
    zIndex: 10
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
