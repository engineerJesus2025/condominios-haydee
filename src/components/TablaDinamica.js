import React from 'react'
import { View, Text, ScrollView } from 'react-native'
import { DataTable } from 'react-native-paper'

import { getEstilosTablaDinamica } from '../styles/components/estilosTablaDinamica'
import { useTema } from '../hooks/useTema'
import { useTablaDinamica } from '../hooks/useTablaDinamica'

import ModalDetalles from '../components/ModalDetalles'
import CabeceraTabla from '../components/CabeceraTabla'
import FilaTabla from '../components/FilaTabla'
import BuscadorTabla from '../components/BuscadorTabla'

const TablaDinamica = ({
  datos = [],
  children,
  acciones = [],
  onBuscar,
  mostrarBusqueda = true,
  estilos = {},
  textoVacio = 'No hay datos disponibles',
  maxColumnas = 3,
  mostrarVerMas = true,
  // para el modal adaptable
  configuracionModal = {
    titulo: "Detalles",
    campos: [],
    mostrarImagen: false
  }
}) => {
  const { colores } = useTema()
  const estilosTablaDinamica = getEstilosTablaDinamica(colores)
  
  const {
    filaSeleccionada,
    modalVisible,
    searchQuery,
    paginacion,
    setPaginaActual,
    setElementosPorPagina,
    abrirDetalle,
    cerrarDetalle,
    setSearchQuery
  } = useTablaDinamica(datos, onBuscar, mostrarBusqueda)
  
  // Extraer y limitar columnas
  const columnas = React.Children.toArray(children).filter(child =>
    child && child.type && child.type.displayName === 'ColumnaTabla'
  )
  const columnasMostradas = columnas.slice(0, maxColumnas - 1)

  return (
    <View style={[estilosTablaDinamica.contenedor, estilos.contenedor]}>
      {/* Búsqueda */}
      <BuscadorTabla
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        estilos={estilosTablaDinamica}
        colores={colores}
        mostrarBusqueda={mostrarBusqueda}
      />

      {/* Información de resultados */}
      <View style={estilosTablaDinamica.infoContainer}>
        <Text style={estilosTablaDinamica.infoText}>
          {paginacion.totalElementos > 0
            ? `Mostrando ${paginacion.desde + 1}-${paginacion.hasta} de ${paginacion.totalElementos} resultados`
            : ''}
        </Text>
      </View>

      {/* Tabla */}
      <DataTable style={[estilosTablaDinamica.tabla, estilos.tabla]}>
        <CabeceraTabla
            columnasMostradas={columnasMostradas}
            estilosTablaDinamica={estilosTablaDinamica}
            mostrarVerMas={mostrarVerMas}
            tieneAcciones={acciones.length > 0}
        />

        <ScrollView style={estilosTablaDinamica.scrollVertical}>
          {paginacion.datosPagina.length === 0 ? (
            <DataTable.Row>
              <DataTable.Cell>
                <Text style={estilosTablaDinamica.noResults}>{textoVacio}</Text>
              </DataTable.Cell>
            </DataTable.Row>
          ) : (
            paginacion.datosPagina.map((fila, indexFila) => (
              <FilaTabla
                key={fila.id || indexFila}
                fila={fila}
                indexFila={indexFila}
                columnasMostradas={columnasMostradas}
                estilosTablaDinamica={estilosTablaDinamica}
                mostrarVerMas={mostrarVerMas}
                onVerMas={abrirDetalle}
                acciones={acciones}
              />
            ))
          )}
        </ScrollView>
      </DataTable>

      {/* Modal Genérico */}
      <ModalDetalles
        visible={modalVisible}
        onClose={cerrarDetalle}
        titulo={configuracionModal.titulo}
        campos={configuracionModal.campos}
        mostrarImagen={configuracionModal.mostrarImagen}
        datos={filaSeleccionada}
      />

      {/* Paginación */}
      {paginacion.totalPaginas > 1 && (
        <DataTable.Pagination
          theme={{
            colors: {
              onSurface: colores.text,
            }
          }}
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

export default TablaDinamica