import React from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView, StyleSheet, Image } from 'react-native';
import { useTema } from './../hooks/useTema';
import { getEstilosModalDetalles } from './../styles/components/estilosModalDetalles'

const ModalDetalles = ({ 
  visible, 
  onClose, 
  datos = {}, 
  titulo = "Detalles",
  campos = [],
  mostrarImagen = true 
}) => {
  const { colores } = useTema();
  const estilosModalDetalles = getEstilosModalDetalles(colores);
  
  if (!datos || Object.keys(datos).length === 0) { return }
  
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={estilosModalDetalles.modalOverlay}>
        <View style={[estilosModalDetalles.modalContent, { backgroundColor: colores.card }]}>
          <Text style={[estilosModalDetalles.modalTitle]}>
            {titulo}
          </Text>
          
          <ScrollView style={estilosModalDetalles.detailsContainer}>
            {mostrarImagen && datos.imagen && (
              <Image source={{ uri: datos.imagen }} style={estilosModalDetalles.detailsImage} />
            )}
            
            <View style={estilosModalDetalles.detailsContent}>
              {campos.map((campo, index) => (
                <View key={index}>
                  <Text style={estilosModalDetalles.detailsLabel}>{campo.label}:</Text>
                  <Text style={estilosModalDetalles.detailsValue}>
                    {datos[campo.key] || 'No disponible'}
                  </Text>
                </View>
              ))}
            </View>
          </ScrollView>

          <TouchableOpacity 
            style={estilosModalDetalles.primaryBtn} 
            activeOpacity={0.8} 
            onPress={onClose}
          >
            <Text style={estilosModalDetalles.primaryBtnText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ModalDetalles;