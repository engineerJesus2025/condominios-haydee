import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
export default function ErrorFormulario ({ error, estilos }) {
  return (
    <>
    {error && (
      <View style={{...estilos.errorContainer}}>
        <Icon name="warning-outline" size={14} color="#e74c3c" />
        <Text style={{...estilos.errorText}}>
          {error.message}
        </Text>
      </View>
    )}
    </>
  )
}
