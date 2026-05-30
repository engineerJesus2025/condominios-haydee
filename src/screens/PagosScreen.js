import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import HeaderPrincipal from '../components/HeaderPrincipal';
import PagoCard from '../components/PagoCard';
import ModalDetalles from '../components/ModalDetalles';
import ResumenFinancieroCard from '../components/ResumenFinancieroCard';
import ModalFormularioPago from '../components/ModalFormularioPago'; 
import ModalEstadoCuenta from '../components/ModalEstadoCuenta';
import ListaRefrescable from '../components/ListaRefrescable';
import BotonRegistrar from '../components/BotonRegistrar';
import CargandoOverlay from '../components/CargandoOverlay';
import SkeletonCard from '../components/SkeletonCard';
import SelectorMesAnio from '../components/SelectorMesAnio';

import { useTema } from './../hooks/useTema';
import { usePagos } from '../hooks/usePagos';

export default function PagosScreen() {
  const { colores } = useTema();
  const estilosPagos = getEstilosPagos(colores);

  const {
    listaPagos,
    loading,
    error,
    totalDeuda,
    listaDeudas,
    esAdmin,
    modalPagoVisible,
    modalEstadoCuentaVisible,
    cargandoDetalle,
    pagoSeleccionado,
    setModalPagoVisible,
    setModalEstadoCuentaVisible,
    abrirDetalles,
    cerrarDetalles,
    obtenerPagos,
    handleAprobar,
    handleRechazar,
    mesFiltro,
    anioFiltro,
    cambiarFiltroFecha,
    periodosDisponibles,
    puedeAprobarPagos,
    procesandoEstado,
    inicializando
  } = usePagos();

  const estaCargando = loading || inicializando;

  const renderHeader = () => (
    <View style={{ paddingBottom: 5 }}>
      <ResumenFinancieroCard 
        monto={totalDeuda} 
        titulo="Tu Deuda Pendiente" 
        moneda="Bs." 
        tipo="deuda"
        onAccion={() => setModalEstadoCuentaVisible(true)}
        textoAccion="Ver Estado"
        cargando={estaCargando}
      />

      <Text style={[estilosPagos.title, { marginTop: 15, marginBottom: 10, paddingHorizontal: 0 }]}>
        Historial de Pagos
      </Text>

      <SelectorMesAnio 
        periodosDisponibles={periodosDisponibles}
        mesActual={mesFiltro} 
        anioActual={anioFiltro} 
        onCambiarMes={(m, a) => cambiarFiltroFecha(m, a)} 
      />

      {estaCargando && (
        <View style={{ paddingTop: 10 }}>
          <SkeletonCard tipo="pago" />
          <SkeletonCard tipo="pago" />
          <SkeletonCard tipo="pago" />
        </View>
      )}
    </View>
  );

  const ALTURA_HEADER = 200; 
  const ALTURA_ITEM = 150; 

  const elGetItemLayout = useCallback((data, index) => ({
    length: ALTURA_ITEM,
    offset: (ALTURA_ITEM * index) + ALTURA_HEADER,
    index,
  }), []);

  return (
    <View style={{ flex: 1, backgroundColor: colores.background }}>
      <HeaderPrincipal />

      <View style={[estilosPagos.mainContentContainer, { flex: 1, paddingHorizontal: 0, paddingVertical: 0, padding: 0 }]}>
        
        {error ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: '#e74c3c' }}>Ocurrió un error: {error}</Text>
            <TouchableOpacity onPress={() => obtenerPagos(true)} style={{ marginTop: 10 }}>
               <Text style={{ color: '#007BFF', fontWeight: 'bold' }}>Reintentar</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ListaRefrescable
            data={estaCargando ? [] : listaPagos}
            keyExtractor={(item) => item.id.toString()}
            cargando={estaCargando && listaPagos.length > 0}
            onRefresh={() => obtenerPagos(true)}
            ListHeaderComponent={renderHeader()} 
            cargandoInicial={estaCargando && listaPagos.length === 0}
            renderItem={({ item }) => (
              <PagoCard pago={item} onPressDetalles={abrirDetalles} />
            )}
            mensajeVacio="No hay pagos registrados este mes."
            getItemLayout={elGetItemLayout}
          />
        )}
      </View>

      <BotonRegistrar 
        puedeRegistrar={puedeAprobarPagos}
        modalAbrir={() => setModalPagoVisible(true)}
      />

      <ModalDetalles
        visible={modalEstadoCuentaVisible === false && pagoSeleccionado !== null} // Evita solapamientos si abres deudas
        onClose={cerrarDetalles}
        titulo="Detalles del Pago"
        datos={pagoSeleccionado}
        campos={[
          { key: 'estado', label: 'Estado' },
          { key: 'fecha', label: 'Fecha del pago', formato: 'fecha_legible' },
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
        procesando={procesandoEstado}
      />

      <ModalFormularioPago 
        visible={modalPagoVisible} 
        onClose={() => setModalPagoVisible(false)}
      />

      <ModalEstadoCuenta 
        visible={modalEstadoCuentaVisible}
        onClose={() => setModalEstadoCuentaVisible(false)}
        totalDeuda={totalDeuda}
        listaDeudas={listaDeudas}
        moneda="Bs."
      />

      <CargandoOverlay 
        visible={cargandoDetalle} 
        mensaje="Obteniendo recibo..." 
      />
    </View>
  );
}

const getEstilosPagos = (colores) => StyleSheet.create({
  mainContentContainer: {
    flex: 1,
    backgroundColor: colores.background,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colores.textTitle,
    marginBottom: 16,
    paddingHorizontal: 4
  },
});