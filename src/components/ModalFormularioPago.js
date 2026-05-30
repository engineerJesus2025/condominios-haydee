import React, { useRef } from 'react'; // <-- Adiós useMemo
import { View, ScrollView, TouchableOpacity, Text } from 'react-native'; 
import { useTema } from '../hooks/useTema';
import { useFormularioPago } from '../hooks/useFormularioPago';
import useValidaciones from '../hooks/useValidaciones';
import { Controller } from 'react-hook-form'; 

import ModalGeneral from './ModalGeneral'; 
import CampoFormulario from './CampoFormulario';
import ErrorFormulario from './ErrorFormulario';
import LabelInput from './LabelInput';
import CustomBoton from './CustomBoton';
import MostrarVistaPrevia from './MostrarVistaPrevia';
import { formatearMesAnio } from '../utils/dateUtils';

export default function ModalFormularioPago({ visible, onClose }) {
  const { colores } = useTema();
  const montoRef = useRef(null);
  const referenciaRef = useRef(null);
  
  // Ahora el hook nos entrega el trabajo totalmente procesado
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
    mesesPendientes,
    requiereBanco,
    esAdmin,
    tasaDolar,
    equivalenteDolares,     
    apartamentoSeleccionado 
  } = useFormularioPago(onClose);

  const validaciones = useValidaciones();

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
        loading={isSubmitting}
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

      {/* SELECTOR EXCLUSIVO PARA ADMINISTRADORES */}
      {esAdmin && (
        <>
          <LabelInput titulo="Estado del Pago" icono={{ nombre: 'shield-checkmark-outline', color: '#3498db' }} />
          <Controller
            control={control}
            name="estado"
            render={({ field: { onChange, value } }) => (
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 15, gap: 10 }}>
                {['PENDIENTE', 'PROCESADO', 'RECHAZADO'].map((opcion) => {
                  const isSelected = value === opcion;
                  
                  // para que destaque el color del estado
                  let colorBorde = isSelected ? (colores.primario || '#3498db') : colores.border;
                  if (isSelected && opcion === 'PROCESADO') colorBorde = '#27ae60';
                  if (isSelected && opcion === 'RECHAZADO') colorBorde = '#e74c3c';

                  return (
                    <TouchableOpacity
                      key={opcion}
                      activeOpacity={0.7}
                      onPress={() => onChange(opcion)}
                      style={{
                        paddingHorizontal: 14, paddingVertical: 10, borderRadius: 20, borderWidth: 1.5,
                        borderColor: colorBorde,
                        backgroundColor: isSelected ? colorBorde + '15' : colores.card,
                      }}
                    >
                      <Text style={{ 
                        color: isSelected ? colorBorde : colores.textPlaceholder, 
                        fontWeight: isSelected ? 'bold' : '500' 
                      }}>
                        {opcion.charAt(0).toUpperCase() + opcion.toLowerCase().slice(1)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          />
          <ErrorFormulario error={errors.estado} />
        </>
      )}

      {/* SELECTOR DE APARTAMENTO */}
      <LabelInput titulo="Apartamento" icono={{ nombre: 'home-outline', color: '#3498db' }} />
      <Controller
        control={control}
        name="apartamento_id"
        rules={validaciones.requeridoSimple('Selecciona tu apartamento')}
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
                    <Text style={{ color: isSelected ? colores.primario : colores.textPlaceholder, fontWeight: isSelected ? 'bold' : '500' }}>
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
        rules={validaciones.requeridoSimple('Selecciona un mes')}
        render={({ field: { onChange, value } }) => (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 15 }}>
            {mesesPendientes.length === 0 ? (
              <Text style={{ color: colores.textPlaceholder, fontStyle: 'italic', paddingLeft: 5 }}>
                {apartamentoSeleccionado ? "🎉 No hay deudas pendientes" : "Selecciona un apartamento primero"}
              </Text>
            ) : (
              mesesPendientes.map((item) => {
                const isSelected = value === item.id;
                const [mes,anio] = item.mes.split(' ')
                return (
                  <TouchableOpacity
                    key={item.id}
                    activeOpacity={0.7}
                    onPress={() => { onChange(item.id); control._defaultValues.monto = item.monto; }} // Opcional: auto-llenar el monto
                    style={{
                      paddingHorizontal: 14, paddingVertical: 10, borderRadius: 20, borderWidth: 1.5, marginRight: 8, marginBottom: 8,
                      borderColor: isSelected ? (colores.primario || '#3498db') : colores.border,
                      backgroundColor: isSelected ? (colores.primario + '15' || '#eaf4fc') : colores.card,
                    }}
                  >
                    <Text style={{ color: isSelected ? colores.primario : colores.textPlaceholder, fontWeight: isSelected ? 'bold' : '500' }}>
                      {formatearMesAnio(mes,anio)}
                    </Text>
                  </TouchableOpacity>
                );
              })
            )}
          </View>
        )}
      />
      <ErrorFormulario error={errors.mensualidad_id} />

      <CampoFormulario
        tituloLabel="Monto (Bs)"
        iconoLabel={{ nombre: 'cash-outline', color: '#3498db' }}
        control={control}
        name="monto"
        rules={validaciones.monto}
        iconoInput={{ nombre: 'cash', color: '#95a5a6' }}
        error={errors.monto}
        placeholder="Ejm: 150.50"
        keyboardType="decimal-pad"
        inputRef={montoRef}
      />

      {/* CONVERSIÓN Y TASA DEL DÍA */}
      <View style={{ 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        backgroundColor: colores.primario + '10', 
        padding: 12, 
        borderRadius: 10, 
        marginBottom: 15, 
        borderWidth: 1, 
        borderColor: colores.primario + '30' 
      }}>
        <View>
          <Text style={{ fontSize: 12, color: colores.textPlaceholder }}>Tasa Oficial (BCV)</Text>
          <Text style={{ fontSize: 15, fontWeight: 'bold', color: colores.text }}>
            {tasaDolar} Bs.
          </Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={{ fontSize: 12, color: colores.textPlaceholder }}>Equivalente aprox.</Text>
          <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#27ae60' }}>
            $ {equivalenteDolares}
          </Text>
        </View>
      </View>

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
                  <Text style={{ color: isSelected ? colores.primario : colores.textPlaceholder, fontWeight: isSelected ? 'bold' : '500' }}>
                    {opcion}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      />

      {/* --- SECCIÓN BANCARIA --- */}
      {requiereBanco && (
        <>
          <LabelInput titulo="Banco de Origen" icono={{ nombre: 'business-outline', color: '#3498db' }} />
          <Controller
            control={control}
            name="banco_id"
            rules={validaciones.requeridoSimple('Selecciona un banco')}
            render={({ field: { onChange, value } }) => (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 15 }}>
                {bancosDisponibles.map((banco) => {
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
            tituloLabel="Nro. Referencia"
            iconoLabel={{ nombre: 'document-text-outline', color: '#3498db' }}
            control={control}
            name="referencia"
            rules={validaciones.referencia}
            iconoInput={{ nombre: 'barcode', color: '#95a5a6' }}
            error={errors.referencia}
            placeholder="Ejm: 004589234"
            keyboardType="numeric"
            inputRef={referenciaRef}
          />

          <LabelInput titulo="Comprobante" icono={{ nombre: 'image-outline', color: '#3498db' }} />
          <View style={{ flexDirection: 'row', gap: 10, marginBottom: 10 }}>
            <CustomBoton titulo={comprobanteUri ? 'Cambiar Foto' : 'Subir Foto'} evento={handleImagePick} icono={{ nombre: 'camera-outline', color: '#fff' }} estilos={{ flex: 1 }} />
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