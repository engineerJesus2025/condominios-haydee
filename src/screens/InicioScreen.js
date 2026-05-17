import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, FlatList, Dimensions, StyleSheet } from 'react-native';

import { useSelector, useDispatch } from 'react-redux';

import HeaderPrincipal from '../components/HeaderPrincipal';
import PublicacionCard from '../components/PublicacionCard';
import DeudaResumenCard from '../components/DeudaResumenCard';
import EventoCard from '../components/EventoCard';
import ProgresoPresupuesto from '../components/ProgresoPresupuesto';
import ListaRefrescable from '../components/ListaRefrescable';

import { useTema } from '../hooks/useTema';
import { useResumenFinanciero } from '../hooks/useResumenFinanciero';
import { useEventos } from '../hooks/useEventos';


import { fetchPublicaciones } from '../store/slices/publicacionesSlice';

const { width } = Dimensions.get('window');
const SNAP_INTERVAL = (width * 0.75) + 12; 

export default function InicioScreen({ navigation }) {
  const { colores } = useTema();
  const estilosInicio = getEstilosInicio(colores);

  const dispatch = useDispatch();

  const { deudaTotal, gastado, presupuestoTotal, loading: loadingFinanzas, error, obtenerDatos } = useResumenFinanciero();
  const { eventos } = useEventos();
  
  const { listaPublicaciones, cargando: loadingPublicaciones } = useSelector(state => state.publicaciones);
  console.log(listaPublicaciones)
  const noticiasGenerales = (listaPublicaciones || []).filter(post => post.tipo?.toLowerCase() !== 'evento');

  useEffect(() => {
    if (obtenerDatos) obtenerDatos();
    if (listaPublicaciones.length === 0) {
        dispatch(fetchPublicaciones({ pagina: 1, limite: 20 }));
    }
  }, [dispatch]);

  const handleVerDetalleDeuda = () => {
    navigation.navigate('Pagos');
  };

  const handleEventoPress = (evento) => {
    navigation.navigate('Cartelera'); 
  };


  const renderHeader = () => {
    if (loadingFinanzas && !gastado) {
      // Solo mostramos el spinner gigante si es la primera carga y no hay datos
      return <ActivityIndicator size="large" color={colores.primario} style={{ marginTop: 40 }} />;
    }
    if (error) {
      return <Text style={{ color: '#e74c3c', textAlign: 'center', marginTop: 20 }}>{error.mensaje}</Text>;
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
              snapToInterval={SNAP_INTERVAL} 
              style={{ marginHorizontal: -16 }} 
              contentContainerStyle={{ paddingLeft: 16, paddingRight: 16, paddingVertical: 8 }} 
            />
            
          </View>
        )}

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

        <Text style={[estilosInicio.title, { fontSize: 18, marginTop: 24, marginBottom: 10, paddingHorizontal: 0 }]}>
          Últimas noticias
        </Text>
      </View>
    );
  };

  // Combinamos los estados de carga para el Pull-to-Refresh
  const isRefreshing = loadingFinanzas || loadingPublicaciones;

  return (
    <View style={{ flex: 1, backgroundColor: colores.background }}>
      <HeaderPrincipal />
      
      <ListaRefrescable
        data={noticiasGenerales}
        keyExtractor={(item) => item.id.toString()}
        cargando={isRefreshing}
        onRefresh={() => {
          dispatch(fetchPublicaciones({ pagina: 1, recargar: true })); 
          if (obtenerDatos) obtenerDatos(true); 
        }}
        ListHeaderComponent={renderHeader}
        renderItem={({ item }) => (
          <View style={{ paddingHorizontal: 16 }}>
            <PublicacionCard post={item} />
          </View>
        )}
        mensajeVacio="No hay noticias recientes en el condominio."
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
});
/*
[
  {"descripcion": "bienvenidos al 2026", "fecha": "2100-10-10 00:00:00", "tipo": "noticia", "titulo": "Bienvenidos"}, 
  {"descripcion": "Hola chamo", "fecha": "2026-05-14 13:03:54", "tipo": "evento", "titulo": "Hola "}, 
  {"descripcion": "Hola ora vez ", "fecha": "2026-05-14 12:53:10","tipo": "noticia", "titulo": "Hola "}, 
  {"descripcion": "Publicacion genérica ", "fecha": "2026-05-12 11:30:42", "tipo": "noticia", "titulo": "Publicacion"}, 
  {"descripcion": "Soy un mensaje encriptado ", "fecha": "2026-05-12 11:01:12" "tipo": "evento", "titulo": "Hola"}, 
  {"descripcion": "Jdjdkdkddd", "fecha": "2026-05-10 01:13:49","tipo": "evento", "titulo": "Hola mi vida "}, 
  {"descripcion": "Gkdksksslsmsmd", "fecha": "2026-05-10 01:08:24", "tipo": "evento", "titulo": "Hola mi amor "}, {"autor": "Jesus", "descripcion": "Hola buenas ", "fecha": "2026-05-10 01:07:28", "id": 41, "imagen": null, "tipo": "aviso", "titulo": "Hola buenas "}, 
  {"descripcion": "Hola buenas ", "fecha": "2026-05-10 01:07:08",  "tipo": "aviso", "titulo": "Hola"}, {"autor": "Jesus", "descripcion": "Ya casi", "fecha": "2026-04-30 11:50:54", "id": 39, "imagen": "http://192.168.1.39/haydee-app/recursos/img/cartelera_virtual/f44e1ac5-7768-4f6c-944f-1989807ebe7b_1777564254_220.png", "tipo": "evento", "titulo": "Ya casi"}
] 
*/