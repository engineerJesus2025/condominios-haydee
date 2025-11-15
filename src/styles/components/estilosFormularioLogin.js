import { StyleSheet } from 'react-native'

export const getEstilosFormularioLogin = (colores) => StyleSheet.create({
  formContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 10,
    width: '90%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#222',
    marginBottom: 20,
    textAlign: 'center'
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#E3E6E9',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 10,
    backgroundColor: '#FAFAFB'
  },
  icon: {
    marginRight: 8,
    fontSize: 18
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#222'
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  keepSession: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  keepText: {
    marginLeft: 8,
    color: '#444',
    fontSize: 14
  },
  recover: {
    color: '#0A84FF',
    fontSize: 14,
    fontWeight: '600'
  },
  button: {
    backgroundColor: '#0A84FF',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    width:'100%'
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700'
  },
  errorText: {
    ...{ fontSize: 14 },
    color: '#f72585',
    marginLeft: 4,
    flex: 1
  },
  errorContainer: {
    width: 'auto',
    minHeight: 20,
    marginBottom: 6
  }
})
