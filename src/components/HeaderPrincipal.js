import { View, Text, Pressable, StyleSheet } from 'react-native'

import MenuUsuario from '../components/MenuUsuario'
import BotonCambiarTema from '../components/BotonCambiarTema'
import BotonMenuUsuario from '../components/BotonMenuUsuario'

import { useSelector } from 'react-redux'
import useHeader from '../hooks/useHeader'
import { useTema } from './../hooks/useTema'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function HeaderPrincipal () {
  const { user } = useSelector(state => state.usuario)
  const insets = useSafeAreaInsets()
  const { colores } = useTema()
  const estilosHeader = getEstilosHeader(colores)
  const { isMenuVisible, toggleMenu, closeMenu } = useHeader()

  return (
    <>
      <View style={{ height: insets.top, backgroundColor: '#000' }} />
      <View style={[estilosHeader.appHeader]}>

        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 10 }}>
          <Text 
            style={{ color: '#fff', fontSize: 18, fontWeight: 'bold', letterSpacing: 0.5 }}
            numberOfLines={1} 
            ellipsizeMode="tail"
          >
            Residencias
          </Text>
          <Text 
            style={{ color: '#3498db', fontSize: 18, fontWeight: '300', marginLeft: 4 }}
            numberOfLines={1}
          >
            Haydee
          </Text>
        </View>

        <View style={[estilosHeader.headerRight, { gap: 15 }]}>
          <BotonCambiarTema />
          <BotonMenuUsuario evento={toggleMenu} user={user} />
        </View>
      </View>

      {isMenuVisible && (
        <Pressable
          style={estilosHeader.overlay}
          onPress={closeMenu}
        />
      )}
      {isMenuVisible && <MenuUsuario />}
    </>
  )
}

const getEstilosHeader = (colores) => StyleSheet.create({
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