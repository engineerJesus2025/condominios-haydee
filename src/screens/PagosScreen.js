import { View, Text, TouchableOpacity } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import Icon from 'react-native-vector-icons/Ionicons'

import AppHeader from '../components/Header'
import TablaDinamica from '../components/TablaDinamica'
import ColumnaTabla from '../components/ColumnaTabla'
import Footer from '../components/Footer'
import BotonNuevoRegistro from '../components/BotonNuevoRegistro'

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

        <BotonNuevoRegistro titulo="Nuevo Pago" />

        <TablaDinamica
            datos={DATA_PAGOS}
            textoVacio='No hay pagos registrados'
            configuracionModal={{ //Este es para el modal de los detalles pago, gasto,etc
              titulo: "Detalles del Pago",
              campos: [
                { key: 'estado', label: 'Título' },
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
            <ColumnaTabla
              titulo='Estado'
              campo='estado'
              ancho={1}
              render={(valor) => {
                const isProcesado = valor.estado === 'Procesado'
                const isPendiente = valor.estado === 'Pendiente'
                const backgroundColor = isProcesado ? '#2ecc71' : isPendiente ? '#f1c40f' : '#6c757d'
                const textColor = isPendiente ? '#222' : '#fff'

                return (
                  <View style={[estilosPagos.statusBadge, { backgroundColor, paddingHorizontal: 7 }]}>
                    <Text style={[estilosPagos.statusText, { color: textColor, fontSize: 13 }]}>
                      {valor.estado}
                    </Text>
                  </View>
                )
              }}
            />
        </TablaDinamica>
      </View>

      <Footer />
    </>
  )
}
