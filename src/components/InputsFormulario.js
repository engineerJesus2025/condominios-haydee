import { StyleSheet } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'

import { Controller } from 'react-hook-form'
import { useState } from 'react'

export function InputFormulario ({ control, name, rules, ...props }) {
  const [focus, setFocus] = useState(false)
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (

        <TextInput
          {...props}
          onBlur={() => {
            onBlur()
            setFocus(false)
          }}
          onChangeText={onChange}
          value={value}
          onFocus={() => setFocus(true)}
          style={[
            estilosInputsFormulario.textInput,
            error && estilosInputsFormulario.textInputError,
            focus && estilosInputsFormulario.textInputFocused
          ]}
        />

      )}
    />
  )
}

const estilosInputsFormulario = StyleSheet.create({
  textInput: {
    flex: 1,
    fontSize: 18,
    color: '#222',
    padding: 8,
    paddingLeft: 13
  },

  textInputFocused: {
    borderColor: '#4361ee',
    backgroundColor: '#fff',
    shadowColor: '#4361ee',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2
  },

  textInputError: {
    borderColor: '#f72585',
    backgroundColor: '#fff5f5'
  }

})
