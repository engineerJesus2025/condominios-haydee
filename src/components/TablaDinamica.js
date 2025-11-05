import React from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { DataTable, TouchableRipple, useTheme, Searchbar } from 'react-native-paper'
import usePaginacion from '../hooks/usePagination'

const TablaDinamica = ({
  datos = [],
  children,
  acciones = [],
  onBuscar,
  mostrarBusqueda = true,
  estilos = {},
  textoVacio = 'No hay datos disponibles'
}) => {
  const theme = useTheme()

  const columnas = React.Children.toArray(children).filter(child =>
    child && child.type && child.type.displayName === 'ColumnaTabla'
  )
  const {
    datosFiltrados,
    paginacion,
    searchQuery,
    setSearchQuery,
    setPaginaActual,
    setElementosPorPagina
  } = usePaginacion(datos, onBuscar)

  return (
    <View style={[styles.contenedor, estilos.contenedor]}>

      {mostrarBusqueda && (
        <Searchbar
          placeholder='Buscar...'
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={[styles.busqueda, estilos.busqueda]}
        />
      )}

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          {paginacion.totalElementos > 0
            ? `Mostrando ${paginacion.desde + 1}-${paginacion.hasta} de ${paginacion.totalElementos} resultados`
            : ''}
        </Text>
      </View>

      <ScrollView horizontal style={styles.scrollHorizontal}>
        <DataTable style={[
          styles.tabla,
          { backgroundColor: theme.colors.background },
          estilos.tabla
        ]}
        >

          <DataTable.Header>
            {columnas.map((columna, index) => {
              const { titulo, ancho = 1, alinear = 'left' } = columna.props
              return (
                <DataTable.Title
                  key={index}
                  style={[
                    styles.cell,
                    { flex: ancho },
                    alinear === 'right' && styles.cellRight,
                    alinear === 'center' && styles.cellCenter
                  ]}
                  numeric={alinear === 'right'}
                >
                  <Text style={styles.headerText}>{titulo}</Text>
                </DataTable.Title>
              )
            })}

            {/* Columna de acciones si existen */}
            {acciones.length > 0 && (
              <DataTable.Title style={[styles.cell, styles.actionsHeader]}>
                <Text style={styles.headerText}>Acciones</Text>
              </DataTable.Title>
            )}
          </DataTable.Header>

          <ScrollView style={styles.scrollVertical}>
            {/* Filas de datos */}
            {paginacion.datosPagina.length === 0
              ? (
                <DataTable.Row>
                  <DataTable.Cell>
                    <Text style={styles.noResults}>{textoVacio}</Text>
                  </DataTable.Cell>
                </DataTable.Row>
                )
              : (
                  paginacion.datosPagina.map((fila, indexFila) => (
                    <DataTable.Row key={fila.id || indexFila} style={styles.row}>
                      {columnas.map((columna, indexColumna) => {
                        const { campo, ancho = 1, alinear = 'left', render } = columna.props

                        return (
                          <DataTable.Cell
                            key={indexColumna}
                            style={[
                              styles.cell,
                              { flex: ancho },
                              alinear === 'right' && styles.cellRight,
                              alinear === 'center' && styles.cellCenter
                            ]}
                            numeric={alinear === 'right'}
                          >
                            {render
                              ? render(fila)
                              : (
                                <Text style={[
                                  styles.cellText,
                                  alinear === 'right' && styles.textRight,
                                  alinear === 'center' && styles.textCenter
                                ]}
                                >
                                  {fila[campo]}
                                </Text>
                                )}
                          </DataTable.Cell>
                        )
                      })}

                      {/* Celda de acciones */}
                      {acciones.length > 0 && (
                        <DataTable.Cell style={[styles.cell, styles.actions]}>
                          <View style={styles.actionsContainer}>
                            {acciones.map((accion, indexAccion) => (
                              <TouchableRipple
                                key={indexAccion}
                                onPress={() => accion.onPress(fila)}
                                style={[styles.iconBtn, { backgroundColor: accion.color }]}
                                borderless
                              >
                                <accion.icon
                                  name={accion.iconName}
                                  size={16}
                                  color='#fff'
                                />
                              </TouchableRipple>
                            ))}
                          </View>
                        </DataTable.Cell>
                      )}
                    </DataTable.Row>
                  ))
                )}
          </ScrollView>
        </DataTable>
      </ScrollView>

      {paginacion.totalPaginas > 1 && (
        <DataTable.Pagination
          page={paginacion.paginaActual}
          numberOfPages={paginacion.totalPaginas}
          onPageChange={setPaginaActual}
          label={`Página ${paginacion.paginaActual + 1} de ${paginacion.totalPaginas}`}
          showFastPaginationControls
          numberOfItemsPerPageList={[5, 10, 20, 50]}
          numberOfItemsPerPage={paginacion.elementosPorPagina}
          onItemsPerPageChange={setElementosPorPagina}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  scrollVertical: {
    flex: 1
  },
  contenedor: {
    flex: 1,
    padding: 10
  },
  busqueda: {
    marginBottom: 10
  },
  infoContainer: {
    padding: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 5,
    marginBottom: 10
  },
  infoText: {
    fontSize: 12,
    color: '#6c757d',
    textAlign: 'center'
  },
  scrollHorizontal: {
    flex: 1
  },
  tabla: {
    minWidth: 600
  },
  row: {
    borderBottomWidth: 1,
    borderColor: '#F1F3F5',
    minHeight: 60
  },
  cell: {
    justifyContent: 'flex-start',
    paddingHorizontal: 8
  },
  cellRight: {
    justifyContent: 'flex-end'
  },
  cellCenter: {
    justifyContent: 'center'
  },
  cellText: {
    fontSize: 13,
    color: '#212529'
  },
  textRight: {
    textAlign: 'right'
  },
  textCenter: {
    textAlign: 'center'
  },
  headerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212529'
  },
  actions: {
    flex: 1.2,
    justifyContent: 'center'
  },
  actionsHeader: {
    flex: 1.2,
    justifyContent: 'center'
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  iconBtn: {
    width: 32,
    height: 32,
    borderRadius: 6,
    marginLeft: 6,
    alignItems: 'center',
    justifyContent: 'center'
  },
  noResults: {
    textAlign: 'center',
    color: '#6c757d',
    fontStyle: 'italic',
    padding: 20
  }
})

export default TablaDinamica
