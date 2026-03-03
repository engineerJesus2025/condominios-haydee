import { View, Text } from 'react-native'

import AppHeader from '../components/Header'
// import TablaDinamica from '../components/TablaDinamica'
// import ColumnaTabla from '../components/ColumnaTabla'
import Footer from '../components/Footer'
import ModalFormularioPublicaciones from '../components/ModalFormularioPublicaciones'
import CustomBoton from '../components/CustomBoton'

import { getEstilosCarteleraVirtual } from '../styles/screens/estilosCarteleraVirtual'
import { useTema } from './../hooks/useTema'
import { useCarteleraVirtual } from '../hooks/useCarteleraVirtual'

export default function CarteleraVirtualScreen () {
  const { colores } = useTema()
  const estilosCarteleraVirtual = getEstilosCarteleraVirtual(colores)

  const {
    posts,
    modalVisible,
    modalEdicionVisible,
    publicacionSeleccionada,
    accionesUsuarios,
    abrirModalNuevaPublicacion,
    cerrarModalNuevaPublicacion,
    cerrarModalEdicion,
    handleGuardarEdicion
  } = useCarteleraVirtual()

  return (
    <>
      <AppHeader />

      <View style={estilosCarteleraVirtual.mainContentContainer}>
        <Text style={estilosCarteleraVirtual.title}>Cartelera Virtual</Text>

        <CustomBoton
          titulo='Nueva publicación'
          evento={abrirModalNuevaPublicacion}
        />


        {/* Modal para nueva publicación */}
        <ModalFormularioPublicaciones
          visible={modalVisible}
          onClose={cerrarModalNuevaPublicacion}
        />

        {/* Modal para editar publicación */}
        <ModalFormularioPublicaciones
          visible={modalEdicionVisible}
          onClose={cerrarModalEdicion}
          publicacionEditar={publicacionSeleccionada}
          onGuardar={handleGuardarEdicion}
        />
      </View>

      <Footer />
    </>
  )
}
