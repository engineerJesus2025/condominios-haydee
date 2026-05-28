import React from 'react';
import { FlatList, RefreshControl, Text, View, ActivityIndicator } from 'react-native';
import { useTema } from '../hooks/useTema';

export default function ListaRefrescable({ 
  data, 
  renderItem, 
  keyExtractor,
  cargando, 
  onRefresh, 
  ListHeaderComponent,
  mensajeVacio = "No hay información disponible.",
  contentContainerStyle,
  onEndReached,
  cargandoMas = false,
  ...restoProps 
}) {
  const { colores } = useTema();

  return (
    <FlatList
      data={data}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      ListHeaderComponent={ListHeaderComponent}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={contentContainerStyle || { paddingBottom: 100, paddingHorizontal: 16, paddingTop: 10 }}

      initialNumToRender={5}
      maxToRenderPerBatch={4}
      updateCellsBatchingPeriod={50}
      windowSize={5}
      removeClippedSubviews={true}

      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        cargandoMas ? (
          <View style={{ paddingVertical: 20, alignItems: 'center', justifyContent: 'center' }}>
             <ActivityIndicator size="small" color={colores.primario || '#007BFF'} />
             <Text style={{ marginTop: 6, fontSize: 12, color: colores.textPlaceholder }}>
               Cargando más publicaciones...
             </Text>
          </View>
        ) : null
      }
      ListEmptyComponent={
        !cargando ? (
          <Text style={{ color: colores.textPlaceholder, textAlign: 'center', marginTop: 20 }}>
            {mensajeVacio}
          </Text>
        ) : null
      }
      refreshControl={
        <RefreshControl
          refreshing={cargando}
          onRefresh={onRefresh}
          colors={[colores.primario || '#007BFF']} // Android
          tintColor={colores.primario || '#007BFF'} // iOS
        />
      }
      {...restoProps}
    />
  );
}