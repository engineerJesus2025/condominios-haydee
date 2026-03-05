import { useState } from 'react';
import { useSelector } from 'react-redux';

export const useCarteleraVirtual = () => {
  
  const listaPublicaciones = useSelector(state => state.publicaciones.listaPublicaciones) || []; 

  const [modalVisible, setModalVisible] = useState(false);
  const [modalEdicionVisible, setModalEdicionVisible] = useState(false);
  const [publicacionSeleccionada, setPublicacionSeleccionada] = useState(null);

  const abrirModalNuevaPublicacion = () => setModalVisible(true);
  
  const cerrarModalNuevaPublicacion = () => setModalVisible(false);

  const abrirModalEdicion = (publicacion) => {
    setPublicacionSeleccionada(publicacion);
    setModalEdicionVisible(true);
  };

  const cerrarModalEdicion = () => {
    setPublicacionSeleccionada(null);
    setModalEdicionVisible(false);
  };

  const handleGuardarEdicion = () => {
    cerrarModalEdicion();
  };

  return {
    listaPublicaciones,
    modalVisible,
    modalEdicionVisible,
    publicacionSeleccionada,
    abrirModalNuevaPublicacion,
    cerrarModalNuevaPublicacion,
    abrirModalEdicion,
    cerrarModalEdicion,
    handleGuardarEdicion
  };
};