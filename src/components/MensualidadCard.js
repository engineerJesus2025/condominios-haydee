// src/components/MensualidadCard.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function MensualidadCard({ mensualidad, onPressDetalles }) {
  // Evaluamos si hay deuda de manera sencilla para cambiar colores
  // (Asumimos que si el restante es mayor a 0, hay deuda)
  const tieneDeuda = parseFloat(mensualidad.restante) > 0;

  return (
    <View style={styles.card}>
      {/* Cabecera de la tarjeta con el mes */}
      <View style={styles.header}>
        <Text style={styles.mesTexto}>{mensualidad.fecha}</Text>
        <Text style={[styles.estado, tieneDeuda ? styles.estadoDeuda : styles.estadoPagado]}>
          {tieneDeuda ? 'Pendiente' : 'Al Día'}
        </Text>
      </View>

      {/* Cuerpo de la tarjeta con los montos */}
      <View style={styles.body}>
        <View style={styles.filaMonto}>
          <Text style={styles.etiqueta}>Total del mes:</Text>
          <Text style={styles.valor}>{mensualidad.total}</Text>
        </View>
        <View style={styles.filaMonto}>
          <Text style={styles.etiqueta}>Restante por pagar:</Text>
          <Text style={[styles.valor, tieneDeuda && styles.textoAlerta]}>
            {mensualidad.restante}
          </Text>
        </View>
      </View>

      {/* Botón de acción rápida */}
      <TouchableOpacity style={styles.boton} onPress={() => onPressDetalles(mensualidad)}>
        <Text style={styles.botonTexto}>Ver Presupuesto / Pagar</Text>
      </TouchableOpacity>
    </View>
  );
}

// Estilos temporales integrados (te sugiero moverlos a tu carpeta styles luego)
const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 3, // Sombra para Android
    shadowColor: '#000', // Sombra para iOS
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
    marginBottom: 10,
  },
  mesTexto: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  estado: {
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 5,
    overflow: 'hidden',
  },
  estadoDeuda: {
    backgroundColor: '#ffebee',
    color: '#d32f2f',
  },
  estadoPagado: {
    backgroundColor: '#e8f5e9',
    color: '#2e7d32',
  },
  body: {
    marginBottom: 15,
  },
  filaMonto: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  etiqueta: {
    fontSize: 14,
    color: '#666',
  },
  valor: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  textoAlerta: {
    color: '#d32f2f',
  },
  boton: {
    backgroundColor: '#0056b3', // Color primario (ajustar a tu tema)
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  botonTexto: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  }
});