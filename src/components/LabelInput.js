import { View, Text, StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'

import { useTema } from './../hooks/useTema'

export default function LabelInput ({ titulo, icono }) {
  const { colores } = useTema()
  const estilosLabelInput = getEstilosLabelInput(colores)

  return (
    <View style={estilosLabelInput.labelContainer}>
      <Icon name={icono.nombre} size={18} color={icono.color} />
      <Text style={estilosLabelInput.label}>{titulo}:</Text>
    </View>
  )
}

const getEstilosLabelInput = (colores) => StyleSheet.create({
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  label: {
    fontSize: 16,
    marginLeft: 8,
    fontWeight: '600',
    color: colores.text
  }
})
