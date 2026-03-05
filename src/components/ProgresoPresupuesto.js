import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Rect, G, Text as SvgText } from 'react-native-svg';
import { useTema } from '../hooks/useTema';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const ProgresoPresupuesto = ({ gastado = 0, total = 0, moneda = "Bs" }) => {
  const { colores } = useTema();
  const estilos = getEstilos(colores);

  const porcentaje = total > 0 ? Math.min((gastado / total) * 100, 100) : 0;

  let colorBarra = colores.success || '#27ae60'; // verde
  if (porcentaje > 90) {
    colorBarra = colores.error || '#e74c3c'; // rojo
  } else if (porcentaje > 70) {
    colorBarra = colores.warning || '#f39c12'; // amarillo/naranja
  }

  // Ancho de pantalla - (Márgenes exteriores horizontales 16*2) - (Padding interior 16*2)
  const anchoTotal = SCREEN_WIDTH - 90; 
  const anchoProgreso = (porcentaje / 100) * anchoTotal;

  return (
    <View style={estilos.container}>
      <View style={estilos.header}>
        <Text style={estilos.label}>Presupuesto del mes</Text>
        <Text style={estilos.valor}>{moneda} {gastado.toFixed(2)} / {moneda} {total.toFixed(2)}</Text>
      </View>

      <View style={estilos.barraContainer}>
        <Svg height="35" width={anchoTotal}>
          <Rect
            x="0"
            y="8"
            width={anchoTotal}
            height="14"
            fill={colores.inputBackground || '#ecf0f1'}
            rx="7"
            ry="7"
          />
          <Rect
            x="0"
            y="8"
            width={anchoProgreso}
            height="14"
            fill={colorBarra}
            rx="7"
            ry="7"
          />
          {porcentaje > 10 && (
            <SvgText
              x={anchoProgreso - 10} 
              y="19"
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
    flexWrap: 'wrap',
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
    justifyContent: 'center',
  },
});

export default ProgresoPresupuesto;