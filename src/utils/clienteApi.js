import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { criptografiaMovil } from './criptografiaMovil'; 
import * as FileSystem from 'expo-file-system/legacy';
const URL_BASE = process.env.EXPO_PUBLIC_URL_BASE;

// Variable para alojar el Store de Redux
let reduxStore;

// Función para inyectar el Store desde fuera
export const injectStore = (store) => {
  reduxStore = store;
};

const clienteApi = axios.create({
  baseURL: `${URL_BASE}/api/index.php`,
  timeout: 10000,
});

// ==========================================================
// INTERCEPTOR DE PETICIÓN (SALIDA)
// ==========================================================
clienteApi.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const dispositivoId = await criptografiaMovil.getDispositivoId();
    config.headers['X-Dispositivo-Id'] = dispositivoId;

    if (config.params?.endpoint === 'handshake') {
      return config;
    }


    let claveAesRsaB64 = null;
    if (config.params?.endpoint === 'login') {
      claveAesRsaB64 = criptografiaMovil.preComputarAES();
    }

    const endpointActual = config.params?.endpoint;

    if (config.method.toLowerCase() === 'get') {
      try {
        const datosParaCifrar = config.params || {};
        const paqueteCifrado = criptografiaMovil.cifrarPayload(datosParaCifrar);
        
        config.params = {
          endpoint: endpointActual,
          payload: paqueteCifrado.payload,
          iv: paqueteCifrado.iv,
          tag: paqueteCifrado.tag
        };
      } catch (error) {
        console.error("Error cifrando URL (GET):", error);
        return Promise.reject(error);
      }
      
    } else {
      // --- RUTA POST / PUT ---
      try {
        let datosParaCifrar = {};

        // Si es un formulario con archivos
        if (config.data instanceof FormData || (config.data && config.data._parts)) {
          const partes = config.data._parts || [];
          datosParaCifrar['_archivos_adjuntos'] = {};

          for (const [key, value] of partes) {
            const esArchivo = value && typeof value === 'object' && value.uri;
            
            if (esArchivo) {
              // Leemos el archivo y lo convertimos a texto Base64
              const base64Str = await FileSystem.readAsStringAsync(value.uri, { 
                encoding: 'base64' // Usamos el string literal directamente
              });
              
              // Lo empaquetamos para cifrarlo
              datosParaCifrar['_archivos_adjuntos'][key] = {
                name: value.name,
                type: value.type,
                base64: base64Str
              };
            } else {
              datosParaCifrar[key] = value; 
            }
          }
        } else {
          datosParaCifrar = config.data || {};
        }

        // Ciframos TODO (Textos + Imágenes)
        const paqueteCifrado = criptografiaMovil.cifrarPayload(datosParaCifrar);
        
        if (claveAesRsaB64) {
          paqueteCifrado.clave_aes_rsa = claveAesRsaB64;
        }

        // Transformamos la petición a JSON puro
        config.data = paqueteCifrado;
        
        if (config.headers && typeof config.headers.set === 'function') {
          config.headers.set('Content-Type', 'application/json');
        } else {
          config.headers['Content-Type'] = 'application/json';
        }

      } catch (error) {
        console.error("Error cifrando Body (POST):", error);
        return Promise.reject(error);
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ==========================================================
// INTERCEPTOR DE RESPUESTA (ENTRADA)
// ==========================================================
clienteApi.interceptors.response.use(
  (response) => {
    if (response.data && response.data.cifrado === true) {
      try {
        const jsonLimpio = criptografiaMovil.descifrarPayload(
          response.data.payload,
          response.data.iv,
          response.data.tag
        );
        response.data = jsonLimpio;
      } catch (error) {
        console.error("Error descifrando la respuesta del servidor:", error);
        return Promise.reject(new Error("Error de seguridad en la respuesta"));
      }
    }

    return response;
  },
  (error) => {
    // EL MVP DE CIERRE DE SESIÓN FORZADO (temporal)
    if (error.response && error.response.status === 401) {
      console.log("🔒 Seguridad: JWT expirado o inválido. Cerrando sesión...");
      
      // Si el store fue inyectado, despachamos el logout globalmente
      if (reduxStore) {
        reduxStore.dispatch({ type: 'usuario/logout' }); 
      }
    }
    
    return Promise.reject(error);
  }
);

export default clienteApi;