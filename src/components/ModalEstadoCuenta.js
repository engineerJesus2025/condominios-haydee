import React from 'react';
import { Modal, View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTema } from '../hooks/useTema';
import Icon from 'react-native-vector-icons/Ionicons';
import CustomBoton from './CustomBoton';
import HeaderFormulario from './HeaderFormulario';

import { DATA_DEUDAS_PENDIENTES } from '../utils/Data';

export default function ModalEstadoCuenta({ visible, onClose, totalDeuda, moneda = "$" }) {
  const { colores } = useTema();

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.overlay}>
        <View style={[styles.modalContent, { backgroundColor: colores.background }]}>
          
          <HeaderFormulario 
            titulo="Estado de Cuenta" 
            evento={onClose} 
            icono={{ name: 'receipt-outline', color: '#fff' }} 
          />

          <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <View style={[styles.resumenCaja, { backgroundColor: colores.card }]}>
              <Text style={styles.resumenTexto}>Total Vencido</Text>
              <Text style={[styles.resumenTotal, { color: colores.error || '#e74c3c' }]}>
                {moneda} {totalDeuda.toFixed(2)}
              </Text>
            </View>

            <Text style={[styles.tituloDesglose, { color: colores.textTitle }]}>
              Detalle de deudas pendientes
            </Text>

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
            
            <View style={styles.infoContainer}>
              <Icon name="information-circle-outline" size={20} color={colores.textPlaceholder} />
              <Text style={[styles.infoTexto, { color: colores.textPlaceholder }]}>
                Si ya realizaste el pago de alguna de estas cuotas, por favor regístralo en el botón "+" de la pantalla anterior.
              </Text>
            </View>

            <View style={{ height: 20 }} />
          </ScrollView>

          {/* Botón de acción */}
          <View style={[styles.footer, { backgroundColor: colores.card, borderTopColor: colores.border }]}>
             <CustomBoton 
                titulo="Cerrar Detalles" 
                evento={onClose} 
                estilos={{ width: '100%', alignItems: 'center', marginBottom: 0 }} 
              />
          </View>

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalContent: { height: '80%', borderTopLeftRadius: 20, borderTopRightRadius: 20, overflow: 'hidden' },
  scrollContent: { padding: 20 },
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
  infoTexto: { flex: 1, marginLeft: 10, fontSize: 13, lineHeight: 18 },
  footer: { padding: 20, borderTopWidth: 1 }
});