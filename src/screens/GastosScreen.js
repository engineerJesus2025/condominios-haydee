import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import AppHeader from '../components/Header'

import Icon from 'react-native-vector-icons/Ionicons'

import TablaDinamica from '../components/TablaDinamica'
import ColumnaTabla from '../components/ColumnaTabla'

import Footer from '../components/Footer'

import { DATA_GASTOS } from '../utils/constants'

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

export default function GastosScreen () {
  return (
    <SafeAreaProvider style={estilosGastos.safe}>
      <AppHeader />

      <View style={estilosGastos.mainContentContainer}>
        <View style={estilosGastos.container}>
          <Text style={estilosGastos.title}>Gestionar Gastos</Text>

          <View style={estilosGastos.topRow}>
            <TouchableOpacity style={estilosGastos.primaryBtn} activeOpacity={0.8}>
              <Text style={estilosGastos.primaryBtnText}>Nuevo Gasto</Text>
            </TouchableOpacity>
          </View>

          <TablaDinamica
            datos={DATA_GASTOS}
            acciones={accionesUsuarios}
            textoVacio='No hay usuarios registrados'
          >
            <ColumnaTabla titulo='Fecha' campo='fecha' ancho={1} />
            <ColumnaTabla titulo='Monto' campo='monto' ancho={1} />
            <ColumnaTabla titulo='Tipo' campo='tipo' ancho={1} />
            <ColumnaTabla titulo='Tipo Gasto' campo='tipo_gasto' ancho={1} />
            <ColumnaTabla titulo='Proveedor' campo='proveedor' ancho={1} />
            <ColumnaTabla titulo='Descripcion' campo='descripcion' ancho={1} />
          </TablaDinamica>

        </View>
      </View>

      <Footer />
    </SafeAreaProvider>
  )
}

const estilosGastos = StyleSheet.create({
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
