import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTema } from '../hooks/useTema';
import CustomBoton from './CustomBoton';

const DeudaResumenCard = ({ 
  totalDeuda = 0, 
  onVerDetalle, 
  titulo = "Tu deuda pendiente",
  moneda = "Bs" 
}) => {
  const { colores } = useTema();
  const estilos = getEstilos(colores);

  const tieneDeuda = totalDeuda > 0;

  return (
    <View style={estilos.card}>
      <View style={estilos.header}>
        <Icon 
          name={tieneDeuda ? "warning-outline" : "checkmark-circle-outline"} 
          size={24} 
          color={tieneDeuda ? (colores.error || '#e74c3c') : (colores.success || '#27ae60')} 
        />
        <Text style={estilos.titulo}>{titulo}</Text>
      </View>
      
      <Text style={estilos.monto}>
        {moneda} {totalDeuda.toFixed(2)}
      </Text>
      
      {/* Acción según estado */}
      {tieneDeuda ? (
        <CustomBoton
          titulo="Ver detalles"
          evento={onVerDetalle}
          icono={{ nombre: 'arrow-forward-outline', color: '#fff' }}
          estilos={estilos.boton}
          fuente={14}
        />
      ) : (
        <Text style={estilos.mensajeAlDia}>¡Estás al día!</Text>
      )}
    </View>
  );
};

const getEstilos = (colores) => StyleSheet.create({
  card: {
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
    alignItems: 'center',
    marginBottom: 12,
  },
  titulo: {
    fontSize: 16,
    fontWeight: '600',
    color: colores.text,
    marginLeft: 8,
  },
  monto: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colores.text,
    marginBottom: 12,
  },
  mensajeAlDia: {
    fontSize: 16,
    color: colores.success || '#27ae60',
    fontWeight: '500',
    textAlign: 'center',
  },
  boton: {
    alignSelf: 'stretch',
    backgroundColor: colores.primario || '#007BFF',
    borderRadius: 8,
    marginTop: 8,
  },
});

export default DeudaResumenCard;