import React, { useRef } from 'react';
import { View, ScrollView, TouchableOpacity, Text } from 'react-native'; 
import { useTema } from '../hooks/useTema';
import { useFormularioPago } from '../hooks/useFormularioPago';

import { Controller, useWatch } from 'react-hook-form'; 

import ModalGeneral from './ModalGeneral'; 
import CampoFormulario from './CampoFormulario';

import ErrorFormulario from './ErrorFormulario';
import LabelInput from './LabelInput';
import CustomBoton from './CustomBoton';
import MostrarVistaPrevia from './MostrarVistaPrevia';

export default function ModalFormularioPago({ visible, onClose }) {
  const { colores } = useTema();
  const montoRef = useRef(null);
  
  const {
    control,
    errors,
    comprobanteUri,
    isSubmitting,
    isValid,
    handleSubmit,
    handleImagePick,
    removeImage,
    onSubmit,
    bancosDisponibles,
    apartamentosDisponibles,
    mesesPendientes
  } = useFormularioPago(onClose);

  const apartamentoSeleccionado = useWatch({ control, name: 'apartamento_id' });

  const reglas = {
    requerido: { required: { value: true, message: 'Obligatorio' }, maxLength: { value: 50, message: 'Máximo 50 caracteres' } },
    monto: { required: { value: true, message: 'Obligatorio' }, pattern: { value: /^[0-9]+(\.[0-9]{1,2})?$/, message: 'Ej. 150.50' } }
  };

  // botones de acción del footer
  const BotonesFooter = (
    <>
      <CustomBoton 
        titulo="Cancelar" 
        evento={onClose} 
        icono={{ nombre: 'close-circle-outline', color: '#fff' }} 
        estilos={{ backgroundColor: '#95a5a6' }} 
        fuente={16}
      />
      <CustomBoton 
        titulo="Enviar Pago" 
        evento={handleSubmit(onSubmit)} 
        icono={{ nombre: 'send-outline', color: '#fff' }} 
        disabled={!isValid || isSubmitting} 
        estilos={{ backgroundColor: '#27ae60', opacity: isValid && !isSubmitting ? 1 : 0.6 }} 
        fuente={16}
      />
    </>
  );

  return (
    <ModalGeneral
      visible={visible}
      onClose={onClose}
      titulo="Registrar Pago"
      iconoHeader={{ name: 'cash-outline', color: '#E1E1F7' }}
      footer={BotonesFooter}
      esFormulario={true}
    >

      {/* SELECTOR DE APARTAMENTO */}
      <LabelInput titulo="Apartamento" icono={{ nombre: 'home-outline', color: '#3498db' }} />
      <Controller
        control={control}
        name="apartamento_id"
        rules={{ required: 'Selecciona tu apartamento' }}
        render={({ field: { onChange, value } }) => (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 15, gap: 10 }}>
            {apartamentosDisponibles.length === 0 ? (
              <Text style={{ color: colores.textPlaceholder, fontStyle: 'italic', paddingLeft: 5 }}>Cargando apartamentos...</Text>
            ) : (
              apartamentosDisponibles.map((apto) => {
                const isSelected = value === apto.id_apartamento;
                return (
                  <TouchableOpacity
                    key={apto.id_apartamento}
                    activeOpacity={0.7}
                    onPress={() => onChange(apto.id_apartamento)}
                    style={{
                      paddingHorizontal: 14, paddingVertical: 10, borderRadius: 20, borderWidth: 1.5,
                      borderColor: isSelected ? (colores.primario || '#3498db') : colores.border,
                      backgroundColor: isSelected ? (colores.primario + '15' || '#eaf4fc') : colores.card,
                    }}
                  >
                    <Text style={{
                      color: isSelected ? (colores.primario || '#3498db') : colores.textPlaceholder,
                      fontWeight: isSelected ? 'bold' : '500',
                    }}>
                      Apto. {apto.nro_apartamento}
                    </Text>
                  </TouchableOpacity>
                );
              })
            )}
          </View>
        )}
      />
      <ErrorFormulario error={errors.apartamento_id} />

      {/* SELECTOR DE MES A PAGAR */}
      <LabelInput titulo="Mes a Pagar" icono={{ nombre: 'calendar-outline', color: '#3498db' }} />
      <Controller
        control={control}
        name="mensualidad_id"
        rules={{ required: 'Selecciona un mes' }}
        render={({ field: { onChange, value } }) => (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 15 }}>
            {mesesPendientes.length === 0 ? (
              <Text style={{ color: colores.textPlaceholder, fontStyle: 'italic', paddingLeft: 5 }}>
                {apartamentoSeleccionado ? "🎉 No hay deudas pendientes" : "Selecciona un apartamento primero"}
              </Text>
            ) : (
              mesesPendientes.map((item) => {
                const isSelected = value === item.id;
                return (
                  <TouchableOpacity
                    key={item.id}
                    activeOpacity={0.7}
                    onPress={() => onChange(item.id)} 
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
              })
            )}
          </View>
        )}
      />
      <ErrorFormulario error={errors.mensualidad_id} />

      {/* SELECTOR DE TIPO DE PAGO */}
      <LabelInput titulo="Método de Pago" icono={{ nombre: 'options-outline', color: '#3498db' }} />
      <Controller
        control={control}
        name="tipo_pago"
        render={({ field: { onChange, value } }) => (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 15, gap: 10 }}>
            {['Transferencia', 'Pago Movil', 'Efectivo', 'Divisa'].map((opcion) => {
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

      {/* SELECTOR DE BANCO */}
      <LabelInput titulo="Banco de Origen" icono={{ nombre: 'business-outline', color: '#3498db' }} />
      <Controller
        control={control}
        name="banco_id"
        rules={{ required: 'Selecciona un banco' }}
        render={({ field: { onChange, value } }) => (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 15 }}>
            {bancosDisponibles.length === 0 ? (
              <Text style={{ color: colores.textPlaceholder, fontStyle: 'italic', paddingLeft: 5 }}>Cargando bancos...</Text>
            ) : (
              bancosDisponibles.map((banco) => {
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
                    <Text style={{
                      color: isSelected ? (colores.primario || '#3498db') : colores.textPlaceholder,
                      fontWeight: isSelected ? 'bold' : '500',
                    }}>
                      {banco.nombre_banco}
                    </Text>
                  </TouchableOpacity>
                );
              })
            )}
          </ScrollView>
        )}
      />
      <ErrorFormulario error={errors.banco_id} />

      <CampoFormulario
        tituloLabel="Nro. Referencia"
        iconoLabel={{ nombre: 'document-text-outline', color: '#3498db' }}
        control={control}
        name="referencia"
        rules={reglas.requerido}
        iconoInput={{ nombre: 'barcode', color: '#95a5a6' }}
        error={errors.referencia}
        placeholder="Ejm: 004589234"
        keyboardType="numeric"
        returnKeyType="next"
        blurOnSubmit={false}
        onSubmitEditing={() => montoRef.current?.focus()}
      />

      <CampoFormulario
        tituloLabel="Monto (Bs)"
        iconoLabel={{ nombre: 'cash-outline', color: '#3498db' }}
        control={control}
        name="monto"
        rules={reglas.monto}
        iconoInput={{ nombre: 'cash', color: '#95a5a6' }}
        error={errors.monto}
        placeholder="Ejm: 150.50"
        keyboardType="decimal-pad"
        inputRef={montoRef}
        returnKeyType="search"
        onSubmitEditing={handleImagePick}
      />


      {/* --- ADJUNTO DE IMAGEN --- */}

      <LabelInput titulo="Comprobante" icono={{ nombre: 'image-outline', color: '#3498db' }} />
      <View style={{ flexDirection: 'row', gap: 10, marginBottom: 10 }}>
        <CustomBoton 
          titulo={comprobanteUri ? 'Cambiar Foto' : 'Subir Foto'} 
          evento={handleImagePick} 
          icono={{ nombre: 'camera-outline', color: '#fff' }} 
          estilos={{ flex: 1 }} 
        />
        {comprobanteUri && (
          <CustomBoton 
            titulo="Quitar" 
            evento={removeImage} 
            icono={{ nombre: 'trash-outline', color: '#fff' }} 
            estilos={{ backgroundColor: '#e74c3c' }} 
          />
        )}
      </View>
      {comprobanteUri && <MostrarVistaPrevia titulo="Recibo adjunto:" imageUri={comprobanteUri} />}

    </ModalGeneral>
  );
}