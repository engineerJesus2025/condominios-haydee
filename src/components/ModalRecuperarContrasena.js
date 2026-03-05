import { View, Text, Modal, Alert, StyleSheet } from 'react-native'

import useValidaciones from '../hooks/useValidaciones'
import useRecuperarContrasenia from '../hooks/useRecuperarContrasenia'
import { useTema } from '../hooks/useTema'

import HeaderFormulario from './HeaderFormulario'
import LabelInput from './LabelInput'
import InputFormulario from './InputFormulario'
import ErrorFormulario from './ErrorFormulario'
import CustomBoton from './CustomBoton'

const ModalRecuperarContrasena = ({ visible, onClose }) => {
  const { colores } = useTema()
  const validaciones = useValidaciones()

  const {
    control,
    handleSubmit,
    errors,
    isValid
  } = useRecuperarContrasenia()

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
        <View style={estilos.modalView}>
          
          <HeaderFormulario
            titulo='Recuperar Contraseña'
            evento={handleCerrar}
            icono={{ name: 'key-outline', color: '#fff' }} // <-- Ícono blanco para que resalte
            noDark={false}
          />

          {/* NUEVO: Envolvemos el contenido en una vista con padding para que no afecte al Header */}
          <View style={{ padding: 20 }}>
            <Text style={estilos.modalSubtitle}>
              Ingresa tu correo electrónico y te enviaremos las instrucciones para restablecer tu contraseña.
            </Text>

            <LabelInput titulo='Correo Electrónico' icono={{ nombre: 'mail-outline', color: '#3498db' }} noDark={true} />
            <InputFormulario
              control={control}
              name='correo'
              rules={validaciones.correo}
              icono={{ nombre: 'mail', color: '#000' }}
              error={errors.correo}
              placeholder='Ejm: ejemplo@gmail.com'
              keyboardType='email-address'
              autoCapitalize='none'
              noDark={true}
            />
            <ErrorFormulario error={errors.correo} />

            <View style={estilos.modalButtons}>
              <CustomBoton
                titulo='Cancelar'
                evento={handleCerrar}
                icono={{ nombre: 'close', color: '#fff' }}
                estilos={{ ...estilos.modalButton, ...estilos.cancelButton }}
                fuente={16}
              />
              <CustomBoton
                titulo='Enviar Enlace'
                evento={handleEnviarEnlace}
                icono={{ nombre: 'send', color: '#fff' }}
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
      </View>
    </Modal>
  )
}

export default ModalRecuperarContrasena;

const getEstilosModalRecuperar = (colores) => StyleSheet.create({
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
    borderRadius: 12, // <-- 1. Esquinas redondeadas parejas
    overflow: 'hidden', // <-- 2. MAGIA: Corta cualquier cosa (como el Header) que intente salirse de las esquinas redondas
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
    color: '#666',
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
    paddingVertical: 12,
    alignItems: 'center'
  },
  cancelButton: {
    backgroundColor: '#95a5a6'
  },
  disabledButton: {
    backgroundColor: '#ccc'
  }
})