import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Alert } from 'react-native';
import { fetchGastos } from '../store/slices/gastosSlice';
import clienteApi from '../utils/clienteApi';

const URL_BASE = process.env.EXPO_PUBLIC_URL_BASE;

export const useGastos = () => {
  const dispatch = useDispatch();
  
  const { listaGastos, totalGastadoMes, loading, error } = useSelector(state => state.gastos);

  const [modalDetalleVisible, setModalDetalleVisible] = useState(false);
  const [modalGastoVisible, setModalGastoVisible] = useState(false);
  const [gastoSeleccionado, setGastoSeleccionado] = useState(null);
  const [cargandoDetalle, setCargandoDetalle] = useState(false);

  // Petición al servidor para la lista inicial
  const obtenerGastos = (forzar = false) => {
    if (forzar || listaGastos.length === 0) {
      dispatch(fetchGastos());
    }
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
        
        // Extraemos el primer detalle para mostrar los datos de pago
        const detalles = dataBackend.detalles || [];
        const primerDetalle = detalles.length > 0 ? detalles[0] : {};

        // Construimos la URL de la imagen
        let urlImagen = null;
        if (primerDetalle.imagen && primerDetalle.imagen !== 'default.png') {
          urlImagen = `${URL_BASE}/recursos/img/gastos/${primerDetalle.imagen}`;
        }

        // Unimos lo visual con lo recién consultado
        setGastoSeleccionado({
          ...gastoCabecera,
          metodo_pago: primerDetalle.metodo_pago || 'No especificado',
          banco: primerDetalle.nombre_banco || 'No aplica',
          referencia: primerDetalle.referencia || 'No aplica',
          imagen: urlImagen
        });
        
        setModalDetalleVisible(true);
      } else {
        Alert.alert("Aviso", respuesta.data.mensaje || "No se pudieron cargar los detalles.");
      }
    } catch (err) {
      Alert.alert("Error", "Problema de conexión al buscar el gasto.");
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

  return {
    listaGastos,
    totalGastadoMes,
    loading,
    error,
    cargandoDetalle,
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