import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

import useValidaciones from '../hooks/useValidaciones';
import useRecuperarContrasenia from '../hooks/useRecuperarContrasenia';
import { useTema } from '../hooks/useTema';

import ModalGeneral from './ModalGeneral';
import CampoFormulario from './CampoFormulario';
import CustomBoton from './CustomBoton';

const ModalRecuperarContrasena = ({ visible, onClose }) => {
  const { colores } = useTema();
  const validaciones = useValidaciones();

  // Inyectamos nuestro Hook Director
  const {
    control,
    errors,
    isValid,
    loading,
    paso,
    correoActual,
    handleCerrar,
    correoIngresado,
    onSubmitPaso1,
    onSubmitPaso2
  } = useRecuperarContrasenia(onClose);

  // Botones para el Paso 1: Pedir Correo
  const BotonesFooterPaso1 = (
    <>
      <CustomBoton
        titulo='Cancelar'
        evento={handleCerrar}
        icono={{ nombre: 'close', color: '#fff' }}
        estilos={{ backgroundColor: '#95a5a6' }}
        fuente={16}
        disabled={loading}
      />
      <CustomBoton
        titulo={loading ? 'Enviando...' : 'Enviar Código'}
        evento={onSubmitPaso1}
        icono={{ nombre: 'send', color: '#fff' }}
        disabled={!isValid || loading}
        estilos={{ backgroundColor: '#27ae60', opacity: (isValid && !loading) ? 1 : 0.6 }}
        fuente={16}
        loading={loading}
      />
    </>
  );

  // Botones para el Paso 2: Ingresar Código OTP y Nueva Clave
  const BotonesFooterPaso2 = (
    <>
      <CustomBoton
        titulo='Cancelar'
        evento={handleCerrar}
        icono={{ nombre: 'close', color: '#fff' }}
        estilos={{ backgroundColor: '#95a5a6' }}
        fuente={16}
        disabled={loading}
      />
      <CustomBoton
        titulo={loading ? 'Validando...' : 'Restablecer'}
        evento={onSubmitPaso2}
        icono={{ nombre: 'checkmark-circle-outline', color: '#fff' }}
        disabled={!isValid || loading}
        estilos={{ backgroundColor: '#27ae60', opacity: (isValid && !loading) ? 1 : 0.6 }}
        fuente={16}
        loading={loading}
      />
    </>
  );

  return (
    <ModalGeneral
      visible={visible}
      onClose={handleCerrar}
      titulo="Recuperar Contraseña"
      iconoHeader={{ name: 'key-outline', color: '#E1E1F7' }}
      footer={paso === 1 ? BotonesFooterPaso1 : BotonesFooterPaso2}
      esFormulario={true}
    >
      {paso === 1 ? (
        <View style={styles.pasoContainer}>
          <Text style={[styles.modalSubtitle, { color: colores.text }]}>
            Ingresa tu correo electrónico y te enviaremos un código de seguridad para restablecer tu contraseña.
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
            editable={!loading} 
          />
        </View>
      ) : (
        <View style={styles.pasoContainer}>
          <Text style={[styles.modalSubtitle, { color: colores.text }]}>
            Hemos enviado un código de 6 dígitos a <Text style={{ fontWeight: 'bold' }}>{correoIngresado}</Text>.
          </Text>
          
          <CampoFormulario
            tituloLabel='Código de Verificación'
            iconoLabel={{ nombre: 'keypad-outline', color: '#f39c12' }}
            control={control}
            name='codigo'
            rules={{ 
              required: { value: true, message: 'El código es obligatorio' },
              pattern: { value: /^\d{6}$/, message: 'Debe contener exactamente 6 números' }
            }}
            iconoInput={{ nombre: 'lock-closed', color: '#95a5a6' }}
            error={errors.codigo}
            placeholder='Ej: 123456'
            keyboardType='numeric'
            maxLength={6}
            editable={!loading}
          />

          <CampoFormulario
            tituloLabel='Nueva Contraseña'
            iconoLabel={{ nombre: 'lock-closed-outline', color: '#3498db' }}
            control={control}
            name='contra'
            rules={validaciones.contra}
            iconoInput={{ nombre: 'key', color: '#95a5a6' }}
            error={errors.contra}
            placeholder='Mínimo 5 caracteres'
            esPassword={true} 
            editable={!loading}
          />
        </View>
      )}
    </ModalGeneral>
  );
};

const styles = StyleSheet.create({
  pasoContainer: {
    paddingBottom: 10
  },
  modalSubtitle: { 
    fontSize: 15, 
    textAlign: 'center', 
    marginBottom: 22, 
    lineHeight: 22, 
    paddingHorizontal: 4 
  }
});

export default ModalRecuperarContrasena;