import { View, Text, TouchableOpacity } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import Icon from 'react-native-vector-icons/Ionicons'

import AppHeader from '../components/Header'
import TablaDinamica from '../components/TablaDinamica'
import ColumnaTabla from '../components/ColumnaTabla'
import Footer from '../components/Footer'
import CustomBoton from '../components/CustomBoton'

import { getEstilosPagos } from '../styles/screens/estilosPagos'
import { useTema } from './../hooks/useTema'

import { DATA_PAGOS } from '../utils/constants' //Para simular registros

export default function PagosScreengetEstilosPagos () {
  const { colores } = useTema()
  const estilosPagos = getEstilosPagos(colores)
  return (
    <>
      <AppHeader />

      <View style={estilosPagos.mainContentContainer}>
        <Text style={estilosPagos.title}>Gestionar Pagos</Text>

        <CustomBoton titulo="Nuevo Pago" />

        <TablaDinamica
            datos={DATA_PAGOS}
            textoVacio='No hay pagos registrados'
            configuracionModal={{ //Este es para el modal de los detalles pago, gasto,etc
              titulo: "Detalles del Pago",
              campos: [
                { key: 'estado', label: 'Estado' },
                { key: 'fecha', label: 'Fecha del pago' },
                { key: 'monto', label: 'Monto' },
                { key: 'mensualidad', label: 'Mensualidad' },
                { key: 'apartamento', label: 'Apartamento' }
              ],
              mostrarImagen: false
            }}
        >
            <ColumnaTabla titulo='Monto' campo='monto' ancho={1} />
            <ColumnaTabla titulo='Mensualidad' campo='mensualidad' ancho={2} />
        </TablaDinamica>
      </View>

      <Footer />
    </>
  )
}
