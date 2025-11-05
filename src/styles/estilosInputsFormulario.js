// styles/InputsFormulario.styles.js
import { StyleSheet } from 'react-native'
import { estilosGlobales } from './estilos_globales'

export const estilosInputsFormulario = StyleSheet.create({
  inputContainer: {
    marginBottom: estilosGlobales.spacing.lg
  },

  label: {
    ...estilosGlobales.typography.body,
    color: estilosGlobales.colors.text.primary,
    marginBottom: estilosGlobales.spacing.sm,
    fontWeight: '600'
  },

  textInput: {
    borderWidth: 2,
    borderColor: estilosGlobales.colors.border,
    borderRadius: estilosGlobales.borderRadius.md,
    paddingHorizontal: estilosGlobales.spacing.md,
    paddingVertical: estilosGlobales.spacing.sm,
    fontSize: 16,
    backgroundColor: estilosGlobales.colors.surface,
    minHeight: 50, // Altura mínima consistente
    textAlignVertical: 'top' // Para inputs multilínea
  },

  textInputFocused: {
    borderColor: estilosGlobales.colors.primary,
    backgroundColor: estilosGlobales.colors.surface,
    shadowColor: estilosGlobales.colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2
  },

  textInputError: {
    borderColor: estilosGlobales.colors.danger,
    backgroundColor: '#fff5f5'
  },

  errorText: {
    ...estilosGlobales.typography.caption,
    color: estilosGlobales.colors.danger,
    marginLeft: estilosGlobales.spacing.xs,
    flex: 1
  },

  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: estilosGlobales.spacing.lg,
    padding: estilosGlobales.spacing.md,
    backgroundColor: estilosGlobales.colors.surfaceVariant,
    borderRadius: estilosGlobales.borderRadius.md,
    borderWidth: 1,
    borderColor: 'transparent'
  },

  checkboxLabel: {
    ...estilosGlobales.typography.body,
    color: estilosGlobales.colors.text.primary,
    marginLeft: estilosGlobales.spacing.md,
    flex: 1,
    fontWeight: '500'
  }
})
