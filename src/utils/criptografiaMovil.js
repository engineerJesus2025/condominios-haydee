import forge from 'node-forge';
import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';

// Variables en memoria (se borran al cerrar la app)
let llavePublicaRSA = null;
let claveAESSesion = null;
let dispositivoIdMemoria = null;

export const criptografiaMovil = {
  
  // Obtener o generar el ID permanente del dispositivo
  getDispositivoId: async () => {
    if (!dispositivoIdMemoria) {
      // Buscamos en el almacenamiento seguro del teléfono
      let idGuardado = await SecureStore.getItemAsync('dispositivo_id_seguro');
      
      if (!idGuardado) {
        // Si no existe, es la primera vez que abre la app. Lo creamos.
        idGuardado = Crypto.randomUUID();
        await SecureStore.setItemAsync('dispositivo_id_seguro', idGuardado);
      }
      dispositivoIdMemoria = idGuardado;
    }
    return dispositivoIdMemoria;
  },

  getClaveAESSesion: () => claveAESSesion,

  // Guardar la llave pública que viene del servidor
  setLlavePublica: (pem) => {
    llavePublicaRSA = forge.pki.publicKeyFromPem(pem);
  },

  // El Pre-Cómputo (Se ejecuta en el interceptor al detectar el endpoint 'login')
  preComputarAES: () => {
    if (!llavePublicaRSA) throw new Error("No hay llave pública del servidor");

    const nuevaClaveAES = forge.random.getBytesSync(32);
    
    // OBLIGAMOS a Node-Forge a usar SHA-256 para el Padding OAEP
    const claveAESCifradaConRSA = llavePublicaRSA.encrypt(nuevaClaveAES, 'RSA-OAEP', {
      md: forge.md.sha256.create(),
      mgf1: {
        md: forge.md.sha256.create()
      }
    });
    claveAESSesion = nuevaClaveAES;
    return forge.util.encode64(claveAESCifradaConRSA);
  },

  // Cifrar cualquier JSON (Login, Pagos, etc.)
  cifrarPayload: (objetoJSON) => {
    if (!claveAESSesion) throw new Error("No hay clave de sesión establecida");

    const jsonString = JSON.stringify(objetoJSON);
    const iv = forge.random.getBytesSync(12); // GCM usa 12 bytes
    
    const cipher = forge.cipher.createCipher('AES-GCM', claveAESSesion);
    cipher.start({ iv: iv });
    cipher.update(forge.util.createBuffer(jsonString, 'utf8'));
    cipher.finish();

    return {
      payload: forge.util.encode64(cipher.output.getBytes()),
      iv: forge.util.encode64(iv),
      tag: forge.util.encode64(cipher.mode.tag.getBytes())
    };
  },

  // Descifrar la respuesta del servidor
  descifrarPayload: (payloadB64, ivB64, tagB64) => {
    if (!claveAESSesion) throw new Error("No hay clave de sesión establecida");

    const decipher = forge.cipher.createDecipher('AES-GCM', claveAESSesion);
    decipher.start({
      iv: forge.util.decode64(ivB64),
      tag: forge.util.decode64(tagB64)
    });
    decipher.update(forge.util.createBuffer(forge.util.decode64(payloadB64)));
    
    if (!decipher.finish()) {
      throw new Error("Fallo la verificación de integridad (GCM Tag no coincide)");
    }

    return JSON.parse(decipher.output.toString('utf8'));
  }
};