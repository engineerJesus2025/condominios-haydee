import { View, Text, TouchableOpacity } from 'react-native'

import { useNavigation } from '@react-navigation/native'
import { getEstilosMenuUsuario } from './../styles/components/estilosMenuUsuario'
import { useTema } from './../hooks/useTema'

export default function MenuUsuario () {
  const { colores } = useTema()
  const estilosMenuUsuario = getEstilosMenuUsuario(colores)
  const navigation = useNavigation()

  return (
    <View style={[estilosMenuUsuario.dropdownContainer, estilosMenuUsuario.userMenuContainer]}>
      <TouchableOpacity onPress={() => navigation.navigate('Login')} style={estilosMenuUsuario.userMenuItem}>
        <Text style={estilosMenuUsuario.userMenuText}>Salir</Text>
      </TouchableOpacity>
    </View>
  )
}
