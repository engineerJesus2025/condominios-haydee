import { View, ImageBackground } from 'react-native'

import Formulario from '../components/FormularioLogin'
import Footer from '../components/Footer'

import { getEstilosLogin } from './../styles/screens/estilosLogin'

export default function LoginScreen () {
  const estilosLogin = getEstilosLogin()

  return (
      <ImageBackground
        source={require('../assets/apartament.jpg')}
        style={estilosLogin.bg}
        imageStyle={estilosLogin.bgImage}
      >
        <Formulario />
        <Footer />
      </ImageBackground>
  )
}
