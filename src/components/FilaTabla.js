import React from 'react'
import { DataTable, Text } from 'react-native-paper'
import { TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'

const FilaTabla = ({
  fila,
  indexFila,
  columnasMostradas,
  estilosTablaDinamica,
  mostrarVerMas,
  onVerMas,
  acciones = [] // Lo quite 3 veces y al final lo deje :)
}) => {
  return (
    <DataTable.Row key={fila.id || indexFila} style={estilosTablaDinamica.row}>
      {columnasMostradas.map((columna, indexColumna) => {
        const { campo, render } = columna.props

        return (
          <DataTable.Cell
            key={indexColumna}
            style={estilosTablaDinamica.cell}
          >
            {render ? render(fila) : (
              <Text 
                style={estilosTablaDinamica.cellText}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {fila[campo]}
              </Text>
            )}
          </DataTable.Cell>
        )
      })}

      {/* Columna de acciones */}
      <DataTable.Cell style={[estilosTablaDinamica.cell, estilosTablaDinamica.accionesCell]}>
        <View style={estilosTablaDinamica.contenedorAcciones}>
          {/* Botón "Ver más" (Ahora Siempre presente :) */}
          {mostrarVerMas && (
            <TouchableOpacity
              onPress={() => onVerMas(fila)}
              style={[estilosTablaDinamica.botonAccion, estilosTablaDinamica.botonVerMas]}
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
                estilosTablaDinamica.botonAccion,
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