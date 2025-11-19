import { View, Text, FlatList } from 'react-native'

import { getEstilosListaPublicaciones } from './../styles/components/estilosListaPublicaciones'
import { useTema } from './../hooks/useTema'
import Publicacion from '../components/Publicacion'

const ListaPublicaciones = ({ posts }) => {
  const { colores } = useTema()
  const estilosListaPublicaciones = getEstilosListaPublicaciones(colores)
  // Si no hay posts, muestra un mensaje
  if (!posts || posts.length === 0) {
    return (
      <View>
        <Text style={estilosListaPublicaciones.headerTitle}>Publicaciones Recientes</Text>
        <Text style={{ color: colores.text }}>No hay publicaciones disponibles.</Text>
      </View>
    )
  }

  return (
    <>
      <Text style={estilosListaPublicaciones.headerTitle}>Publicaciones Recientes</Text>
      <FlatList
        data={posts}
        renderItem={({ item }) => <Publicacion post={item} />}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={estilosListaPublicaciones.listContentContainer}
        ListEmptyComponent={<Text>No hay publicaciones para mostrar</Text>}
      />
    </>
  )
}

export default ListaPublicaciones
