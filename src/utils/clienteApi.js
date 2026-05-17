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
                encoding: 'base64' 
              });
              
              datosParaCifrar['_archivos_adjuntos'][key] = {
                name: value.name,
                type: value.type,
                base64: base64Str
              };
            } else {
              // Verificamos si la llave tiene formato de arreglo (ej. "monto[0]" o "monto[]")
              const arrayMatch = key.match(/^(.+)\[(\d*)\]$/);
              
              if (arrayMatch) {
                const baseKey = arrayMatch[1]; // ej. "monto"
                const index = arrayMatch[2];   // ej. "0"
                
                // Si no existe el arreglo en nuestro JSON, lo creamos
                if (!datosParaCifrar[baseKey]) {
                  datosParaCifrar[baseKey] = [];
                }
                
                if (index === '') {
                  // Si mandan "campo[]", lo empujamos al final
                  datosParaCifrar[baseKey].push(value);
                } else {
                  // Si mandan "campo[0]", respetamos el índice
                  datosParaCifrar[baseKey][parseInt(index)] = value;
                }
              } else {
                // Campos normales (ej. "clasificacion")
                datosParaCifrar[key] = value; 
              }
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
    let errorFormateado = { tipo: 'DESCONOCIDO', mensaje: error.message, status: null };
    if (error.response) {
      
    console.log(error.response.data)
      // DESCIFRADO DE EMERGENCIA: Si el servidor envió un error cifrado (ej. 401 o 429)
      let dataServidor = error.response.data;
      if (dataServidor && dataServidor.cifrado === true) {
        try {
          dataServidor = criptografiaMovil.descifrarPayload(dataServidor.payload, dataServidor.iv, dataServidor.tag);
        } catch (e) {
          console.error("No se pudo descifrar el error del servidor");
        }
      }

      errorFormateado = { 
        tipo: 'SERVIDOR', 
        status: error.response.status, 
        mensaje: dataServidor?.mensaje || 'Error interno del servidor.' 
      };

      // LOGOUT GLOBAL INTELIGENTE: Cerramos sesión SOLO si no estamos en la pantalla de Login
      const endpoint = error.config?.params?.endpoint;
      if (errorFormateado.status === 401 && reduxStore && endpoint !== 'login') {
        console.log("🔒 Seguridad: JWT expirado o inválido. Cerrando sesión...");
        reduxStore.dispatch({ type: 'usuario/logout' }); 
      }
    } else if (error.request) {
      errorFormateado = { tipo: 'RED', mensaje: 'El servidor tardó demasiado o no hay conexión.', status: 0 };
    }

    return Promise.reject(errorFormateado);
  }
);

export default clienteApi;