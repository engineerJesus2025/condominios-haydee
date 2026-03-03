// components/ProgresoPresupuesto.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Rect, G, Text as SvgText } from 'react-native-svg';
import { useTema } from '../hooks/useTema';

/**
 * Barra de progreso para mostrar el avance del presupuesto.
 * @param {number} gastado - Monto gastado hasta ahora.
 * @param {number} total - Presupuesto total del mes.
 * @param {string} moneda - Símbolo de moneda (ej. "Bs").
 */
const ProgresoPresupuesto = ({ gastado = 0, total = 0, moneda = "Bs" }) => {
  const { colores } = useTema();
  const estilos = getEstilos(colores);

  // Calcular porcentaje (evitar división por cero)
  const porcentaje = total > 0 ? Math.min((gastado / total) * 100, 100) : 0;

  // Determinar color según el porcentaje
  let colorBarra = colores.success || '#27ae60'; // verde
  if (porcentaje > 90) {
    colorBarra = colores.error || '#e74c3c'; // rojo
  } else if (porcentaje > 70) {
    colorBarra = colores.warning || '#f39c12'; // amarillo/naranja
  }

  // Ancho de la barra de progreso (fijo 300px, pero podemos hacerlo responsive)
  const anchoTotal = 250;
  const anchoProgreso = (porcentaje / 100) * anchoTotal;

  return (
    <View style={estilos.container}>
      <View style={estilos.header}>
        <Text style={estilos.label}>Presupuesto del mes</Text>
        <Text style={estilos.valor}>{moneda} {gastado.toFixed(2)} / {moneda} {total.toFixed(2)}</Text>
      </View>

      <View style={estilos.barraContainer}>
        <Svg height="35" width={anchoTotal}>
          {/* Fondo de la barra */}
          <Rect
            x="0"
            y="8"
            width={anchoTotal}
            height="14"
            fill={colores.inputBackground || '#ecf0f1'}
            rx="7"
            ry="7"
          />
          {/* Barra de progreso */}
          <Rect
            x="0"
            y="8"
            width={anchoProgreso}
            height="14"
            fill={colorBarra}
            rx="7"
            ry="7"
          />
          {/* Texto del porcentaje (opcional) */}
          {porcentaje > 5 && (
            <SvgText
              x={anchoProgreso - 30}
              y="20"
              fill="#fff"
              fontSize="10"
              fontWeight="bold"
              textAnchor="end"
            >
              {`${Math.round(porcentaje)}%`}
            </SvgText>
          )}
        </Svg>
      </View>
    </View>
  );
};

const getEstilos = (colores) => StyleSheet.create({
  container: {
    backgroundColor: colores.card,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    flexWrap:'wrap',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colores.text,
  },
  valor: {
    fontSize: 14,
    color: colores.textPlaceholder || '#999',
  },
  barraContainer: {
    alignItems: 'center',
    justifyContent:'center',

  },
});

export default ProgresoPresupuesto;