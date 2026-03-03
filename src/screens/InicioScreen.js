// screens/InicioScreen.js
import React from 'react';
import { View, Text, ActivityIndicator, FlatList } from 'react-native';
import { useSelector } from 'react-redux';
import AppHeader from '../components/Header';
import Footer from '../components/Footer';
import Publicacion from '../components/Publicacion';
import DeudaResumenCard from '../components/DeudaResumenCard';
import EventoCard from '../components/EventoCard';
import ProgresoPresupuesto from '../components/ProgresoPresupuesto';
import { getEstilosInicio } from '../styles/screens/estilosInicio';
import { useTema } from '../hooks/useTema';
import { useResumenFinanciero } from '../hooks/useResumenFinanciero';
import { useEventos } from '../hooks/useEventos';

export default function InicioScreen({ navigation }) {
  const { colores } = useTema();
  const estilosInicio = getEstilosInicio(colores);

  const { deudaTotal, gastado, presupuestoTotal, loading, error } = useResumenFinanciero();
  const { eventos } = useEventos();
  const posts = useSelector(state => state.publicaciones.publicacion);

  const handleVerDetalleDeuda = () => {
    navigation.navigate('Pagos');
  };

  const handleEventoPress = (evento) => {
    console.log('Evento seleccionado:', evento.titulo);
    // Aquí puedes navegar al detalle del evento
  };

  const renderHeader = () => {
    if (loading) {
      return <ActivityIndicator size="small" color={colores.primario} style={{ marginTop: 20 }} />;
    }
    if (error) {
      return <Text style={{ color: 'red', textAlign: 'center', marginTop: 20 }}>{error}</Text>;
    }

    return (
      <>
        <Text style={estilosInicio.title}>Inicio</Text>

        <DeudaResumenCard
          totalDeuda={deudaTotal}
          onVerDetalle={handleVerDetalleDeuda}
        />

        {eventos.length > 0 && (
          <View style={{ marginVertical: 16 }}>
            <Text style={[estilosInicio.title, { fontSize: 18, marginBottom: 8 }]}>
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
              contentContainerStyle={{ paddingHorizontal: 16 }}
              style={{ height: 130 }} // Ajusta según el alto de tus tarjetas
            />
          </View>
        )}

        {!loading && !error && (
          <ProgresoPresupuesto
            gastado={gastado}
            total={presupuestoTotal}
            moneda="Bs"
          />
        )}

        <Text style={[estilosInicio.title, { fontSize: 18, marginTop: 16 }]}>
          Últimas noticias
        </Text>
      </>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colores.background }}>
      <AppHeader />
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <Publicacion post={item} />}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={estilosInicio.mainContentContainer}
        showsVerticalScrollIndicator={true}
      />
      <Footer />
    </View>
  );
}