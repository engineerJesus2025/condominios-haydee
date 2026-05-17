import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Alert } from 'react-native';
import { loginUsuario } from '../store/slices/usuarioSlice';
import { procesarErrorApi } from '../utils/gestorErroresUI';
import { HTTP_CODIGO } from '../utils/HttpCodigos';

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
    } catch (errorObj) {
      procesarErrorApi(errorObj, (status, mensaje) => {
        if (status === HTTP_CODIGO.BAD_REQUEST) {
          // Pintamos los inputs de rojo y le decimos al gestor global: "Yo me encargo"
          setError('correo', { type: 'manual', message: 'Credenciales incorrectas' });
          setError('contra', { type: 'manual', message: 'Credenciales incorrectas' });
          Alert.alert('Atención', mensaje);
          return true; 
        }
        return false; // Si es otro error (ej. Rate Limit 429), dejamos que el gestor global muestre el Alert
      });
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