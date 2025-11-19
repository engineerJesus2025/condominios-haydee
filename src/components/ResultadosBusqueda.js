import { View, Text, StyleSheet } from 'react-native'

import { useTema } from '../hooks/useTema'

export default function ResultadosBusqueda ({ paginacion }) {
  const { colores } = useTema()
  const estilosResultadosBusqueda = getEstilosResultadosBusqueda(colores)

  return (
    <View style={estilosResultadosBusqueda.infoContainer}>
      <Text style={estilosResultadosBusqueda.infoText}>
        {paginacion.totalElementos > 0
          ? `Mostrando ${paginacion.desde + 1}-${paginacion.hasta} de ${paginacion.totalElementos} resultados`
          : ''}
      </Text>
    </View>
  )
}

export const getEstilosResultadosBusqueda = (colores) => StyleSheet.create({
  infoContainer: {
    padding: 8,
    backgroundColor: colores.inputBackground,
    borderRadius: 4,
    marginBottom: 8
  },
  infoText: {
    fontSize: 12,
    color: colores.text,
    textAlign: 'center'
  }
})
