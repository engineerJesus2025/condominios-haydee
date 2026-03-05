import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { cambiarEstadoPago } from '../store/slices/pagosSlice'; 
import { Alert } from 'react-native'; 

import HeaderPrincipal from '../components/HeaderPrincipal';
import PagoCard from '../components/PagoCard';
import ModalDetalles from '../components/ModalDetalles';
import DeudaResumenCard from '../components/DeudaResumenCard'; 
import ModalFormularioPago from '../components/ModalFormularioPago'; 
import ModalEstadoCuenta from '../components/ModalEstadoCuenta';

import { useTema } from './../hooks/useTema';

export default function PagosScreen() {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.usuario);
  const esAdmin = user?.rol === 'administrador' || user?.rol === 'presidente';

  const { colores } = useTema();
  const estilosPagos = getEstilosPagos(colores);

  const listaPagos = useSelector(state => state.pagos.listaPagos);
  
  const [modalVisible, setModalVisible] = useState(false); 
  const [modalPagoVisible, setModalPagoVisible] = useState(false); 
  const [modalEstadoCuentaVisible, setModalEstadoCuentaVisible] = useState(false);
  const [pagoSeleccionado, setPagoSeleccionado] = useState(null);

  const abrirDetalles = (pago) => {
    setPagoSeleccionado({
      ...pago,
      imagen: pago.comprobante || pago.imagen 
    });
    setModalVisible(true);
  };

  const handleAprobar = (pago) => {
    Alert.alert(
      "Aprobar Pago",
      `¿Confirmas que el pago por ${pago.monto} es válido y está en la cuenta del condominio?`,
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Sí, Aprobar", 
          onPress: () => {
            dispatch(cambiarEstadoPago({ id: pago.id, nuevoEstado: 'Procesado' }));
            setModalVisible(false); 
          }
        }
      ]
    );
  };

  const handleRechazar = (pago) => {
    Alert.alert(
      "Rechazar Pago",
      "¿Estás seguro de rechazar este pago? El recibo será marcado como inválido.",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Sí, Rechazar", 
          style: "destructive",
          onPress: () => {
            dispatch(cambiarEstadoPago({ id: pago.id, nuevoEstado: 'Rechazado' }));
            setModalVisible(false);
          }
        }
      ]
    );
  };

  const renderHeader = () => (
    <View style={{ paddingBottom: 10 }}>
      <DeudaResumenCard 
        totalDeuda={150.75} 
        titulo="Total Adeudado" 
        moneda="$"
        onVerDetalle={() => setModalEstadoCuentaVisible(true)}
      />
      <Text style={[estilosPagos.title, { paddingHorizontal: 16, marginTop: 10 }]}>
        Historial de Pagos
      </Text>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colores.background }}>
      <HeaderPrincipal />

      <View style={[estilosPagos.mainContentContainer, { flex: 1, paddingHorizontal: 0, paddingTop: 10 }]}>
        <FlatList
          data={listaPagos}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={renderHeader}
          renderItem={({ item }) => (
            <PagoCard pago={item} onPressDetalles={abrirDetalles} />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 16 }}
          ListEmptyComponent={<Text style={{ color: colores.text }}>No hay pagos registrados</Text>}
        />
      </View>

      {/* EL BOTÓN FLOTANTE (FAB) PARA REGISTRAR PAGO */}
      <TouchableOpacity 
        style={[estilosPagos.fab, { backgroundColor: colores.backgroundBotones || '#007BFF' }]} 
        onPress={() => setModalPagoVisible(true)}
        activeOpacity={0.8}
      >
        <Icon name="add" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Modal Detalles Existente */}
      <ModalDetalles
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        titulo="Detalles del Pago"
        datos={pagoSeleccionado}
        campos={[
          { key: 'estado', label: 'Estado' },
          { key: 'fecha', label: 'Fecha del pago' },
          { key: 'banco', label: 'Banco Origen' },         
          { key: 'referencia', label: 'Nro. Referencia' }, 
          { key: 'monto', label: 'Monto' },
          { key: 'mensualidad', label: 'Mensualidad' },
          { key: 'apartamento', label: 'Apartamento' }
        ]}
        mostrarImagen={true}
        esAdmin={esAdmin}
        onAprobar={handleAprobar}
        onRechazar={handleRechazar}
      />

      {/* Modal para Registrar Pago */}
      <ModalFormularioPago 
        visible={modalPagoVisible} 
        onClose={() => setModalPagoVisible(false)} 
      />

      <ModalEstadoCuenta 
        visible={modalEstadoCuentaVisible}
        onClose={() => setModalEstadoCuentaVisible(false)}
        totalDeuda={150.75}
        moneda="$"
      />
    </View>
  );
}

const getEstilosPagos = (colores) => StyleSheet.create({
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
