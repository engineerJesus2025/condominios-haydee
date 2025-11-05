// styles/HomePage.styles.js
import { StyleSheet } from 'react-native'
import { estilosGlobales } from './estilos_globales'

export const estilosHeader = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: estilosGlobales.spacing.lg,
    paddingHorizontal: estilosGlobales.spacing.sm
  },

  title: {
    ...estilosGlobales.typography.h1,
    color: estilosGlobales.colors.text.primary
  },

  addButton: {
    backgroundColor: estilosGlobales.colors.primary,
    paddingHorizontal: estilosGlobales.spacing.lg,
    paddingVertical: estilosGlobales.spacing.sm,
    borderRadius: estilosGlobales.borderRadius.round,
    ...estilosGlobales.shadows.md
  },

  addButtonText: {
    ...estilosGlobales.typography.body,
    color: estilosGlobales.colors.text.inverse,
    fontWeight: '600'
  }
})
