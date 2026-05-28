import { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Alert } from 'react-native';
import { fetchGastos } from '../store/slices/gastosSlice';
import clienteApi from '../utils/clienteApi';
import { procesarErrorApi } from '../utils/gestorErroresUI';

const URL_BASE = process.env.EXPO_PUBLIC_URL_BASE;

export const useGastos = () => {
  const dispatch = useDispatch();
  
  const { listaGastos, totalGastadoMes, loading, error } = useSelector(state => state.gastos);

  // Estados para el filtro de fechas (inicia en el mes/año actual)
  const fechaActual = new Date();
  const [mesFiltro, setMesFiltro] = useState(fechaActual.getMonth() + 1);
  const [anioFiltro, setAnioFiltro] = useState(fechaActual.getFullYear());
  const [periodosDisponibles, setPeriodosDisponibles] = useState([]);

  const [modalDetalleVisible, setModalDetalleVisible] = useState(false);
  const [modalGastoVisible, setModalGastoVisible] = useState(false);
  const [gastoSeleccionado, setGastoSeleccionado] = useState(null);
  const [cargandoDetalle, setCargandoDetalle] = useState(false);

  // Ahora recibe mes y año. Si no se pasan, usa los del estado local
  const obtenerGastos = (forzar = false, mes = mesFiltro, anio = anioFiltro) => {
    if (forzar || listaGastos.length === 0) {
      dispatch(fetchGastos({ mes, anio }));
    }
  };

  const cargarPeriodos = useCallback(async () => {
    try {
      const respuesta = await clienteApi.get('', {
        params: { endpoint: 'gastos', operacion: 'obtener_periodos' }
      });

      if (respuesta.data.estatus) {
        const periodosBD = respuesta.data.datos;
        setPeriodosDisponibles(periodosBD);

        if (periodosBD.length > 0) {
          // Verificamos si el mes/año actual tiene registros
          const existeMesActual = periodosBD.some(
            p => Number(p.mes) === mesFiltro && Number(p.anio) === anioFiltro
          );

          // Si el mes actual NO tiene gastos, forzamos la vista al último mes que sí tenga
          if (!existeMesActual) {
            const ultimoPeriodo = periodosBD[0]; // Como viene DESC de PHP, el [0] es el más reciente
            setMesFiltro(Number(ultimoPeriodo.mes));
            setAnioFiltro(Number(ultimoPeriodo.anio));
            obtenerGastos(true, Number(ultimoPeriodo.mes), Number(ultimoPeriodo.anio));
            return; // Salimos para no ejecutar obtenerGastos dos veces
          }
        }
      }
    } catch (err) {
      procesarErrorApi(error);
    }
    
    // Si el mes actual sí existe, o si hubo error, cargamos normalmente
    obtenerGastos();
  }, [mesFiltro, anioFiltro]);

  // Función para que el SelectorMesAnio actualice el estado y dispare la consulta
  const cambiarFiltroFecha = (nuevoMes, nuevoAnio) => {
    setMesFiltro(nuevoMes);
    setAnioFiltro(nuevoAnio);
    obtenerGastos(true, nuevoMes, nuevoAnio);
  };

  const abrirDetalles = async (gastoCabecera) => {
    if (cargandoDetalle) return;
    setCargandoDetalle(true);

    try {
      const respuesta = await clienteApi.get('', {
        params: {
          endpoint: 'gastos',
          operacion: 'consultar_gasto',
          id_gasto: gastoCabecera.id
        }
      });

      if (respuesta.data.estatus) {
        const dataBackend = respuesta.data.datos;
        const detalles = dataBackend.detalles || [];
        const primerDetalle = detalles.length > 0 ? detalles[0] : {};

        let urlImagen = null;
        if (primerDetalle.imagen && primerDetalle.imagen !== 'default.png') {
          urlImagen = `${URL_BASE}/recursos/img/gastos/${primerDetalle.imagen}`;
        }

        setGastoSeleccionado({
          ...gastoCabecera,
          metodo_pago: primerDetalle.metodo_pago || 'No especificado',
          banco: primerDetalle.nombre_banco || 'No aplica',
          referencia: primerDetalle.referencia || 'No aplica',
          imagen: urlImagen
        });
        
        setModalDetalleVisible(true);
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
    setModalDetalleVisible(false);
    setGastoSeleccionado(null);
  };

  const abrirNuevoGasto = () => setModalGastoVisible(true);
  const cerrarNuevoGasto = () => setModalGastoVisible(false);

  useEffect(() => {
    obtenerGastos(); 

    // carga de los meses/años disponibles para el selector de la cabecera
    if (typeof cargarPeriodos === 'function') {
      cargarPeriodos();
    }
  }, []);

  return {
    listaGastos,
    totalGastadoMes,
    loading,
    error,
    cargandoDetalle,
    modalDetalleVisible,
    modalGastoVisible,
    gastoSeleccionado,
    mesFiltro,
    anioFiltro,
    cambiarFiltroFecha,
    obtenerGastos,
    abrirDetalles,
    cerrarDetalles,
    abrirNuevoGasto,
    cerrarNuevoGasto,
    periodosDisponibles,
  };
};