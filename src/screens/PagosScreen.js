// src/screens/PagosScreen.js
import React, { useState } from 'react';
import { View, Text, FlatList } from 'react-native';

import AppHeader from '../components/Header';
import Footer from '../components/Footer';
import CustomBoton from '../components/CustomBoton';
import PagoCard from '../components/PagoCard';
import ModalDetalles from '../components/ModalDetalles';

import { getEstilosPagos } from '../styles/screens/estilosPagos';
import { useTema } from './../hooks/useTema';

import { DATA_PAGOS } from '../utils/constants';

export default function PagosScreen() {
  const { colores } = useTema();
  const estilosPagos = getEstilosPagos(colores);
  
  // Estado para controlar el modal de detalles
  const [modalVisible, setModalVisible] = useState(false);
  const [pagoSeleccionado, setPagoSeleccionado] = useState(null);

  const abrirDetalles = (pago) => {
    setPagoSeleccionado(pago);
    setModalVisible(true);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colores.fondo }}>
      <AppHeader />

      <View style={[estilosPagos.mainContentContainer, { flex: 1, paddingHorizontal: 16 }]}>
        <Text style={estilosPagos.title}>Historial de Pagos</Text>

        <CustomBoton titulo='Registrar Nuevo Pago' icono={{ nombre: 'add-circle-outline', color: '#fff' }} />

        <FlatList
          data={DATA_PAGOS}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PagoCard pago={item} onPressDetalles={abrirDetalles} />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20, paddingTop: 10 }}
          ListEmptyComponent={<Text style={{ color: colores.text }}>No hay pagos registrados</Text>}
        />
      </View>

      {/* Reutilizamos tu modal genérico */}
      <ModalDetalles
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        titulo='Detalles del Pago'
        datos={pagoSeleccionado}
        campos={[
          { key: 'estado', label: 'Estado' },
          { key: 'fecha', label: 'Fecha del pago' },
          { key: 'monto', label: 'Monto' },
          { key: 'mensualidad', label: 'Mensualidad' },
          { key: 'apartamento', label: 'Apartamento' }
        ]}
        mostrarImagen={false}
      />

      <Footer />
    </View>
  );
}