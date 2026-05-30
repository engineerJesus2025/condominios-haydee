import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Alert } from 'react-native';
import { fetchPagos, actualizarEstadoPagoServidor, fetchEstadoCuenta } from '../store/slices/pagosSlice';
import { usePermisos } from './usePermisos';
import clienteApi from '../utils/clienteApi'; 
import { procesarErrorApi } from '../utils/gestorErroresUI';

const URL_BASE = process.env.EXPO_PUBLIC_URL_BASE; 

export const usePagos = () => {
  const dispatch = useDispatch();

  const { listaPagos, loading, error, listaDeudas, totalDeuda, loadingDeudas } = useSelector(state => state.pagos);
  const { esAdmin, puedeAprobarPagos } = usePermisos();

  const fechaActual = new Date();
  const [mesFiltro, setMesFiltro] = useState(fechaActual.getMonth() + 1);
  const [anioFiltro, setAnioFiltro] = useState(fechaActual.getFullYear());
  const [periodosDisponibles, setPeriodosDisponibles] = useState([]);

  const [modalVisible, setModalVisible] = useState(false); 
  const [modalPagoVisible, setModalPagoVisible] = useState(false); 
  const [modalEstadoCuentaVisible, setModalEstadoCuentaVisible] = useState(false);
  const [pagoSeleccionado, setPagoSeleccionado] = useState(null);
  const [cargandoDetalle, setCargandoDetalle] = useState(false);
  const [procesandoEstado, setProcesandoEstado] = useState(false);
  
  // Estado puente para el primer renderizado
  const [inicializando, setInicializando] = useState(true);

  const obtenerPagos = (forzar = false, mes = mesFiltro, anio = anioFiltro) => {
    if (forzar || listaPagos.length === 0) {
      dispatch(fetchPagos({ mes, anio }));
      dispatch(fetchEstadoCuenta()); 
    }
  };

  const cargarPeriodos = useCallback(async () => {
    try {
      const respuesta = await clienteApi.get('', {
        params: { endpoint: 'pagos', operacion: 'obtener_periodos' }
      });

      if (respuesta.data.estatus) {
        const periodosBD = respuesta.data.datos;
        setPeriodosDisponibles(periodosBD);

        if (periodosBD.length > 0) {
          const existeMesActual = periodosBD.some(
            p => Number(p.mes) === mesFiltro && Number(p.anio) === anioFiltro
          );

          if (!existeMesActual) {
            const ultimoPeriodo = periodosBD[0]; 
            setMesFiltro(Number(ultimoPeriodo.mes));
            setAnioFiltro(Number(ultimoPeriodo.anio));
            obtenerPagos(true, Number(ultimoPeriodo.mes), Number(ultimoPeriodo.anio));
            setInicializando(false); // Apagamos el puente
            return; 
          }
        }
      }
    } catch (err) {
      procesarErrorApi(err); 
    }
    
    obtenerPagos();
    setInicializando(false); 
  }, [mesFiltro, anioFiltro]);

  const cambiarFiltroFecha = (nuevoMes, nuevoAnio) => {
    setMesFiltro(nuevoMes);
    setAnioFiltro(nuevoAnio);
    obtenerPagos(true, nuevoMes, nuevoAnio);
  };

  const abrirDetalles = async (pagoCabecera) => {
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
        const detalleBancario = dataBackend.detalles && dataBackend.detalles.length > 0 
          ? dataBackend.detalles[0] 
          : {};

        let urlImagen = null;
        if (detalleBancario.imagen && detalleBancario.imagen !== 'default.png') {
          urlImagen = `${URL_BASE}/recursos/img/pagos/${detalleBancario.imagen}`;
        }

        setPagoSeleccionado({
          ...pagoCabecera, 
          banco: detalleBancario.nombre_banco || pagoCabecera.banco || 'No aplica',
          referencia: detalleBancario.referencia || pagoCabecera.referencia || 'No aplica',
          imagen: urlImagen
        });
        
        setModalVisible(true);
      } else {
        // Si el estatus de negocio es false pero vino con un 200 HTTP, estructuramos el error
        procesarErrorApi({ tipo: 'SERVIDOR', status: 400, mensaje: respuesta.data.mensaje });
      }
    } catch (err) {
      procesarErrorApi(err);
    } finally {
      setCargandoDetalle(false);
    }
  };

  const cerrarDetalles = () => {
    setModalVisible(false);
    setPagoSeleccionado(null);
  };

  const handleAprobar = (pago) => {
    if (!puedeAprobarPagos) return;
    Alert.alert(
      "Aprobar Pago",
      `¿Confirmas que el pago por ${pago.monto} es válido y está en la cuenta?`,
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Sí, Aprobar", 
          onPress: async () => {
            setProcesandoEstado(true);
            try {
              await dispatch(actualizarEstadoPagoServidor({ id_pago: pago.id, nuevoEstado: 'PROCESADO' })).unwrap();
              
              obtenerPagos(true);
            } catch (error) {
              procesarErrorApi(error);
            } finally {
              setProcesandoEstado(false);
              cerrarDetalles();
            }
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
          onPress: async () => {
            setProcesandoEstado(true);
            try {
              await dispatch(actualizarEstadoPagoServidor({ id_pago: pago.id, nuevoEstado: 'RECHAZADO' })).unwrap();
              
              obtenerPagos(true);
            } catch (error) {
              procesarErrorApi(error);
            } finally {
              setProcesandoEstado(false);
              cerrarDetalles();
            }
          }
        }
      ]
    );
  };

  useEffect(() => {
    if (typeof cargarPeriodos === 'function') {
      cargarPeriodos();
    } else {
      obtenerPagos(); 
    }
  }, []);

  return {
    listaPagos,
    loading,
    error,
    listaDeudas,
    totalDeuda,
    loadingDeudas,
    esAdmin,
    puedeAprobarPagos,
    mesFiltro,
    setMesFiltro,
    anioFiltro,
    setAnioFiltro,
    periodosDisponibles,
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
    handleRechazar,
    procesandoEstado,
    inicializando
  };
};