import React, { useEffect } from 'react';
import { Modal, View, TextInput, Button, Image, Text, TouchableOpacity, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';
import { Controller } from 'react-hook-form';
import Icon from 'react-native-vector-icons/Ionicons';
import { useFormularioPublicaciones } from './../hooks/useFormularioPublicaciones'
import useValidaciones from '../hooks/useValidaciones'

import { useTema } from './../hooks/useTema';
import { getEstilosModalFormularioPublicaciones } from './../styles/components/estilosModalFormularioPublicaciones'

import ErrorFormulario from '../components/ErrorFormulario'
import InputModal from '../components/InputModal'
import LabelInput from '../components/LabelInput'

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

  const validaciones = useValidaciones()

  const { colores } = useTema();
  const estilosModalFormularioPublicaciones = getEstilosModalFormularioPublicaciones(colores);

  const esEdicion = !!publicacionEditar;

  return (
    <Modal visible={visible} animationType="slide">
      <View style={estilosModalFormularioPublicaciones.container}>
        {/* Header */}
        <View style={estilosModalFormularioPublicaciones.header}>
          <Icon name={esEdicion ? "create-outline" : "add-circle-outline"} size={24} color="#E1E1F7" />
          <Text style={estilosModalFormularioPublicaciones.title}>
            {esEdicion ? 'Editar Publicación' : 'Nueva Publicación'}
          </Text>
          <TouchableOpacity onPress={handleCancel} style={estilosModalFormularioPublicaciones.closeButton}>
            <Icon name="close-outline" size={24} color="#E1E1F7" />
          </TouchableOpacity>
        </View>

        {/* Contenido del formulario */}
        <ScrollView style={estilosModalFormularioPublicaciones.formContent}>
          {/*Pensar en componentes ;P */}
          {/* Título */}
          <LabelInput titulo="Título" icono={{nombre:'text-outline',color:'#3498db'}} />
          <InputModal control={control} name="titulo" rules={validaciones.titulo_publicacion} icono={{nombre:'pricetag-outline',color:'#95a5a6'}} error={errors.titulo} placeholder="Ingresa el título de la publicación" />
          <ErrorFormulario error={errors.titulo} estilos={estilosModalFormularioPublicaciones} />

          {/* Descripción */}       
          <LabelInput titulo="Descripción" icono={{nombre:'document-text-outline',color:'#3498db'}} />
          <InputModal control={control} name="descripcion" rules={validaciones.descripcion_publicacion} icono={{nombre:'reader-outline',color:'#95a5a6'}} error={errors.descripcion} placeholder="Describe tu publicación" estilos={estilosModalFormularioPublicaciones.textArea} />
          <ErrorFormulario error={errors.descripcion} estilos={{errorContainer:estilosModalFormularioPublicaciones.errorContainer,errorText:estilosModalFormularioPublicaciones.errorText}} />

          {/* Imagen */}
          <LabelInput titulo="Imagen" icono={{nombre:'image-outline',color:'#3498db'}} />

          <View style={estilosModalFormularioPublicaciones.imageButtonsContainer}>
            <TouchableOpacity 
              style={estilosModalFormularioPublicaciones.imageButton}
              onPress={handleImagePick}
            >
              <Icon name={imageUri ? "camera-reverse-outline" : "image-outline"} size={18} color="#ffffff" />
              <Text style={estilosModalFormularioPublicaciones.imageButtonText}>
                {imageUri ? "Cambiar Imagen" : "Seleccionar Imagen"}
              </Text>
            </TouchableOpacity>
            
            {imageUri && (
              <TouchableOpacity 
                style={[estilosModalFormularioPublicaciones.imageButton, estilosModalFormularioPublicaciones.removeButton]}
                onPress={removeImage}
              >
                <Icon name="trash-outline" size={18} color="#ffffff" />
                <Text style={estilosModalFormularioPublicaciones.removeButtonText}>Quitar</Text>
              </TouchableOpacity>
            )}
          </View>
          
          {/* Vista previa de la imagen */}
          {imageUri && (
            <View style={estilosModalFormularioPublicaciones.imagePreviewContainer}>
              <View style={estilosModalFormularioPublicaciones.previewHeader}>
                <Icon name="eye-outline" size={16} color={colores.textPlaceholder} />
                <Text style={estilosModalFormularioPublicaciones.previewText}>Vista previa:</Text>
              </View>
              <View style={estilosModalFormularioPublicaciones.imageWrapper}>
                <Image 
                  source={{ uri: imageUri }} 
                  style={estilosModalFormularioPublicaciones.imagePreview}
                  resizeMode="cover"
                />
                <View style={estilosModalFormularioPublicaciones.imageOverlay}>
                  <Icon name="checkmark-circle" size={32} color="#27ae60" />
                </View>
              </View>
            </View>
          )}

          {/* Espacio flexible para empujar los botones hacia abajo */}
          <View style={estilosModalFormularioPublicaciones.spacer} />
        </ScrollView>

        {/* Botones de acción */}
        <View style={estilosModalFormularioPublicaciones.actionButtons}>
          <TouchableOpacity
            onPress={handleCancel}
            disabled={isSubmitting}
            style={[
              estilosModalFormularioPublicaciones.button,
              estilosModalFormularioPublicaciones.cancelButton,
              isSubmitting && estilosModalFormularioPublicaciones.disabledButton
            ]}
          >
            <Icon name="close-circle-outline" size={20} color="#ffffff" />
            <Text style={estilosModalFormularioPublicaciones.cancelButtonText}>
              Cancelar
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            disabled={!canSubmit || isSubmitting}
            style={[
              estilosModalFormularioPublicaciones.button,
              estilosModalFormularioPublicaciones.submitButton,
              (!canSubmit || isSubmitting) && estilosModalFormularioPublicaciones.disabledButton
            ]}
          >
            {isSubmitting ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <>
                <Icon name={esEdicion ? "save-outline" : "send-outline"} size={20} color="#ffffff" />
                <Text style={estilosModalFormularioPublicaciones.submitButtonText}>
                  {esEdicion ? 'Actualizar' : 'Publicar'}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ModalFormularioPublicaciones;