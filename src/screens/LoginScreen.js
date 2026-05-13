import { useState, useEffect } from 'react'; 
import { ImageBackground, Dimensions, StyleSheet } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view' 

import FormularioLogin from '../components/FormularioLogin'
import clienteApi from '../utils/clienteApi';
import { criptografiaMovil } from '../utils/criptografiaMovil';

const { height: screenHeight } = Dimensions.get('window')

export default function LoginScreen () {
  const estilosLogin = getEstilosLogin()
  
  // Estado para saber si el Handshake terminó
  const [llaveLista, setLlaveLista] = useState(false);

  // EL PRE-CÓMPUTO SILENCIOSO AL ABRIR LA APP
  useEffect(() => {
    const obtenerLlavePublica = async () => {
      try {
        const respuesta = await clienteApi.get('', { params: { endpoint: 'handshake' } });
        if (respuesta.data.estatus) {
          criptografiaMovil.setLlavePublica(respuesta.data.public_key);
          setLlaveLista(true); 
          console.log("Canal criptográfico preparado.");
        }
      } catch (error) {
        console.error("Error al establecer Handshake:", error);
      }
    };

    obtenerLlavePublica();
  }, []);

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
        {/* Pasamos la variable para bloquear el botón si la llave no ha llegado */}
        <FormularioLogin botonBloqueadoPorSeguridad={!llaveLista} />
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