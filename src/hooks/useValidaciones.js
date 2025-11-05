import { CONTRA_REGEX, CORREO_REGEX } from '../utils/regex'

export default function useValidaciones () {
  const validaciones = {
    correo: {
      required: CORREO_REGEX.requerido,
      minLength: {
        value: CORREO_REGEX.limites.minimo,
        message: CORREO_REGEX.limites.mensaje_min
      },
      maxLength: {
        value: CORREO_REGEX.limites.maximo,
        message: CORREO_REGEX.limites.mensaje_max
      },
      pattern: {
        value: CORREO_REGEX.patron,
        message: CORREO_REGEX.mensaje
      }
    },

    contra: {
      required: CONTRA_REGEX.requerido,
      minLength: {
        value: CONTRA_REGEX.limites.minimo,
        message: CONTRA_REGEX.limites.mensaje_min
      },
      maxLength: {
        value: CONTRA_REGEX.limites.maximo,
        message: CONTRA_REGEX.limites.mensaje_max
      },
      pattern: {
        value: CONTRA_REGEX.patron,
        message: CONTRA_REGEX.mensaje
      }
    }
  }
  return validaciones
}
