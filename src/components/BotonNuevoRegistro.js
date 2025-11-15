import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { useTema } from './../hooks/useTema'

export default function BotonNuevoRegistro ({titulo = 'Nuevo', evento = ()=>{}}) {
  const { colores } = useTema()
  const estilosBotonNuevoRegistro = getEstilosBotonNuevoRegistro(colores)

  return (
  	<View style={estilosBotonNuevoRegistro.topRow}>
      <TouchableOpacity 
        style={estilosBotonNuevoRegistro.primaryBtn} 
        activeOpacity={0.8} 
        onPress={evento} 
      >
        <Text style={estilosBotonNuevoRegistro.primaryBtnText}>{titulo}</Text>
      </TouchableOpacity>
    </View>
  )
}

const getEstilosBotonNuevoRegistro = (colores) => StyleSheet.create({
  topRow: { marginBottom: 12 },
  primaryBtn: {
    alignSelf: 'flex-start',
    backgroundColor: colores.backgroundBotones,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 6,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 2
  },
  primaryBtnText: { color: '#fff', fontWeight: '700' },
})