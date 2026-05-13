import { useDispatch, useSelector } from 'react-redux';
import { fetchResumenFinanciero } from '../store/slices/mensualidadesSlice';

export const useResumenFinanciero = () => {
  const dispatch = useDispatch();

  const { resumen, loading, error } = useSelector(state => state.mensualidades);
  const { deudaTotal, gastado, presupuestoTotal } = resumen;

  // patrón Cache-First
  const obtenerDatos = (forzar = false) => {
    // o si los datos están en 0 (es la primera vez que abre la app) --- Pull-to-Refresh
    if (forzar || (deudaTotal === 0 && gastado === 0)) {
      dispatch(fetchResumenFinanciero());
    }
  };

  return { 
    deudaTotal, 
    gastado, 
    presupuestoTotal, 
    loading, 
    error, 
    obtenerDatos, 
    refrescarResumen: () => obtenerDatos(true) // Alias semántico para forzar recarga
  };
};