import { View, Text, StyleSheet } from 'react-native';
import { TextInput } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/Ionicons';
import { Controller } from 'react-hook-form'
import { useTema } from './../hooks/useTema'

export default function InputModal ({ control, name, rules, icono, estilos, error, placeholder=''}) {
  const { colores } = useTema()
  const estilosInputModal = getEstilosInputModal(colores)

  return (
    <Controller
      control={control}
      rules={rules}
      render={({ field: { onChange, onBlur, value } }) => (
        <>
          <View style={estilosInputModal.inputContainer}>
            <Icon name={icono.nombre} size={20} color={error ? 'red' : icono.color} style={estilosInputModal.inputIcon} />
            <TextInput
              placeholder={placeholder}
              placeholderTextColor="#999"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              multiline
              maxLength={rules.maxLength.value}
              style={[
                estilosInputModal.input,
                error && estilosInputModal.inputError,
                {...estilos}
              ]}
            />
          </View>
            <View style={estilosInputModal.charCounterContainer}>
              <Icon name="ellipsis-horizontal" size={14} color="#95a5a6" />
              <Text style={estilosInputModal.charCounter}>
                {value?.length || 0}/{rules.maxLength.value}
              </Text>
            </View>
        </>
      )}
      name={name}
    />
  )
}

const getEstilosInputModal = (colores) => StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  inputIcon: {
    marginRight: 12,
    position: 'absolute',
    left: 15,
    zIndex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    paddingLeft: 50,
    borderRadius: 12,
    fontSize: 16,
    backgroundColor: colores.inputBackground,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    flex: 1,
    color: colores.text
  },
  inputError: {
    borderColor: '#e74c3c',
    borderWidth: 1.5,
  },
  charCounterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 1,
  },
  charCounter: {
    fontSize: 12,
    color: '#95a5a6',
    marginLeft: 4,
  },
})
/*

<InputModal control={control} name="" rules={validaciones.} icono={{nombre:'',color:''} estilos={estilosModalFormularioPublicaciones}} />
reader-outline
#95a5a6
"Describe tu publicación"
*/