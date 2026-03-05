import { CONTRA_REGEX, CORREO_REGEX, TITULO_REGEX, DESCRIPCION_REGEX } from '../utils/regex';

export default function useValidaciones() {
  return {
    correo: {
      required: CORREO_REGEX.requerido,
      minLength: { value: CORREO_REGEX.limites.minimo, message: CORREO_REGEX.limites.mensaje_min },
      maxLength: { value: CORREO_REGEX.limites.maximo, message: CORREO_REGEX.limites.mensaje_max },
      pattern: { value: CORREO_REGEX.patron, message: CORREO_REGEX.mensaje }
    },
    contra: {
      required: CONTRA_REGEX.requerido,
      minLength: { value: CONTRA_REGEX.limites.minimo, message: CONTRA_REGEX.limites.mensaje_min },
      maxLength: { value: CONTRA_REGEX.limites.maximo, message: CONTRA_REGEX.limites.mensaje_max },
      pattern: { value: CONTRA_REGEX.patron, message: CONTRA_REGEX.mensaje }
    },
    tituloPublicacion: { 
      required: TITULO_REGEX.requerido,
      minLength: { value: TITULO_REGEX.limites.minimo, message: TITULO_REGEX.limites.mensaje_min },
      maxLength: { value: TITULO_REGEX.limites.maximo, message: TITULO_REGEX.limites.mensaje_max },
      pattern: { value: TITULO_REGEX.patron, message: TITULO_REGEX.mensaje }
    },
    descripcionPublicacion: {
      required: DESCRIPCION_REGEX.requerido,
      minLength: { value: DESCRIPCION_REGEX.limites.minimo, message: DESCRIPCION_REGEX.limites.mensaje_min },
      maxLength: { value: DESCRIPCION_REGEX.limites.maximo, message: DESCRIPCION_REGEX.limites.mensaje_max },
      pattern: { value: DESCRIPCION_REGEX.patron, message: DESCRIPCION_REGEX.mensaje }
    }
  };
}