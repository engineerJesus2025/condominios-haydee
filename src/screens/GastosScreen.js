import { View, Text } from 'react-native'

import AppHeader from '../components/Header'
import TablaDinamica from '../components/TablaDinamica'
import ColumnaTabla from '../components/ColumnaTabla'
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

        <TablaDinamica
          datos={DATA_GASTOS}
          textoVacio='No hay gastos registrados'
          configuracionModal={{ // Este es para el modal de los detalles pago, gasto,etc
            titulo: 'Detalles de Gasto',
            campos: [
              { key: 'fecha', label: 'Fecha del Gasto' },
              { key: 'monto', label: 'Monto' },
              { key: 'tipo', label: 'Tipo' },
              { key: 'tipo_gasto', label: 'Tipo de gasto' },
              { key: 'proveedor', label: 'Proveedor' },
              { key: 'descripcion', label: 'Descripcion' }
            ],
            mostrarImagen: false
          }}
        >
          <ColumnaTabla titulo='Fecha' campo='fecha' ancho={1} />
          <ColumnaTabla titulo='Monto' campo='monto' ancho={1} />
        </TablaDinamica>
      </View>

      <Footer />
    </>
  )
}
