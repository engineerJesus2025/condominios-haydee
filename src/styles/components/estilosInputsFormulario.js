import { StyleSheet } from 'react-native'

export const getEstilosInputsFormulario = (colores) => StyleSheet.create({
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#222',
    padding: 12,
    paddingLeft: 0,
    borderWidth: 0,
    backgroundColor: 'transparent',
    minHeight: 40
  },

  textInputFocused: {
    backgroundColor: 'transparent'
  },
  textInputError: {
    backgroundColor: 'transparent',
    color: 'red'
  },
  errorText: {
    color: '#f72585',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
    fontWeight: '500'
  }
})
