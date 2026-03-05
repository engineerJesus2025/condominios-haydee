import React, { useRef, useEffect } from 'react';
import { Modal, View, ScrollView, TouchableOpacity, Text } from 'react-native'; 
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTema } from '../hooks/useTema';
import { useFormularioPago } from '../hooks/useFormularioPago';

import { Controller } from 'react-hook-form';

import HeaderFormulario from './HeaderFormulario';
import ErrorFormulario from './ErrorFormulario';
import InputFormulario from './InputFormulario';
import LabelInput from './LabelInput';
import CustomBoton from './CustomBoton';
import MostrarVistaPrevia from './MostrarVistaPrevia';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export default function ModalFormularioPago({ visible, onClose }) {
  const insets = useSafeAreaInsets();
  const { colores } = useTema();

  const montoRef = useRef(null);
  
  const {
    control,
    errors,
    comprobanteUri,
    isSubmitting,
    canSubmit,
    handleSubmit,
    handleImagePick,
    removeImage,
    onSubmit,
    handleCancel,
    mesesPendientes,
    bancosDisponibles,
    seleccionarMes,
    seleccionarBanco
  } = useFormularioPago(onClose);

  const reglas = {
    requerido: { required: { value: true, message: 'Obligatorio' }, maxLength: { value: 50, message: 'Máximo 50 caracteres' } },
    monto: { required: { value: true, message: 'Obligatorio' }, pattern: { value: /^[0-9]+(\.[0-9]{1,2})?$/, message: 'Ej. 150.50' } }
  };

  return (
    <Modal visible={visible} animationType="slide" statusBarTranslucent={true}>
      <View style={{ height: insets.top, backgroundColor: '#000' }} />
      <View style={{ flex: 1, backgroundColor: colores.background }}>
        
        <HeaderFormulario titulo="Registrar Pago" evento={handleCancel} icono={{ name: 'cash-outline', color: '#E1E1F7' }} />
        <KeyboardAwareScrollView
        style={{ flex: 1 }}
          resetScrollToCoords={{ x: 0, y: 0 }}
          contentContainerStyle={{ padding: 20 }}
          scrollEnabled={true}
          enableOnAndroid={true} 
          extraScrollHeight={0} 
        >
          <LabelInput titulo="Mes a Pagar" icono={{ nombre: 'calendar-outline', color: '#3498db' }} />
          <Controller
            control={control}
            name="mes"
            rules={{ required: 'Selecciona un mes' }}
            render={({ field: { value } }) => (
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 15 }}>
                {mesesPendientes.map((item) => {
                  const isSelected = value === item.mes;
                  return (
                    <TouchableOpacity
                      key={item.id}
                      activeOpacity={0.7}
                      onPress={() => seleccionarMes(item.mes, item.monto)}
                      style={{
                        paddingHorizontal: 14, paddingVertical: 10, borderRadius: 20, borderWidth: 1.5,
                        marginRight: 8, marginBottom: 8,
                        borderColor: isSelected ? (colores.primario || '#3498db') : colores.border,
                        backgroundColor: isSelected ? (colores.primario + '15' || '#eaf4fc') : colores.card,
                      }}
                    >
                      <Text style={{
                        color: isSelected ? (colores.primario || '#3498db') : colores.textPlaceholder,
                        fontWeight: isSelected ? 'bold' : '500',
                      }}>
                        {item.mes}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          />
          <ErrorFormulario error={errors.mes} />

          <LabelInput titulo="Banco de Origen" icono={{ nombre: 'business-outline', color: '#3498db' }} />
          <Controller
            control={control}
            name="banco"
            rules={{ required: 'Selecciona un banco' }}
            render={({ field: { value } }) => (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 15 }}>
                {bancosDisponibles.map((banco) => {
                  const isSelected = value === banco;
                  return (
                    <TouchableOpacity
                      key={banco}
                      activeOpacity={0.7}
                      onPress={() => seleccionarBanco(banco)}
                      style={{
                        paddingHorizontal: 14, paddingVertical: 10, borderRadius: 20, borderWidth: 1.5, marginRight: 8,
                        borderColor: isSelected ? (colores.primario || '#3498db') : colores.border,
                        backgroundColor: isSelected ? (colores.primario + '15' || '#eaf4fc') : colores.card,
                      }}
                    >
                      <Text style={{
                        color: isSelected ? (colores.primario || '#3498db') : colores.textPlaceholder,
                        fontWeight: isSelected ? 'bold' : '500',
                      }}>
                        {banco}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            )}
          />
          <ErrorFormulario error={errors.banco} />

          <LabelInput titulo="Nro. Referencia" icono={{ nombre: 'document-text-outline', color: '#3498db' }} />
          <InputFormulario 
            control={control} 
            name="referencia" 
            rules={reglas.requerido} 
            icono={{ nombre: 'barcode', color: '#95a5a6' }} 
            error={errors.referencia} 
            placeholder="Ejm: 004589234" 
            keyboardType="numeric"
            returnKeyType="next"
            blurOnSubmit={false}
            onSubmitEditing={() => montoRef.current?.focus()} 
          />
          <ErrorFormulario error={errors.referencia} />

          <LabelInput titulo="Monto (Bs)" icono={{ nombre: 'cash-outline', color: '#3498db' }} />
          <InputFormulario 
            control={control} 
            name="monto" 
            rules={reglas.monto} 
            icono={{ nombre: 'cash', color: '#95a5a6' }} 
            error={errors.monto} 
            placeholder="Ejm: 150.50" 
            keyboardType="decimal-pad" 
            inputRef={montoRef}
            returnKeyType="search"
            onSubmitEditing={handleImagePick}
          />
          <ErrorFormulario error={errors.monto} />

          <LabelInput titulo="Comprobante" icono={{ nombre: 'image-outline', color: '#3498db' }} />
          <View style={{ flexDirection: 'row', gap: 10, marginBottom: 10 }}>
            <CustomBoton titulo={comprobanteUri ? 'Cambiar Foto' : 'Subir Foto'} evento={handleImagePick} icono={{ nombre: 'camera-outline', color: '#fff' }} estilos={{ flex: 1 }} />
            {comprobanteUri && (
              <CustomBoton titulo="Quitar" evento={removeImage} icono={{ nombre: 'trash-outline', color: '#fff' }} estilos={{ backgroundColor: '#e74c3c' }} />
            )}
          </View>
          {comprobanteUri && <MostrarVistaPrevia titulo="Recibo adjunto:" imageUri={comprobanteUri} />}

        </KeyboardAwareScrollView>

        <View style={{ flexDirection: 'row', padding: 20, backgroundColor: colores.backgroundBotones, justifyContent: 'space-between' }}>
          <CustomBoton titulo="Cancelar" evento={handleCancel} icono={{ nombre: 'close', color: '#fff' }} estilos={{ backgroundColor: '#95a5a6' }} />
          <CustomBoton titulo="Enviar Pago" evento={handleSubmit(onSubmit)} icono={{ nombre: 'send', color: '#fff' }} disabled={!canSubmit || isSubmitting} estilos={{ backgroundColor: '#27ae60', opacity: canSubmit ? 1 : 0.6 }} />
        </View>

      </View>

    </Modal>
  );
}