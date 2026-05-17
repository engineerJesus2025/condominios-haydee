import { Alert } from 'react-native';
import { HTTP_CODIGO } from './HttpCodigos';

export const procesarErrorApi = (errorObj, manejadorEspecificoFormulario = null) => {
  if (errorObj.tipo === 'SERVIDOR') {
    console.log(errorObj)
    // El formulario quiere manejar este error HTTP por su cuenta
    if (manejadorEspecificoFormulario) {
      const errorManejado = manejadorEspecificoFormulario(errorObj.status, errorObj.mensaje);
      // Si el componente devolvió true, significa que pintó sus propios errores Cortamos ejecución.
      if (errorManejado) return; 
    }
    // console.log(errorObj)
    // COMPORTAMIENTO POR DEFECTO (Si el formulario no lo manejó, o no se pasó callback)
    switch (errorObj.status) {
      case HTTP_CODIGO.RATE_LIMIT:
        Alert.alert('Bloqueo de Seguridad', errorObj.mensaje);
        break;
      case HTTP_CODIGO.NO_AUTORIZADO:
        // En peticiones internas, un 401 significa Token Expirado. El interceptor cerrará sesión,
        // pero avisamos al usuario por qué la pantalla cambió de repente.
        Alert.alert('Sesión expirada', 'Por favor, inicie sesión nuevamente.');
        break;
      case HTTP_CODIGO.BAD_REQUEST:
        Alert.alert('Datos Inválidos', errorObj.mensaje);
        break;
      default:
        Alert.alert('Error del Servidor', errorObj.mensaje || 'Operación fallida.');
    }
    
  } else if (errorObj.tipo === 'RED') {
    Alert.alert('Problema de conexión', errorObj.mensaje);
  } else {
    Alert.alert('Error', 'Ha ocurrido un error inesperado.');
  }
};