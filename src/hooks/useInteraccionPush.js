import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { useNavigation } from '@react-navigation/native';
import { usePermisos } from './usePermisos';

export const useInteraccionPush = () => {
  const navigation = useNavigation();
  const permisos = usePermisos(); 

  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      const data = response.notification.request.content.data;

      if (!data?.ruta) return;

      let rutaDestino = data.ruta;

      // Si la ruta no está en el diccionario, se asume que es pública (ej. Inicio o Perfil).
      const reglasAcceso = {
        'Mensualidad': permisos.puedeVerMensualidad,
        'Gastos': permisos.puedeVerGastos,
        'Cartelera': permisos.puedeVerCartelera,
        'DetalleCartelera': permisos.puedeVerCartelera,
        'DetallePago': true, // todos pueden ver sus propios pagos
      };

      // Verificamos si la ruta tiene una regla definida y si el permiso es estrictamente falso
      if (reglasAcceso[rutaDestino] === false) {
        console.warn(`Acceso denegado por Push a: ${rutaDestino}. Redirigiendo a Inicio.`);
        rutaDestino = 'Inicio'; // Por defecto
      }

      // Al pasar los params, cualquier pantalla receptora podrá hacer fetch de su registro específico.
      navigation.navigate(rutaDestino, {
        id_registro: data.id_registro,
        tabla_origen: data.tabla_origen
      });
    });

    return () => subscription.remove();
  }, [navigation, permisos]);
};

// Componente "Wrapper" para montar dentro del Stack de Navegación
export const EscuchadorNotificaciones = () => {
  useInteraccionPush();
  return null; 
};