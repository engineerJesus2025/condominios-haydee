import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import AppHeader from '../components/Header'

import Icon from 'react-native-vector-icons/Ionicons'

import TablaDinamica from '../components/TablaDinamica'
import ColumnaTabla from '../components/ColumnaTabla'

import Footer from '../components/Footer'

import { DATA_PAGOS } from '../utils/constants'

const accionesUsuarios = [
  {
    icon: Icon,
    iconName: 'eye',
    color: '#007BFF',
    onPress: (fila) => console.log('ver mas')
  },
  {
    icon: Icon,
    iconName: 'pencil',
    color: '#28A745',
    onPress: (fila) => console.log('Editar')
  },
  {
    icon: Icon,
    iconName: 'trash',
    color: '#DC3545',
    onPress: (fila) => console.log('Borrar')
  }
]

export default function PagosScreen () {
  return (
    <SafeAreaProvider style={estilosPagos.safe}>
      <AppHeader />

      <View style={estilosPagos.mainContentContainer}>
        <View style={estilosPagos.container}>
          <Text style={estilosPagos.title}>Gestionar Pagos</Text>

          <View style={estilosPagos.topRow}>
            <TouchableOpacity style={estilosPagos.primaryBtn} activeOpacity={0.8}>
              <Text style={estilosPagos.primaryBtnText}>Nuevo Pago</Text>
            </TouchableOpacity>
          </View>

          <TablaDinamica
            datos={DATA_PAGOS}
            acciones={accionesUsuarios}
            textoVacio='No hay usuarios registrados'
          >
            <ColumnaTabla titulo='Fecha' campo='fecha' ancho={1} />
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
            <ColumnaTabla titulo='Apartamento' campo='apartamento' ancho={1} />
          </TablaDinamica>

        </View>
      </View>

      <Footer />
    </SafeAreaProvider>
  )
}

const estilosPagos = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#4A556A',
    paddingTop: Platform.OS === 'android' ? 25 : 0
  },

  mainContentContainer: {
    flex: 1,
    backgroundColor: '#F4F7F6'
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#495057',
    marginBottom: 16,
    paddingHorizontal: 4
  },
  container: {
    flex: 1,
    padding: 14
  },
  topRow: { marginBottom: 12 },
  primaryBtn: {
    alignSelf: 'flex-start',
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 6,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 2
  },
  primaryBtnText: { color: '#fff', fontWeight: '700' },
  note: { color: '#DC3545', fontSize: 13, marginLeft: 4 },
  statusBadge: {
    paddingHorizontal: 2,
    paddingVertical: 6,
    borderRadius: 14,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  },
  statusText: {
    fontWeight: '700',
    fontSize: 14
  }
})
