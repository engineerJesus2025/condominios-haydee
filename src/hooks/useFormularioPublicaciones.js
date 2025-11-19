import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { useState, useEffect } from 'react'
import * as ImagePicker from 'expo-image-picker'
import { Alert } from 'react-native'
import { agregarPublicacion, editarPublicacion } from '../store/slices/publicacionesSlice'

export const useFormularioPublicaciones = (onClose, publicacionEditar = null) => { // ✅ Agregar publicacionEditar como parámetro
  const dispatch = useDispatch()
  const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions()
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
      imagen: null
    }
  })

  const imageUri = watch('imagen')
  const titulo = watch('titulo')
  const descripcion = watch('descripcion')

  useEffect(() => {
    if (publicacionEditar) {
      setValue('titulo', publicacionEditar.titulo || '')
      setValue('descripcion', publicacionEditar.descripcion || '')
      setValue('imagen', publicacionEditar.imagen || null)
    } else {
      reset({
        titulo: '',
        descripcion: '',
        imagen: null
      })
    }
  }, [publicacionEditar, setValue, reset])

  // Verificar permisos al montar el hook
  useEffect(() => {
    (async () => {
      if (!status?.granted) {
        await requestPermission()
      }
    })()
  }, [])

  const handleImagePick = async () => {
    try {
      if (!status?.granted) {
        const permissionResult = await requestPermission()
        if (!permissionResult.granted) {
          Alert.alert('Permisos necesarios', 'Se necesitan permisos de galería para seleccionar una imagen.')
          return
        }
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
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
    if (isSubmitting) return

    // Verificar que no sea base64
    if (data.imagen && data.imagen.startsWith('data:')) {
      Alert.alert('Formato no soportado', 'La imagen está en un formato no optimizado. Por favor selecciona otra.')
      return
    }

    setIsSubmitting(true)

    try {
      if (publicacionEditar) {
        dispatch(editarPublicacion({
          id: publicacionEditar.id,
          titulo: data.titulo,
          descripcion: data.descripcion,
          imagen: data.imagen,
          date: publicacionEditar.date || new Date().toLocaleDateString()
        }))
      } else {
        dispatch(agregarPublicacion({
          id: Date.now().toString(),
          titulo: data.titulo,
          descripcion: data.descripcion,
          imagen: data.imagen,
          fecha: new Date().toLocaleDateString()
        }))
      }

      resetForm()
      onClose()
    } catch (error) {
      console.error('Error al publicar:', error)
      Alert.alert('Error', 'No se pudo guardar la publicación')
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    reset({
      titulo: '',
      descripcion: '',
      imagen: null
    })
    setIsSubmitting(false)
  }

  const handleCancel = () => {
    resetForm()
    onClose()
  }

  // Validación adicional para el botón de submit
  const canSubmit = isValid && !isSubmitting && titulo.trim() && descripcion.trim()

  return {
    // Form state
    control,
    errors,
    isValid,
    isSubmitting,
    canSubmit,

    // Form values
    imageUri,
    titulo,
    descripcion,

    // Form methods
    handleSubmit,
    setValue,
    trigger,

    // Actions
    handleImagePick,
    removeImage,
    onSubmit,
    handleCancel,
    resetForm
  }
}
