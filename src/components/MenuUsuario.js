import {
  View, Text, TouchableOpacity, StyleSheet
} from 'react-native'

import { useNavigation } from '@react-navigation/native'

export default function MenuUsuario () {
  const navigation = useNavigation()
  return (
    <View style={[estilosMenuUsuario.dropdownContainer, estilosMenuUsuario.userMenuContainer]}>
      <TouchableOpacity style={estilosMenuUsuario.userMenuItem}>
        <Text style={estilosMenuUsuario.userMenuText}>Mi perfil</Text>
      </TouchableOpacity>
      <TouchableOpacity style={estilosMenuUsuario.userMenuItem}>
        <Text style={estilosMenuUsuario.userMenuText}>Ayuda</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Login')} style={[estilosMenuUsuario.userMenuItem, { borderBottomWidth: 0 }]}>
        <Text style={estilosMenuUsuario.userMenuText}>Salir</Text>
      </TouchableOpacity>
    </View>
  )
}

const estilosMenuUsuario = StyleSheet.create({
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
    borderBottomWidth: 1,
    borderColor: '#F1F3F5'
  },
  userMenuText: {
    fontSize: 15,
    color: '#333'
  }
})
