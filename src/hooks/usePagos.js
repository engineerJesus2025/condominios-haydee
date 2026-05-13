import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Alert } from 'react-native';
import { fetchPagos, cambiarEstadoPago } from '../store/slices/pagosSlice';
import { usePermisos } from './usePermisos';

export const usePagos = () => {
  const dispatch = useDispatch();

  // Estados de Redux
  const { listaPagos, loading, error } = useSelector(state => state.pagos);
  const { esAdmin, puedeAprobarPagos } = usePermisos();

  // Estados Locales (Modales)
  const [modalVisible, setModalVisible] = useState(false); 
  const [modalPagoVisible, setModalPagoVisible] = useState(false); 
  const [modalEstadoCuentaVisible, setModalEstadoCuentaVisible] = useState(false);
  const [pagoSeleccionado, setPagoSeleccionado] = useState(null);

  // Acciones Principales
  const obtenerPagos = (forzar = false) => {
    if (forzar || listaPagos.length === 0) {
      dispatch(fetchPagos());
    }
  };

  const abrirDetalles = (pago) => {
    setPagoSeleccionado({
      ...pago,
      imagen: pago.comprobante || pago.imagen 
    });
    setModalVisible(true);
  };

  const cerrarDetalles = () => {
    setModalVisible(false);
    setPagoSeleccionado(null);
  };

  // Acciones de Administrador
  const handleAprobar = (pago) => {
    if (!puedeAprobarPagos) return;
    
    Alert.alert(
      "Aprobar Pago",
      `¿Confirmas que el pago por ${pago.monto} es válido y está en la cuenta?`,
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Sí, Aprobar", 
          onPress: () => {
            dispatch(cambiarEstadoPago({ id: pago.id, nuevoEstado: 'Procesado' }));
            setModalVisible(false); 
          }
        }
      ]
    );
  };

  const handleRechazar = (pago) => {
    Alert.alert(
      "Rechazar Pago",
      "¿Estás seguro de rechazar este pago? El recibo será marcado como inválido.",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Sí, Rechazar", 
          style: "destructive",
          onPress: () => {
            dispatch(cambiarEstadoPago({ id: pago.id, nuevoEstado: 'Rechazado' }));
            setModalVisible(false);
          }
        }
      ]
    );
  };

  return {
    listaPagos,
    loading,
    error,
    esAdmin,
    modalVisible,
    modalPagoVisible,
    modalEstadoCuentaVisible,
    pagoSeleccionado,
    setModalPagoVisible,
    setModalEstadoCuentaVisible,
    obtenerPagos,
    abrirDetalles,
    cerrarDetalles,
    handleAprobar,
    handleRechazar
  };
};