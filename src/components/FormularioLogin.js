import { View, Text } from 'react-native'
import React, { useState } from 'react'

import useValidaciones from '../hooks/useValidaciones'
import useFormulario from '../hooks/useFormulario'
import { useTema } from './../hooks/useTema'

import { getEstilosFormularioLogin } from './../styles/components/estilosFormularioLogin'

import InputFormulario from './InputFormulario'
import ErrorFormulario from '../components/ErrorFormulario'
import CustomBoton from '../components/CustomBoton'
import LabelInput from '../components/LabelInput'
import BotonRecuperarContra from '../components/BotonRecuperarContra'
import ModalRecuperarContrasena from './ModalRecuperarContrasena'

export default function Formulario () {
  const { colores } = useTema()
  const estilosFormulario = getEstilosFormularioLogin(colores)

  const {
    control,
    handleSubmit,
    isValid,
    errors
  } = useFormulario()
  const validaciones = useValidaciones()

  const botonDesabilitado = !isValid
  const [modalRecuperarVisible, setModalRecuperarVisible] = useState(false)

  return (
    <View style={estilosFormulario.formContainer}>
      <Text style={estilosFormulario.title}>Iniciar sesión</Text>

      <LabelInput titulo='Correo Electrónico' icono={{ nombre: 'mail-outline', color: '#3498db' }} />
      <InputFormulario
        control={control}
        name='correo'
        rules={validaciones.correo}
        icono={{ nombre: 'mail', color: '#000' }}
        error={errors.correo}
        placeholder='Ejm: ejemplo@gmail.com'
        keyboardType='email-address'
        autoCapitalize='none'
      />
      <ErrorFormulario error={errors.correo} />

      <LabelInput titulo='Contraseña' icono={{ nombre: 'lock-closed-outline', color: '#3498db' }} />
      <InputFormulario
        control={control}
        name='contra'
        rules={validaciones.contra}
        icono={{ nombre: 'lock-closed', color: '#000' }}
        error={errors.contra}
        placeholder='Ejm: 12345'
        keyboardType='password'
        autoCapitalize='none'
      />

      <ErrorFormulario error={errors.contra} />

      {/* Enlace para recuperar contraseña */}
      <BotonRecuperarContra
        titulo='¿Olvidaste tu contraseña?'
        evento={() => setModalRecuperarVisible(true)}
        fuente={16}
      />

      <CustomBoton
        titulo='Ingresar'
        evento={handleSubmit}
        icono={{ nombre: 'send', color: '#fff' }}
        disabled={botonDesabilitado}
        estilos={estilosFormulario.button}
        fuente={18}
      />

      {/* Modal para recuperar contraseña */}
      <ModalRecuperarContrasena
        visible={modalRecuperarVisible}
        onClose={() => setModalRecuperarVisible(false)}
      />
    </View>
  )
}
