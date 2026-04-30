
// config.js
const ENV = {
  development: {
    API_URL: "http://localhost:5000/api",
  },
  production: {
    API_URL: "https://levelup-crew.duckdns.org/api"
    // Cuando tengas dominio:
    // API_URL: "https://tu-dominio.com/api",
  }
};

// Detecta automáticamente el entorno
const isDevelopment = window.location.hostname === 'localhost' || 
                      window.location.hostname === '127.0.0.1';

const config = isDevelopment ? ENV.development : ENV.production;

const API = config.API_URL;