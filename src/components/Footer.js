import { View, Text } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getEstilosFooter } from './../styles/components/estilosFooter'
import { useTema } from './../hooks/useTema'

export default function Footer () {
  const insets = useSafeAreaInsets();

  const { colores } = useTema()
  const estilosFooter = getEstilosFooter(colores)
  // console.log(insets)
  return (
  	<>
	    <View style={[estilosFooter.footer,{bottom:insets.bottom}]}>
	      <Text style={estilosFooter.footerText}>Junta de Condominios Edificio Haydee C.A.</Text>
	    </View>
	    <View style={{height:insets.bottom, backgroundColor:'#000'}} />
    </>
  )
}