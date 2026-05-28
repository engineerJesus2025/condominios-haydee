import { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { registrarPagoServidor } from '../store/slices/pagosSlice';
import clienteApi from '../utils/clienteApi';
import { usePermisos } from './usePermisos';
import { procesarErrorApi } from '../utils/gestorErroresUI';
import AsyncStorage from '@react-native-async-storage/async-storage';


export const useFormularioPago = (onClose) => {
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [tasaDolar, setTasaDolar] = useState('1.00'); 
  
  const [bancosDisponibles, setBancosDisponibles] = useState([]);
  const [apartamentosDisponibles, setApartamentosDisponibles] = useState([]);
  const [mesesPendientes, setMesesPendientes] = useState([]);

  const { esAdmin, usuario } = usePermisos();

  const { control, handleSubmit, formState: { errors, isValid }, reset, setValue, watch, setError } = useForm({
    mode: 'onChange',
    defaultValues: {
      apartamento_id: '',
      monto: '',
      referencia: '',
      banco_id: '',
      tipo_pago: 'Transferencia',
      mensualidad_id: '',
      comprobante: null,
      estado: 'PENDIENTE'
    }
  });

  const comprobanteUri = watch('comprobante');
  const apartamentoSeleccionado = watch('apartamento_id'); 
  const tipoPagoSeleccionado = watch('tipo_pago');
  const montoIngresado = watch('monto'); 

  const requiereBanco = (tipoPagoSeleccionado === 'Transferencia' || tipoPagoSeleccionado === 'Pago Movil');

  // CONVERSIÓN DE DIVISAS
  const equivalenteDolares = useMemo(() => {
    const montoBase = parseFloat(montoIngresado);
    const tasa = parseFloat(tasaDolar);
    
    if (!isNaN(montoBase) && !isNaN(tasa) && tasa > 0) {
      return (montoBase / tasa).toFixed(2);
    }
    return '0.00';
  }, [montoIngresado, tasaDolar]);

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
        procesarErrorApi(error);
      }
    };

    const leerTasaDeCacheLocal = async () => {
      try {
        const tasaGuardada = await AsyncStorage.getItem('tasa_dolar');
        if (tasaGuardada) {
          setTasaDolar(tasaGuardada);
        } else {
          setTasaDolar('1.00'); // en caso de error crítico de hardware
        }
      } catch (e) {
        setTasaDolar('1.00');
      }
    };

    leerTasaDeCacheLocal();
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
        procesarErrorApi(error);
      }
    };

    cargarDeudas();
    setValue('mensualidad_id', null); 
  }, [apartamentoSeleccionado]);

  const handleImagePick = async () => {
    // Verificamos permisos si es necesario
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, // Permite al usuario recortar los bordes negros del recibo
      aspect: [4, 5],      // Proporción estándar para recibos
      quality: 0.4, // Reduce la calidad al 40% (es un recibo, no hace falta el hd aqui -_-)
      base64: true
    });

    if (!result.canceled) {
      setValue('comprobante', result.assets[0].uri, { shouldValidate: true });
    }
  };
  
  const onSubmit = async (data) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    // Pausamos para que tenga tiempo de pintar el Spinner
    await new Promise(resolve => setTimeout(resolve, 50)); // Esto se llama THREAD YIELDING mi estimado

    try {
      const formData = new FormData();
      formData.append('operacion', 'registrar_pago');
      formData.append('es_propietario', esAdmin ? '0' : '1');
      
      // Datos de Cabecera
      formData.append('apartamento_id', data.apartamento_id);
      formData.append('mensualidad_id', data.mensualidad_id);
      formData.append('observacion', 'Pago registrado desde la App');

      formData.append('estado', data.estado); 
      formData.append('tasa_dolar', tasaDolar);

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
      procesarErrorApi(error, (status, mensaje, erroresFormulario) => {
        // Si es un error 400 y trae detalles por campo
        if (status === 400 && erroresFormulario) {
          Object.keys(erroresFormulario).forEach(campo => {
            setError(campo, {
              type: 'server',
              message: erroresFormulario[campo][0]
            });
          });
          
          //Feedback general
          Alert.alert('Datos Inválidos', mensaje || 'Revise los campos marcados en rojo.');
          
          return true;
        }
        
        return false; // Si es un 401, 403, 500, etc.
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit = isValid && !isSubmitting && (!requiereBanco || (watch('banco_id') && watch('referencia')));

  return { 
    control, 
    errors,
    comprobanteUri,
    isSubmitting,
    isValid: canSubmit,
    handleSubmit,
    handleImagePick,
    onSubmit,
    removeImage: () => setValue('comprobante',
    null),
    bancosDisponibles,
    apartamentosDisponibles,
    mesesPendientes,
    requiereBanco ,
    esAdmin,
    tasaDolar, 
    equivalenteDolares,
    apartamentoSeleccionado
  };
};