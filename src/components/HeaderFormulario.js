import { View, Text, StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'

import { useTema } from './../hooks/useTema'
import CustomBoton from '../components/CustomBoton'

export default function HeaderFormulario ({ icono = false, titulo, evento, estilos = {},  noDark = false }) {
  const { colores } = useTema()
  const estilosHeaderFormulario = getEstilosHeaderFormulario(colores, noDark)

  return (
    <View style={[estilosHeaderFormulario.header, estilos]}>
      <Icon name={icono.name} size={24} color={icono.color} />
      <Text style={estilosHeaderFormulario.title}>
        {titulo}
      </Text>
      <CustomBoton
        titulo=''
        evento={evento}
        icono={{ nombre: 'close-outline', color: '#E1E1F7' }}
        estilos={estilosHeaderFormulario.closeButton}
        fuente={24}
        noDark={true}
      />

    </View>

  )
};

const getEstilosHeaderFormulario = (colores, noDark = false) => StyleSheet.create({
  header: {
    backgroundColor: noDark?'#007BFF':colores.backgroundBotones,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: noDark?'#2c3e50':colores.text,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#E1E1F7',
    textAlign: 'center',
    flex: 1,
    marginHorizontal: 10
  },
  closeButton: {
    paddingVertical: 4,
    paddingHorizontal: 4,
    elevation: 0,
    marginBottom: 0,
    marginTop: 8
  }
})
