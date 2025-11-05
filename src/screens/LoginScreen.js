import {
  View, ImageBackground, StyleSheet
} from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import Formulario from '../components/FormularioLogin'
import Footer from '../components/Footer'

export default function LoginScreen () {
  return (
    <SafeAreaProvider style={styles.container}>
      <ImageBackground
        source={require('../assets/apartament.jpg')}
        style={styles.bg}
        imageStyle={styles.bgImage}
      >
        <View style={styles.overlay} />

        <Formulario />

        <Footer />

      </ImageBackground>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  bg: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  bgImage: {
    resizeMode: 'cover'
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.18)'
  },
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
    marginBottom: 14
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#E3E6E9',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    backgroundColor: '#FAFAFB'
  },
  icon: {
    marginRight: 8,
    fontSize: 18
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#222',
    padding: 0
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
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#0A84FF',
    paddingVertical: 12,
    alignItems: 'center'
  },
  footerText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600'
  }
})
