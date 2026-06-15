import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { criptografiaMovil } from './criptografiaMovil'; 
import * as FileSystem from 'expo-file-system/legacy';
import { Alert } from 'react-native';

const URL_BASE = process.env.EXPO_PUBLIC_URL_BASE;
let reduxStore;

export const injectStore = (store) => {
  reduxStore = store;
};

const clienteApi = axios.create({
  baseURL: `${URL_BASE}/api/index.php`,
  timeout: 10000,
});

// CONTROL DE FALLBACKS
let estaRefrescandoToken = false;
let colaRefrescadaToken = [];

let estaRefrescandoHandshake = false;
let colaRefrescadaHandshake = [];

const procesarColaToken = (error, token = null) => {
  colaRefrescadaToken.forEach((promesa) => error ? promesa.reject(error) : promesa.resolve(token));
  colaRefrescadaToken = [];
};

const procesarColaHandshake = (error) => {
  colaRefrescadaHandshake.forEach((promesa) => error ? promesa.reject(error) : promesa.resolve());
  colaRefrescadaHandshake = [];
};

// INTERCEPTOR DE PETICIÓN (SALIDA)
clienteApi.interceptors.request.use(
  async (config) => {
    if (config.skipCrypto) {
      return config;
    }

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
    if (config.params?.endpoint === 'login' || config.params?.endpoint === 'refrescar') {
      claveAesRsaB64 = criptografiaMovil.preComputarAES();
    }

    // RESPALDO DE DATOS ORIGINALES (ANTI DOBLE CIFRADO)
    if (config._datosPlanos === undefined) {
      config._datosPlanos = config.method.toLowerCase() === 'get' ? { ...config.params } : config.data;
    } else {
      if (config.method.toLowerCase() === 'get') {
        config.params = { ...config._datosPlanos };
      } else {
        config.data = config._datosPlanos;
      }
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
      try {
        let datosParaCifrar = {};
        if (config.data instanceof FormData || (config.data && config.data._parts)) {
          const partes = config.data._parts || [];
          datosParaCifrar['_archivos_adjuntos'] = {};

          for (const [key, value] of partes) {
            const esArchivo = value && typeof value === 'object' && value.uri;
            if (esArchivo) {
              const base64Str = await FileSystem.readAsStringAsync(value.uri, { encoding: 'base64' });
              datosParaCifrar['_archivos_adjuntos'][key] = {
                name: value.name,
                type: value.type,
                base64: base64Str
              };
            } else {
              const arrayMatch = key.match(/^(.+)\[(\d*)\]$/);
              if (arrayMatch) {
                const baseKey = arrayMatch[1];
                const index = arrayMatch[2];
                if (!datosParaCifrar[baseKey]) datosParaCifrar[baseKey] = [];
                if (index === '') datosParaCifrar[baseKey].push(value);
                else datosParaCifrar[baseKey][parseInt(index)] = value;
              } else {
                datosParaCifrar[key] = value; 
              }
            }
          }
        } else {
          datosParaCifrar = config.data || {};
        }

        const paqueteCifrado = criptografiaMovil.cifrarPayload(datosParaCifrar);
        if (claveAesRsaB64) {
          paqueteCifrado.clave_aes_rsa = claveAesRsaB64;
        }

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

// INTERCEPTOR DE RESPUESTA (ENTRADA)
clienteApi.interceptors.response.use(
  (response) => {
    if (response.config.skipCrypto) {
      return response;
    }
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

  async (error) => {
    const originalRequest = error.config;

    // === DESCIFRADO DE ERRORES ===
    // En Axios, un error HTTP salta el callback de éxito, por lo que el payload sigue cifrado.
    // Lo desciframos aquí para que el gestor de errores (o esta misma función) pueda leer 'codigo_interno'.
    if (error.response?.data?.cifrado === true) {
      try {
        const jsonErrorLimpio = criptografiaMovil.descifrarPayload(
          error.response.data.payload,
          error.response.data.iv,
          error.response.data.tag
        );
        error.response.data = jsonErrorLimpio; // Lo inyectamos desencriptado
      } catch (e) {
        console.error("No se pudo descifrar el error del Gateway:", e);
      }
    }

    // =================================================================
    // DETALLE 2: DETECCIÓN Y FLUJO DE REFRESH TOKEN (HTTP 401)
    // =================================================================
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Marcamos para no ciclar
      
      const codigoInterno = error.response?.data?.codigo_interno;

      // 1. RECHAZO ESTRICTO DE IDENTIDAD (Ataque o manipulación detectada)
      if (codigoInterno === 'JWT_INVALIDO') {
        Alert.alert(
          "Anomalía Detectada",
          "El identificador de sesión es inválido o ha sido alterado. Por tu seguridad, debes iniciar sesión nuevamente.",
          [
            { 
              text: "Aceptar", 
              onPress: () => {
                if (reduxStore) reduxStore.dispatch({ type: 'usuario/logout' });
              } 
            }
          ],
          { cancelable: false }
        );
        return Promise.reject(error);
      }

      // 2. EXPIRACIÓN NATURAL (Proceder con Refresh Token en segundo plano)
      if (estaRefrescandoToken) {
        return new Promise((resolve, reject) => {
          colaRefrescadaToken.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers['Authorization'] = `Bearer ${token}`;
          return clienteApi(originalRequest);
        }).catch(err => Promise.reject(err));
      }

      estaRefrescandoToken = true;

      try {
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        const userDataStr = await AsyncStorage.getItem('userData');
        const userData = userDataStr ? JSON.parse(userDataStr) : null;

        if (!refreshToken || !userData?.id_usuario) {
          throw new Error("Credenciales de renovación locales inexistentes.");
        }

        console.log("JWT Expirado. Renovando sesión con Refresh Token...");
        
        // Llamada axios directa, sin interceptores para no causar bucles
        const respuestaRefresh = await axios.post(`${URL_BASE}/api/index.php?endpoint=refrescar`, {
          id_usuario: userData.id_usuario,
          token: refreshToken
        });

        // Aseguramos leer correctamente la respuesta considerando si viene o no cifrada
        const dataRefresh = respuestaRefresh.data.cifrado 
            ? criptografiaMovil.descifrarPayload(respuestaRefresh.data.payload, respuestaRefresh.data.iv, respuestaRefresh.data.tag)
            : respuestaRefresh.data;

        if (dataRefresh?.estatus) {
          const nuevoJwt = dataRefresh.token_jwt;
          
          await AsyncStorage.setItem('userToken', nuevoJwt);

          estaRefrescandoToken = false;
          procesarColaToken(null, nuevoJwt);

          originalRequest.headers['Authorization'] = `Bearer ${nuevoJwt}`;
          return clienteApi(originalRequest);
        } else {
          throw new Error("El servidor rechazó el token de larga duración.");
        }

      } catch (falloRefresh) {
        estaRefrescandoToken = false;
        procesarColaToken(falloRefresh, null);

        // =================================================================
        // DETALLE 1: EXPERIENCIA DE USUARIO CALMADA EN EL LOGOUT
        // =================================================================
        Alert.alert(
          "Sesión Expirada",
          "Tu sesión ha caducado por inactividad prolongada o por seguridad. Por favor, vuelve a ingresar.",
          [
            { 
              text: "Entendido", 
              onPress: () => {
                if (reduxStore) reduxStore.dispatch({ type: 'usuario/logout' });
              } 
            }
          ],
          { cancelable: false }
        );

        return Promise.reject(falloRefresh);
      }
    }

    // CONTROL EXISTENTE: FALLO CRIPTOGRÁFICO (HTTP 403)
    if (error.response?.status === 403 && !originalRequest._retryHandshake) {
      originalRequest._retryHandshake = true;

      if (estaRefrescandoHandshake) {
        return new Promise((resolve, reject) => {
          colaRefrescadaHandshake.push({ resolve, reject });
        }).then(() => clienteApi(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      estaRefrescandoHandshake = true;

      try {
        console.log("Código 403: Fallo Criptográfico. Re-sincronizando canal AES...");
        const respuestaHandshake = await axios.get(`${URL_BASE}/api/index.php`, {
          params: { endpoint: 'handshake' },
          timeout: 5000
        });

        // Verificamos si la respuesta del handshake es plana o cifrada
        const dataHandshake = respuestaHandshake.data.cifrado 
            ? criptografiaMovil.descifrarPayload(respuestaHandshake.data.payload, respuestaHandshake.data.iv, respuestaHandshake.data.tag)
            : respuestaHandshake.data;

        if (dataHandshake?.estatus) {
          criptografiaMovil.setLlavePublica(dataHandshake.public_key);
          estaRefrescandoHandshake = false;
          procesarColaHandshake(null);
          return clienteApi(originalRequest);
        } else {
          throw new Error("El handshake falló.");
        }
      } catch (falloHandshake) {
        estaRefrescandoHandshake = false;
        procesarColaHandshake(falloHandshake);

        Alert.alert(
          "Seguridad Comprometida",
          "Error de integridad en el canal seguro. Es necesario reingresar al sistema por protección de datos.",
          [
            { 
              text: "Reingresar", 
              onPress: () => {
                if (reduxStore) reduxStore.dispatch({ type: 'usuario/logout' });
              } 
            }
          ],
          { cancelable: false }
        );

        return Promise.reject(falloHandshake);
      }
    }

    return Promise.reject(error);
  }
);

export default clienteApi;