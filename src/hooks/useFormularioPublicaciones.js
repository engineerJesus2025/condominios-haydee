import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { useState, useEffect } from 'react'
import * as ImagePicker from 'expo-image-picker'
import { Alert } from 'react-native'
import { fetchPublicaciones, crearPublicacion } from '../store/slices/publicacionesSlice';

export const useFormularioPublicaciones = (onClose, publicacionEditar = null) => { 
  const dispatch = useDispatch()
  const [permissionStatus, requestPermission] = ImagePicker.useMediaLibraryPermissions();
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    setValue,
    watch,
    trigger
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      titulo: '',
      descripcion: '',
      imagen: null,
      tipo: 'aviso'
    }
  })

  const imageUri = watch('imagen')
  const titulo = watch('titulo')
  const descripcion = watch('descripcion')
  const tipo = watch('tipo')

  useEffect(() => {
    if (publicacionEditar) {
      setValue('titulo', publicacionEditar.titulo || '')
      setValue('descripcion', publicacionEditar.descripcion || '')
      setValue('imagen', publicacionEditar.imagen || null)
      setValue('tipo', publicacionEditar.tipo || '')
    } else {
      reset({
        titulo: '',
        descripcion: '',
        imagen: null,
        tipo: ''
      })
    }
  }, [publicacionEditar, setValue, reset])

  useEffect(() => {
    (async () => {
      if (!permissionStatus?.granted) {
        await requestPermission();
      }
    })();
  }, [permissionStatus, requestPermission]);

  const handleImagePick = async () => {
    try {
      if (!permissionStatus?.granted) {
        const permissionResult = await requestPermission()
        if (!permissionResult.granted) {
          Alert.alert('Permisos necesarios', 'Se necesitan permisos de galería para seleccionar una imagen.')
          return
        }
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: false
      })

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setValue('imagen', result.assets[0].uri, { shouldValidate: true })
      }
    } catch (error) {
      console.error('Error al seleccionar imagen:', error)
      Alert.alert('Error', 'No se pudo seleccionar la imagen')
    }
  }

  const removeImage = () => {
    setValue('imagen', null, { shouldValidate: true })
  }

  const onSubmit = async (data) => {
    if (isSubmitting) return;

    if (data.imagen && data.imagen.startsWith('data:')) {
      Alert.alert('Formato no soportado', 'La imagen está en un formato no optimizado. Por favor selecciona otra.');
      return;
    }

    setIsSubmitting(true);

    try {
      // FormData estándar
      const formData = new FormData();
      formData.append('operacion', 'registrar_cartelera');
      formData.append('titulo', data.titulo);
      formData.append('descripcion', data.descripcion);
      formData.append('usuario_id', 1); // Temporal hasta usar Tokens de sesión

      let prioridad = 3; // Por defecto Noticia
      if (data.tipo === 'aviso') prioridad = 1;
      else if (data.tipo === 'evento') prioridad = 2;
      formData.append('prioridad', prioridad);

      // Empaquetar la imagen para React Native
      if (data.imagen) {
        let localUri = data.imagen;
        let filename = localUri.split('/').pop();

        let match = /\.(\w+)$/.exec(filename);
        let type = match ? `image/${match[1]}` : `image`;

        formData.append('imagen', {
          uri: localUri,
          name: filename,
          type: type
        });
      }

      const datosVisuales = {
        titulo: data.titulo,
        descripcion: data.descripcion,
        tipo: data.tipo,
        autor: 'Tú',
        imagen: data.imagen
      };

      // Despachamos la acción al servidor y esperamos que termine (.unwrap() extrae el resultado o lanza el error)
      await dispatch(crearPublicacion({ datosVisuales, formData })).unwrap();

      // Cerramos modal y limpiamos
      onClose();
      setTimeout(() => {
        resetForm();
      }, 400);

    } catch (error) {
      console.error('Error al publicar:', error);
      Alert.alert('Error', typeof error === 'string' ? error : 'No se pudo guardar la publicación en el servidor.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    reset({
      titulo: '',
      descripcion: '',
      imagen: null,
      tipo: ''
    })
    setIsSubmitting(false)
  }

  const handleCancel = () => {
    onClose()
    setTimeout(() => {
      resetForm()
    }, 400)
  }

  const canSubmit = isValid && !isSubmitting && titulo.trim() && descripcion.trim() && tipo;

  return {
    control,
    errors,
    isValid,
    isSubmitting,
    canSubmit,
    imageUri,
    titulo,
    descripcion,
    handleSubmit,
    setValue,
    trigger,
    handleImagePick,
    removeImage,
    onSubmit,
    handleCancel,
    resetForm
  }
}