import { DataTable, Text } from 'react-native-paper'
import { TouchableOpacity, View, StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'

import { useTema } from '../hooks/useTema'

const FilaTabla = ({
  fila,
  indexFila,
  columnasMostradas,
  mostrarVerMas,
  onVerMas,
  acciones = [] // Lo quite 3 veces y al final lo deje :)
}) => {
  const { colores } = useTema()
  const estilosFilaTabla = getEstilosFilaTabla(colores)

  return (
    <DataTable.Row key={fila.id || indexFila} style={estilosFilaTabla.row}>
      {columnasMostradas.map((columna, indexColumna) => {
        const { campo, render } = columna.props

        return (
          <DataTable.Cell
            key={indexColumna}
            style={estilosFilaTabla.cell}
          >
            {render
              ? render(fila)
              : (
                <Text
                  style={estilosFilaTabla.cellText}
                  numberOfLines={1}
                  ellipsizeMode='tail'
                >
                  {fila[campo]}
                </Text>
                )}
          </DataTable.Cell>
        )
      })}

      {/* Columna de acciones */}
      <DataTable.Cell style={[estilosFilaTabla.cell, estilosFilaTabla.accionesCell]}>
        <View style={estilosFilaTabla.contenedorAcciones}>
          {/* Botón "Ver más" (Ahora Siempre presente :) */}
          {mostrarVerMas && (
            <TouchableOpacity
              onPress={() => onVerMas(fila)}
              style={[estilosFilaTabla.botonAccion, estilosFilaTabla.botonVerMas]}
            >
              <Icon name='eye' color='#fff' size={16} />
            </TouchableOpacity>
          )}

          {/* Acciones dinámicas */}
          {acciones.map((accion, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => accion.onPress(fila)}
              style={[
                estilosFilaTabla.botonAccion,
                { backgroundColor: accion.color || '#666' }
              ]}
            >
              <Icon name={accion.icono} color='#fff' size={16} />
            </TouchableOpacity>
          ))}
        </View>
      </DataTable.Cell>
    </DataTable.Row>
  )
}

export default FilaTabla

const getEstilosFilaTabla = (colores) => StyleSheet.create({
  row: {
    borderBottomWidth: 1,
    borderColor: colores.border,
    minHeight: 44,
    paddingVertical: 2
  },
  cell: {
    justifyContent: 'flex-start',
    flex: 1
  },
  cellText: {
    fontSize: 12,
    color: colores.text
  },
  accionesCell: {
    flex: 1,
    justifyContent: 'center'
  },
  botonAccion: {
    padding: 8,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center'
  },
  botonVerMas: {
    backgroundColor: '#2196F3'
  },
  contenedorAcciones: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 8
  }
})
