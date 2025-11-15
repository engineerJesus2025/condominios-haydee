import { TextInput } from 'react-native-gesture-handler'
import { Controller } from 'react-hook-form'
import { useState } from 'react'
import { useSelector } from 'react-redux'

import { useTema } from './../hooks/useTema'
import { getEstilosInputsFormulario } from './../styles/components/estilosInputsFormulario'

export function InputFormulario ({ control, name, rules, ...props }) {
  const { colores } = useTema()
  const estilosInputsFormulario = getEstilosInputsFormulario(colores)

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
