import { View, Text, ScrollView } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'

import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { getEstilosMenuLatelal } from '../styles/components/estilosMenuLateral'
import { useTema } from '../hooks/useTema'
import { useMenuLateral } from '../hooks/useMenuLateral'
import MenuLateralItem from '../components/MenuLateralItem'
import { LISTA_MENU } from '../utils/constants'

export default function MenuLateral (props) {
  const insets = useSafeAreaInsets()
  const { colores } = useTema()
  const estilosMenuLateral = getEstilosMenuLatelal(colores)
  const { isExpanded, toggleExpanded } = useMenuLateral()

  const handleItemPress = (item) => {
    if (item.screen) {
      props.navigation.navigate(item.screen)
      props.navigation.closeDrawer()
    }
  }

  const activeRouteName = props.state.routes[props.state.index].name
  const paginaActual = LISTA_MENU.find((item) => item.screen === activeRouteName)

  return (
    <>
      <View style={{ height: insets.top, backgroundColor: '#000' }} />
      <View style={estilosMenuLateral.container}>
        <View style={estilosMenuLateral.header}>
          <View style={estilosMenuLateral.logoContainer}>
            <Icon name={paginaActual.icon} size={28} color='#fff' />
            <Text style={estilosMenuLateral.logoText}>{paginaActual.name}</Text>
          </View>
        </View>

        <ScrollView style={estilosMenuLateral.menuList}>
          {LISTA_MENU.map((item, index) => (
            <MenuLateralItem
              key={index}
              item={item}
              isActive={activeRouteName === item.screen}
              isExpanded={isExpanded(item.name)}
              onItemPress={handleItemPress}
              onToggleExpand={toggleExpanded}
              styles={estilosMenuLateral}
            />
          ))}
        </ScrollView>

        <View style={estilosMenuLateral.footer}>
          <Text style={estilosMenuLateral.footerText}>Hola mano</Text>
        </View>
      </View>
    </>
  )
}
