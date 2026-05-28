import { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPublicaciones } from '../store/slices/publicacionesSlice';

import { useResumenFinanciero } from './useResumenFinanciero';
import { useEventos } from './useEventos';
import { usePermisos } from './usePermisos';

export const useInicio = () => {
  const dispatch = useDispatch();

  const { deudaTotal, gastado, presupuestoTotal, loading: loadingFinanzas, error, obtenerDatos: obtenerFinanzas, recaudado } = useResumenFinanciero();
  const { eventos } = useEventos();
  const { puedeVerGastos, puedeVerMensualidad } = usePermisos();
  
  const { listaPublicaciones, loading: loadingCartelera, hayMas } = useSelector(state => state.publicaciones);

  const [refreshing, setRefreshing] = useState(false);

  const [modalDetalleVisible, setModalDetalleVisible] = useState(false);
  const [publicacionSeleccionada, setPublicacionSeleccionada] = useState(null);

  const cargarDatosInicio = useCallback(async (forzar = false) => {
    if (forzar) setRefreshing(true);
    
    dispatch(fetchPublicaciones({ pagina: 1, recargar: true }));
    obtenerFinanzas(forzar);
    
    if (forzar) setRefreshing(false);
  }, [dispatch, obtenerFinanzas]);

  useEffect(() => {
    cargarDatosInicio();
  }, []);

  const abrirModalDetalle = useCallback((publicacion) => {
    setPublicacionSeleccionada(publicacion);
    setModalDetalleVisible(true);
  }, []);

  const cerrarModalDetalle = useCallback(() => {
    setPublicacionSeleccionada(null);
    setModalDetalleVisible(false);
  }, []);

  // PAra optimizar el scroll
  // Lo meti aqui porque las dimensiones dependen de un estado administrado por el hook
  // Sino estuviera en la screen
  const obtenerItemLayout = useCallback((dimensiones) => {
    // El hook solo opera la lógica de negocio y condicionales
    return (data, index) => {
      const alturaHeaderEventos = (eventos && eventos.length > 0) ? dimensiones.alturaEventos : 0;
      const alturaTotalHeader = dimensiones.alturaHeaderBase + alturaHeaderEventos;

      return {
        length: dimensiones.alturaItem,
        offset: (dimensiones.alturaItem * index) + alturaTotalHeader,
        index,
      };
    };
  }, [eventos]);

  return {
    deudaTotal, 
    gastado, 
    presupuestoTotal, 
    loadingFinanzas, 
    error,
    eventos,
    listaPublicaciones, 
    loadingCartelera, 
    refreshing,
    cargarDatosInicio,
    obtenerItemLayout,
    modalDetalleVisible,
    publicacionSeleccionada,
    abrirModalDetalle,
    cerrarModalDetalle,
    puedeVerGastos,
    puedeVerMensualidad,
    recaudado
  };
};