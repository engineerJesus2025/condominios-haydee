import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, RefreshControl, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';

import HeaderPrincipal from '../components/HeaderPrincipal';
import GastoCard from '../components/GastoCard';
import ModalDetalles from '../components/ModalDetalles';
import ModalFormularioGasto from '../components/ModalFormularioGasto';
import ListaRefrescable from '../components/ListaRefrescable';
import BotonRegistrar from '../components/BotonRegistrar';

import { useTema } from './../hooks/useTema';
import { useGastos } from '../hooks/useGastos';
import { usePermisos } from '../hooks/usePermisos';

export default function GastosScreen () {
  const { colores } = useTema();
  const estilosGastos = getEstilosGastos(colores);
  
  const { puedeRegistrarGasto, usuario: user } = usePermisos();

  // Usamos el Hook para obtener todo lo necesario
  const {
    listaGastos,
    totalGastadoMes,
    loading,
    error,
    modalDetalleVisible,
    modalGastoVisible,
    gastoSeleccionado,
    obtenerGastos,
    abrirDetalles,
    cerrarDetalles,
    abrirNuevoGasto,
    cerrarNuevoGasto
  } = useGastos();

  // Disparamos la consulta al entrar a la pantalla
  useEffect(() => {
    obtenerGastos();
  }, []);

  const renderHeader = () => (
    <View style={[estilosGastos.resumenContainer, { backgroundColor: colores.card }]}>
      <Text style={[estilosGastos.resumenLabel, { color: colores.textPlaceholder }]}>
        Total Ejecutado
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
        
        {loading ? (
           <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
             <ActivityIndicator size="large" color={colores.primario || '#007BFF'} />
             <Text style={{ marginTop: 10, color: colores.textPlaceholder }}>Cargando gastos...</Text>
           </View>
        ) : error ? (
           <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
             <Text style={{ color: '#e74c3c' }}>Ocurrió un error: {error}</Text>
             <TouchableOpacity onPress={obtenerGastos} style={{ marginTop: 10 }}>
                <Text style={{ color: '#007BFF' }}>Reintentar</Text>
             </TouchableOpacity>
           </View>
        ) : (
          <ListaRefrescable
            data={listaGastos}
            keyExtractor={(item) => item.id.toString()}
            cargando={loading}
            onRefresh={() => obtenerGastos(true)}
            ListHeaderComponent={renderHeader}
            renderItem={({ item }) => (
              <GastoCard gasto={item} onPressDetalles={abrirDetalles} />
            )}
            mensajeVacio="No hay gastos registrados este mes."
          />
        )}
      </View>

      <BotonRegistrar 
        puedeRegistrar={puedeRegistrarGasto}
        modalAbrir={abrirNuevoGasto}
      />

      <ModalDetalles
        visible={modalDetalleVisible}
        onClose={cerrarDetalles}
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
      
      <ModalFormularioGasto 
        visible={modalGastoVisible} 
        onClose={cerrarNuevoGasto} 
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
