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
      // Primera pasada: Guardamos el contenido original intacto
      config._datosPlanos = config.method.toLowerCase() === 'get' ? { ...config.params } : config.data;
    } else {
      // Es un REINTENTO (Viene de un 401 o 403): Restauramos el texto plano
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
    if (!originalRequest) return Promise.reject(error);

    let errorFormateado = { tipo: 'DESCONOCIDO', mensaje: error.message, status: null };

    if (error.response) {
      let dataServidor = error.response.data;
      const status = error.response.status;
      const endpointActual = originalRequest.params?.endpoint;

      if (dataServidor && dataServidor.cifrado === true) {
        try {
          dataServidor = criptografiaMovil.descifrarPayload(dataServidor.payload, dataServidor.iv, dataServidor.tag);
        } catch (e) {
          console.error("No se pudo descifrar el payload de error del servidor");
        }
      }

      errorFormateado = { 
        tipo: 'SERVIDOR', 
        status: status, 
        mensaje: dataServidor?.mensaje || 'Error interno del servidor.',
        erroresFormulario: dataServidor?.errores || null 
      };

      // Si el error viene de un endpoint de recuperación/autenticación base, no ciclar
      if (endpointActual === 'login' || endpointActual === 'handshake' || endpointActual === 'refrescar') {
        return Promise.reject(errorFormateado);
      }

      // ==================== REFRESH TOKEN (JWT EXPIRADO) ====================
      if (status === 401) {
        if (estaRefrescandoToken) {
          return new Promise((resolve, reject) => {
            colaRefrescadaToken.push({ resolve, reject });
          }).then((nuevoToken) => {
            originalRequest.headers.Authorization = `Bearer ${nuevoToken}`;
            return clienteApi(originalRequest);
          }).catch((err) => Promise.reject(err));
        }

        estaRefrescandoToken = true;

        try {
          console.log("Móvil JWT: Token expirado (401). Intentando renovación transparente...");
          const rawUserData = await AsyncStorage.getItem('userData');
          const refreshToken = await AsyncStorage.getItem('refreshToken');
          const userData = rawUserData ? JSON.parse(rawUserData) : null;

          if (!userData?.id_usuario || !refreshToken) {
            throw new Error("Credenciales de refresco inexistentes en almacenamiento local.");
          }

          // Se ejecuta vía clienteApi. Al llamar a 'refrescar', se cifra automáticamente con el AES activo
          const resRefresh = await clienteApi.post('', {
            operacion: 'refrescar_token',
            id_usuario: userData.id_usuario,
            token: refreshToken
          }, {
            params: { endpoint: 'refrescar' }
          });

          let datosRenovacion = resRefresh.data;

          // Ahora evaluamos sobre el objeto seguro
          if (datosRenovacion?.estatus && datosRenovacion?.nuevo_token_jwt) {
            const nuevoJwt = datosRenovacion.nuevo_token_jwt;
            await AsyncStorage.setItem('userToken', nuevoJwt);
            
            estaRefrescandoToken = false;
            procesarColaToken(null, nuevoJwt);

            // Reinyectar credencial fresca y ejecutar de nuevo la petición original
            originalRequest.headers.Authorization = `Bearer ${nuevoJwt}`;
            return clienteApi(originalRequest);
          } else {
            throw new Error("Respuesta de renovación inválida.");
          }

        } catch (falloRefresh) {
          console.error("Móvil JWT: Fallo definitivo en la renovación del token.", falloRefresh.message);
          estaRefrescandoToken = false;
          procesarColaToken(falloRefresh);

          if (reduxStore) {
            reduxStore.dispatch({ type: 'usuario/logout' });
          }
          errorFormateado.mensaje = "Su sesión ha expirado. Por favor, vuelva a identificarse.";

          Alert.alert("Sesión Expirada", errorFormateado.mensaje);

          return Promise.reject(errorFormateado);
        }
      }

      // ==================== SILENT HANDSHAKE (FALLO CRIPTOGRÁFICO) ====================
      if (status === 403) {
        if (estaRefrescandoHandshake) {
          return new Promise((resolve, reject) => {
            colaRefrescadaHandshake.push({ resolve, reject });
          }).then(() => {
            return clienteApi(originalRequest);
          }).catch((err) => Promise.reject(err));
        }

        estaRefrescandoHandshake = true;

        try {
          console.log("Código 403. Re-sincronizando canal AES de manera silenciosa");
          
          // Petición Axios cruda (salta interceptores) para traer la llave RSA pública del server
          const respuestaHandshake = await axios.get(`${URL_BASE}/api/index.php`, {
            params: { endpoint: 'handshake' },
            timeout: 5000
          });

          if (respuestaHandshake.data?.estatus) {
            criptografiaMovil.setLlavePublica(respuestaHandshake.data.public_key);
            estaRefrescandoHandshake = false;
            procesarColaHandshake(null);

            return clienteApi(originalRequest);
          } else {
            throw new Error("El handshake automático no retornó una llave válida.");
          }
        } catch (falloHandshake) {
          console.error("Móvil Cripto: Fallo crítico en la autoreparación del canal.", falloHandshake.message);
          estaRefrescandoHandshake = false;
          procesarColaHandshake(falloHandshake);

          if (reduxStore) {
            reduxStore.dispatch({ type: 'usuario/logout' });
          }
          errorFormateado.mensaje = "Error de integridad en el canal seguro. Es necesario reingresar.";

          Alert.alert("Seguridad Comprometida", errorFormateado.mensaje);
          
          return Promise.reject(errorFormateado);
        }
      }
    }
    return Promise.reject(errorFormateado);
  }
);

export default clienteApi;