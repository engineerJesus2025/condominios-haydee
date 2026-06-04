import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'; 
import { Image } from 'expo-image';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTema } from '../hooks/useTema';
import { tiempoRelativo } from '../utils/dateUtils';

const IMAGEN_POR_DEFECTO = require('../../assets/publicacion-default.svg');

function PublicacionCard({ post, onPress }) {
  const { colores } = useTema();

  const estiloTipo = getEstiloTipo(post.tipo);
  const sourceImagen = post.imagen ? { uri: post.imagen } : IMAGEN_POR_DEFECTO;

  return (
    <TouchableOpacity 
      onPress={() => onPress(post)}
      activeOpacity={0.85}
      style={[styles.card, { backgroundColor: colores.card }]}
    >
      <View style={styles.headerContainer}>
        <View style={[styles.badge, { backgroundColor: estiloTipo.fondo }]}>
          <Icon name={estiloTipo.icono} size={14} color={estiloTipo.color} style={{ marginRight: 4 }} />
          <Text style={[styles.badgeText, { color: estiloTipo.color }]}>
            {estiloTipo.label}
          </Text>
        </View>
        <Text style={[styles.fecha, { color: colores.textPlaceholder }]}>
          {post.fecha ? tiempoRelativo(post.fecha) : 'Sin fecha'}
        </Text>
      </View>

      <Text style={[styles.titulo, { color: colores.textTitle }]}>
        {post.titulo}
      </Text>
      <Text style={[styles.descripcion, { color: colores.text }]} numberOfLines={4}>
        {post.descripcion}
      </Text>

      <Image
        source={sourceImagen}
        style={styles.imagen}
        contentFit="cover"
        transition={300}
        cachePolicy="disk"
      />
    </TouchableOpacity>
  );
}

export default memo(PublicacionCard);

const getEstiloTipo = (tipoRaw) => {
    const tipo = tipoRaw?.toLowerCase() || 'noticia';
    
    switch (tipo) {
      case 'evento':
        return { 
          color: '#f39c12', 
          fondo: 'rgba(243, 156, 18, 0.12)', // Naranja clarito
          icono: 'calendar-outline', 
          label: 'Evento' 
        };
      case 'aviso':
        return { 
          color: '#e74c3c', 
          fondo: 'rgba(231, 76, 60, 0.12)', // Rojo clarito
          icono: 'warning-outline', 
          label: 'Aviso' 
        };
      default: // noticia
        return { 
          color: '#3498db', 
          fondo: 'rgba(52, 152, 219, 0.12)', // Azul clarito
          icono: 'information-circle-outline', 
          label: 'Noticia' 
        };
    }
  };

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    overflow: 'hidden',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12, 
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  fecha: {
    fontSize: 12,
    fontWeight: '500',
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  descripcion: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 10,
  },
  imagen: { width: '100%', height: 200 },
});