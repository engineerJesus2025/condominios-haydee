// hooks/useEventos.js
import { useSelector } from 'react-redux';

export const useEventos = () => {
  const publicaciones = useSelector(state => state.publicaciones.publicacion);
  
  // Filtrar solo eventos (suponiendo que tienen tipo 'evento')
  const eventos = publicaciones.filter(pub => pub.tipo === 'evento');
  
  // Opcional: ordenar por fecha (más próximos primero)
  const eventosOrdenados = [...eventos].sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
  
  // Tomar solo los próximos 3, por ejemplo
  const proximosEventos = eventosOrdenados.slice(0, 3);
  
  return { eventos: proximosEventos };
};