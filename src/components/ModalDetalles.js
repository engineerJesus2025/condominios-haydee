import { Modal, View, Text, ScrollView, Image } from 'react-native'

import { useTema } from './../hooks/useTema'
import { getEstilosModalDetalles } from './../styles/components/estilosModalDetalles'
import CustomBoton from '../components/CustomBoton'
import DetalleRegistro from '../components/DetalleRegistro'

const ModalDetalles = ({
  visible,
  onClose,
  datos = {},
  titulo = 'Detalles',
  campos = [],
  mostrarImagen = true
}) => {
  const { colores } = useTema()
  const estilosModalDetalles = getEstilosModalDetalles(colores)

  if (!datos || Object.keys(datos).length === 0) { return }

  return (
    <Modal
      visible={visible}
      animationType='slide'
      transparent
      onRequestClose={onClose}
    >
      <View style={estilosModalDetalles.modalOverlay}>
        <View style={[estilosModalDetalles.modalContent, { backgroundColor: colores.card }]}>
          <Text style={[estilosModalDetalles.modalTitle]}>
            {titulo}
          </Text>

          <ScrollView style={estilosModalDetalles.detailsContainer}>
            {mostrarImagen && datos.imagen && (
              <Image source={{ uri: datos.imagen }} style={estilosModalDetalles.detailsImage} />
            )}

            <View style={estilosModalDetalles.detailsContent}>
              {campos.map((campo, index) => (
                <DetalleRegistro detalle={{ label: campo.label, dato: datos[campo.key] }} key={index} index={index} />
              ))}
            </View>
          </ScrollView>

          <CustomBoton titulo='Cerrar' evento={onClose} estilos={{ margin: 'auto' }} />
        </View>
      </View>
    </Modal>
  )
}

export default ModalDetalles
