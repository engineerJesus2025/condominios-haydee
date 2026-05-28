// Constantes extraídas de FormatoFechas.js
const mesesAbreviados = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
const mesesCompletos = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

export const parseFechaMySQL = (fechaStr) => {
  if (!fechaStr) return new Date(NaN);
  
  const [fecha] = fechaStr.split(' '); 
  const [anio, mes, dia] = fecha.split('-').map(Number);
  
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
  
  mes = mes.substring(0, 3).toLowerCase();
  
  return { dia, mes };
};

// --- NUEVAS FUNCIONES INTEGRADAS DEL WEB HELPER ---

export const obtenerNombreMes = (mesNumero) => {
  // Aseguramos que sea entero y ajustamos al índice 0-11
  const index = parseInt(mesNumero, 10) - 1;
  return mesesCompletos[index] || 'Mes inválido';
};

/**
 * Convierte pares como (2, 2025) o strings "2 2025" a "febrero 2025"
 */
export const formatearMesAnio = (mes, anio) => {
  if (!mes || !anio) return '';
  const nombreMes = obtenerNombreMes(mes).toLowerCase();
  return `${nombreMes.charAt(0).toUpperCase() + nombreMes.slice(1)} ${anio}`; 
};

// Agregar al final de dateUtils.js

export const tiempoRelativo = (fechaEntrada) => {
    const fecha = parseFechaMySQL(fechaEntrada);
    // Si la fecha es inválida o viene vacía
    if (isNaN(fecha)) return '';

    const ahora = new Date();
    // Diferencia en milisegundos convertida a segundos
    const segundos = Math.round((ahora - fecha) / 1000);
    const minutos = Math.round(segundos / 60);
    const horas = Math.round(minutos / 60);
    const dias = Math.round(horas / 24);
    const meses = Math.round(dias / 30);
    const años = Math.round(dias / 365);

    if (segundos < 60) return 'Hace unos segundos';
    if (minutos < 60) return `Hace ${minutos} minuto${minutos !== 1 ? 's' : ''}`;
    if (horas < 24) return `Hace ${horas} hora${horas !== 1 ? 's' : ''}`;
    if (dias < 30) return `Hace ${dias} día${dias !== 1 ? 's' : ''}`;
    if (meses < 12) return `Hace ${meses} mes${meses !== 1 ? 'es' : ''}`;
    return `Hace ${años} año${años !== 1 ? 's' : ''}`;
};