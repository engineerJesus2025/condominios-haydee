import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useTema } from '../hooks/useTema';
import Icon from 'react-native-vector-icons/Ionicons';

import ModalGeneral from './ModalGeneral';
import CustomBoton from './CustomBoton';
import VisorImagenFullScreen from './VisorImagenFullScreen';
import { formatearFechaLegible, tiempoRelativo } from '../utils/dateUtils';

export default function ModalDetalles({
  visible,
  onClose,
  datos = {},
  titulo = 'Detalles',
  campos = [],
  mostrarImagen = true,
  esAdmin = false, 
  onAprobar = null,
  onRechazar = null,
  procesando = false
}) {
  const { colores } = useTema();
  const [imagenExpandida, setImagenExpandida] = useState(false);

  if (!datos || Object.keys(datos).length === 0) return null;

  // Renderizado dinámico del Footer basado en si es Admin y el estado
  const BotonesFooter = esAdmin && datos.estado?.toLowerCase() === 'pendiente' ? (
    <>
      <CustomBoton 
          titulo="Rechazar" 
          evento={() => onRechazar && onRechazar(datos)} 
          icono={{ nombre: 'close-circle-outline', color: '#fff' }}
          estilos={{ backgroundColor: '#e74c3c', width: '100%', alignSelf: 'stretch' }} 
          fuente={15}
          disabled={procesando}
          loading={procesando}
        />
      <CustomBoton 
          titulo="Aprobar" 
          evento={() => onAprobar && onAprobar(datos)} 
          icono={{ nombre: 'checkmark-circle-outline', color: '#fff' }}
          // Al agregar width: '100%' y alignSelf: 'stretch' forzamos a que el botón se expanda completo
          estilos={{ backgroundColor: '#27ae60', width: '100%', alignSelf: 'stretch' }} 
          fuente={15}
          disabled={procesando}
          loading={procesando}
        />
    </>
  ) : (
    <CustomBoton 
      titulo="Cerrar Detalles" 
      evento={onClose} 
      icono={{ nombre: 'close-circle-outline', color: '#fff' }}
      estilos={{ backgroundColor: '#95a5a6' }} 
      fuente={16}
    />
  );

  // const BotonesFooter = esAdmin && datos.estado?.toLowerCase() === 'pendiente' ? (
  //   <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
  //     <View style={{ flex: 1, marginRight: 5 }}>
  //       <CustomBoton 
  //         titulo={procesando ? "Procesando..." : "Rechazar"} 
  //         evento={() => onRechazar && onRechazar(datos)} 
  //         icono={{ nombre: procesando ? 'hourglass-outline' : 'close-circle-outline', color: '#fff' }}
  //         estilos={{ backgroundColor: procesando ? '#bdc3c7' : '#e74c3c' }} 
  //         fuente={15}
  //         disabled={procesando}
  //         cargando={procesando}
  //       />
  //     </View>
  //     <View style={{ flex: 1, marginLeft: 5 }}>
  //       <CustomBoton 
  //         titulo={procesando ? "Guardando..." : "Aprobar"} 
  //         evento={() => onAprobar && onAprobar(datos)} 
  //         icono={{ nombre: procesando ? 'sync-outline' : 'checkmark-circle-outline', color: '#fff' }}
  //         estilos={{ backgroundColor: procesando ? '#bdc3c7' : '#27ae60' }} 
  //         fuente={15}
  //         disabled={procesando}
  //         cargando={procesando}
  //       />
  //     </View>
  //   </View>
  // ) : (
  //   <CustomBoton 
  //     titulo="Cerrar Detalles" 
  //     evento={onClose} 
  //     icono={{ nombre: 'close-circle-outline', color: '#fff' }}
  //     estilos={{ backgroundColor: '#95a5a6' }} 
  //     fuente={16}
  //   />
  // );

  return (
    <>
      <ModalGeneral
        visible={visible}
        onClose={onClose}
        titulo={titulo}
        iconoHeader={{ name: 'document-text-outline', color: '#E1E1F7' }}
        footer={BotonesFooter}
        esFormulario={false}
      >
        
        {/* --- TARJETA DE DATOS --- */}
        <View style={[styles.reciboContainer, { backgroundColor: colores.card, borderColor: colores.border }]}>
          {campos.map((campo, index) => {
            const valor = datos[campo.key];
            const isEstado = campo.key.toLowerCase() === 'estado';
            const isMonto = campo.key.toLowerCase() === 'monto';
            const isUltimo = index === campos.length - 1;

            let valorMostrar = valor;
            if (valor && campo.formato) {
              if (campo.formato === 'fecha_legible') {
                valorMostrar = formatearFechaLegible(valor);
              } else if (campo.formato === 'tiempo_relativo') {
                valorMostrar = tiempoRelativo(valor);
              }
            }
            
            return (
              <View key={index} style={[styles.fila, !isUltimo && { borderBottomColor: colores.border, borderBottomWidth: 1 }]}>
                <Text style={[styles.label, { color: colores.textPlaceholder }]}>
                  {campo.label}
                </Text>
                
                {isEstado ? (
                  <View style={[
                    styles.badge, 
                    { backgroundColor: valorMostrar?.toLowerCase() === 'procesado' ? '#27ae6020' : valorMostrar?.toLowerCase() === 'rechazado' ? '#e23c3c20' : '#f39c1220'},
                  ]}>
                    <Text style={[
                      styles.badgeText, 
                      { color: valorMostrar?.toLowerCase() === 'procesado' ? '#27ae60' : valorMostrar?.toLowerCase() === 'rechazado' ? '#e74c3c' : '#f39c12' }
                    ]}>
                      {valorMostrar || 'Desconocido'}
                    </Text>
                  </View>
                ) : isMonto ? (
                  <Text style={[styles.valor, styles.valorMonto, { color: colores.textTitle }]}>
                    {valorMostrar || '---'}
                  </Text>
                ) : (
                  <Text style={[styles.valor, { color: colores.textTitle }]} numberOfLines={2}>
                    {valorMostrar || 'No especificado'}
                  </Text>
                )}
              </View>
            );
          })}
        </View>

        {/* --- VISTA PREVIA IMAGEN --- */}
        {mostrarImagen && datos.imagen && (
          <View style={styles.imagenContainer}>
            <View style={styles.imagenHeader}>
              <Icon name="image-outline" size={18} color={colores.textPlaceholder} />
              <Text style={[styles.imagenTitulo, { color: colores.textPlaceholder }]}>
                Comprobante Adjunto
              </Text>
            </View>

            <TouchableOpacity 
              activeOpacity={0.8} 
              onPress={() => setImagenExpandida(true)}
              style={styles.imagenPreviewContainer}
            >
              <Image 
                source={{ uri: datos.imagen }} 
                style={styles.imagenPreview} 
              />
              
              <View style={styles.overlayAmpliar}>
                <Icon name="expand-outline" size={20} color="#fff" />
                <Text style={styles.textoAmpliar}>Tocar para ampliar</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

      </ModalGeneral>

      <VisorImagenFullScreen 
        visible={imagenExpandida} 
        onClose={() => setImagenExpandida(false)} 
        imageUri={datos?.imagen} 
      />
    </>
  );
}

const styles = StyleSheet.create({
  reciboContainer: {
    borderRadius: 14, borderWidth: 1, overflow: 'hidden', marginBottom: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2,
  },
  fila: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16 },
  label: { fontSize: 14, flex: 1 },
  valor: { fontSize: 15, fontWeight: '500', flex: 1.5, textAlign: 'right' },
  valorMonto: { fontSize: 18, fontWeight: 'bold' },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeText: { fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase' },
  
  imagenContainer: { marginTop: 10, alignItems: 'center' },
  imagenHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, alignSelf: 'flex-start', marginLeft: 5 },
  imagenTitulo: { fontSize: 14, fontWeight: '600', marginLeft: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
  imagenPreviewContainer: {
    width: '100%', height: 180, borderRadius: 12, overflow: 'hidden', backgroundColor: '#000', 
  },
  imagenPreview: { width: '100%', height: '100%' },
  overlayAmpliar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 10,
  },
  textoAmpliar: { color: '#fff', fontSize: 14, fontWeight: 'bold', marginLeft: 8 },
});