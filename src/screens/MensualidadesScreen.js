import { View, Text, TouchableOpacity } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import Icon from 'react-native-vector-icons/Ionicons'

import AppHeader from '../components/Header'
import TablaDinamica from '../components/TablaDinamica'
import ColumnaTabla from '../components/ColumnaTabla'
import Footer from '../components/Footer'
import BotonNuevoRegistro from '../components/BotonNuevoRegistro'

import { getEstilosMensualidades } from '../styles/screens/estilosMensualidades'
import { useTema } from './../hooks/useTema'

import { DATA } from '../utils/constants' //Para simular registros

export default function MensualidadesScreen () {
  const { colores } = useTema()
  const estilosMensualidad = getEstilosMensualidades(colores)
  return (
    <>
      <AppHeader />

      <View style={estilosMensualidad.mainContentContainer}>
          <Text style={estilosMensualidad.title}>MENSUALIDAD</Text>
          <BotonNuevoRegistro titulo="Nueva Mensualidad" />

          <TablaDinamica
            datos={DATA}
            textoVacio='No hay mensualidades registradas'
            configuracionModal={{ //Este es para el modal de los detalles pago, gasto,etc
              titulo: "Detalles de la Mensualidad",
              campos: [
                { key: 'fecha', label: 'Fecha' },
                { key: 'total', label: 'Total' },
                { key: 'restante', label: 'Restante' }
              ],
              mostrarImagen: false
            }}
          >
            <ColumnaTabla titulo='Mes/año' campo='fecha' ancho={1} />
            <ColumnaTabla titulo='Total' campo='total' ancho={1} />
          </TablaDinamica>
      </View>

      <Footer />
    </>
  )
}
