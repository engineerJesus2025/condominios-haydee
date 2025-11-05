// styles/Formulario.styles.js
import { StyleSheet } from 'react-native'
import { estilosGlobales } from './estilos_globales'

export const estilosFormulario = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: estilosGlobales.colors.background,
    padding: estilosGlobales.spacing.md
  },

  formCard: {
    backgroundColor: estilosGlobales.colors.surface,
    borderRadius: estilosGlobales.borderRadius.lg,
    padding: estilosGlobales.spacing.lg,
    marginHorizontal: estilosGlobales.spacing.sm,
    ...estilosGlobales.shadows.lg,
    minHeight: 400 // Altura mínima para que se vea bien
  },

  header: {
    alignItems: 'center',
    marginBottom: estilosGlobales.spacing.xl,
    paddingBottom: estilosGlobales.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: estilosGlobales.colors.border
  },

  title: {
    ...estilosGlobales.typography.h1,
    color: estilosGlobales.colors.text.primary,
    textAlign: 'center',
    marginBottom: estilosGlobales.spacing.xs
  },

  subtitle: {
    ...estilosGlobales.typography.body,
    color: estilosGlobales.colors.text.secondary,
    textAlign: 'center'
  },

  fieldGroup: {
    marginBottom: estilosGlobales.spacing.xl
  },

  fieldLabel: {
    ...estilosGlobales.typography.h3,
    color: estilosGlobales.colors.text.primary,
    marginBottom: estilosGlobales.spacing.md,
    fontWeight: '600'
  },

  submitButton: {
    backgroundColor: estilosGlobales.colors.primary,
    padding: estilosGlobales.spacing.lg,
    borderRadius: estilosGlobales.borderRadius.md,
    alignItems: 'center',
    marginTop: estilosGlobales.spacing.md,
    ...estilosGlobales.shadows.md
  },

  submitButtonDisabled: {
    backgroundColor: estilosGlobales.colors.text.secondary,
    opacity: 0.6
  },

  submitButtonText: {
    ...estilosGlobales.typography.body,
    color: estilosGlobales.colors.text.inverse,
    fontWeight: '600',
    fontSize: 16
  },

  submitButtonTextDisabled: {
    color: estilosGlobales.colors.text.light
  }
})
