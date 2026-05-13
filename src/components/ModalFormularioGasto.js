import React, { useRef } from 'react';
import { View, Text, TouchableOpacity } from 'react-native'; 
import { useFormularioGasto } from '../hooks/useFormularioGasto';
import { useTema } from '../hooks/useTema';
import { Controller } from 'react-hook-form';

import ModalGeneral from './ModalGeneral'; 
import CampoFormulario from './CampoFormulario';
import CustomBoton from './CustomBoton';
import MostrarVistaPrevia from './MostrarVistaPrevia';
import LabelInput from './LabelInput';

export default function ModalFormularioGasto({ visible, onClose }) {
  const { colores } = useTema();
  
  const proveedorRef = useRef(null);
  const montoRef = useRef(null);
  const descripcionRef = useRef(null);

  const {
    control, errors, comprobanteUri, isSubmitting, canSubmit,
    handleSubmit, handleImagePick, removeImage, onSubmit, handleCancel
  } = useFormularioGasto(onClose);

  const reglas = {
    requerido: { required: { value: true, message: 'Este campo es obligatorio' }, maxLength: { value: 60 } },
    monto: { required: { value: true, message: 'El monto es obligatorio' }, pattern: { value: /^[0-9]+(\.[0-9]{1,2})?$/, message: 'Ej. 150.50' } }
  };

  // Separamos los botones para mantener limpio el return principal
  const BotonesFooter = (
    <>
      <CustomBoton titulo="Cancelar" evento={handleCancel} icono={{ nombre: 'close-circle-outline', color: '#fff' }} estilos={{ backgroundColor: '#95a5a6', flex: 1 }} 
        fuente={16} />
      <CustomBoton titulo="Registrar" evento={handleSubmit(onSubmit)} icono={{ nombre: 'save-outline', color: '#fff' }} disabled={!canSubmit || isSubmitting} estilos={{ backgroundColor: '#27ae60', opacity: canSubmit ? 1 : 0.6 }} 
        fuente={16} />
    </>
  );

  return (
    <ModalGeneral
      visible={visible}
      onClose={handleCancel}
      titulo="Registrar Gasto"
      iconoHeader={{ name: 'cart-outline', color: '#E1E1F7' }}
      footer={BotonesFooter}
      esFormulario={true} // Activa el ajuste del teclado
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

      <CampoFormulario
        tituloLabel="Categoría"
        iconoLabel={{ nombre: 'pricetag-outline', color: '#3498db' }}
        control={control}
        name="categoria"
        rules={reglas.requerido}
        iconoInput={{ nombre: 'list', color: '#95a5a6' }}
        error={errors.categoria}
        placeholder="Ejm: Servicio de Agua"
        returnKeyType="next"
        blurOnSubmit={false}
        onSubmitEditing={() => proveedorRef.current?.focus()}
      />

      <CampoFormulario
        tituloLabel="Proveedor (Opcional)"
        iconoLabel={{ nombre: 'business-outline', color: '#3498db' }}
        control={control}
        name="proveedor"
        rules={{ maxLength: { value: 50 } }}
        iconoInput={{ nombre: 'person', color: '#95a5a6' }}
        error={errors.proveedor}
        placeholder="Ejm: Hidrolara"
        inputRef={proveedorRef}
        returnKeyType="next"
        blurOnSubmit={false}
        onSubmitEditing={() => montoRef.current?.focus()}
      />

      <CampoFormulario
        tituloLabel="Monto (Bs)"
        iconoLabel={{ nombre: 'cash-outline', color: '#3498db' }}
        control={control}
        name="monto"
        rules={{ 
          required: { value: true, message: 'El monto es requerido' },
          maxLength: { value: 12, message: 'Máximo 12 caracteres' } 
        }}
        iconoInput={{ nombre: 'cash', color: '#95a5a6' }}
        error={errors.monto}
        placeholder="Ejm: 120.00"
        inputRef={montoRef}
        returnKeyType="next"
        blurOnSubmit={false}
        onSubmitEditing={() => descripcionRef.current?.focus()}
      />

      <CampoFormulario
        tituloLabel="Descripción"
        iconoLabel={{ nombre: 'document-text-outline', color: '#3498db' }}
        control={control}
        name="descripcion"
        rules={reglas.requerido}
        iconoInput={{ nombre: 'reader-outline', color: '#95a5a6' }}
        error={errors.descripcion}
        placeholder="Motivo del gasto..."
        inputRef={descripcionRef}
        returnKeyType="search"
        onSubmitEditing={handleImagePick}
      />


      <LabelInput titulo="Factura / Recibo" icono={{ nombre: 'image-outline', color: '#3498db' }} />
      <View style={{ flexDirection: 'row', gap: 10, marginBottom: 10 }}>
        <CustomBoton titulo={comprobanteUri ? 'Cambiar Foto' : 'Subir Factura'} evento={handleImagePick} icono={{ nombre: 'camera-outline', color: '#fff' }} estilos={{ flex: 1 }} />
        {comprobanteUri && (
          <CustomBoton titulo="Quitar" evento={removeImage} icono={{ nombre: 'trash-outline', color: '#fff' }} estilos={{ backgroundColor: '#e74c3c' }} />
        )}
      </View>
      {comprobanteUri && <MostrarVistaPrevia titulo="Factura adjunta:" imageUri={comprobanteUri} />}
    </ModalGeneral>
  );
}