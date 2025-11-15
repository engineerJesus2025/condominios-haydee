import React from 'react'
import { DataTable, Text } from 'react-native-paper'

const CabeceraTabla = ({ 
  columnasMostradas, 
  estilosTablaDinamica, 
  mostrarVerMas,
  tieneAcciones = false  // para saber si hay acciones
}) => {
  return (
    <DataTable.Header>
      {columnasMostradas.map((columna, index) => {
        const { titulo } = columna.props
        return (
          <DataTable.Title
            key={index}
            style={[estilosTablaDinamica.cell,{ flex: 1 }]}
          >
            <Text style={estilosTablaDinamica.headerText}>{titulo}</Text>
          </DataTable.Title>
        )
      })}

      {/* Columna de acciones */}
      {(mostrarVerMas || tieneAcciones) && (
        <DataTable.Title style={[estilosTablaDinamica.cell, estilosTablaDinamica.accionesHeader]}>
          <Text style={estilosTablaDinamica.headerText}>Acciones</Text>
        </DataTable.Title>
      )}
    </DataTable.Header>
  )
}

export default CabeceraTabla