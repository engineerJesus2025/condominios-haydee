import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Alert } from 'react-native';
import { DATA_USUARIOS } from '../utils/Data'; 
import { loginSuccess } from '../store/slices/usuarioSlice';

export default function useLogin() {
  const dispatch = useDispatch();
  
  const { control, handleSubmit, formState: { isValid, errors }, setError } = useForm({
    mode: 'onTouched',
    defaultValues: { correo: '', contra: '' }
  });

  const onSubmit = (data) => {
    const usuario = DATA_USUARIOS.find(
      (u) => u.correo === data.correo.toLowerCase() && u.contra === data.contra
    );

    if (usuario) {
      dispatch(loginSuccess({
        id: usuario.id,
        usuario: usuario.usuario,
        rol: usuario.rol,
        correo: usuario.correo
      }));
    } else {
      Alert.alert('Atención', 'Usuario o contraseña Incorrecto', [{ text: 'Aceptar', style: 'confirm' }]);
      setError('correo', { type: 'manual', message: 'Revise el correo introducido' });
      setError('contra', { type: 'manual', message: 'Revise la contraseña introducida' });
    }
  };

  return { control, handleSubmit: handleSubmit(onSubmit), isValid, errors };
}