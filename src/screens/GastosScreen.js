import { View, Text } from 'react-native'

import AppHeader from '../components/Header'
// import TablaDinamica from '../components/TablaDinamica'
// import ColumnaTabla from '../components/ColumnaTabla'
import Footer from '../components/Footer'
import CustomBoton from '../components/CustomBoton'

import { getEstilosGastos } from '../styles/screens/estilosGastos'
import { useTema } from './../hooks/useTema'

import { DATA_GASTOS } from '../utils/constants' // Para simular registros

export default function GastosScreen () {
  const { colores } = useTema()
  const estilosGastos = getEstilosGastos(colores)

  return (
    <>
      <AppHeader />

      <View style={estilosGastos.mainContentContainer}>
        <Text style={estilosGastos.title}>Gestionar Gastos</Text>

        <CustomBoton titulo='Nuevo Gasto' />


      </View>

      <Footer />
    </>
  )
}
