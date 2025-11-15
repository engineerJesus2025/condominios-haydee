import { StyleSheet } from 'react-native'

export const getEstilosModalFormularioPublicaciones = (colores) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colores.background,
  },
  formContent: {
    flex: 1,
    padding: 20,
  },

  textArea: {
    textAlignVertical: 'top',
    height: 120,
  },
  imageButtonsContainer: {
    flexDirection: 'row',
    marginBottom: 1,
    gap: 20
  },
  imageButton: {
    backgroundColor: colores.backgroundBotones,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: 8,
  },
  removeButton: {
    backgroundColor: '#e74c3c',
    flex: 0.5,
  },
  removeButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  spacer: {
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    paddingBottom:8,
    backgroundColor: colores.backgroundBotones,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    gap: 12,
  },
  button: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    flexDirection: 'row',
    marginBottom:0
  },
  cancelButton: {
    backgroundColor: '#95a5a6',
  },
  submitButton: {
    backgroundColor: '#27ae60',
  },
  disabledButton: {
    opacity: 0.6,
  }
});