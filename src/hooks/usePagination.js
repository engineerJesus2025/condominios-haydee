import { useState, useEffect, useMemo } from 'react'

const usePaginacion = (datos, onBuscarPersonalizado) => {
  const [paginaActual, setPaginaActual] = useState(0)
  const [elementosPorPagina, setElementosPorPagina] = useState(9)
  const [searchQuery, setSearchQuery] = useState('')

  // Filtrar datos
  const datosFiltrados = useMemo(() => {
    if (!searchQuery.trim()) return datos

    if (onBuscarPersonalizado) {
      return onBuscarPersonalizado(datos, searchQuery)
    }

    // Búsqueda por defecto en todos los campos string
    return datos.filter(fila =>
      Object.values(fila).some(valor =>
        typeof valor === 'string' &&
        valor.toLowerCase().includes(searchQuery.toLowerCase())
      )
    )
  }, [datos, searchQuery, onBuscarPersonalizado])

  // Calcular paginación
  const paginacion = useMemo(() => {
    const totalElementos = datosFiltrados.length
    const totalPaginas = Math.ceil(totalElementos / elementosPorPagina)

    let paginaAjustada = paginaActual
    if (paginaAjustada >= totalPaginas && totalPaginas > 0) {
      paginaAjustada = totalPaginas - 1
    }

    const desde = paginaAjustada * elementosPorPagina
    const hasta = Math.min(desde + elementosPorPagina, totalElementos)
    const datosPagina = datosFiltrados.slice(desde, hasta)

    return {
      paginaActual: paginaAjustada,
      totalPaginas,
      desde,
      hasta,
      totalElementos,
      datosPagina
    }
  }, [datosFiltrados, paginaActual, elementosPorPagina])

  // Resetear página cuando cambian los datos o la búsqueda
  useEffect(() => {
    setPaginaActual(0)
  }, [searchQuery, datos])

  return {
    datosFiltrados,
    paginacion,
    searchQuery,
    setSearchQuery,
    setPaginaActual,
    setElementosPorPagina
  }
}

export default usePaginacion
