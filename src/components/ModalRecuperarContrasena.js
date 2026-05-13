import React from 'react';
import { Text, Alert, StyleSheet } from 'react-native';

import useValidaciones from '../hooks/useValidaciones';
import useRecuperarContrasenia from '../hooks/useRecuperarContrasenia';
import { useTema } from '../hooks/useTema';

import ModalGeneral from './ModalGeneral';
import CampoFormulario from './CampoFormulario';
import CustomBoton from './CustomBoton';

const ModalRecuperarContrasena = ({ visible, onClose }) => {
  const { colores } = useTema();
  const validaciones = useValidaciones();

  const {
    control,
    handleSubmit,
    errors,
    isValid
  } = useRecuperarContrasenia();

  const handleCerrar = () => {
    onClose();
  };

  const onSubmitRecuperar = (data) => {
    console.log('Correo para recuperar contraseña:', data.correo);

    Alert.alert(
      'Atención',
      'Se ha enviado un enlace de recuperación a su correo electrónico.',
      [{ text: 'OK', onPress: handleCerrar }]
    );
  };

  // Botones estandarizados para el Footer
  const BotonesFooter = (
    <>
      <CustomBoton
        titulo='Cancelar'
        evento={handleCerrar}
        icono={{ nombre: 'close', color: '#fff' }}
        estilos={{ backgroundColor: '#95a5a6'}}
        fuente={16}
      />
      <CustomBoton
        titulo='Enviar Enlace'
        evento={handleSubmit(onSubmitRecuperar)}
        icono={{ nombre: 'send', color: '#fff' }}
        disabled={!isValid}
        estilos={{ backgroundColor: '#27ae60', opacity: isValid ? 1 : 0.6 }}
        fuente={16}
      />
    </>
  );

  return (
    <ModalGeneral
      visible={visible}
      onClose={handleCerrar}
      titulo="Recuperar Contraseña"
      iconoHeader={{ name: 'key-outline', color: '#E1E1F7' }}
      footer={BotonesFooter}
      esFormulario={true}
    >
      
      <Text style={[styles.modalSubtitle, { color: colores.text }]}>
        Ingresa tu correo electrónico y te enviaremos las instrucciones para restablecer tu contraseña.
      </Text>

      <CampoFormulario
        tituloLabel='Correo Electrónico'
        iconoLabel={{ nombre: 'mail-outline', color: '#3498db' }}
        control={control}
        name='correo'
        rules={validaciones.correo}
        iconoInput={{ nombre: 'mail', color: '#95a5a6' }}
        error={errors.correo}
        placeholder='Ejm: ejemplo@gmail.com'
        keyboardType='email-address'
        autoCapitalize='none'
      />

    </ModalGeneral>
  );
};

export default ModalRecuperarContrasena;

const styles = StyleSheet.create({
  modalSubtitle: {
    fontSize: 15,
    textAlign: 'left',
    marginBottom: 25,
    marginTop: 10,
    lineHeight: 22
  }
});