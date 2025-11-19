import { useNavigation } from '@react-navigation/native'
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import { Alert } from 'react-native'

import { login } from '../store/slices/usuarioSlice'

const USUARIOS = [
  { id: '1', usuario: 'jesus', correo: 'jesus@gmail.com', contra: '12345', rol: 'administrador' },
  { id: '2', usuario: 'rafa', correo: 'rafa@gmail.com', contra: '12345', rol: 'coordinador' },
  { id: '3', usuario: 'francisco', correo: 'fran@gmail.com', contra: '12345', rol: 'presidente' }
]

export default function useFormulario () {
  const dispatch = useDispatch()
  const navigation = useNavigation()

  const { control, handleSubmit, formState: { isValid, errors }, setError } = useForm({
    mode: 'onTouched',
    defaultValues: {
      correo: '',
      contra: ''
    }
  })

  const onSubmit = (data) => {
    const usuario = USUARIOS.find(
      usuarioBuscar => usuarioBuscar.correo === data.correo && usuarioBuscar.contra === data.contra
    )
    if (usuario) {
      // Login exitoso
      dispatch(login({
        usuario: usuario.usuario,
        rol: usuario.rol,
        correo: usuario.correo
      }))
      navigation.navigate('MainApp')
    } else {
      Alert.alert(
        'Atención',
        'Usuario o contraseña Incorrecto',
        [
          {
            text: 'Aceptar',
            style: 'confirm'
          }
        ]
      )
      // Login inválido
      setError('correo', {
        type: 'manual',
        message: 'Revise el correo introducido'
      })
      setError('contra', {
        type: 'manual',
        message: 'Revise la contraseña introducida'
      })
    }
  }

  return {
    control,
    handleSubmit: handleSubmit(onSubmit),
    isValid,
    errors
  }
}
