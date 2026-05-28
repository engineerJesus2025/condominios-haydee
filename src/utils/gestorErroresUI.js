import { Alert } from 'react-native';
import { HTTP_CODIGO } from './HttpCodigos';

export const procesarErrorApi = (errorObj, manejadorEspecificoFormulario = null) => {
  if (errorObj.tipo === 'SERVIDOR') {
    // El formulario quiere manejar este error de validación por su cuenta
    if (manejadorEspecificoFormulario) {
      const errorManejado = manejadorEspecificoFormulario(
        errorObj.status, 
        errorObj.mensaje, 
        errorObj.erroresFormulario 
      );
      if (errorManejado) return; 
    }

    switch (errorObj.status) {
      case HTTP_CODIGO.RATE_LIMIT: // 429
        Alert.alert('Bloqueo de Seguridad', errorObj.mensaje);
        break;

      case HTTP_CODIGO.NO_AUTORIZADO: // 401
        Alert.alert('Sesión expirada', 'Por favor, inicie sesión nuevamente.');
        break;

      case HTTP_CODIGO.PROHIBIDO: // 403
        Alert.alert(
          'Fallo de Integridad', 
          'No tiene los permisos requeridos para realizar esta acción'
        );
        break;

      case HTTP_CODIGO.BAD_REQUEST: // 400
        Alert.alert('Datos Inválidos', errorObj.mensaje);
        break;

      case HTTP_CODIGO.NO_ENCONTRADO: // 404
        Alert.alert(
          'Registro no encontrado', 
          errorObj.mensaje || 'El elemento que intenta consultar o modificar ya no existe en el sistema.'
        );
        break;

      default:
        Alert.alert('Error del Servidor', errorObj.mensaje || 'Operación fallida.');
    }
    
  } else if (errorObj.tipo === 'RED') {
    Alert.alert('Problema de conexión', errorObj.mensaje);
  } else {
    // Captura errores de JavaScript puro o fallos de descifrado locales lanzados con throw
    Alert.alert(
      'Fallo de Seguridad Local', 
      errorObj.mensaje || 'No se pudo verificar la firma de autenticidad de la respuesta.'
    );
  }
};