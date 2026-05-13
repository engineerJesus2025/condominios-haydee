import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/usuarioSlice';
import clienteApi from '../utils/clienteApi';

export const usePerfil = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.usuario);
  const [datosPerfil, setDatosPerfil] = useState(user);
  const [loading, setLoading] = useState(false);

  // Consultar datos frescos del servidor al entrar
  const cargarDatosServidor = async () => {
    setLoading(true);
    try {
      const respuesta = await clienteApi.get('', {
        params: { endpoint: 'perfil' } // api/perfil_api.php
      });
      if (respuesta.data.estatus) {
        setDatosPerfil(respuesta.data.datos);
      }
    } catch (error) {
      console.error("Error al cargar perfil:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return {
    usuario: datosPerfil,
    loading,
    cargarDatosServidor,
    handleLogout
  };
};