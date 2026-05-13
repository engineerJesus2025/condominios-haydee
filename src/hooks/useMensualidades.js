import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMensualidades, fetchDetalleMensualidad } from '../store/slices/mensualidadesSlice';
import { useResumenFinanciero } from './useResumenFinanciero';

export const useMensualidades = () => {
  const dispatch = useDispatch();
  const { listaMensualidades, loading: loadingLista, error } = useSelector(state => state.mensualidades);
  const { obtenerDatos: obtenerResumen, loading: loadingResumen, gastado, presupuestoTotal } = useResumenFinanciero();

  const [modalVisible, setModalVisible] = useState(false);
  const [mensualidadSeleccionada, setMensualidadSeleccionada] = useState(null);
  const [cargandoDetalleId, setCargandoDetalleId] = useState(null);

  const obtenerMensualidades = (forzar = false) => {
    if (forzar || listaMensualidades.length === 0) {
      dispatch(fetchMensualidades());
    }
    obtenerResumen(forzar);
  };

  const manejarVerDetalles = async (mensualidad) => {
    try {
      let dataActualizada = mensualidad;
      
      // Si aún no hemos descargado la lista de apartamentos para este mes
      if (!mensualidad.apartamentos) {
        setCargandoDetalleId(mensualidad.id);
        const result = await dispatch(fetchDetalleMensualidad({
          id: mensualidad.id,
          mes: mensualidad.mes_raw,
          anio: mensualidad.anio_raw
        })).unwrap();
        
        // Inyectamos la data fresca para que el modal reaccione inmediatamente
        dataActualizada = { ...mensualidad, apartamentos: result.apartamentos };
      }
      
      setMensualidadSeleccionada(dataActualizada);
      setModalVisible(true);
    } catch (err) {
      console.error("Error al cargar el detalle de apartamentos:", err);
    } finally {
      setCargandoDetalleId(null);
    }
  };

  return {
    listaMensualidades,
    loading: loadingLista || loadingResumen,
    gastado,
    presupuestoTotal,
    error,
    obtenerMensualidades,
    manejarVerDetalles,
    modalVisible,
    setModalVisible,
    mensualidadSeleccionada,
    cargandoDetalleId
  };
};