import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Alert } from 'react-native';
import clienteApi from '../utils/clienteApi';
import { procesarErrorApi } from '../utils/gestorErroresUI';

export default function useRecuperarContrasenia(onClose) {
  const [paso, setPaso] = useState(1);
  const [loading, setLoading] = useState(false);
  const [correoIngresado, setcorreoIngresado] = useState('');

  const { control, handleSubmit, formState: { isValid, errors }, reset, watch } = useForm({
    mode: 'onChange',
    defaultValues: {
      correo: '',
      codigo: '',
      contra: ''
    }
  });

  const correoActual = watch('correo');

  // Acción del Paso 1
  const solicitarCodigo = async (data) => {
    setLoading(true);
    try {
      const respuesta = await clienteApi.post('', { correo: data.correo, operacion: 'solicitar_otp'}, {
        params: { endpoint: 'recuperar' }
      });
      
      if (respuesta.data.estatus) {
        setPaso(2); 
        setcorreoIngresado(data.correo);
      }
    } catch (error) {
      procesarErrorApi(error);
    } finally {
      setLoading(false);
    }
  };

  // Acción del Paso 2
  const restablecerContrasenia = async (data) => {
    setLoading(true);
    try {
      const respuesta = await clienteApi.post('', { 
        correo: correoIngresado, 
        codigo: data.codigo,
        contra: data.contra, 
        operacion: 'restablecer_con_otp'
      }, {
        params: { endpoint: 'recuperar'}
      });
      
      if (respuesta.data.estatus) {
        Alert.alert("¡Éxito!", "Tu contraseña ha sido actualizada correctamente.", [
          { text: "Ingresar", onPress: () => handleCerrar() }
        ]);
      }
    } catch (error) {
      procesarErrorApi(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCerrar = () => {
    reset();
    setPaso(1);
    onClose();
  };

  return {
    control,
    errors,
    isValid,
    loading,
    paso,
    correoActual,
    handleCerrar,
    correoIngresado,
    onSubmitPaso1: handleSubmit(solicitarCodigo),
    onSubmitPaso2: handleSubmit(restablecerContrasenia)
  };
}