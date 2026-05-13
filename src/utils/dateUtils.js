export const parseFechaMySQL = (fechaStr) => {
  if (!fechaStr) return new Date(NaN);
  
  // MySQL devuelve "YYYY-MM-DD HH:MM:SS"
  // Separamos la fecha de la hora para evitar problemas de zona horaria
  const [fecha] = fechaStr.split(' '); 
  const [anio, mes, dia] = fecha.split('-').map(Number);
  
  // Nota: mes en JS es 0-11
  return new Date(anio, mes - 1, dia);
};

export const formatearFechaLegible = (fechaStr) => {
  const date = parseFechaMySQL(fechaStr);
  if (isNaN(date)) return 'Fecha no disponible';
  
  const opciones = { day: '2-digit', month: 'long', year: 'numeric' };
  return date.toLocaleDateString('es-ES', opciones);
};

export const obtenerDiaMes = (fechaStr) => {
  const date = parseFechaMySQL(fechaStr);
  if (isNaN(date)) return { dia: '??', mes: '???' };
  
  const dia = date.getDate().toString().padStart(2, '0');
  let mes = date.toLocaleDateString('es-ES', { month: 'short' }).replace('.', '');
  
  // Aseguramos que sea "abr" y no "abrir" o similar
  mes = mes.substring(0, 3).toLowerCase();
  
  return { dia, mes };
};