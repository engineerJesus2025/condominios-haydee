import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchGastos } from '../store/slices/gastosSlice';

export const useGastos = () => {
  const dispatch = useDispatch();
  
  const { listaGastos, totalGastadoMes, loading, error } = useSelector(state => state.gastos);

  const [modalDetalleVisible, setModalDetalleVisible] = useState(false);
  const [modalGastoVisible, setModalGastoVisible] = useState(false);
  const [gastoSeleccionado, setGastoSeleccionado] = useState(null);

  // Petición al servidor
  const obtenerGastos = (forzar = false) => {
    if (forzar || listaGastos.length === 0) {
      dispatch(fetchGastos());
    }
  };

  // Controladores de Modales
  const abrirDetalles = (gasto) => {
    setGastoSeleccionado({
      ...gasto,
      // Aquí en el futuro haremos otra petición GET para traer los renglones y la foto real
      imagen: gasto.comprobante 
    });
    setModalDetalleVisible(true);
  };

  const cerrarDetalles = () => {
    setModalDetalleVisible(false);
    setGastoSeleccionado(null);
  };

  const abrirNuevoGasto = () => setModalGastoVisible(true);
  const cerrarNuevoGasto = () => setModalGastoVisible(false);

  return {
    listaGastos,
    totalGastadoMes,
    loading,
    error,
    modalDetalleVisible,
    modalGastoVisible,
    gastoSeleccionado,
    obtenerGastos,
    abrirDetalles,
    cerrarDetalles,
    abrirNuevoGasto,
    cerrarNuevoGasto
  };
};