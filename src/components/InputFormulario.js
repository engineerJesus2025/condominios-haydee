import { View, Text, StyleSheet } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/Ionicons'
import { Controller } from 'react-hook-form'
import { useTema } from './../hooks/useTema'

export default function InputFormulario ({ control, name, rules, icono, estilos, error, placeholder = '', noDark = false, inputRef, ...props }) {
  const { colores } = useTema()
  const estilosInputFormulario = getEstilosInputFormulario(colores,noDark)

  const maxLengthValue = rules?.maxLength?.value;

  return (
    <Controller
      control={control}
      rules={rules}
      render={({ field: { onChange, onBlur, value } }) => (
        <>
          <View style={estilosInputFormulario.inputContainer}>
            <Icon name={icono.nombre} size={20} color={error ? 'red' : icono.color} style={estilosInputFormulario.inputIcon} />
            <TextInput
              {...props}
              placeholder={placeholder}
              placeholderTextColor='#999'
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              multiline={props.multiline || false}
              ref={inputRef}
              maxLength={maxLengthValue}
              style={[
                estilosInputFormulario.input,
                error && estilosInputFormulario.inputError,
                { ...estilos }
              ]}
            />
          </View>
          
          {/* Solo dibuja el contador si el input tiene límite de caracteres */}
          {maxLengthValue && (
            <View style={[estilosInputFormulario.charCounterContainer, !error && { marginBottom: 15 }]}>
              <Icon name='ellipsis-horizontal' size={14} color='#95a5a6' />
              <Text style={estilosInputFormulario.charCounter}>
                {value?.length || 0}/{maxLengthValue}
              </Text>
            </View>
          )}
        </>
      )}
      name={name}
    />
  )
}

const getEstilosInputFormulario = (colores, noDark = false) => StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5
  },
  inputIcon: {
    marginRight: 12,
    position: 'absolute',
    left: 15,
    zIndex: 1
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    paddingLeft: 50,
    borderRadius: 12,
    fontSize: 16,
    backgroundColor: noDark ? '#ffffff' : colores.inputBackground,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    flex: 1,
    color: noDark ? '#2c3e50' : colores.text
  },
  inputError: {
    borderColor: '#e74c3c',
    borderWidth: 1.5
  },
  charCounterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 1
  },
  charCounter: {
    fontSize: 12,
    color: '#95a5a6',
    marginLeft: 4
  }
})
