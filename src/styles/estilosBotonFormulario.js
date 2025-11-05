// styles/BotonFormulario.styles.js
import { StyleSheet } from 'react-native'
import { estilosGlobales } from './estilos_globales'

export const estilosBotonFormulario = StyleSheet.create({
  button: {
    paddingHorizontal: estilosGlobales.spacing.md,
    paddingVertical: estilosGlobales.spacing.sm,
    borderRadius: estilosGlobales.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
    ...estilosGlobales.shadows.sm
  },

  // Variantes de tamaño
  small: {
    paddingHorizontal: estilosGlobales.spacing.sm,
    paddingVertical: estilosGlobales.spacing.xs,
    minWidth: 60
  },

  large: {
    paddingHorizontal: estilosGlobales.spacing.lg,
    paddingVertical: estilosGlobales.spacing.md,
    minWidth: 100
  },

  // Variantes de color
  primary: {
    backgroundColor: estilosGlobales.colors.primary
  },

  secondary: {
    backgroundColor: estilosGlobales.colors.secondary
  },

  danger: {
    backgroundColor: estilosGlobales.colors.danger
  },

  success: {
    backgroundColor: estilosGlobales.colors.success
  },

  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: estilosGlobales.colors.primary
  },

  // Estados
  disabled: {
    opacity: 0.5
  },

  // Texto del botón
  buttonText: {
    ...estilosGlobales.typography.body,
    fontWeight: '600',
    textAlign: 'center'
  },

  buttonTextPrimary: {
    color: estilosGlobales.colors.text.inverse
  },

  buttonTextOutline: {
    color: estilosGlobales.colors.primary
  },

  buttonTextDisabled: {
    color: estilosGlobales.colors.text.secondary
  }
})
