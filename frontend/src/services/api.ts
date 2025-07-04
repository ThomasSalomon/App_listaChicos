/**
 * API Service Configuration
 * Configuración central para todas las peticiones HTTP
 */

import axios from 'axios';

// Configuración dinámica de la URL base
const getApiBaseUrl = (): string => {
  // 1. Usar variable de entorno si está definida
  if (import.meta.env.VITE_API_BASE_URL) {
    return `${import.meta.env.VITE_API_BASE_URL}/api`;
  }
  
  // 2. Detectar automáticamente según el protocolo del frontend
  const protocol = window.location.protocol; // 'http:' o 'https:'
  const hostname = window.location.hostname; // 'localhost' o IP
  
  // Si el frontend está en HTTPS, usar HTTPS para el backend también
  const backendPort = 3001;
  return `${protocol}//${hostname}:${backendPort}/api`;
};

const API_BASE_URL = getApiBaseUrl();

// Crear instancia de axios con configuración base
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 segundos
  headers: {
    'Content-Type': 'application/json',
  },
  // Para desarrollo: aceptar certificados auto-firmados
  ...(API_BASE_URL.startsWith('https://localhost') && {
    validateStatus: () => true, // Aceptar cualquier status para debugging
  })
});

// Log de configuración para debugging
console.log('🔧 API Configuration:', {
  baseURL: API_BASE_URL,
  protocol: window.location.protocol,
  hostname: window.location.hostname
});

// Interceptor para requests (opcional - para logging)
apiClient.interceptors.request.use(
  (config) => {
    console.log(`🚀 ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Interceptor para responses (manejo de errores global)
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ Response error:', error.response?.data || error.message);
    
    // Manejo específico de errores HTTP
    if (error.response) {
      switch (error.response.status) {
        case 400:
          console.error('Bad Request:', error.response.data);
          break;
        case 404:
          console.error('Not Found:', error.response.data);
          break;
        case 500:
          console.error('Server Error:', error.response.data);
          break;
        default:
          console.error('HTTP Error:', error.response.status, error.response.data);
      }
    } else if (error.request) {
      console.error('Network Error: No response from server');
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
