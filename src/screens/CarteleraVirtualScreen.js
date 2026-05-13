import { useMemo, useState, useEffect } from 'react';
import { View, Text, FlatList, RefreshControl, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';

import HeaderPrincipal from '../components/HeaderPrincipal';
import ModalFormularioPublicaciones from '../components/ModalFormularioPublicaciones';
import PublicacionCard from '../components/PublicacionCard'; 
import ListaRefrescable from '../components/ListaRefrescable';
import BotonRegistrar from '../components/BotonRegistrar';

import { useTema } from '../hooks/useTema';
import { useCarteleraVirtual } from '../hooks/useCarteleraVirtual';
import { usePermisos } from '../hooks/usePermisos';

import { criptografiaMovil } from '../utils/criptografiaMovil'; 

LocaleConfig.locales['es'] = {
  monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
  monthNamesShort: ['Ene.', 'Feb.', 'Mar', 'Abr', 'May', 'Jun', 'Jul.', 'Ago', 'Sept.', 'Oct.', 'Nov.', 'Dic.'],
  dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
  dayNamesShort: ['Dom.', 'Lun.', 'Mar.', 'Mié.', 'Jue.', 'Vie.', 'Sáb.'],
  today: 'Hoy'
};
LocaleConfig.defaultLocale = 'es';

export default function CarteleraVirtualScreen () {
// console.log('¿Hay clave AES?', criptografiaMovil.claveAESSesion);
  const { colores } = useTema();
  const estilosCarteleraVirtual = getEstilosCarteleraVirtual(colores);

  const { puedePublicarCartelera, usuario: user } = usePermisos();

  const {
    listaPublicacionesMostrar,
    markedDates,
    fechaSeleccionada,
    setFechaSeleccionada,
    cargando,
    error,
    obtenerPublicaciones,
    modalVisible,
    modalEdicionVisible,
    publicacionSeleccionada,
    abrirModalNuevaPublicacion,
    cerrarModalNuevaPublicacion,
    cerrarModalEdicion,
    handleGuardarEdicion
  } = useCarteleraVirtual(colores);

  useEffect(() => {
    obtenerPublicaciones();
  }, []);


  const renderHeader = () => (
    <View style={{ marginBottom: 20 }}>
      <Text style={[estilosCarteleraVirtual.title, { marginBottom: 10 }]}>Cartelera Virtual</Text>
      
      <View style={estilosCarteleraVirtual.calendarContainer}>
        <Calendar
          markingType={'multi-dot'}
          onDayPress={(day) => {
            setFechaSeleccionada(fechaSeleccionada === day.dateString ? '' : day.dateString);
          }}
          markedDates={markedDates}
          theme={{
            calendarBackground: colores.card,
            textSectionTitleColor: colores.textPlaceholder,
            dayTextColor: colores.text,
            todayTextColor: '#007BFF',
            monthTextColor: colores.textTitle,
            arrowColor: '#007BFF',
          }}
        />
      </View>

      {/* LEYENDA DE COLORES */}
      <View style={estilosCarteleraVirtual.leyendaContainer}>
        <View style={estilosCarteleraVirtual.leyendaItem}>
          <View style={[estilosCarteleraVirtual.leyendaPunto, { backgroundColor: '#f39c12' }]} />
          <Text style={{ color: colores.text, fontSize: 13 }}>Aviso</Text>
        </View>
        <View style={estilosCarteleraVirtual.leyendaItem}>
          <View style={[estilosCarteleraVirtual.leyendaPunto, { backgroundColor: '#e74c3c' }]} />
          <Text style={{ color: colores.text, fontSize: 13 }}>Evento</Text>
        </View>
        <View style={estilosCarteleraVirtual.leyendaItem}>
          <View style={[estilosCarteleraVirtual.leyendaPunto, { backgroundColor: '#3498db' }]} />
          <Text style={{ color: colores.text, fontSize: 13 }}>Noticia</Text>
        </View>
      </View>

      <View style={estilosCarteleraVirtual.filtroInfo}>
        <Text style={{ color: colores.textTitle, fontSize: 18, fontWeight: 'bold' }}>
          {fechaSeleccionada ? `Publicaciones del día` : 'Últimas publicaciones'}
        </Text>
        {fechaSeleccionada ? (
          <TouchableOpacity onPress={() => setFechaSeleccionada('')}>
            <Text style={{ color: '#007BFF', fontWeight: 'bold' }}>Ver todas</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colores.background }}>
      <HeaderPrincipal />

      <View style={[estilosCarteleraVirtual.mainContentContainer, { flex: 1, paddingHorizontal: 16, paddingTop: 10 }]}>
        {cargando ? (
           <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
             <ActivityIndicator size="large" color={colores.primario || '#007BFF'} />
             <Text style={{ marginTop: 10, color: colores.textPlaceholder }}>Cargando cartelera...</Text>
           </View>
        ) : error ? (
           <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
             <Text style={{ color: '#e74c3c' }}>Ocurrió un error: {error}</Text>
             <TouchableOpacity onPress={obtenerPublicaciones} style={{ marginTop: 10 }}>
                <Text style={{ color: '#007BFF' }}>Reintentar</Text>
             </TouchableOpacity>
           </View>
        ) : (
          <ListaRefrescable
            data={listaPublicacionesMostrar}
            keyExtractor={(item) => item.id.toString()}
            cargando={cargando}
            onRefresh={() => obtenerPublicaciones(true)}
            ListHeaderComponent={renderHeader}
            renderItem={({ item }) => <PublicacionCard post={item} />}
            mensajeVacio="No hay publicaciones para esta fecha."
          />
        )}
      </View>

      <BotonRegistrar 
        puedeRegistrar={puedePublicarCartelera}
        modalAbrir={abrirModalNuevaPublicacion}
      />

      <ModalFormularioPublicaciones
        visible={modalVisible}
        onClose={cerrarModalNuevaPublicacion}
      />

      <ModalFormularioPublicaciones
        visible={modalEdicionVisible}
        onClose={cerrarModalEdicion}
        publicacionEditar={publicacionSeleccionada}
        onGuardar={handleGuardarEdicion}
      />
    </View>
  );
}

const getEstilosCarteleraVirtual = (colores) => StyleSheet.create({
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
  calendarContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  leyendaContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
    marginBottom: 5,
    gap: 15
  },
  leyendaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 5
  },
  leyendaPunto: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6
  },
  filtroInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
    paddingHorizontal: 5
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
    zIndex: 100,
  }
})
