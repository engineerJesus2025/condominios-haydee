import { useSelector } from 'react-redux';

export const usePermisos = () => {
  const { user, isAuthenticated } = useSelector(state => state.usuario);
  
  const rolActual = user?.rol?.toLowerCase() || 'desconocido';
  const esAdmin = ['administrador', 'presidente'].includes(rolActual.split(" ")[0]);

  return {
    isLogueado: isAuthenticated,
    rolActual,
    usuario: user, // Exportamos al usuario para no tener que usar useSelector en las vistas
    
    // Bandera General
    esAdmin,
    
    // Permisos Específicos (Módulos)
    puedeRegistrarGasto: esAdmin, 
    puedeRegistrarPago: ['propietario', 'administrador', 'presidente'].includes(rolActual),
    puedeAprobarPagos: ['administrador', 'presidente', 'contador'].includes(rolActual),
    puedePublicarCartelera: esAdmin,
    esInvitadoLectura: ['invitado', 'desconocido'].includes(rolActual)
  };
};