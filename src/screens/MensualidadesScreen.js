// src/screens/MensualidadesScreen.js
import React from 'react';
import { View, Text, FlatList } from 'react-native';

import AppHeader from '../components/Header';
import Footer from '../components/Footer';
import MensualidadCard from '../components/MensualidadCard'; // Importamos la nueva tarjeta

import { getEstilosMensualidades } from '../styles/screens/estilosMensualidades';
import { useTema } from './../hooks/useTema';

// Tu arreglo de datos de prueba
const DATA = [
  { id: '1', fecha: 'Enero del 2025', total: '0.19 Bs. / 0.00 $', restante: '0.14 Bs. / 0.00 $' },
  { id: '2', fecha: 'Febrero del 2025', total: '1.98 Bs. / 0.01 $', restante: '1.03 Bs. / 0.01 $' },
  { id: '3', fecha: 'Marzo del 2025', total: '163.23 Bs. / 0.84 $', restante: '109.09 Bs. / 0.56 $' },
  { id: '4', fecha: 'Abril del 2025', total: '113.10 Bs. / 0.58 $', restante: '92.10 Bs. / 0.47 $' },
  { id: '5', fecha: 'Mayo del 2025', total: '316.45 Bs. / 1.62 $', restante: '308.21 Bs. / 1.58 $' }
];

export default function MensualidadesScreen () {
  const { colores } = useTema();
  const estilosMensualidad = getEstilosMensualidades(colores);

  // Esta función se ejecutará cuando el usuario toque el botón en la tarjeta
  const manejarVerDetalles = (mensualidad) => {
    // Aquí más adelante podemos abrir el ModalDetalles que ya tienes
    console.log('Ver presupuesto/pagar para:', mensualidad.fecha);
  };

  return (
    // Agregué flex: 1 para que ocupe toda la pantalla correctamente
    <View style={{ flex: 1, backgroundColor: colores.fondo }}> 
      <AppHeader />

      {/* Ajustamos el contenedor principal para darle espacio a la lista */}
      <View style={[estilosMensualidad.mainContentContainer, { flex: 1, paddingHorizontal: 15 }]}>
        
        <Text style={estilosMensualidad.title}>Mis Mensualidades</Text>
        
        {/* Aquí entra la magia móvil: El FlatList */}
        <FlatList
          data={DATA}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MensualidadCard 
              mensualidad={item} 
              onPressDetalles={manejarVerDetalles} 
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20, paddingTop: 10 }}
          ListEmptyComponent={<Text>No hay mensualidades registradas</Text>}
        />

      </View>

      <Footer />
    </View>
  );
}