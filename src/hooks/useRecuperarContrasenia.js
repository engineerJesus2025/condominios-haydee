import { useForm } from 'react-hook-form'

export default function useRecuperarContrasenia () {
  const { control, handleSubmit, formState: { isValid, errors } } = useForm({
    mode: 'onTouched',
    defaultValues: {
      correo: '',
      contra: ''
    }
  })

  return {
    control,
    handleSubmit,
    isValid,
    errors
  }
}
