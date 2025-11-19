import { ImageBackground } from 'react-native'

import FormularioLogin from '../components/FormularioLogin'

import { getEstilosLogin } from './../styles/screens/estilosLogin'

export default function LoginScreen () {
  const estilosLogin = getEstilosLogin()

  return (
    <ImageBackground
      source={require('../../assets/apartament.jpg')}
      style={estilosLogin.bg}
      imageStyle={estilosLogin.bgImage}
    >
      <FormularioLogin />
    </ImageBackground>
  )
}
