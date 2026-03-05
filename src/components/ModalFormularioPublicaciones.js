import { Modal, View, ScrollView, Keyboard, Platform, KeyboardAvoidingView, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Controller } from 'react-hook-form';
import { SafeAreaView } from 'react-native-safe-area-context';  
import { useFormularioPublicaciones } from './../hooks/useFormularioPublicaciones';
import useValidaciones from '../hooks/useValidaciones';
import { useTema } from './../hooks/useTema';

import HeaderFormulario from '../components/HeaderFormulario';
import ErrorFormulario from '../components/ErrorFormulario';
import InputFormulario from '../components/InputFormulario';
import LabelInput from '../components/LabelInput';
import CustomBoton from '../components/CustomBoton';
import MostrarVistaPrevia from '../components/MostrarVistaPrevia';

const ModalFormularioPublicaciones = ({
  visible,
  onClose,
  publicacionEditar = null
}) => {
  const {
    control,
    errors,
    imageUri,
    isSubmitting,
    canSubmit,
    handleSubmit,
    handleImagePick,
    removeImage,
    onSubmit,
    handleCancel
  } = useFormularioPublicaciones(onClose, publicacionEditar);

  const validaciones = useValidaciones();
  const { colores } = useTema();
  const estilosModalFormularioPublicaciones = getEstilosModalFormularioPublicaciones(colores);
  const esEdicion = !!publicacionEditar;

  const ejecutarConTecladoCerrado = (accion) => {
    Keyboard.dismiss();
    setTimeout(() => {
      accion();
    }, 300);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false} 
      onRequestClose={() => ejecutarConTecladoCerrado(handleCancel)}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: colores.background }}>
        
        <HeaderFormulario
          titulo={esEdicion ? 'Editar Publicación' : 'Nueva Publicación'}
          evento={() => ejecutarConTecladoCerrado(handleCancel)}
          icono={{ name: esEdicion ? 'create-outline' : 'add-circle-outline', color: '#E1E1F7' }}
        />

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            style={estilosModalFormularioPublicaciones.formContent}
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
          >
            <LabelInput titulo="Título" icono={{ nombre: 'text-outline', color: '#3498db' }} />
            <InputFormulario
              control={control}
              name="titulo"
              rules={validaciones.tituloPublicacion}
              icono={{ nombre: 'pricetag-outline', color: '#95a5a6' }}
              error={errors.titulo}
              placeholder="Ejm: Aviso importante"
            />
            <ErrorFormulario error={errors.titulo} />

            <LabelInput titulo="Descripción" icono={{ nombre: 'document-text-outline', color: '#3498db' }} />
            <InputFormulario
              control={control}
              name="descripcion"
              rules={validaciones.descripcionPublicacion}
              icono={{ nombre: 'reader-outline', color: '#95a5a6' }}
              error={errors.descripcion}
              placeholder="Ejm: Se fue el agua por..."
              estilos={estilosModalFormularioPublicaciones.textArea}
            />
            <ErrorFormulario error={errors.descripcion} />

            <LabelInput titulo="Tipo de Publicación" icono={{ nombre: 'options-outline', color: '#3498db' }} />
            <Controller
              control={control}
              name="tipo"
              rules={{ required: 'Debes seleccionar un tipo' }}
              render={({ field: { onChange, value } }) => (
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 }}>
                  {['Aviso', 'Evento', 'Noticia'].map((opcion, index) => {
                    const isSelected = value === opcion.toLowerCase(); 
                    
                    return (
                      <TouchableOpacity
                        key={opcion}
                        activeOpacity={0.7}
                        onPress={() => onChange(opcion.toLowerCase())}
                        style={{
                          flex: 1,
                          paddingVertical: 12,
                          borderRadius: 8,
                          borderWidth: 1.5,
                          marginLeft: index > 0 ? 8 : 0, // Espaciado entre botones
                          borderColor: isSelected ? (colores.primario || '#3498db') : colores.border,
                          backgroundColor: isSelected ? (colores.primario + '15' || '#eaf4fc') : colores.card,
                          alignItems: 'center'
                        }}
                      >
                        <Text style={{
                          color: isSelected ? (colores.primario || '#3498db') : colores.textPlaceholder,
                          fontWeight: isSelected ? 'bold' : '500',
                          fontSize: 14
                        }}>
                          {opcion}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            />
            <ErrorFormulario error={errors.tipo} />

            <LabelInput titulo="Imagen" icono={{ nombre: 'image-outline', color: '#3498db' }} />

            <View style={estilosModalFormularioPublicaciones.imageButtonsContainer}>
              <CustomBoton
                titulo={imageUri ? 'Cambiar Imagen' : 'Seleccionar Imagen'}
                evento={() => ejecutarConTecladoCerrado(handleImagePick)}
                icono={{ nombre: imageUri ? 'camera-reverse-outline' : 'image-outline', color: 'ffffff' }}
                estilos={estilosModalFormularioPublicaciones.imageButton}
                fuente={16}
              />

              {imageUri && (
                <CustomBoton
                  titulo="Quitar"
                  evento={removeImage}
                  icono={{ nombre: 'trash-outline', color: 'ffffff' }}
                  estilos={{
                    ...estilosModalFormularioPublicaciones.imageButton,
                    ...estilosModalFormularioPublicaciones.removeButton,
                  }}
                  fuente={16}
                />
              )}
            </View>

            {imageUri && (
              <MostrarVistaPrevia
                titulo="Vista previa:"
                imageUri={imageUri}
                icono={{ name: 'eye-outline', color: colores.textPlaceholder }}
              />
            )}

            <View style={estilosModalFormularioPublicaciones.spacer} />
          </ScrollView>

          {/* Los botones de acción se mantienen pegados abajo naturalmente */}
          <View style={[estilosModalFormularioPublicaciones.actionButtons, { paddingBottom: 10 }]}>
            <CustomBoton
              titulo="Cancelar"
              evento={() => ejecutarConTecladoCerrado(handleCancel)}
              icono={{ nombre: 'close-circle-outline', color: 'ffffff' }}
              estilos={{
                ...estilosModalFormularioPublicaciones.button,
                ...estilosModalFormularioPublicaciones.cancelButton,
                ...(isSubmitting && estilosModalFormularioPublicaciones.disabledButton),
              }}
              fuente={20}
            />

            <CustomBoton
              titulo={esEdicion ? 'Actualizar' : 'Publicar'}
              evento={handleSubmit((data) => ejecutarConTecladoCerrado(() => onSubmit(data)))}
              icono={{ nombre: esEdicion ? 'save-outline' : 'send-outline', color: 'ffffff' }}
              estilos={{
                ...estilosModalFormularioPublicaciones.button,
                ...estilosModalFormularioPublicaciones.submitButton,
                ...(!canSubmit || isSubmitting) && estilosModalFormularioPublicaciones.disabledButton,
              }}
              fuente={20}
            />
          </View>

        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};

export default ModalFormularioPublicaciones;

const getEstilosModalFormularioPublicaciones = (colores) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colores.background
  },
  formContent: {
    flex: 1,
    paddingHorizontal: 16,
  },

  textArea: {
    textAlignVertical: 'top',
    height: 120
  },
  imageButtonsContainer: {
    flexDirection: 'row',
    marginBottom: 1,
    gap: 20
  },
  imageButton: {
    backgroundColor: colores.backgroundBotones,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: 8
  },
  removeButton: {
    backgroundColor: '#e74c3c',
    flex: 0.5
  },
  removeButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600'
  },
  spacer: {
    flex: 1
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    paddingBottom: 8,
    backgroundColor: colores.backgroundBotones,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    gap: 12
  },
  button: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    flexDirection: 'row',
    marginBottom: 0
  },
  cancelButton: {
    backgroundColor: '#95a5a6'
  },
  submitButton: {
    backgroundColor: '#27ae60'
  },
  disabledButton: {
    opacity: 0.6
  }
})