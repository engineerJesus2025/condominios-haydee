import React from 'react';
import { View, Text, ActivityIndicator, FlatList, Dimensions, StyleSheet } from 'react-native'; // <-- IMPORTAMOS Dimensions
import { useSelector } from 'react-redux';

import HeaderPrincipal from '../components/HeaderPrincipal';
import PublicacionCard from '../components/PublicacionCard';
import DeudaResumenCard from '../components/DeudaResumenCard';
import EventoCard from '../components/EventoCard';
import ProgresoPresupuesto from '../components/ProgresoPresupuesto';

import { useTema } from '../hooks/useTema';
import { useResumenFinanciero } from '../hooks/useResumenFinanciero';
import { useEventos } from '../hooks/useEventos';

const { width } = Dimensions.get('window');
const SNAP_INTERVAL = (width * 0.75) + 12; 

export default function InicioScreen({ navigation }) {
  const { colores } = useTema();
  const estilosInicio = getEstilosInicio(colores);

  const { deudaTotal, gastado, presupuestoTotal, loading, error } = useResumenFinanciero();
  const { eventos } = useEventos();
  
  const listaPublicaciones = useSelector(state => state.publicaciones.listaPublicaciones) || []; 

  const noticiasGenerales = listaPublicaciones.filter(post => post.tipo?.toLowerCase() !== 'evento');

  const handleVerDetalleDeuda = () => {
    navigation.navigate('Pagos');
  };

  const handleEventoPress = (evento) => {
    navigation.navigate('Cartelera'); 
  };

  const renderHeader = () => {
    if (loading) {
      return <ActivityIndicator size="large" color={colores.primario} style={{ marginTop: 40 }} />;
    }
    if (error) {
      return <Text style={{ color: '#e74c3c', textAlign: 'center', marginTop: 20 }}>{error}</Text>;
    }

    return (
      <View style={{ paddingHorizontal: 16, paddingTop: 10 }}>
        
        <Text style={[estilosInicio.title, { marginBottom: 10, paddingHorizontal: 0 }]}>
          Mi Estado
        </Text>
        <DeudaResumenCard
          totalDeuda={deudaTotal}
          onVerDetalle={handleVerDetalleDeuda}
        />

        {eventos && eventos.length > 0 && (
          <View style={{ marginTop: 20, marginBottom: 5 }}>
            <Text style={[estilosInicio.title, { fontSize: 18, marginBottom: 12, paddingHorizontal: 0 }]}>
              Próximos eventos
            </Text>
            
            <FlatList
              data={eventos}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <EventoCard evento={item} onPress={handleEventoPress} />
              )}
              horizontal
              showsHorizontalScrollIndicator={false}
              snapToAlignment="start"
              decelerationRate="fast"
              snapToInterval={SNAP_INTERVAL} // Detiene la tarjeta en el lugar perfecto
              
              style={{ marginHorizontal: -16 }} 
              contentContainerStyle={{ paddingLeft: 16, paddingRight: 16, paddingVertical: 8 }} 
            />
            
          </View>
        )}

        {!loading && !error && (
          <View style={{ marginTop: 20 }}>
            <Text style={[estilosInicio.title, { fontSize: 18, marginBottom: 10, paddingHorizontal: 0 }]}>
              Gestión del mes
            </Text>
            <ProgresoPresupuesto
              gastado={gastado}
              total={presupuestoTotal}
              moneda="Bs"
            />
          </View>
        )}

        <Text style={[estilosInicio.title, { fontSize: 18, marginTop: 24, marginBottom: 10, paddingHorizontal: 0 }]}>
          Últimas noticias
        </Text>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colores.background }}>
      <HeaderPrincipal />
      
      <FlatList
        data={noticiasGenerales}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ paddingHorizontal: 16 }}>
            <PublicacionCard post={item} />
          </View>
        )}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', color: colores.textPlaceholder, marginTop: 20 }}>
            No hay noticias recientes en el condominio.
          </Text>
        }
      />
    </View>
  );
}

const getEstilosInicio = (colores) => StyleSheet.create({
  mainContentContainer: {
    flexGrow: 1,
    paddingBottom: 20,
    padding: 14,
    paddingBottom: 40
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colores.textTitle,
    marginBottom: 16,
    paddingHorizontal: 4
  }
})
