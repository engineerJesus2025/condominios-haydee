import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Alert } from 'react-native';
import { loginUsuario } from '../store/slices/usuarioSlice';

export default function useLogin() {
  const dispatch = useDispatch();
  const { loading, error: serverError } = useSelector(state => state.usuario);
  
  const { control, handleSubmit, formState: { isValid, errors }, setError } = useForm({
    mode: 'onTouched',
    defaultValues: { correo: '', contra: '' }
  });

  const onSubmit = async (data) => {
    try {
      const resultado = await dispatch(loginUsuario(data)).unwrap();
      // Si llega aquí, el login fue exitoso y el slice ya actualizó el estado
    } catch (error) {
      Alert.alert('Error de acceso', error);
      setError('correo', { type: 'manual', message: 'Verifique sus credenciales' });
      setError('contra', { type: 'manual', message: 'Verifique sus credenciales' });
    }
  };

  return { 
    control, 
    handleSubmit: handleSubmit(onSubmit), 
    isValid, 
    errors,
    loading // Para mostrar un spinner en el botón de ingresar
  };
}