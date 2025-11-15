import { View, Text } from 'react-native'
import { useSelector } from 'react-redux';

import AppHeader from '../components/Header'
import ColumnaTabla from '../components/ColumnaTabla'
import Footer from '../components/Footer'
import ListaPublicaciones from '../components/ListaPublicaciones'

import { getEstilosInicio } from '../styles/screens/estilosInicio'

import { useTema } from './../hooks/useTema'

export default function InicioScreen () {
  const posts = useSelector(state => state.publicaciones.publicacion);

  const { colores } = useTema()
  const estilosInicio = getEstilosInicio(colores)

  return (
    <>
      <AppHeader />
      <View style={estilosInicio.mainContentContainer}>
          <Text style={estilosInicio.title}>Inicio</Text>
          <ListaPublicaciones posts={posts} />
      </View>

      <Footer />
    </>
  )
}
