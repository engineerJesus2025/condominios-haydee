import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import { usePermisos } from '../hooks/usePermisos';

import HeaderPrincipal from '../components/HeaderPrincipal';
import GastoCard from '../components/GastoCard';
import ModalDetalles from '../components/ModalDetalles';
import ModalFormularioGasto from '../components/ModalFormularioGasto';

import { useTema } from './../hooks/useTema';

export default function GastosScreen () {
  const { colores } = useTema();
  const estilosGastos = getEstilosGastos(colores);
  
  const listaGastos = useSelector(state => state.gastos.listaGastos);
  const totalGastadoMes = useSelector(state => state.gastos.totalGastadoMes);
  
  const { user } = useSelector(state => state.usuario);
  const esAdministrador = user?.rol === 'administrador' || user?.rol === 'presidente';
  const { puedeRegistrarGasto } = usePermisos();

  const [modalVisible, setModalVisible] = useState(false);
  const [modalGastoVisible, setModalGastoVisible] = useState(false);
  const [gastoSeleccionado, setGastoSeleccionado] = useState(null);

  const abrirDetalles = (gasto) => {
    setGastoSeleccionado({
      ...gasto,
      imagen: gasto.comprobante // <-- Le pasamos la factura al modal
    });
    setModalVisible(true);
  };

  // Resumen superior para los propietarios
  const renderHeader = () => (
    <View style={[
      estilosGastos.resumenContainer, 
      { backgroundColor: colores.card }
    ]}>
      <Text style={[
        estilosGastos.resumenLabel, 
        { color: colores.textPlaceholder }
      ]}>
        Total Ejecutado este Mes
      </Text>
      <Text style={[estilosGastos.resumenTotal, { color: colores.error || '#e74c3c' }]}>
        {totalGastadoMes} Bs.
      </Text>
      <Text style={[estilosGastos.title, { marginTop: 20, marginBottom: 5 }]}>Últimos Gastos Registrados</Text>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colores.background }}>
      <HeaderPrincipal />

      <View style={[estilosGastos.mainContentContainer, { flex: 1, paddingHorizontal: 0 }]}>
        <FlatList
          data={listaGastos}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={renderHeader}
          renderItem={({ item }) => (
            <GastoCard gasto={item} onPressDetalles={abrirDetalles} />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ 
            paddingBottom: 100, 
            paddingHorizontal: 16,
            paddingTop: 10 
          }}
        />
      </View>

      {puedeRegistrarGasto && (
        <TouchableOpacity 
          style={[estilosGastos.fab, { backgroundColor: colores.backgroundBotones || '#007BFF' }]} 
          onPress={() => setModalGastoVisible(true)}
          activeOpacity={0.8}
        >
          <Icon name="add-outline" size={28} color="#fff" />
        </TouchableOpacity>
      )}

      <ModalDetalles
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        titulo="Detalle de Gasto"
        datos={gastoSeleccionado}
        campos={[
          { key: 'tipo_gasto', label: 'Categoría' },
          { key: 'proveedor', label: 'Proveedor' },
          { key: 'monto', label: 'Monto' },
          { key: 'fecha', label: 'Fecha' },
          { key: 'descripcion', label: 'Descripción' }
        ]}
        mostrarImagen={true}
      />
      {/* Modal para Registrar Nuevo Gasto */}
      <ModalFormularioGasto 
        visible={modalGastoVisible} 
        onClose={() => setModalGastoVisible(false)} 
      />
    </View>
  );
}

const getEstilosGastos = (colores) => StyleSheet.create({
  mainContentContainer: {
    flex: 1,
    backgroundColor: colores.background,
    padding: 14
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colores.textTitle,
    marginBottom: 16,
    paddingHorizontal: 4
  },
  resumenContainer: { 
    alignItems: 'center', 
    backgroundColor: colores.card,
    padding: 20, 
    borderRadius: 12, 
    marginBottom: 10, 
    elevation: 2, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 1 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 2 
  },
  resumenLabel: { fontSize: 16, color: colores.textPlaceholder, marginBottom: 5 },
  resumenTotal: { fontSize: 32, fontWeight: 'bold', color: colores.text },
  fab: {
    position: 'absolute',
    bottom: 120,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  }
})
