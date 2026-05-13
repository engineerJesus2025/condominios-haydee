import React, { useEffect } from 'react';
import { View, Text, FlatList, RefreshControl, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';

import HeaderPrincipal from '../components/HeaderPrincipal';
import PagoCard from '../components/PagoCard';
import ModalDetalles from '../components/ModalDetalles';
import DeudaResumenCard from '../components/DeudaResumenCard'; 
import ModalFormularioPago from '../components/ModalFormularioPago'; 
import ModalEstadoCuenta from '../components/ModalEstadoCuenta';
import ListaRefrescable from '../components/ListaRefrescable';
import BotonRegistrar from '../components/BotonRegistrar';

import { useTema } from './../hooks/useTema';
import { usePagos } from '../hooks/usePagos';

export default function PagosScreen() {
  const { colores } = useTema();
  const estilosPagos = getEstilosPagos(colores);

  // Destructuramos todo lo necesario desde el Hook
  const {
    listaPagos,
    loading,
    error,
    esAdmin,
    modalVisible,
    modalPagoVisible,
    modalEstadoCuentaVisible,
    pagoSeleccionado,
    setModalPagoVisible,
    setModalEstadoCuentaVisible,
    obtenerPagos,
    abrirDetalles,
    cerrarDetalles,
    handleAprobar,
    handleRechazar
  } = usePagos();
  
  // Cargamos los datos al montar la pantalla
  useEffect(() => {
    obtenerPagos();
  }, []);

  const renderHeader = () => (
    <View style={{ paddingBottom: 10 }}>
      {/* Temporalmente pasamos datos estáticos a la Deuda, esto lo conectaremos luego a otro endpoint */}
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
        
        {/* Renderizado Condicional */}
        {loading ? (
           <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
             <ActivityIndicator size="large" color={colores.primario || '#007BFF'} />
             <Text style={{ marginTop: 10, color: colores.textPlaceholder }}>Cargando pagos...</Text>
           </View>
        ) : error ? (
           <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
             <Text style={{ color: '#e74c3c' }}>Ocurrió un error: {error}</Text>
             <TouchableOpacity onPress={obtenerPagos} style={{ marginTop: 10 }}>
                <Text style={{ color: '#007BFF' }}>Reintentar</Text>
             </TouchableOpacity>
           </View>
        ) : (
          <ListaRefrescable
            data={listaPagos}
            keyExtractor={(item) => item.id.toString()}
            cargando={loading}
            onRefresh={() => obtenerPagos(true)}
            ListHeaderComponent={renderHeader}
            renderItem={({ item }) => (
              <PagoCard pago={item} onPressDetalles={abrirDetalles} />
            )}
            mensajeVacio="No hay pagos registrados"
          />
        )}
      </View>

      <BotonRegistrar 
        puedeRegistrar={true}
        modalAbrir={() => setModalPagoVisible(true)}
      />

      <ModalDetalles
        visible={modalVisible}
        onClose={cerrarDetalles}
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
