import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { registrarGasto } from '../store/slices/gastosSlice'; 

export const useFormularioGasto = (onClose) => {
  const dispatch = useDispatch();
  const [permissionStatus, requestPermission] = ImagePicker.useMediaLibraryPermissions();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { control, handleSubmit, formState: { errors, isValid }, reset, setValue, watch } = useForm({
    mode: 'onChange',
    defaultValues: { tipo: 'Fijo', categoria: '', proveedor: '', descripcion: '', monto: '', comprobante: null }
  });

  const comprobanteUri = watch('comprobante');

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

  const removeImage = () => setValue('comprobante', null, { shouldValidate: true });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      dispatch(registrarGasto(data)); 
      setTimeout(() => {
        Alert.alert('Éxito', 'Gasto registrado en el balance del mes.');
        resetForm();
        onClose();
        setIsSubmitting(false);
      }, 500);
    } catch (error) {
      Alert.alert('Error', 'Hubo un problema al registrar el gasto');
      setIsSubmitting(false);
    } 
  };

  const resetForm = () => {
    reset({ tipo: 'Fijo', categoria: '', proveedor: '', descripcion: '', monto: '', comprobante: null });
    setIsSubmitting(false);
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  const canSubmit = isValid && !isSubmitting;

  return {
    control, errors, isSubmitting, canSubmit, comprobanteUri,
    handleSubmit, handleImagePick, removeImage, onSubmit, handleCancel
  };
};