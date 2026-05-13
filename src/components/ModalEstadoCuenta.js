import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTema } from '../hooks/useTema';
import Icon from 'react-native-vector-icons/Ionicons';

import ModalGeneral from './ModalGeneral';
import CustomBoton from './CustomBoton';

import { DATA_DEUDAS_PENDIENTES } from '../utils/Data';

export default function ModalEstadoCuenta({ visible, onClose, totalDeuda, moneda = "$" }) {
  const { colores } = useTema();

  const BotonesFooter = (
    <CustomBoton 
      titulo="Cerrar Detalles" 
      evento={onClose} 
      icono={{ nombre: 'close-circle-outline', color: '#fff' }}
      estilos={{ backgroundColor: '#95a5a6' }} 
      fuente={16}
    />
  );

  return (
    <ModalGeneral
      visible={visible}
      onClose={onClose}
      titulo="Estado de Cuenta"
      iconoHeader={{ name: 'receipt-outline', color: '#E1E1F7' }}
      footer={BotonesFooter}
      esFormulario={false} // Al ser false, omite el cálculo del teclado
    >
      
      {/* --- CAJA DE RESUMEN --- */}
      <View style={[styles.resumenCaja, { backgroundColor: colores.card }]}>
        <Text style={styles.resumenTexto}>Total Vencido</Text>
        <Text style={[styles.resumenTotal, { color: colores.error || '#e74c3c' }]}>
          {moneda} {totalDeuda.toFixed(2)}
        </Text>
      </View>

      <Text style={[styles.tituloDesglose, { color: colores.textTitle }]}>
        Detalle de deudas pendientes
      </Text>

      {/* --- LISTA DE DEUDAS --- */}
      {DATA_DEUDAS_PENDIENTES.map((item) => (
        <View key={item.id} style={[styles.itemDeuda, { borderBottomColor: colores.border }]}>
          <View style={styles.itemInfo}>
            <Text style={[styles.itemConcepto, { color: colores.text }]}>{item.concepto}</Text>
            <Text style={styles.itemVencimiento}>Venció: {item.vencimiento}</Text>
          </View>
          <Text style={[styles.itemMonto, { color: colores.textTitle }]}>
            {moneda} {item.monto.toFixed(2)}
          </Text>
        </View>
      ))}
      
      {/* --- MENSAJE INFORMATIVO --- */}
      <View style={styles.infoContainer}>
        <Icon name="information-circle-outline" size={20} color={colores.textPlaceholder} />
        <Text style={[styles.infoTexto, { color: colores.textPlaceholder }]}>
          Si ya realizaste el pago de alguna de estas cuotas, por favor regístralo en el botón "+" de la pantalla anterior.
        </Text>
      </View>

    </ModalGeneral>
  );
}

const styles = StyleSheet.create({
  resumenCaja: { padding: 20, borderRadius: 12, alignItems: 'center', marginBottom: 20, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 },
  resumenTexto: { fontSize: 16, color: '#7f8c8d', marginBottom: 5 },
  resumenTotal: { fontSize: 32, fontWeight: 'bold' },
  tituloDesglose: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  itemDeuda: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1 },
  itemInfo: { flex: 1, paddingRight: 10 },
  itemConcepto: { fontSize: 15, fontWeight: '600', marginBottom: 4 },
  itemVencimiento: { fontSize: 13, color: '#e74c3c' },
  itemMonto: { fontSize: 16, fontWeight: 'bold' },
  infoContainer: { flexDirection: 'row', marginTop: 20, padding: 15, backgroundColor: 'rgba(0,0,0,0.03)', borderRadius: 10, alignItems: 'center' },
  infoTexto: { flex: 1, marginLeft: 10, fontSize: 13, lineHeight: 18 }
});