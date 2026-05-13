import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { registrarPagoServidor } from '../store/slices/pagosSlice';
import clienteApi from '../utils/clienteApi';

export const useFormularioPago = (onClose) => {
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estados para los catálogos de la Base de Datos
  const [bancosDisponibles, setBancosDisponibles] = useState([]);
  const [apartamentosDisponibles, setApartamentosDisponibles] = useState([]);
  const [mesesPendientes, setMesesPendientes] = useState([]);

  const { user } = useSelector(state => state.usuario);
  const esAdmin = user?.rol === 'administrador' || user?.rol === 'presidente';

  const { control, handleSubmit, formState: { errors, isValid }, reset, setValue, watch } = useForm({
    mode: 'onChange',
    defaultValues: {
      apartamento_id: '',
      monto: '',
      referencia: '',
      banco_id: '',
      tipo_pago: 'Transferencia',
      mensualidad_id: '',
      comprobante: null
    }
  });

  const comprobanteUri = watch('comprobante');
  const apartamentoSeleccionado = watch('apartamento_id'); // Escuchamos qué apartamento elige

  // CARGA INICIAL: Bancos y Apartamentos
  useEffect(() => {
    const cargarCatalogosIniciales = async () => {
      try {
        // Petición a Bancos
        const resBancos = await clienteApi.get('?endpoint=bancos&operacion=consulta');
        if (resBancos.data.estatus) setBancosDisponibles(resBancos.data.datos);

        // Petición a Apartamentos (Le decimos quiénes somos)
        const resAptos = await clienteApi.get('?endpoint=apartamentos&operacion=consulta', {
          params: {
            es_propietario: esAdmin ? 0 : 1,
            correo: user?.correo || ''
          }
        });
        if (resAptos.data.estatus) {
          setApartamentosDisponibles(resAptos.data.datos);
          
          // Auto-seleccionar si el propietario solo tiene 1 apartamento
          if (resAptos.data.datos.length === 1) {
            setValue('apartamento_id', resAptos.data.datos[0].id_apartamento, { shouldValidate: true });
          }
        }
      } catch (error) {
        console.error("Error cargando catálogos", error);
      }
    };

    cargarCatalogosIniciales();
  }, []);

  // Si cambia el apartamento, buscamos sus deudas
  useEffect(() => {
    if (!apartamentoSeleccionado) {
      setMesesPendientes([]);
      return;
    }

    const cargarDeudas = async () => {
      try {
        const resDeudas = await clienteApi.get('?endpoint=pagos&operacion=consultar_mensualidades', {
          params: { apartamento_id: apartamentoSeleccionado }
        });
        
        if (resDeudas.data.estatus) {
          // Mapeamos para que la vista lo entienda fácil
          const deudasFormateadas = resDeudas.data.datos.map(d => ({
            id: d.id_mensualidad,
            mes: `${d.mes} ${d.anio}`,
            monto: d.pendiente
          }));
          setMesesPendientes(deudasFormateadas);
        }
      } catch (error) {
        console.error("Error buscando deudas", error);
      }
    };

    cargarDeudas();
    // Reiniciamos el mes seleccionado si cambian de apartamento
    setValue('mensualidad_id', null); 
  }, [apartamentoSeleccionado]);

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setValue('comprobante', result.assets[0].uri, { shouldValidate: true });
    }
  };

  const onSubmit = async (data) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('operacion', 'registrar_pago');
      formData.append('es_propietario', '1'); // Simulación de rol
      
      // Datos de Cabecera
      formData.append('apartamento_id', data.apartamento_id);
      formData.append('mensualidad_id', data.mensualidad_id);
      formData.append('observacion', 'Pago registrado desde la App');

      // Datos de Detalles (Renglón 0)
      const hoy = new Date().toISOString().split('T')[0];
      formData.append('fecha_pago[0]', hoy);
      formData.append('monto[0]', data.monto);
      formData.append('tipo_pago[0]', data.tipo_pago);
      formData.append('referencia[0]', data.referencia);
      formData.append('banco_id[0]', data.banco_id);

      // Imagen (Usando el formato que espera imagen_0)
      if (data.comprobante) {
        const localUri = data.comprobante;
        const filename = localUri.split('/').pop();
        const type = `image/${filename.split('.').pop()}`;

        formData.append('imagen_0', { uri: localUri, name: filename, type });
      }

      const datosVisuales = {
        monto: `${parseFloat(data.monto).toFixed(2)} Bs.`,
        estado: 'PENDIENTE',
        fecha: hoy,
        mensualidad: 'Mensualidad actual',
        apartamento: 'Tu apto.',
        comprobante: data.comprobante
      };

      await dispatch(registrarPagoServidor({ datosVisuales, formData })).unwrap();

      onClose();
      reset();
    } catch (error) {
      Alert.alert('Error', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return { 
    control, errors, comprobanteUri, isSubmitting, isValid, handleSubmit, 
    handleImagePick, onSubmit, removeImage: () => setValue('comprobante', null),
    bancosDisponibles, apartamentosDisponibles, mesesPendientes 
  };
};