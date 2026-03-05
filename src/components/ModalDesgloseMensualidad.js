import React from 'react';
import { Modal, View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTema } from '../hooks/useTema';
import Icon from 'react-native-vector-icons/Ionicons';
import CustomBoton from './CustomBoton';
import HeaderFormulario from './HeaderFormulario';

const BarraCategoria = ({ categoria, monto, porcentaje, color, coloresTema }) => (
  <View style={styles.categoriaContainer}>
    <View style={styles.categoriaHeader}>
      <Text style={[styles.categoriaNombre, { color: coloresTema.text }]}>{categoria}</Text>
      <Text style={[styles.categoriaMonto, { color: coloresTema.textTitle }]}>{monto} Bs ({porcentaje}%)</Text>
    </View>
    <View style={[styles.barraFondo, { backgroundColor: coloresTema.border }]}>
      <View style={[styles.barraProgreso, { width: `${porcentaje}%`, backgroundColor: color }]} />
    </View>
  </View>
);

export default function ModalDesgloseMensualidad({ visible, onClose, mensualidad }) {
  const { colores } = useTema();

  if (!mensualidad) return null;

  const desgloseDelMes = mensualidad.desglose || [];

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.modalContent, { backgroundColor: colores.background }]}>
          
          <HeaderFormulario 
            titulo={`Presupuesto: ${mensualidad.fecha}`} 
            evento={onClose} 
            icono={{ name: 'pie-chart-outline', color: '#fff' }} 
          />

          <ScrollView style={styles.scrollContent}>
            <View style={[styles.resumenCaja, { backgroundColor: colores.card }]}>
              <Text style={styles.resumenTexto}>Cuota del Apartamento</Text>
              <Text style={[styles.resumenTotal, { color: colores.textTitle }]}>
                {mensualidad.total}
              </Text>
              <View style={styles.alertaContainer}>
                <Icon name="information-circle" size={16} color="#007BFF" />
                <Text style={styles.alertaTexto}>Basado en la alícuota de tu apartamento</Text>
              </View>
            </View>

            <Text style={[styles.tituloDesglose, { color: colores.textTitle }]}>
              Desglose de Gastos del Mes
            </Text>

            {/* Renderizado dinámico condicional */}
            {desgloseDelMes.length > 0 ? (
              desgloseDelMes.map((item, index) => (
                <BarraCategoria 
                  key={item.id || index.toString()}
                  categoria={item.categoria}
                  monto={item.monto}
                  porcentaje={item.porcentaje}
                  color={item.color}
                  coloresTema={colores}
                />
              ))
            ) : (
              <Text style={{ textAlign: 'center', color: colores.textPlaceholder, marginTop: 20 }}>
                Aún no hay desglose disponible para este mes.
              </Text>
            )}
            
            <View style={{ height: 20 }} />
          </ScrollView>

          <View style={[styles.footer, { backgroundColor: colores.card, borderTopColor: colores.border }]}>
             <CustomBoton 
                titulo="Entendido" 
                evento={onClose} 
                estilos={{ width: '100%', alignItems: 'center', marginBottom: 0 }} 
                icono={{ nombre: 'checkmark-circle-outline', color: '#fff' }}
              />
          </View>

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalContent: { height: '85%', borderTopLeftRadius: 20, borderTopRightRadius: 20, overflow: 'hidden' },
  scrollContent: { padding: 20 },
  resumenCaja: { padding: 20, borderRadius: 12, alignItems: 'center', marginBottom: 20, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 },
  resumenTexto: { fontSize: 16, color: '#7f8c8d', marginBottom: 5 },
  resumenTotal: { fontSize: 28, fontWeight: 'bold' },
  alertaContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 10, backgroundColor: '#e6f2ff', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 15 },
  alertaTexto: { fontSize: 12, color: '#007BFF', marginLeft: 5 },
  tituloDesglose: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  categoriaContainer: { marginBottom: 16 },
  categoriaHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  categoriaNombre: { fontSize: 14, fontWeight: '500' },
  categoriaMonto: { fontSize: 14, fontWeight: 'bold' },
  barraFondo: { height: 8, borderRadius: 4, width: '100%' },
  barraProgreso: { height: 8, borderRadius: 4 },
  footer: { padding: 20, borderTopWidth: 1 }
});