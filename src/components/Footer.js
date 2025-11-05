import { View, Text, StyleSheet } from 'react-native'

export default function Footer () {
  return (
    <View style={styles.footer}>
      <Text style={styles.footerText}>Junta de Condominios Edificio Haydee C.A.</Text>
    </View>
  )
}
const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#3939a9',
    paddingVertical: 12,
    alignItems: 'center'
  },
  footerText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600'
  }
})
