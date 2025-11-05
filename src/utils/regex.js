/**
 * Expresiones regulares para validaciones
 */

export const CORREO_REGEX = {
  patron: /^[a-zA-Z0-9._+-]{3,35}@([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/,
  mensaje: 'ejemplo@gmail.com',
  limites: {
    minimo: 3,
    maximo: 40,
    mensaje_min: 'Al menos 3 caracteres',
    mensaje_max: 'Maximo 40 caracteres'
  },
  requerido: {
    value: true,
    message: 'El correo es obligatorio'
  }
}

export const CONTRA_REGEX = {
  patron: /^[A-Za-z0-9_.+*$#%&@]{5,50}$/,
  mensaje: 'Solo letras, números, espacios y signos de puntuación comunes',
  limites: {
    minimo: 5,
    maximo: 50,
    mensaje_min: 'La contraseña debe tener mínimo 5 caracteres',
    mensaje_max: 'Maximo 50 caracteres'
  },
  requerido: {
    value: true,
    message: 'Contraseña requerida'
  }
}
