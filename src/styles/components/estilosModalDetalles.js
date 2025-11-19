import { StyleSheet } from 'react-native'

export const getEstilosModalDetalles = (colores) => StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  modalContent: {
    width: '90%',
    maxHeight: '90%',
    borderRadius: 12,
    padding: 15,
    elevation: 5,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: colores.text
  },

  detailsContainer: {
    padding: 0,
    borderRadius: 10
  },
  detailsImage: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    marginBottom: 16,
    resizeMode: 'cover'
  },
  detailsContent: {
    paddingBottom: 20 // Espacio al final del scroll
  }
})
