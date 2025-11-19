import React from 'react'
import { DataTable, Text } from 'react-native-paper'
import { StyleSheet } from 'react-native'

import { useTema } from '../hooks/useTema'

const CabeceraTabla = ({
  columnasMostradas,
  mostrarVerMas,
  tieneAcciones = false // para saber si hay acciones
}) => {
  const { colores } = useTema()
  const estilosCabeceraTabla = getEstilosCabeceraTabla(colores)

  return (
    <DataTable.Header style={estilosCabeceraTabla.header}>
      {columnasMostradas.map((columna, index) => {
        const { titulo } = columna.props
        return (
          <DataTable.Title
            key={index}
            style={[estilosCabeceraTabla.cell]}
          >
            <Text style={estilosCabeceraTabla.headerText}>{titulo}</Text>
          </DataTable.Title>
        )
      })}

      {/* Columna de acciones */}
      {(mostrarVerMas || tieneAcciones) && (
        <DataTable.Title style={[estilosCabeceraTabla.cell, estilosCabeceraTabla.accionesHeader]}>
          <Text style={estilosCabeceraTabla.headerText}>Acciones</Text>
        </DataTable.Title>
      )}
    </DataTable.Header>
  )
}

export default CabeceraTabla

const getEstilosCabeceraTabla = (colores) => StyleSheet.create({
  header: {
    borderBottomWidth: 2.5,
    borderColor: colores.text
  },
  cell: {
    justifyContent: 'flex-start',
    flex: 1
  },
  headerText: {
    fontSize: 13,
    fontWeight: '600',
    color: colores.text
  },
  accionesHeader: {
    flex: 1,
    justifyContent: 'center'
  }
})
