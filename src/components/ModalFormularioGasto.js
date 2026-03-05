import React, { useRef, useEffect } from 'react';
import { Modal, View, TouchableOpacity, Text } from 'react-native'; 

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTema } from '../hooks/useTema';
import { useFormularioGasto } from '../hooks/useFormularioGasto';

import { Controller } from 'react-hook-form';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import HeaderFormulario from './HeaderFormulario';
import ErrorFormulario from './ErrorFormulario';
import InputFormulario from './InputFormulario';
import LabelInput from './LabelInput';
import CustomBoton from './CustomBoton';
import MostrarVistaPrevia from './MostrarVistaPrevia';

export default function ModalFormularioGasto({ visible, onClose }) {
  const { colores } = useTema();
    
  const proveedorRef = useRef(null);
  const montoRef = useRef(null);
  const descripcionRef = useRef(null);

  const insets = useSafeAreaInsets();

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
    handleCancel
  } = useFormularioGasto(onClose);

  const reglas = {
    requerido: { required: { value: true, message: 'Este campo es obligatorio' }, maxLength: { value: 60 } },
    monto: { required: { value: true, message: 'El monto es obligatorio' }, pattern: { value: /^[0-9]+(\.[0-9]{1,2})?$/, message: 'Ej. 150.50' } }
  };

  return (
    <Modal visible={visible} animationType="slide" statusBarTranslucent={true}>
      <View style={{ height: insets.top, backgroundColor: '#000' }} />
      <View style={{ flex: 1, backgroundColor: colores.background }}>
        
        <HeaderFormulario titulo="Registrar Gasto" evento={handleCancel} icono={{ name: 'cart-outline', color: '#E1E1F7' }} />

        <KeyboardAwareScrollView
          style={{ flex: 1 }}
          resetScrollToCoords={{ x: 0, y: 0 }}
          contentContainerStyle={{ padding: 20 }}
          scrollEnabled={true}
          enableOnAndroid={true}
          extraScrollHeight={10} // Un empuje suave, sin exagerar
        >
          
          <LabelInput titulo="Tipo de Gasto" icono={{ nombre: 'options-outline', color: '#3498db' }} />
          <Controller
            control={control}
            name="tipo"
            render={({ field: { onChange, value } }) => (
              <View style={{ flexDirection: 'row', marginBottom: 15, gap: 10 }}>
                {['Fijo', 'Variable'].map((opcion) => {
                  const isSelected = value === opcion;
                  return (
                    <TouchableOpacity
                      key={opcion}
                      activeOpacity={0.7}
                      onPress={() => onChange(opcion)}
                      style={{
                        flex: 1, paddingVertical: 12, borderRadius: 12, borderWidth: 1.5, alignItems: 'center',
                        borderColor: isSelected ? (colores.primario || '#3498db') : colores.border,
                        backgroundColor: isSelected ? (colores.primario + '15' || '#eaf4fc') : colores.card,
                      }}
                    >
                      <Text style={{
                        color: isSelected ? (colores.primario || '#3498db') : colores.textPlaceholder,
                        fontWeight: isSelected ? 'bold' : '500',
                      }}>
                        {opcion}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          />

          <LabelInput titulo="Categoría" icono={{ nombre: 'pricetag-outline', color: '#3498db' }} />
          <InputFormulario 
            control={control} name="categoria" rules={reglas.requerido} icono={{ nombre: 'list', color: '#95a5a6' }} error={errors.categoria} placeholder="Ejm: Servicio de Agua" 
            returnKeyType="next"
            blurOnSubmit={false}
            onSubmitEditing={() => proveedorRef.current?.focus()}
          />
          <ErrorFormulario error={errors.categoria} />

          <LabelInput titulo="Proveedor (Opcional)" icono={{ nombre: 'business-outline', color: '#3498db' }} />
          <InputFormulario 
            control={control} name="proveedor" rules={{maxLength: {value: 50}}} icono={{ nombre: 'person', color: '#95a5a6' }} error={errors.proveedor} placeholder="Ejm: Hidrolara" 
            inputRef={proveedorRef}
            returnKeyType="next"
            blurOnSubmit={false}
            onSubmitEditing={() => montoRef.current?.focus()}
          />
          <ErrorFormulario error={errors.proveedor} />

          <LabelInput titulo="Monto (Bs)" icono={{ nombre: 'cash-outline', color: '#3498db' }} />
          <InputFormulario 
            control={control} 
            name="monto" 
            rules={{ 
              required: { value: true, message: 'El monto es requerido' },
              maxLength: { value: 12, message: 'Máximo 12 caracteres' } 
            }} 
            icono={{ nombre: 'cash', color: '#95a5a6' }} 
            error={errors.monto} 
            placeholder="Ejm: 120.00" 
            keyboardType="decimal-pad" 
            inputRef={montoRef}
            returnKeyType="next"
            blurOnSubmit={false}
            onSubmitEditing={() => descripcionRef.current?.focus()}
          />
          <ErrorFormulario error={errors.monto} />

          <LabelInput titulo="Descripción" icono={{ nombre: 'document-text-outline', color: '#3498db' }} />
          <InputFormulario 
            control={control} name="descripcion" rules={reglas.requerido} icono={{ nombre: 'reader-outline', color: '#95a5a6' }} error={errors.descripcion} placeholder="Motivo del gasto..." 
            inputRef={descripcionRef}
            returnKeyType="search"
            onSubmitEditing={handleImagePick} // Abre la galería
          />
          <ErrorFormulario error={errors.descripcion} />

          <LabelInput titulo="Factura / Recibo" icono={{ nombre: 'image-outline', color: '#3498db' }} />
          <View style={{ flexDirection: 'row', gap: 10, marginBottom: 10 }}>
            <CustomBoton titulo={comprobanteUri ? 'Cambiar Foto' : 'Subir Factura'} evento={handleImagePick} icono={{ nombre: 'camera-outline', color: '#fff' }} estilos={{ flex: 1 }} />
            {comprobanteUri && (
              <CustomBoton titulo="Quitar" evento={removeImage} icono={{ nombre: 'trash-outline', color: '#fff' }} estilos={{ backgroundColor: '#e74c3c' }} />
            )}
          </View>
          {comprobanteUri && <MostrarVistaPrevia titulo="Factura adjunta:" imageUri={comprobanteUri} />}

        </KeyboardAwareScrollView>

        <View style={{ flexDirection: 'row', padding: 20, backgroundColor: colores.backgroundBotones, justifyContent: 'space-between' }}>
          <CustomBoton titulo="Cancelar" evento={handleCancel} icono={{ nombre: 'close', color: '#fff' }} estilos={{ backgroundColor: '#95a5a6' }} />
          <CustomBoton titulo="Registrar" evento={handleSubmit(onSubmit)} icono={{ nombre: 'save', color: '#fff' }} disabled={!canSubmit || isSubmitting} estilos={{ backgroundColor: '#27ae60', opacity: canSubmit ? 1 : 0.6 }} />
        </View> 
      </View>
    </Modal>
  );
}