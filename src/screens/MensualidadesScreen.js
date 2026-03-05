import React, { useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux'; 

import HeaderPrincipal from '../components/HeaderPrincipal';
import MensualidadCard from '../components/MensualidadCard';
import ProgresoPresupuesto from '../components/ProgresoPresupuesto';
import ModalDesgloseMensualidad from '../components/ModalDesgloseMensualidad';

import { useTema } from './../hooks/useTema';

import { useResumenFinanciero } from '../hooks/useResumenFinanciero'; 

export default function MensualidadesScreen () {
  const { colores } = useTema();
  const estilosMensualidad = getEstilosMensualidades(colores);

  
  const { gastado, presupuestoTotal, loading } = useResumenFinanciero();
  const listaMensualidades = useSelector(state => state.mensualidades.listaMensualidades);

  const [modalVisible, setModalVisible] = useState(false);
  const [mensualidadSeleccionada, setMensualidadSeleccionada] = useState(null);

  const manejarVerDetalles = (mensualidad) => {
    setMensualidadSeleccionada(mensualidad);
    setModalVisible(true);
  };

  const renderHeader = () => (
    <View style={{ marginBottom: 15 }}>
      <Text style={estilosMensualidad.title}>Balance General</Text>
      <Text style={{ color: colores.textPlaceholder, paddingHorizontal: 4, marginBottom: 10, marginTop: -10 }}>
        Ejecución del presupuesto del mes en curso.
      </Text>
      
      {loading ? (
        <ActivityIndicator size="small" color={colores.primario} />
      ) : (
        <ProgresoPresupuesto gastado={gastado} total={presupuestoTotal} moneda="Bs" />
      )}
      
      <Text style={[estilosMensualidad.title, { marginTop: 20, fontSize: 20 }]}>Historial de Mensualidades</Text>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colores.background }}> 
      <HeaderPrincipal />

      <View style={[estilosMensualidad.mainContentContainer, { flex: 1, paddingHorizontal: 0 }]}>
        
        <FlatList
          data={listaMensualidades} 
          keyExtractor={(item) => item.id}
          ListHeaderComponent={renderHeader}
          renderItem={({ item }) => (
            <MensualidadCard 
              mensualidad={item} 
              onPressDetalles={manejarVerDetalles} 
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 15, paddingTop: 10 }}
        />

      </View>

      <ModalDesgloseMensualidad 
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        mensualidad={mensualidadSeleccionada}
      />
    </View>
  );
}

const getEstilosMensualidades = (colores) => StyleSheet.create({
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
  }
})
