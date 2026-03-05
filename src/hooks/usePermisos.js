import { useSelector } from 'react-redux'

export const usePermisos = () => {
  const { user, isLogueado } = useSelector(state => state.usuario)
  
  // Si no hay usuario en el estado, lo consideramos un desconocido
  const rolActual = user?.rol || 'desconocido' 

  return {
    isLogueado,
    rolActual,
    usuario: user,
    
    // ¿Quién puede agregar un nuevo Gasto?
    puedeRegistrarGasto: ['administrador', 'presidente'].includes(rolActual),
    
    // ¿Quién puede reportar un Pago?
    puedeRegistrarPago: ['propietario', 'administrador', 'presidente'].includes(rolActual),
    
    // ¿Quién puede aprobar/rechazar pagos en estado "Pendiente"?
    puedeAprobarPagos: ['administrador', 'presidente', 'contador'].includes(rolActual),

    // ¿Quién puede crear publicaciones en la Cartelera?
    puedePublicarCartelera: ['administrador', 'presidente'].includes(rolActual),

    // ¿Es un invitado de solo lectura?
    esInvitadoLectura: ['invitado', 'desconocido'].includes(rolActual)
  }
}