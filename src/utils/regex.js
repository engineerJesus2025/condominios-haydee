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

export const TITULO_REGEX = {
  patron: /^[A-Za-zÁÉÍÓÚáéíóúñÑ0-9.,\- ]{3,50}$/,
  mensaje: 'Solo letras, números, espacios y signos de puntuación comunes',
  limites: {
    minimo: 3,
    maximo: 50,
    mensaje_min: 'El titulo debe tener mínimo 3 caracteres',
    mensaje_max: 'El título no puede tener más de 50 caracteres'
  },
  requerido: {
    value: true,
    message: 'El Titulo es requerido'
  }
}

export const DESCRIPCION_REGEX = {
  patron: /^[A-Za-zÁÉÍÓÚáéíóúñÑ0-9.,\- ]{5,100}$/,
  mensaje: 'Solo letras, números, espacios y signos de puntuación comunes',
  limites: {
    minimo: 5,
    maximo: 500,
    mensaje_min: 'La descripción debe tener mínimo 5 caracteres',
    mensaje_max: 'La descripción no puede tener más de 500 caracteres'
  },
  requerido: {
    value: true,
    message: 'Contraseña requerida'
  }
}
