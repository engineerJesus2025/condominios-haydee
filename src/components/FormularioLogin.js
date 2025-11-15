import { View, Text, TouchableOpacity, Platform, Switch } from 'react-native'
import React, { useState } from 'react'
import Icon from 'react-native-vector-icons/Ionicons'

import { useSelector } from 'react-redux'

import useValidaciones from '../hooks/useValidaciones'
import useFormulario from '../hooks/useFormulario'
import { useTema } from './../hooks/useTema'

import { getEstilosFormularioLogin } from './../styles/components/estilosFormularioLogin'

import InputFormulario from './InputFormulario'
import ErrorFormulario from '../components/ErrorFormulario'
import CustomBoton from '../components/CustomBoton'

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

  const [keepSession, setKeepSession] = useState(false)

  return (
    <View style={estilosFormulario.formContainer}>
      <Text style={estilosFormulario.title}>Iniciar sesión</Text>

      <InputFormulario control={control} 
         name="correo" 
         rules={validaciones.correo} 
         icono={{nombre:'mail',color:'#000'}} 
         error={errors.correo} 
         placeholder="Correo"
         keyboardType='email-address'
         autoCapitalize='none'
       />
      <ErrorFormulario error={errors.correo}/>

      <InputFormulario control={control} 
        name="contra" 
        rules={validaciones.contra} 
        icono={{nombre:'lock-closed',color:'#000'}} 
        error={errors.contra} 
        placeholder="Contraseña"
        keyboardType='password'
        autoCapitalize='none'
      />
      
      <ErrorFormulario error={errors.contra}/> 

      <CustomBoton titulo="Ingresar" evento={handleSubmit} icono={{nombre:'send',color:'#fff'}} disabled={botonDesabilitado} estilos={estilosFormulario.button} fuente={18} />
    </View>
  )
}


export const getEstilasdosFormularioLogin = (colores) => StyleSheet.create({
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
})