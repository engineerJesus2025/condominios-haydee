import { useState } from 'react'
import usePaginacion from './usePagination'

export const useTablaDinamica = (datos, onBuscar, mostrarBusqueda = true) => {
  const [filaSeleccionada, setFilaSeleccionada] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)

  const {
    paginacion,
    searchQuery,
    setSearchQuery,
    setPaginaActual,
    setElementosPorPagina
  } = usePaginacion(datos, onBuscar)

  const abrirDetalle = (fila) => {
    setFilaSeleccionada(fila)
    setModalVisible(true)
  }

  const cerrarDetalle = () => {
    setModalVisible(false)
    setFilaSeleccionada(null)
  }

  return {
    // Estado
    filaSeleccionada,
    modalVisible,
    searchQuery,
    
    // Paginación
    paginacion,
    setPaginaActual,
    setElementosPorPagina,
    
    // Acciones
    abrirDetalle,
    cerrarDetalle,
    setSearchQuery,
    
    // Configuración
    mostrarBusqueda
  }
}