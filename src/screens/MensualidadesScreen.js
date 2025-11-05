import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import AppHeader from '../components/Header'

import Icon from 'react-native-vector-icons/Ionicons'

import TablaDinamica from '../components/TablaDinamica'
import ColumnaTabla from '../components/ColumnaTabla'

import Footer from '../components/Footer'

import { DATA } from '../utils/constants'

const accionesUsuarios = [
  {
    icon: Icon,
    iconName: 'eye',
    color: '#007BFF',
    onPress: (fila) => console.log('ver mas')
  },
  {
    icon: Icon,
    iconName: 'receipt-outline',
    color: '#6f42c1',
    onPress: (fila) => console.log('reporte')
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

export default function MensualidadesScreen () {
  return (
    <SafeAreaProvider style={estilosMensualidad.safe}>
      <AppHeader />

      <View style={estilosMensualidad.mainContentContainer}>
        <View style={estilosMensualidad.container}>
          <Text style={estilosMensualidad.title}>MENSUALIDAD</Text>

          <View style={estilosMensualidad.topRow}>
            <TouchableOpacity style={estilosMensualidad.primaryBtn} activeOpacity={0.8}>
              <Text style={estilosMensualidad.primaryBtnText}>Nueva Mensualidad</Text>
            </TouchableOpacity>
            <Text style={estilosMensualidad.note}>*Hay 1 Mes que falta por asignar.</Text>
          </View>

          <TablaDinamica
            datos={DATA}
            acciones={accionesUsuarios}
            textoVacio='No hay usuarios registrados'
          >
            <ColumnaTabla titulo='Mes/año' campo='mes' ancho={1} />
            <ColumnaTabla
              titulo='Total'
              campo='totalBs'
              ancho={1}
              render={(fila) => (
                <View>
                  <Text style={{ fontSize: 13, color: '#212529', fontWeight: '500' }}>
                    {fila.totalBs}
                  </Text>
                  <Text style={{ fontSize: 11, color: '#6C757D' }}>
                    {fila.totalUsd}
                  </Text>
                </View>
              )}
            />
            <ColumnaTabla
              titulo='Restante'
              campo='restanteBs'
              ancho={1}
              render={(fila) => (
                <View>
                  <Text style={{ fontSize: 13, color: '#212529', fontWeight: '500' }}>
                    {fila.restanteBs}
                  </Text>
                  <Text style={{ fontSize: 11, color: '#6C757D' }}>
                    {fila.restanteUsd}
                  </Text>
                </View>
              )}
            />
          </TablaDinamica>

        </View>
      </View>

      <Footer />
    </SafeAreaProvider>
  )
}

const estilosMensualidad = StyleSheet.create({
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
  note: { color: '#DC3545', fontSize: 13, marginLeft: 4 }
})
