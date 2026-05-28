import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../store/slices/usuarioSlice';
import clienteApi from '../utils/clienteApi';
import { usePermisos } from './usePermisos'; 
import { procesarErrorApi } from '../utils/gestorErroresUI';

export const usePerfil = () => {
  const dispatch = useDispatch();
  
  const { usuario } = usePermisos(); 
  
  const [datosPerfil, setDatosPerfil] = useState(usuario);
  const [loading, setLoading] = useState(false);

  // Consultar datos frescos del servidor al entrar
  const cargarDatosServidor = async () => {
    setLoading(true);
    try {
      const respuesta = await clienteApi.get('', {
        params: { endpoint: 'perfil', operacion: 'consultar_perfil' } 
      });
      if (respuesta.data.estatus) {
        setDatosPerfil(respuesta.data.datos);
      }
    } catch (error) {
      procesarErrorApi(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  useEffect(() => {
    cargarDatosServidor();
  }, []);

  return {
    usuario: datosPerfil,
    loading,
    cargarDatosServidor,
    handleLogout
  };
};