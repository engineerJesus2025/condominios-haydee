import {
  View, Text, TouchableOpacity,
  StyleSheet, Platform, Switch
} from 'react-native'

import React, { useState } from 'react'

import Icon from 'react-native-vector-icons/Ionicons'

import useFormulario from '../hooks/useFormulario'
import useValidaciones from '../hooks/useValidaciones'

import { InputFormulario } from './InputsFormulario'

export default function Formulario () {
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

      <View style={estilosFormulario.inputRow}>
        <Icon name='mail' size={26} color='#000' style={estilosFormulario.icon} />
        <InputFormulario
          name='correo'
          control={control}
          rules={validaciones.correo}
          placeholder='Correo'
          placeholderTextColor='#9AA0A6'
          style={estilosFormulario.input}
          keyboardType='email-address'
          autoCapitalize='none'
        />
      </View>
      {errors.correo && 
        (<View style={estilosFormulario.errorContainer}><Text style={estilosFormulario.errorText}>{errors.correo.message}</Text></View>)
      }

      <View style={estilosFormulario.inputRow}>
        <Icon name='lock-closed' size={26} color='#000' style={estilosFormulario.icon} />
        <InputFormulario
          name='contra'
          control={control}
          rules={validaciones.contra}
          placeholder='Contraseña'
          placeholderTextColor='#9AA0A6'
          style={estilosFormulario.input}
          keyboardType='email-address'
          autoCapitalize='none'
        />
      </View>
      {errors.contra && 
        (<View style={estilosFormulario.errorContainer}><Text style={estilosFormulario.errorText}>{errors.contra.message}</Text></View>)
      }

      <View style={estilosFormulario.rowBetween}>
        <View style={estilosFormulario.keepSession}>
          <Switch
            value={keepSession}
            onValueChange={setKeepSession}
            thumbColor={Platform.OS === 'android' ? (keepSession ? '#0A84FF' : '#fff') : undefined}
          />
          <Text style={estilosFormulario.keepText}>Mantener sesión</Text>
        </View>
      </View>
      <View style={estilosFormulario.rowBetween}>
        <TouchableOpacity activeOpacity={0.7}>
          <Text style={estilosFormulario.recover}>Recuperar Contraseña</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[estilosFormulario.button, botonDesabilitado && { opacity: 0.7 }]} activeOpacity={0.9}
        onPress={handleSubmit} disabled={botonDesabilitado}
      >
        <Text style={estilosFormulario.buttonText}>Ingresar <Icon name='send' size={26} color='#fff' style={{ fontSize: 15, marginLeft: 5 }} /></Text>

      </TouchableOpacity>
    </View>
  )
}

const estilosFormulario = StyleSheet.create({
  formContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 28,
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
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4
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
  errorContainer:{
    width:'auto',
    minHeight: 20,
    marginBottom: 6,
  }
})
