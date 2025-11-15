import { View, Text, TouchableOpacity, Pressable } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'

import MenuUsuario from '../components/MenuUsuario'
import BotonCambiarTema from '../components/BotonCambiarTema'
import BotonMenuUsuario from '../components/BotonMenuUsuario'

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
      <View style={{height:insets.top, backgroundColor:'#000'}} />
      <View style={[estilosHeader.appHeader]}>
        <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.toggleDrawer()}>
          <Icon name='menu' size={26} color='#fff' />
        </TouchableOpacity>


        <View style={estilosHeader.headerRight}>
          <BotonCambiarTema />

          <BotonMenuUsuario evento={toggleUserMenu} user={user} icono={{name:'caret-down',color:'#fff'}} />
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
