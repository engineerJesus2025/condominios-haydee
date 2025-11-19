import { View, Text, Modal, Alert } from 'react-native'

import useValidaciones from '../hooks/useValidaciones'
import useFormularioRecuperar from '../hooks/useFormularioRecuperar'
import { useTema } from './../hooks/useTema'

import HeaderFormulario from '../components/HeaderFormulario'
import LabelInput from '../components/LabelInput'
import InputFormulario from './InputFormulario'
import ErrorFormulario from './ErrorFormulario'
import CustomBoton from './CustomBoton'

const ModalRecuperarContrasena = ({ visible, onClose }) => {
  const { colores } = useTema()
  const validaciones = useValidaciones()

  // Formulario para recuperar contraseña
  const {
    control,
    handleSubmit,
    errors,
    isValid
  } = useFormularioRecuperar()

  const handleCerrar = () => {
    onClose()
  }

  const onSubmitRecuperar = (data) => {
    console.log('Correo para recuperar contraseña:', data.correo)

    Alert.alert(
      'Atención',
      'Se ha enviado un enlace de recuperación a su correo electrónico.',
      [{ text: 'OK', onPress: handleCerrar }]
    )
  }

  const handleEnviarEnlace = () => {
    handleSubmit(onSubmitRecuperar)()
  }

  const estilos = getEstilosModalRecuperar(colores)

  return (
    <Modal
      animationType='fade'
      transparent
      visible={visible}
      onRequestClose={handleCerrar}
    >
      <View style={estilos.centeredView}>

        {/* Header del Modal */}
        <HeaderFormulario
          titulo='Recuperar Contraseña'
          evento={handleCerrar}
          icono={{ name: 'key-outline', color: '#E1E1F7' }} estilos={{ borderTopLeftRadius: 10, borderTopRightRadius: 10 }}
        />

        <View style={estilos.modalView}>
          {/* Contenido del Modal */}
          <Text style={estilos.modalSubtitle}>
            Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
          </Text>

          <LabelInput titulo='Correo Electrónico' icono={{ nombre: 'pricetag-outline', color: '#3498db' }} />
          <InputFormulario
            control={control}
            name='correo'
            rules={validaciones.correo}
            icono={{ nombre: 'mail-outline', color: colores.primario }}
            error={errors.correo}
            placeholder='Ejm: ejemplo@gmail.com'
            keyboardType='email-address'
            autoCapitalize='none'
            autoComplete='email'
          />
          <ErrorFormulario error={errors.correo} />

          {/* Botones de acción */}
          <View style={estilos.modalButtons}>

            <CustomBoton
              titulo='Cancelar'
              evento={handleCerrar}
              icono={{ nombre: 'close-circle-outline', color: 'ffffff' }}
              estilos={{
                ...(estilos.modalButton),
                ...(estilos.modalButtonCancel)
              }}
              fuente={16}
            />

            <CustomBoton
              titulo='Enviar Enlace'
              evento={handleEnviarEnlace}
              icono={{ nombre: 'send-outline', color: '#fff' }}
              disabled={!isValid}
              estilos={{
                ...(estilos.modalButton),
                ...(!isValid && estilos.disabledButton)
              }}
              fuente={16}
            />
          </View>

        </View>
      </View>
    </Modal>
  )
}

// Estilos para el modal
const getEstilosModalRecuperar = (colores) => ({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 20,
    paddingVertical: 0
  },
  modalView: {
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    padding: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalSubtitle: {
    fontSize: 14,
    color: colores.textoSecundario || '#666',
    textAlign: 'left',
    marginBottom: 20,
    lineHeight: 20
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    gap: 10
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: colores.primario || '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    minHeight: 50
  },
  modalButtonCancel: {
    backgroundColor: colores.peligro || '#FF3B30',
    flex: 0.8
  },
  disabledButton: {
    opacity: 0.6
  }
})

export default ModalRecuperarContrasena
