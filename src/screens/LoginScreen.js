import { ImageBackground, Dimensions, StyleSheet } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view' 

import FormularioLogin from '../components/FormularioLogin'

const { height: screenHeight } = Dimensions.get('window')

export default function LoginScreen () {
  const estilosLogin = getEstilosLogin()

  return (
    <ImageBackground
      source={require('../../assets/apartament.jpg')}
      style={[estilosLogin.bg, { flex: 1 }]}
      imageStyle={estilosLogin.bgImage}
    >
      <KeyboardAwareScrollView
        style={{ flex: 1, width: '100%' }} 
        contentContainerStyle={{ 
          flexGrow: 1, 
          justifyContent: 'center', 
          alignItems: 'stretch', 
          padding: 20,
          minHeight: screenHeight 
        }}
        enableOnAndroid={true}
        extraScrollHeight={20} 
        keyboardShouldPersistTaps='handled' 
        showsVerticalScrollIndicator={false}
        bounces={false} 
      >
        <FormularioLogin />
      </KeyboardAwareScrollView>
    </ImageBackground>
  )
}

const getEstilosLogin = () => StyleSheet.create({
  bg: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  bgImage: {
    resizeMode: 'cover'
  }
})
