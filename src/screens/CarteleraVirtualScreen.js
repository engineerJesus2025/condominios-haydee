import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native'
import { useSelector, useDispatch } from 'react-redux';

import AppHeader from '../components/Header'
import TablaDinamica from '../components/TablaDinamica'
import ColumnaTabla from '../components/ColumnaTabla'
import Footer from '../components/Footer'
import ModalFormularioPublicaciones from '../components/ModalFormularioPublicaciones'
import BotonNuevoRegistro from '../components/BotonNuevoRegistro'

import { getEstilosCarteleraVirtual } from '../styles/screens/estilosCarteleraVirtual'

import { useTema } from './../hooks/useTema'
import { editarPublicacion, eliminarPublicacion } from '../store/slices/publicacionesSlice' // ✅ Importar las acciones

export default function CarteleraVirtualScreen () {
  const posts = useSelector(state => state.publicaciones.publicacion);
  const { colores } = useTema()
  const estilosCarteleraVirtual = getEstilosCarteleraVirtual(colores)
  const dispatch = useDispatch()

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
  ]

  return (
    <>
      <AppHeader />

      <View style={estilosCarteleraVirtual.mainContentContainer}>
        <Text style={estilosCarteleraVirtual.title}>Cartelera Virtual</Text>
        
        <BotonNuevoRegistro titulo="Nueva publicación" evento={() => setModalVisible(true)} />

        <TablaDinamica
            datos={posts}
            mostrarVerMas={true}
            acciones={accionesUsuarios}
            configuracionModal={{ //Este es para el modal de los detalles pago, gasto,etc
              titulo: "Detalles de Publicación",
              campos: [
                { key: 'titulo', label: 'Título' },
                { key: 'fecha', label: 'Fecha de Publicación' },
                { key: 'descripcion', label: 'Descripción' }
              ],
              mostrarImagen: true
            }}
        >
            <ColumnaTabla titulo='Título' campo='titulo' />
            <ColumnaTabla titulo='Fecha' campo='fecha' />
        </TablaDinamica>

        {/* Modal para nueva publicación */}
        <ModalFormularioPublicaciones 
          visible={modalVisible} 
          onClose={() => setModalVisible(false)} 
        />

        <ModalFormularioPublicaciones 
          visible={modalEdicionVisible} 
          onClose={() => {
            setModalEdicionVisible(false);
            setPublicacionSeleccionada(null);
          }}
          publicacionEditar={publicacionSeleccionada}
          onGuardar={handleGuardarEdicion} 
        />
      </View>

      <Footer />
    </>
  )
}