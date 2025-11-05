import { useNavigation } from '@react-navigation/native'

import { useForm } from 'react-hook-form'

export default function useFormulario () {
  const navigation = useNavigation()
  const { control, handleSubmit, formState: { isValid, errors } } = useForm({
    mode: 'onTouched',
    defaultValues: {
      correo: '',
      contra: ''
    }
  })

  const onSubmit = () => {
    navigation.navigate('MainApp')
  }

  return {
    control,
    handleSubmit: handleSubmit(onSubmit),
    isValid,
    errors
  }
}
