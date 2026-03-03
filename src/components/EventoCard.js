// components/EventoCard.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTema } from '../hooks/useTema';
import { obtenerDiaMes } from '../utils/dateUtils';

const EventoCard = ({ evento, onPress }) => {
  const { colores } = useTema();
  const estilos = getEstilos(colores);

  const { dia, mes } = obtenerDiaMes(evento.fecha);

  return (
    <TouchableOpacity style={estilos.card} onPress={() => onPress(evento)} activeOpacity={0.7}>
      <View style={estilos.fechaContainer}>
        <Text style={estilos.fechaDia}>{dia}</Text>
        <Text style={estilos.fechaMes}>{mes}</Text>
      </View>
      <View style={estilos.infoContainer}>
        <Text style={estilos.titulo} numberOfLines={1}>{evento.titulo}</Text>
        <Text style={estilos.descripcion} numberOfLines={2}>{evento.descripcion}</Text>
      </View>
      <Icon name="chevron-forward-outline" size={20} color={colores.text} />
    </TouchableOpacity>
  );
};

const getEstilos = (colores) => StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colores.card,
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  fechaContainer: {
    backgroundColor: colores.primario || '#007BFF',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    marginRight: 12,
  },
  fechaDia: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  fechaMes: {
    color: '#fff',
    fontSize: 12,
    textTransform: 'uppercase',
  },
  infoContainer: {
    flex: 1,
  },
  titulo: {
    fontSize: 16,
    fontWeight: '600',
    color: colores.text,
    marginBottom: 4,
  },
  descripcion: {
    fontSize: 14,
    color: colores.textPlaceholder || '#999',
  },
});

export default EventoCard;