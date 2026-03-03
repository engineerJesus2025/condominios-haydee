// utils/dateUtils.js

/**
 * Convierte una fecha en string formato dd/mm/aaaa a un objeto Date.
 * @param {string} fechaStr - Fecha en formato "dd/mm/aaaa"
 * @returns {Date} Objeto Date (medianoche UTC)
 */
export const parseFechaDDMMYYYY = (fechaStr) => {
  if (!fechaStr) return new Date(NaN); // fecha inválida
  const partes = fechaStr.split('/');
  if (partes.length !== 3) return new Date(NaN);
  const [dia, mes, anio] = partes.map(Number);
  // Nota: mes en JS es 0-11, por eso restamos 1
  return new Date(anio, mes - 1, dia);
};

/**
 * Formatea una fecha (objeto Date) a un string legible: "dd de mes de aaaa"
 * @param {Date} date 
 * @returns {string} Ejemplo: "25 de abril de 2025"
 */
export const formatearFechaLegible = (date) => {
  if (isNaN(date)) return 'Fecha no disponible';
  const opciones = { day: '2-digit', month: 'long', year: 'numeric' };
  return date.toLocaleDateString('es-ES', opciones);
};

/**
 * Obtiene el día y mes abreviado a partir de una fecha string dd/mm/aaaa
 * @param {string} fechaStr 
 * @returns {{dia: string, mes: string}} día y mes (ej: {dia: "25", mes: "abr"})
 */
export const obtenerDiaMes = (fechaStr) => {
  const date = parseFechaDDMMYYYY(fechaStr);
  if (isNaN(date)) return { dia: '??', mes: '???' };
  const dia = date.getDate().toString().padStart(2, '0');
  const mes = date.toLocaleDateString('es-ES', { month: 'short' }).replace('.', ''); // "abr"
  return { dia, mes };
};