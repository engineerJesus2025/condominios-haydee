import { View, Text, Image } from 'react-native'

import { getEstilosPublicacion } from './../styles/components/estilosPublicacion'
import { useTema } from './../hooks/useTema'
import { formatearFechaLegible, parseFechaDDMMYYYY } from '../utils/dateUtils';

export default function Publicacion ({ post }) {
  const { colores } = useTema()
  const estilosPublicacion = getEstilosPublicacion(colores)

  if (!post) {
    return null
  }

  const fechaLegible = formatearFechaLegible(parseFechaDDMMYYYY(post.fecha));

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
        <Text style={estilosPublicacion.cardDate}>{fechaLegible}</Text>
        <Text style={estilosPublicacion.cardDescription} numberOfLines={3}>
          {post.descripcion || 'Sin descripción'}
          {post.tipo || 'Sin tipo'}
        </Text>
      </View>
    </View>
  )
};
