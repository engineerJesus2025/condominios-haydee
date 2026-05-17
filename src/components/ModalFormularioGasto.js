import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native'; 
import { useFormularioGasto } from '../hooks/useFormularioGasto';
import { useTema } from '../hooks/useTema';
import { Controller } from 'react-hook-form';

import ModalGeneral from './ModalGeneral'; 
import CampoFormulario from './CampoFormulario';
import CustomBoton from './CustomBoton';
import MostrarVistaPrevia from './MostrarVistaPrevia';
import LabelInput from './LabelInput';
import ErrorFormulario from './ErrorFormulario';

export default function ModalFormularioGasto({ visible, onClose }) {
  const { colores } = useTema();
  
  const montoRef = useRef(null);
  const descripcionRef = useRef(null);
  const referenciaRef = useRef(null);

  const {
    control, errors, comprobanteUri, isSubmitting, canSubmit,
    handleSubmit, handleImagePick, removeImage, onSubmit, handleCancel,
    catalogos, requiereBanco
  } = useFormularioGasto(onClose);

  const reglas = {
    requerido: { required: { value: true, message: 'Este campo es obligatorio' }, maxLength: { value: 255 } },
    monto: { required: { value: true, message: 'El monto es obligatorio' }, pattern: { value: /^[0-9]+(\.[0-9]{1,2})?$/, message: 'Ej. 150.50' } }
  };

  const BotonesFooter = (
    <>
      <CustomBoton titulo="Cancelar" evento={handleCancel} icono={{ nombre: 'close-circle-outline', color: '#fff' }} estilos={{ backgroundColor: '#95a5a6', flex: 1 }} fuente={16} />
      <CustomBoton titulo="Registrar" evento={handleSubmit(onSubmit)} icono={{ nombre: 'save-outline', color: '#fff' }} disabled={!canSubmit || isSubmitting} estilos={{ backgroundColor: '#27ae60', opacity: canSubmit && !isSubmitting ? 1 : 0.6 }} fuente={16} />
    </>
  );

  return (
    <ModalGeneral
      visible={visible}
      onClose={handleCancel}
      titulo="Registrar Gasto"
      iconoHeader={{ name: 'cart-outline', color: '#E1E1F7' }}
      footer={BotonesFooter}
      esFormulario={true}
    >
      <LabelInput titulo="Tipo de Gasto" icono={{ nombre: 'pricetag-outline', color: '#3498db' }} />
      <Controller
        control={control}
        name="clasificacion"
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

      <LabelInput titulo="Categoría" icono={{ nombre: 'grid-outline', color: '#3498db' }} />
      <Controller
        control={control}
        name="tipo_gasto_id"
        rules={{ required: 'Selecciona una categoría' }}
        render={({ field: { onChange, value } }) => (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 15 }}>
            {catalogos.tipos_gasto.map((tipo) => {
              const isSelected = value === tipo.id_tipo_gasto;
              return (
                <TouchableOpacity
                  key={tipo.id_tipo_gasto}
                  activeOpacity={0.7}
                  onPress={() => onChange(tipo.id_tipo_gasto)}
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
                    {tipo.nombre_tipo_gasto}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}
      />
      <ErrorFormulario error={errors.tipo_gasto_id} />

      <LabelInput titulo="Proveedor (Opcional)" icono={{ nombre: 'business-outline', color: '#3498db' }} />
      <Controller
        control={control}
        name="proveedor_id"
        render={({ field: { onChange, value } }) => (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 15 }}>
             <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => onChange('')}
                  style={{
                    paddingHorizontal: 14, paddingVertical: 10, borderRadius: 20, borderWidth: 1.5, marginRight: 8,
                    borderColor: value === '' ? (colores.primario || '#3498db') : colores.border,
                    backgroundColor: value === '' ? (colores.primario + '15' || '#eaf4fc') : colores.card,
                  }}
                >
                  <Text style={{ color: value === '' ? colores.primario : colores.textPlaceholder }}>Ninguno</Text>
            </TouchableOpacity>

            {catalogos.proveedores.map((prov) => {
              const isSelected = value === prov.id_proveedor;
              return (
                <TouchableOpacity
                  key={prov.id_proveedor}
                  activeOpacity={0.7}
                  onPress={() => onChange(prov.id_proveedor)}
                  style={{
                    paddingHorizontal: 14, paddingVertical: 10, borderRadius: 20, borderWidth: 1.5, marginRight: 8,
                    borderColor: isSelected ? (colores.primario || '#3498db') : colores.border,
                    backgroundColor: isSelected ? (colores.primario + '15' || '#eaf4fc') : colores.card,
                  }}
                >
                  <Text style={{ color: isSelected ? colores.primario : colores.textPlaceholder, fontWeight: isSelected ? 'bold' : '500' }}>
                    {prov.nombre_proveedor}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}
      />

      <CampoFormulario
        tituloLabel="Descripción del Gasto"
        iconoLabel={{ nombre: 'document-text-outline', color: '#3498db' }}
        control={control}
        name="descripcion_gasto"
        rules={reglas.requerido}
        iconoInput={{ nombre: 'reader-outline', color: '#95a5a6' }}
        error={errors.descripcion_gasto}
        placeholder="Motivo detallado..."
        inputRef={descripcionRef}
        returnKeyType="next"
        onSubmitEditing={() => montoRef.current?.focus()}
      />

      <CampoFormulario
        tituloLabel="Monto Total (Bs)"
        iconoLabel={{ nombre: 'cash-outline', color: '#3498db' }}
        control={control}
        name="monto"
        rules={reglas.monto}
        iconoInput={{ nombre: 'cash', color: '#95a5a6' }}
        error={errors.monto}
        placeholder="Ejm: 250.00"
        keyboardType="decimal-pad"
        inputRef={montoRef}
      />

      {/* --- SECCIÓN DE PAGOS --- */}
      <LabelInput titulo="Método de Pago" icono={{ nombre: 'wallet-outline', color: '#3498db' }} />
      <Controller
        control={control}
        name="metodo_pago"
        render={({ field: { onChange, value } }) => (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 15, gap: 10 }}>
            {['Efectivo', 'Pago Movil', 'Transferencia', 'Divisa'].map((opcion) => {
              const isSelected = value === opcion;
              return (
                <TouchableOpacity
                  key={opcion}
                  activeOpacity={0.7}
                  onPress={() => onChange(opcion)}
                  style={{
                    paddingHorizontal: 14, paddingVertical: 10, borderRadius: 20, borderWidth: 1.5,
                    borderColor: isSelected ? (colores.primario || '#3498db') : colores.border,
                    backgroundColor: isSelected ? (colores.primario + '15' || '#eaf4fc') : colores.card,
                  }}
                >
                  <Text style={{ color: isSelected ? colores.primario : colores.textPlaceholder, fontWeight: isSelected ? 'bold' : '500' }}>
                    {opcion}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      />

      {requiereBanco && (
        <>
          <LabelInput titulo="Banco" icono={{ nombre: 'business', color: '#3498db' }} />
          <Controller
            control={control}
            name="banco_id"
            rules={{ required: 'Selecciona un banco' }}
            render={({ field: { onChange, value } }) => (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 15 }}>
                {catalogos.bancos.map((banco) => {
                  const isSelected = value === banco.id_banco;
                  return (
                    <TouchableOpacity
                      key={banco.id_banco}
                      activeOpacity={0.7}
                      onPress={() => onChange(banco.id_banco)}
                      style={{
                        paddingHorizontal: 14, paddingVertical: 10, borderRadius: 20, borderWidth: 1.5, marginRight: 8,
                        borderColor: isSelected ? (colores.primario || '#3498db') : colores.border,
                        backgroundColor: isSelected ? (colores.primario + '15' || '#eaf4fc') : colores.card,
                      }}
                    >
                      <Text style={{ color: isSelected ? colores.primario : colores.textPlaceholder, fontWeight: isSelected ? 'bold' : '500' }}>
                        {banco.nombre_banco}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            )}
          />
          <ErrorFormulario error={errors.banco_id} />

          <CampoFormulario
            tituloLabel="Nro. de Referencia"
            iconoLabel={{ nombre: 'barcode-outline', color: '#3498db' }}
            control={control}
            name="referencia"
            rules={{ required: { value: true, message: 'La referencia es obligatoria' } }}
            iconoInput={{ nombre: 'keypad', color: '#95a5a6' }}
            error={errors.referencia}
            placeholder="Ejm: 00123456"
            keyboardType="numeric"
            inputRef={referenciaRef}
          />

          <LabelInput titulo="Comprobante Bancario" icono={{ nombre: 'image-outline', color: '#3498db' }} />
          <View style={{ flexDirection: 'row', gap: 10, marginBottom: 10 }}>
            <CustomBoton titulo={comprobanteUri ? 'Cambiar Foto' : 'Subir Captura'} evento={handleImagePick} icono={{ nombre: 'camera-outline', color: '#fff' }} estilos={{ flex: 1 }} />
            {comprobanteUri && (
              <CustomBoton titulo="Quitar" evento={removeImage} icono={{ nombre: 'trash-outline', color: '#fff' }} estilos={{ backgroundColor: '#e74c3c' }} />
            )}
          </View>
          {comprobanteUri && <MostrarVistaPrevia titulo="Recibo adjunto:" imageUri={comprobanteUri} />}
        </>
      )}

    </ModalGeneral>
  );
}