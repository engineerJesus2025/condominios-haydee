import { TouchableOpacity, StyleSheet, View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import { useTema } from './../hooks/useTema';

export default function BotonMenuUsuario({evento , user, icono=false}) {

  return (
    <TouchableOpacity
      style={estilosBotonMenuUsuario.userMenuButton}
      onPress={evento}
      activeOpacity={0.8}
    >
      <View style={estilosBotonMenuUsuario.userInfo}>
        <Text style={estilosBotonMenuUsuario.userName}>
          Hola, {user?.usuario || 'Invitado'}
        </Text>
        <Text style={estilosBotonMenuUsuario.userRole}>
          ({user?.rol || 'Rol no disponible'})
        </Text>
      </View>
      {icono && (<Icon name={icono.name} size={12} color={icono.color} style={{ marginLeft: 4 }} />)}
    </TouchableOpacity>
    )
}

const estilosBotonMenuUsuario = StyleSheet.create({
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
});
