import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { crearGasto, fetchCatalogosGastos } from '../store/slices/gastosSlice';

export const useFormularioGasto = (onClose) => {
  const dispatch = useDispatch();
  
  // Traemos los catálogos de Redux
  const catalogos = useSelector(state => state.gastos.catalogos);
  
  const [permissionStatus, requestPermission] = ImagePicker.useMediaLibraryPermissions();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Inicializamos los catálogos al abrir el modal (si no están cargados)
  useEffect(() => {
    if (catalogos.tipos_gasto.length === 0) {
      dispatch(fetchCatalogosGastos());
    }
  }, [dispatch]);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    setValue,
    watch
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      clasificacion: 'Variable',
      tipo_gasto_id: '',
      proveedor_id: '',
      descripcion_gasto: '',
      monto: '',
      metodo_pago: 'Efectivo',
      banco_id: '',
      referencia: '',
      comprobante: null
    }
  });

  const comprobanteUri = watch('comprobante');
  const metodoPago = watch('metodo_pago');
  const requiereBanco = (metodoPago === 'Transferencia' || metodoPago === 'Pago Movil');

  useEffect(() => {
    (async () => {
      if (!permissionStatus?.granted) await requestPermission();
    })();
  }, [permissionStatus]);

  const handleImagePick = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets.length > 0) {
        setValue('comprobante', result.assets[0].uri, { shouldValidate: true });
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo seleccionar el comprobante');
    }
  };

  const removeImage = () => setValue('comprobante', null);

  const onSubmit = async (data) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      
      // -- CABECERA DEL GASTO --
      formData.append('operacion', 'registrar_gasto');
      formData.append('clasificacion', data.clasificacion);
      formData.append('descripcion_gasto', data.descripcion_gasto);
      formData.append('tipo_gasto_id', data.tipo_gasto_id); 
      if (data.proveedor_id) formData.append('proveedor_id', data.proveedor_id);

      // -- DETALLES DEL GASTO (Renglones) --
      const fechaHoy = new Date().toISOString().split('T')[0];
      formData.append('fecha_detalle[0]', fechaHoy);
      formData.append('monto[0]', data.monto);
      formData.append('metodo_pago[0]', data.metodo_pago);
      formData.append('descripcion_detalle_gasto[0]', data.descripcion_gasto);

      // -- DATOS BANCARIOS (Si aplica) --
      if (requiereBanco) {
        formData.append('banco_id[0]', data.banco_id);
        formData.append('referencia[0]', data.referencia);
        
        if (data.comprobante) {
          let localUri = data.comprobante;
          let filename = localUri.split('/').pop() || 'comprobante.jpg';
          let match = /\.(\w+)$/.exec(filename);
          let type = match ? `image/${match[1]}` : `image`;
          formData.append('imagen_0', { uri: localUri, name: filename, type }); 
          // constructor de PHP usa 'imagen_0', 'imagen_1' para los archivos.
        }
      }

      // -- DATOS PARA OPTIMISTIC UI --
      const tipoGastoObj = catalogos.tipos_gasto.find(t => t.id_tipo_gasto === data.tipo_gasto_id);
      const proveedorObj = catalogos.proveedores.find(p => p.id_proveedor === data.proveedor_id);

      const datosVisuales = {
        fecha: fechaHoy,
        monto: `${parseFloat(data.monto).toFixed(2)} Bs.`,
        montoCrudo: data.monto,
        tipo: data.clasificacion,
        tipo_gasto: tipoGastoObj ? tipoGastoObj.nombre_tipo_gasto : 'General',
        proveedor: proveedorObj ? proveedorObj.nombre_proveedor : 'No especificado',
        descripcion: data.descripcion_gasto,
        comprobante: data.comprobante
      };

      await dispatch(crearGasto({ datosVisuales, formData })).unwrap();

      onClose();
      setTimeout(() => reset(), 400);

    } catch (error) {
      Alert.alert('Error al registrar', typeof error === 'string' ? error : 'Revisa los datos e intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    onClose();
    setTimeout(() => reset(), 400);
  };

  const descripcionActual = watch('descripcion_gasto');
  const montoActual = watch('monto');
  // Validamos extra que si requiere banco, la foto sea obligatoria (opcional según tu regla de negocio)
  const canSubmit = isValid && !isSubmitting && descripcionActual?.trim() && montoActual?.trim() 
                    && (!requiereBanco || (data => data.banco_id && data.referencia));

  return {
    control, errors, comprobanteUri, isSubmitting, canSubmit,
    handleSubmit, handleImagePick, removeImage, onSubmit, handleCancel,
    catalogos, requiereBanco
  };
};