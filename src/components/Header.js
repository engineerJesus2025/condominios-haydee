import { View, Text, TouchableOpacity, Pressable } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'

import MenuUsuario from '../components/MenuUsuario'
import BotonCambiarTema from '../components/BotonCambiarTema'

import { useNavigation } from '@react-navigation/native'
import { useSelector } from 'react-redux'

import useHeader from '../hooks/useHeader'
import { useTema } from './../hooks/useTema'

import { getEstilosHeader } from './../styles/components/estilosHeader'

import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AppHeader () {
  const { user } = useSelector(state => state.usuario)
  
  const insets = useSafeAreaInsets();

  const { colores } = useTema()
  const estilosHeader = getEstilosHeader(colores)

  const navigation = useNavigation()

  const [userMenuVisible, toggleUserMenu, closeMenus] = useHeader()

  return (
    <>
      <View style={[estilosHeader.appHeader,{marginTop:insets.top}]}>
        <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.toggleDrawer()}>
          <Icon name='menu' size={26} color='#fff' />
        </TouchableOpacity>


        <View style={estilosHeader.headerRight}>
          <BotonCambiarTema />

          <TouchableOpacity
            style={estilosHeader.userMenuButton}
            onPress={toggleUserMenu}
            activeOpacity={0.8}
          >
            <View style={estilosHeader.userInfo}>
              <Text style={estilosHeader.userName}>
                Hola, {user?.usuario || 'Invitado'}
              </Text>
              <Text style={estilosHeader.userRole}>
                ({user?.rol || 'Rol no disponible'})
              </Text>
            </View>
            <Icon name='caret-down' size={12} color='#fff' style={{ marginLeft: 4 }} />
          </TouchableOpacity>
        </View>
      </View>

      {userMenuVisible && (
        <Pressable
          style={estilosHeader.overlay}
          onPress={closeMenus}
        />
      )}
      {userMenuVisible && <MenuUsuario />}
    </>
  )
}
