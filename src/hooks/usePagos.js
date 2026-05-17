import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Alert } from 'react-native';
import { fetchPagos, cambiarEstadoPago } from '../store/slices/pagosSlice';
import { usePermisos } from './usePermisos';
import clienteApi from '../utils/clienteApi'; 

// URL Base para armar la ruta de las imágenes
const URL_BASE = process.env.EXPO_PUBLIC_URL_BASE; 

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
  
  // Estado para saber si estamos buscando los detalles
  const [cargandoDetalle, setCargandoDetalle] = useState(false);

  // Acciones Principales
  const obtenerPagos = (forzar = false) => {
    if (forzar || listaPagos.length === 0) {
      dispatch(fetchPagos());
    }
  };

  // Modificamos abrirDetalles para que consulte el servidor
  const abrirDetalles = async (pagoCabecera) => {
    // Si ya estamos buscando uno, evitamos dobles toques
    if (cargandoDetalle) return;
    
    setCargandoDetalle(true);
    
    try {
      const respuesta = await clienteApi.get('', {
        params: {
          endpoint: 'pagos',
          operacion: 'consultar_pago',
          id_pago: pagoCabecera.id
        }
      });

      if (respuesta.data.estatus) {
        const dataBackend = respuesta.data.datos;
        
        // Extraemos el primer detalle (donde suele estar la info bancaria)
        const detalleBancario = dataBackend.detalles && dataBackend.detalles.length > 0 
          ? dataBackend.detalles[0] 
          : {};

        // Armamos la URL completa de la imagen si existe
        let urlImagen = null;
        if (detalleBancario.imagen && detalleBancario.imagen !== 'default.png') {
          urlImagen = `${URL_BASE}/recursos/img/pagos/${detalleBancario.imagen}`;
        }

        // Combinamos la info visual de la lista con los datos fuertes del servidor
        setPagoSeleccionado({
          ...pagoCabecera, // Mantenemos fecha visual, monto visual, etc.
          banco: detalleBancario.nombre_banco || pagoCabecera.banco || 'No aplica',
          referencia: detalleBancario.referencia || pagoCabecera.referencia || 'No aplica',
          imagen: urlImagen
        });
        
        setModalVisible(true);
      } else {
        Alert.alert("Aviso", respuesta.data.mensaje || "No se pudieron cargar los detalles.");
      }
    } catch (err) {
      Alert.alert("Error", "Problema de conexión al buscar el recibo.");
    } finally {
      setCargandoDetalle(false);
    }
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
    cargandoDetalle, 
    setModalPagoVisible,
    setModalEstadoCuentaVisible,
    obtenerPagos,
    abrirDetalles,
    cerrarDetalles,
    handleAprobar,
    handleRechazar
  };
};