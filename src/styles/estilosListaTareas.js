// styles/ListaTareas.styles.js
import { StyleSheet } from 'react-native'
import { estilosGlobales } from './estilos_globales'

export const estilosListaTareas = StyleSheet.create({
  container: {
    flex: 1
  },

  listContainer: {
    paddingBottom: estilosGlobales.spacing.xl
  },

  taskCard: {
    backgroundColor: estilosGlobales.colors.surface,
    borderRadius: estilosGlobales.borderRadius.lg,
    padding: estilosGlobales.spacing.md,
    marginBottom: estilosGlobales.spacing.md,
    borderLeftWidth: 4,
    ...estilosGlobales.shadows.md
  },

  taskCardCompleted: {
    borderLeftColor: estilosGlobales.colors.success,
    opacity: 0.8
  },

  taskCardPending: {
    borderLeftColor: estilosGlobales.colors.warning
  },

  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: estilosGlobales.spacing.sm
  },

  taskTitle: {
    ...estilosGlobales.typography.h3,
    color: estilosGlobales.colors.text.primary,
    flex: 1,
    marginRight: estilosGlobales.spacing.sm
  },

  taskStatus: {
    ...estilosGlobales.typography.caption,
    paddingHorizontal: estilosGlobales.spacing.sm,
    paddingVertical: estilosGlobales.spacing.xs,
    borderRadius: estilosGlobales.borderRadius.round,
    fontWeight: '600',
    textTransform: 'uppercase'
  },

  statusCompleted: {
    backgroundColor: estilosGlobales.colors.success + '20',
    color: estilosGlobales.colors.success
  },

  statusPending: {
    backgroundColor: estilosGlobales.colors.warning + '20',
    color: estilosGlobales.colors.warning
  },

  statusText: {
    ...estilosGlobales.typography.body,
    fontWeight: '600',
    textAlign: 'center',
    color: estilosGlobales.colors.text.primary
  },

  taskDescription: {
    ...estilosGlobales.typography.body,
    color: estilosGlobales.colors.text.secondary,
    marginBottom: estilosGlobales.spacing.md,
    lineHeight: 20
  },

  taskActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: estilosGlobales.spacing.sm
  },

  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: estilosGlobales.spacing.xl,
    backgroundColor: estilosGlobales.colors.surfaceVariant,
    borderRadius: estilosGlobales.borderRadius.lg,
    marginTop: estilosGlobales.spacing.xl
  },

  emptyStateText: {
    ...estilosGlobales.typography.h3,
    color: estilosGlobales.colors.text.secondary,
    textAlign: 'center',
    marginBottom: estilosGlobales.spacing.sm
  }
})
