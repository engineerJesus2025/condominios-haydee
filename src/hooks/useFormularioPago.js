import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';
import { useDispatch } from 'react-redux'; 
import { registrarPago } from '../store/slices/pagosSlice'; 

import { MESES_PENDIENTES, DATA_BANCOS } from '../utils/Data';

export const useFormularioPago = (onClose) => {
  const dispatch = useDispatch(); 
  const [permissionStatus, requestPermission] = ImagePicker.useMediaLibraryPermissions(); // Nombre más claro
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
      mes: '',
      banco: '',
      referencia: '',
      monto: '',
      comprobante: null 
    }
  });

  const comprobanteUri = watch('comprobante');  

  const seleccionarMes = (mesSeleccionado, montoCorrespondiente) => {
    setValue('mes', mesSeleccionado, { shouldValidate: true });
    setValue('monto', montoCorrespondiente, { shouldValidate: true });
  };

  const seleccionarBanco = (bancoSeleccionado) => {
    setValue('banco', bancoSeleccionado, { shouldValidate: true });
  };

  useEffect(() => {
    (async () => {
      if (!permissionStatus?.granted) {
        await requestPermission();
      }
    })();
  }, [permissionStatus, requestPermission]);

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
      Alert.alert('Error', 'No se pudo adjuntar el comprobante');
    }
  };

  const removeImage = () => {
    setValue('comprobante', null, { shouldValidate: true });
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const datosParaRedux = { ...data, mensualidad: data.mes };
      dispatch(registrarPago(datosParaRedux)); 
      
      setTimeout(() => {
        Alert.alert('Éxito', 'Pago registrado exitosamente. En espera de validación.');
        resetForm();
        onClose();
        setIsSubmitting(false);
      }, 800);

    } catch (error) {
      Alert.alert('Error', 'Hubo un problema al registrar el pago');
      setIsSubmitting(false);
    } 
  };

  const resetForm = () => {
    reset({ mes: '', banco: '', referencia: '', monto: '', comprobante: null });
    setIsSubmitting(false);
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  const canSubmit = isValid && !isSubmitting && comprobanteUri;

  return {
    control,
    errors,
    isSubmitting,
    canSubmit,
    comprobanteUri,
    mesesPendientes: MESES_PENDIENTES,
    bancosDisponibles: DATA_BANCOS,
    handleSubmit,
    handleImagePick,
    removeImage,
    onSubmit,
    handleCancel,
    seleccionarMes,
    seleccionarBanco
  };
};