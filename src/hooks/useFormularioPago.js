import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { registrarPagoServidor } from '../store/slices/pagosSlice';
import clienteApi from '../utils/clienteApi';
import { usePermisos } from './usePermisos';

export const useFormularioPago = (onClose) => {
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estados para los catálogos
  const [bancosDisponibles, setBancosDisponibles] = useState([]);
  const [apartamentosDisponibles, setApartamentosDisponibles] = useState([]);
  const [mesesPendientes, setMesesPendientes] = useState([]);

  const { esAdmin, usuario } = usePermisos();

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
  const apartamentoSeleccionado = watch('apartamento_id'); 
  const tipoPagoSeleccionado = watch('tipo_pago');

  // Lógica para saber si requerimos validaciones bancarias
  const requiereBanco = (tipoPagoSeleccionado === 'Transferencia' || tipoPagoSeleccionado === 'Pago Movil');

  // CARGA INICIAL
  useEffect(() => {
    const cargarCatalogosIniciales = async () => {
      try {
        const respuesta = await clienteApi.get('', {
          params: {
            endpoint: 'pagos',
            operacion: 'obtener_catalogos_base',
            es_propietario: esAdmin ? 0 : 1,
            correo: usuario?.correo || ''
          }
        });

        if (respuesta.data.estatus) {
          const { bancos, apartamentos } = respuesta.data.datos;
          setBancosDisponibles(bancos);
          setApartamentosDisponibles(apartamentos);
          
          // Auto-seleccionar si el propietario solo tiene 1 apartamento
          if (apartamentos.length === 1) {
            setValue('apartamento_id', apartamentos[0].id_apartamento, { shouldValidate: true });
          }
        }
      } catch (error) {
        console.error("Error cargando catálogos unificados", error);
      }
    };

    cargarCatalogosIniciales();
  }, []);

  // Mensualidades (Se ejecuta al elegir apartamento)
  useEffect(() => {
    if (!apartamentoSeleccionado) {
      setMesesPendientes([]);
      return;
    }

    const cargarDeudas = async () => {
      try {
        const resDeudas = await clienteApi.get('', {
          params: { 
            endpoint: 'pagos',
            operacion: 'consultar_mensualidades',
            apartamento_id: apartamentoSeleccionado 
          }
        });
        
        if (resDeudas.data.estatus) {
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
      formData.append('es_propietario', esAdmin ? '0' : '1');
      
      // Datos de Cabecera
      formData.append('apartamento_id', data.apartamento_id);
      formData.append('mensualidad_id', data.mensualidad_id);
      formData.append('observacion', 'Pago registrado desde la App');

      // Datos de Detalles (Renglón 0)
      const hoy = new Date().toISOString().split('T')[0];
      formData.append('fecha_pago[0]', hoy);
      formData.append('monto[0]', data.monto);
      formData.append('tipo_pago[0]', data.tipo_pago);

      // Enviamos datos bancarios solo si aplica
      if (requiereBanco) {
        formData.append('referencia[0]', data.referencia);
        formData.append('banco_id[0]', data.banco_id);

        if (data.comprobante) {
          const localUri = data.comprobante;
          const filename = localUri.split('/').pop() || 'comprobante.jpg';
          const match = /\.(\w+)$/.exec(filename);
          const type = match ? `image/${match[1]}` : `image`;
          formData.append('imagen_0', { uri: localUri, name: filename, type });
        }
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
      Alert.alert('Error al procesar pago', typeof error === 'string' ? error : 'Intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit = isValid && !isSubmitting && (!requiereBanco || (watch('banco_id') && watch('referencia')));

  return { 
    control, errors, comprobanteUri, isSubmitting, isValid: canSubmit, handleSubmit, 
    handleImagePick, onSubmit, removeImage: () => setValue('comprobante', null),
    bancosDisponibles, apartamentosDisponibles, mesesPendientes, requiereBanco 
  };
};