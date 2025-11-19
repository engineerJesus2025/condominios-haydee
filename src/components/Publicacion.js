import { View, Text, Image } from 'react-native'

import { getEstilosPublicacion } from './../styles/components/estilosPublicacion'
import { useTema } from './../hooks/useTema'

export default function Publicacion ({ post }) {
  const { colores } = useTema()
  const estilosPublicacion = getEstilosPublicacion(colores)

  if (!post) {
    return null
  }

  return (
    <View style={estilosPublicacion.cardContainer}>
      {post.imagen
        ? (
          <Image
            source={{ uri: post.imagen }}
            style={estilosPublicacion.cardImage}
            onError={(e) => console.log('Error cargando imagen:', e.nativeEvent.error)}
          />
          )
        : (
          <View style={[estilosPublicacion.cardImage, estilosPublicacion.placeholderImage]}>
            <Text>Sin imagen</Text>
          </View>
          )}

      <View style={estilosPublicacion.cardContent}>
        <Text style={estilosPublicacion.cardTitle}>{post.titulo || 'Sin título'}</Text>
        <Text style={estilosPublicacion.cardDate}>{post.fecha || 'Fecha no disponible'}</Text>
        <Text style={estilosPublicacion.cardDescription} numberOfLines={3}>
          {post.descripcion || 'Sin descripción'}
        </Text>
      </View>
    </View>
  )
};
