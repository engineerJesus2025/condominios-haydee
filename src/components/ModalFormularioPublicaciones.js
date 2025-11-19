import { Modal, View, ScrollView } from 'react-native'
import { useFormularioPublicaciones } from './../hooks/useFormularioPublicaciones'
import useValidaciones from '../hooks/useValidaciones'

import { useTema } from './../hooks/useTema'
import { getEstilosModalFormularioPublicaciones } from './../styles/components/estilosModalFormularioPublicaciones'

import HeaderFormulario from '../components/HeaderFormulario'
import ErrorFormulario from '../components/ErrorFormulario'
import InputFormulario from '../components/InputFormulario'
import LabelInput from '../components/LabelInput'
import CustomBoton from '../components/CustomBoton'
import MostrarVistaPrevia from '../components/MostrarVistaPrevia'

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
  } = useFormularioPublicaciones(onClose, publicacionEditar)

  const validaciones = useValidaciones()

  const { colores } = useTema()
  const estilosModalFormularioPublicaciones = getEstilosModalFormularioPublicaciones(colores)

  const esEdicion = !!publicacionEditar

  return (
    <Modal visible={visible} animationType='slide'>
      <View style={estilosModalFormularioPublicaciones.container}>
        {/* Header */}
        <HeaderFormulario
          titulo={esEdicion ? 'Editar Publicación' : 'Nueva Publicación'} evento={handleCancel}
          icono={{ name: esEdicion ? 'create-outline' : 'add-circle-outline', color: '#E1E1F7' }}
        />

        {/* Contenido del formulario */}
        <ScrollView style={estilosModalFormularioPublicaciones.formContent}>
          {/* Pensar en componentes ;P */}
          {/* Título */}
          <LabelInput titulo='Título' icono={{ nombre: 'text-outline', color: '#3498db' }} />
          <InputFormulario control={control} name='titulo' rules={validaciones.titulo_publicacion} icono={{ nombre: 'pricetag-outline', color: '#95a5a6' }} error={errors.titulo} placeholder='Ejm: Aviso importante' />
          <ErrorFormulario error={errors.titulo} />

          {/* Descripción */}
          <LabelInput titulo='Descripción' icono={{ nombre: 'document-text-outline', color: '#3498db' }} />
          <InputFormulario control={control} name='descripcion' rules={validaciones.descripcion_publicacion} icono={{ nombre: 'reader-outline', color: '#95a5a6' }} error={errors.descripcion} placeholder='Ejm: Se fue el agua por...' estilos={estilosModalFormularioPublicaciones.textArea} />
          <ErrorFormulario error={errors.descripcion} />

          {/* Imagen */}
          <LabelInput titulo='Imagen' icono={{ nombre: 'image-outline', color: '#3498db' }} />

          <View style={estilosModalFormularioPublicaciones.imageButtonsContainer}>
            <CustomBoton
              titulo={imageUri ? 'Cambiar Imagen' : 'Seleccionar Imagen'}
              evento={handleImagePick}
              icono={{ nombre: imageUri ? 'camera-reverse-outline' : 'image-outline', color: 'ffffff' }}
              estilos={estilosModalFormularioPublicaciones.imageButton}
              fuente={16}
            />

            {imageUri && (<CustomBoton
              titulo='Quitar'
              evento={removeImage}
              icono={{ nombre: 'trash-outline', color: 'ffffff' }}
              estilos={{
                ...estilosModalFormularioPublicaciones.imageButton,
                ...estilosModalFormularioPublicaciones.removeButton
              }}
              fuente={16}
                          />)}

          </View>

          {/* Vista previa de la imagen */}
          {imageUri && (<MostrarVistaPrevia titulo='Vista previa:' imageUri={imageUri} icono={{ name: 'eye-outline', color: colores.textPlaceholder }} />)}

          {/* Espacio flexible para empujar los botones hacia abajo */}
          <View style={estilosModalFormularioPublicaciones.spacer} />
        </ScrollView>

        {/* Botones de acción */}
        <View style={estilosModalFormularioPublicaciones.actionButtons}>
          <CustomBoton
            titulo='Cancelar'
            evento={onClose}
            icono={{ nombre: 'close-circle-outline', color: 'ffffff' }}
            estilos={{
              ...estilosModalFormularioPublicaciones.button,
              ...estilosModalFormularioPublicaciones.cancelButton,
              ...(isSubmitting && estilosModalFormularioPublicaciones.disabledButton)
            }}
            fuente={20}
          />

          <CustomBoton
            titulo={esEdicion ? 'Actualizar' : 'Publicar'}
            evento={handleSubmit(onSubmit)}
            icono={{ nombre: esEdicion ? 'save-outline' : 'send-outline', color: 'ffffff' }}
            estilos={{
              ...estilosModalFormularioPublicaciones.button,
              ...estilosModalFormularioPublicaciones.submitButton,
              ...(!canSubmit || isSubmitting) && estilosModalFormularioPublicaciones.disabledButton
            }}
            fuente={20}
          />
        </View>
      </View>
    </Modal>
  )
}

export default ModalFormularioPublicaciones
