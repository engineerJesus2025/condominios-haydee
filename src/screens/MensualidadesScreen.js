import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMensualidades, fetchDetalleMensualidad } from '../store/slices/mensualidadesSlice';

import HeaderPrincipal from '../components/HeaderPrincipal';
import MensualidadCard from '../components/MensualidadCard';
import ProgresoPresupuesto from '../components/ProgresoPresupuesto';
import ModalDesgloseMensualidad from '../components/ModalDesgloseMensualidad';
import ListaRefrescable from '../components/ListaRefrescable';

import { useTema } from './../hooks/useTema';
import { useMensualidades } from '../hooks/useMensualidades'; 

export default function MensualidadesScreen () {
  const { colores } = useTema();
  const estilosMensualidad = getEstilosMensualidades(colores);
  
  const {
    listaMensualidades,
    loading,
    obtenerMensualidades,
    manejarVerDetalles,
    modalVisible,
    setModalVisible,
    mensualidadSeleccionada,
    gastado,
    presupuestoTotal
  } = useMensualidades();

  useEffect(() => {
    obtenerMensualidades();
  }, []);

  const renderHeader = () => (
    <View style={{ marginBottom: 15 }}>
      <Text style={estilosMensualidad.title}>Balance General de Deuda</Text>
      
      {loading && !gastado ? (
         <View style={{ padding: 20, alignItems: 'center' }}>
           <ActivityIndicator size="small" color={colores.primario} />
         </View>
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
        
        {loading && listaMensualidades.length === 0 ? (
           <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
             <ActivityIndicator size="large" color={colores.primario || '#007BFF'} />
             <Text style={{ marginTop: 10, color: colores.textPlaceholder }}>Cargando mensualidades...</Text>
           </View>
        ) : (
          <ListaRefrescable
            data={listaMensualidades}
            keyExtractor={(item) => item.id.toString()}
            cargando={loading}
            onRefresh={() => {
              obtenerDatos(true); // Refresca las barras y KPIs
              dispatch(fetchMensualidades()); // Refresca la lista histórica
            }}
            ListHeaderComponent={renderHeader}
            renderItem={({ item }) => (
              <MensualidadCard 
                mensualidad={item} 
                onPressDetalles={manejarVerDetalles} 
              />
            )}
            mensajeVacio="No hay mensualidades registradas."
          />
        )}

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
});