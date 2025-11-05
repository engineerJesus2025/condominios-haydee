// styles/HomePage.styles.js
import { StyleSheet } from 'react-native'

import { estilosGlobales } from './estilos_globales'

export const estilosEstadisticasHome = StyleSheet.create({
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: estilosGlobales.spacing.lg,
    padding: estilosGlobales.spacing.md,
    backgroundColor: estilosGlobales.colors.surface,
    borderRadius: estilosGlobales.borderRadius.md,
    ...estilosGlobales.shadows.sm
  },

  statItem: {
    alignItems: 'center'
  },

  statNumber: {
    ...estilosGlobales.typography.h2,
    color: estilosGlobales.colors.primary
  },

  statLabel: {
    ...estilosGlobales.typography.caption,
    color: estilosGlobales.colors.text.secondary
  }
})
