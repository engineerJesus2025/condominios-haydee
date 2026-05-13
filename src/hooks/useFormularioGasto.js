/*

TERMINAR


*/
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { crearGasto } from '../store/slices/gastosSlice';

export const useFormularioGasto = (onClose) => {
  const dispatch = useDispatch();
  const [permissionStatus, requestPermission] = ImagePicker.useMediaLibraryPermissions();
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      tipo: 'Variable', // 'Fijo' o 'Variable'
      categoria: '',    // Texto temporal, luego será ID
      proveedor: '',    // Texto temporal, luego será ID
      monto: '',
      descripcion: '',
      comprobante: null
    }
  });

  const comprobanteUri = watch('comprobante');
  const tipo = watch('tipo');
  const descripcion = watch('descripcion');
  const monto = watch('monto');

  // Solicitar permisos de cámara/galería
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
      Alert.alert('Error', 'No se pudo seleccionar la factura');
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
      formData.append('clasificacion', data.tipo);
      formData.append('descripcion_gasto', data.descripcion);
      formData.append('tipo_gasto_id', 1); 
      formData.append('proveedor_id', 1);

      // -- DETALLES DEL GASTO (Renglones) --
      const fechaHoy = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      formData.append('fecha_detalle[0]', fechaHoy);
      formData.append('monto[0]', data.monto);
      formData.append('metodo_pago[0]', 'Efectivo'); // Por defecto para evitar validaciones bancarias complejas por ahora
      
      // -- IMAGEN (Comprobante) --
      if (data.comprobante) {
        let localUri = data.comprobante;
        let filename = localUri.split('/').pop();
        let match = /\.(\w+)$/.exec(filename);
        let type = match ? `image/${match[1]}` : `image`;

        // Tu ConstructorDetalles probablemente busca las imágenes así:
        formData.append('imagen[0]', { uri: localUri, name: filename, type });
      }

      // -- DATOS PARA OPTIMISTIC UI --
      const datosVisuales = {
        fecha: fechaHoy,
        monto: `${parseFloat(data.monto).toFixed(2)} Bs.`,
        montoCrudo: data.monto, // Para poder sumarlo al total
        tipo: data.tipo,
        tipo_gasto: data.categoria, // Mostramos el texto temporal que escribió el usuario
        proveedor: data.proveedor || 'No especificado',
        descripcion: data.descripcion,
        comprobante: data.comprobante // URI temporal para que lo vea de inmediato
      };

      // Despachamos al Thunk
      await dispatch(crearGasto({ datosVisuales, formData })).unwrap();

      // Limpiamos y cerramos
      onClose();
      setTimeout(() => {
        reset();
      }, 400);

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

  const canSubmit = isValid && !isSubmitting && descripcion.trim() && monto.trim();

  return {
    control,
    errors,
    comprobanteUri,
    isSubmitting,
    canSubmit,
    handleSubmit,
    handleImagePick,
    removeImage,
    onSubmit,
    handleCancel
  };
};