import { useMemo, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';

import HeaderPrincipal from '../components/HeaderPrincipal';
import ModalFormularioPublicaciones from '../components/ModalFormularioPublicaciones';
import PublicacionCard from '../components/PublicacionCard'; 

import { useTema } from '../hooks/useTema';
import { useCarteleraVirtual } from '../hooks/useCarteleraVirtual';

LocaleConfig.locales['es'] = {
  monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
  monthNamesShort: ['Ene.', 'Feb.', 'Mar', 'Abr', 'May', 'Jun', 'Jul.', 'Ago', 'Sept.', 'Oct.', 'Nov.', 'Dic.'],
  dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
  dayNamesShort: ['Dom.', 'Lun.', 'Mar.', 'Mié.', 'Jue.', 'Vie.', 'Sáb.'],
  today: 'Hoy'
};
LocaleConfig.defaultLocale = 'es';

export default function CarteleraVirtualScreen () {
  const { colores } = useTema();
  const estilosCarteleraVirtual = getEstilosCarteleraVirtual(colores);

  const { user } = useSelector(state => state.usuario);
  // Verificamos si es administrador o presidente
  const esAdmin = user?.rol === 'administrador' || user?.rol === 'presidente';

  const {
    listaPublicaciones,
    modalVisible,
    modalEdicionVisible,
    publicacionSeleccionada,
    abrirModalNuevaPublicacion,
    cerrarModalNuevaPublicacion,
    cerrarModalEdicion,
    handleGuardarEdicion
  } = useCarteleraVirtual();

  const [fechaSeleccionada, setFechaSeleccionada] = useState('');

  const markedDates = useMemo(() => {
    let dates = {};
    if (!listaPublicaciones) return dates;

    listaPublicaciones.forEach(post => {
      if (post.fecha) {
        const partes = post.fecha.split('/'); 
        if(partes.length === 3) {
          const dia = partes[0].padStart(2, '0');
          const mes = partes[1].padStart(2, '0');
          const anio = partes[2];
          const fechaFormateada = `${anio}-${mes}-${dia}`; 
          
          const tipo = post.tipo?.toLowerCase() || 'noticia';
          let dotColor = '#3498db'; // Azul para Noticia 
          if (tipo === 'evento') dotColor = '#e74c3c'; // Rojo para Eventos
          else if (tipo === 'aviso') dotColor = '#f39c12'; // Naranja para Avisos
          
          if (!dates[fechaFormateada]) {
            dates[fechaFormateada] = { dots: [] };
          }

          const yaTieneEseTipo = dates[fechaFormateada].dots.some(dot => dot.key === tipo);
          
          if (!yaTieneEseTipo) {
            dates[fechaFormateada].dots.push({ key: tipo, color: dotColor });
          }
        }
      }
    });
    
    if (fechaSeleccionada) {
      if (!dates[fechaSeleccionada]) {
        dates[fechaSeleccionada] = { dots: [] };
      }
      dates[fechaSeleccionada].selected = true;
      dates[fechaSeleccionada].selectedColor = colores.primario || '#007BFF';
    }
    
    return dates;
  }, [listaPublicaciones, fechaSeleccionada, colores]);

  const listaPublicacionesMostrar = useMemo(() => {
    if (!fechaSeleccionada) return listaPublicaciones; 
    
    return listaPublicaciones.filter(post => {
      if (!post.fecha) return false;
      const partes = post.fecha.split('/');
      if (partes.length !== 3) return false;
      const dia = partes[0].padStart(2, '0');
      const mes = partes[1].padStart(2, '0');
      const anio = partes[2];
      const fechaFormateada = `${anio}-${mes}-${dia}`;
      return fechaFormateada === fechaSeleccionada;
    });
  }, [listaPublicaciones, fechaSeleccionada]);

  const renderHeader = () => (
    <View style={{ marginBottom: 20 }}>
      <Text style={[estilosCarteleraVirtual.title, { marginBottom: 10 }]}>Cartelera Virtual</Text>
      
      <View style={estilosCarteleraVirtual.calendarContainer}>
        <Calendar
          markingType={'multi-dot'} // <-- MAGIA: Cambia a modo de múltiples puntos
          onDayPress={(day) => {
            if (fechaSeleccionada === day.dateString) {
              setFechaSeleccionada('');
            } else {
              setFechaSeleccionada(day.dateString);
            }
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

      {/* LEYENDA DE COLORES (Ayuda visual para los usuarios) */}
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
        <FlatList
          data={listaPublicacionesMostrar}
          keyExtractor={(item) => item.id.toString()}
          ListHeaderComponent={renderHeader}
          renderItem={({ item }) => <PublicacionCard post={item} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          ListEmptyComponent={
            <Text style={{ color: colores.textPlaceholder, textAlign: 'center', marginTop: 20 }}>
              No hay publicaciones para esta fecha.
            </Text>
          }
        />
      </View>

      {esAdmin && (
        <TouchableOpacity 
          style={[estilosCarteleraVirtual.fab, { backgroundColor: colores.backgroundBotones || '#007BFF' }]} 
          onPress={abrirModalNuevaPublicacion}
          activeOpacity={0.8}
        >
          <Icon name="megaphone-outline" size={26} color="#fff" />
        </TouchableOpacity>
      )}

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
