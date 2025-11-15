import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Alert } from 'react-native';
import { editarPublicacion, eliminarPublicacion } from '../store/slices/publicacionesSlice';

export const useCarteleraVirtual = () => {
  const dispatch = useDispatch();
  const posts = useSelector(state => state.publicaciones.publicacion);
  
  const [modalVisible, setModalVisible] = useState(false);
  const [modalEdicionVisible, setModalEdicionVisible] = useState(false);
  const [publicacionSeleccionada, setPublicacionSeleccionada] = useState(null);

  const handleEliminarPublicacion = (fila) => {
    Alert.alert(
      "Confirmar eliminación",
      `¿Estás seguro de que quieres eliminar "${fila.titulo}"?`,
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        { 
          text: "Eliminar", 
          style: "destructive",
          onPress: () => {
            dispatch(eliminarPublicacion(fila.id));
          }
        }
      ]
    );
  };

  const handleEditarPublicacion = (fila) => {
    setPublicacionSeleccionada(fila);
    setModalEdicionVisible(true);
  };

  const handleGuardarEdicion = (datosActualizados) => {
    if (publicacionSeleccionada) {
      dispatch(editarPublicacion({
        id: publicacionSeleccionada.id,
        ...datosActualizados
      }));
      setModalEdicionVisible(false);
      setPublicacionSeleccionada(null);
    }
  };

  const abrirModalNuevaPublicacion = () => setModalVisible(true);
  
  const cerrarModalNuevaPublicacion = () => setModalVisible(false);
  
  const cerrarModalEdicion = () => {
    setModalEdicionVisible(false);
    setPublicacionSeleccionada(null);
  };

  const accionesUsuarios = [
    {
      icono: 'pencil',
      color: '#28A745', 
      onPress: handleEditarPublicacion
    },
    {
      icono: 'trash',
      color: '#DC3545',
      onPress: handleEliminarPublicacion
    }
  ];

  return {
    // Estado
    posts,
    modalVisible,
    modalEdicionVisible,
    publicacionSeleccionada,
    accionesUsuarios,
    
    // Acciones
    abrirModalNuevaPublicacion,
    cerrarModalNuevaPublicacion,
    cerrarModalEdicion,
    handleGuardarEdicion
  };
};