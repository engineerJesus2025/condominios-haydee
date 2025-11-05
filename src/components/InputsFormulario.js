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
    fontSize: 16,
    color: '#222',
    padding: 12,
    paddingLeft: 0,
    borderWidth: 0,
    backgroundColor: 'transparent',
    minHeight: 40,
  },

  textInputFocused: {
    backgroundColor: 'transparent',
  },
  textInputError: {
    backgroundColor: 'transparent',
    color: 'red'
  },
  errorText: {
    color: '#f72585',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
    fontWeight: '500'
  }

})
