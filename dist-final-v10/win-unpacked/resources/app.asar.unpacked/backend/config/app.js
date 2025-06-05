/**
 * Application Configuration
 * Configuración centralizada de la aplicación
 */

const path = require('path');

const config = {
  // Configuración del servidor
  server: {
    port: process.env.PORT || 3001,
    host: process.env.HOST || 'localhost',
    env: process.env.NODE_ENV || 'development'
  },

  // Configuración de la base de datos
  database: {
    path: process.env.DB_PATH || path.join(__dirname, '..', 'database', 'database.sqlite'),
    options: {
      busyTimeout: 30000,
      // En producción, usar WAL mode para mejor concurrencia
      mode: process.env.NODE_ENV === 'production' ? 'WAL' : 'DELETE'
    }
  },

  // Configuración de CORS
  cors: {
    origins: {
      development: [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:5173',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:3001',
        'http://127.0.0.1:5173'
      ],
      production: [
        // Agregar dominios de producción aquí
      ]
    }
  },

  // Configuración de rate limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutos
    maxRequests: 100, // máximo 100 requests por ventana
    skipSuccessfulRequests: false,
    skipFailedRequests: false
  },

  // Configuración de validación
  validation: {
    child: {
      nombre: {
        minLength: 2,
        maxLength: 50,
        pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]+$/
      },
      apellido: {
        minLength: 2,
        maxLength: 50,
        pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]+$/
      },
      edad: {
        min: 1,
        max: 18
      }
    },
    pagination: {
      defaultLimit: 20,
      maxLimit: 100
    }
  },

  // Configuración de logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.LOG_FORMAT || 'combined',
    enabled: process.env.LOGGING_ENABLED !== 'false'
  },

  // Configuración de seguridad
  security: {
    headers: {
      xFrameOptions: 'DENY',
      xContentTypeOptions: 'nosniff',
      xXssProtection: '1; mode=block',
      referrerPolicy: 'strict-origin-when-cross-origin'
    },
    cookieSecret: process.env.COOKIE_SECRET || 'lista-chicos-secret-key',
    sessionTimeout: 24 * 60 * 60 * 1000 // 24 horas
  },

  // Configuración de cache
  cache: {
    defaultTtl: 3600, // 1 hora
    checkPeriod: 600,  // revisar cada 10 minutos
    enabled: process.env.CACHE_ENABLED !== 'false'
  },

  // Configuración de archivos estáticos
  static: {
    enabled: process.env.SERVE_STATIC !== 'false',
    path: path.join(__dirname, '..', 'public'),
    maxAge: '1d'
  },

  // Configuración de respuestas API
  api: {
    version: '1.0.0',
    prefix: '/api',
    defaultPageSize: 20,
    maxPageSize: 100,
    timeout: 30000 // 30 segundos
  },

  // Configuración del frontend (para integración)
  frontend: {
    url: process.env.FRONTEND_URL || 'http://localhost:3000',
    buildPath: path.join(__dirname, '..', '..', 'frontend', 'dist')
  }
};

// Validar configuración crítica
const validateConfig = () => {
  const errors = [];

  // Validar puerto
  if (!config.server.port || isNaN(parseInt(config.server.port))) {
    errors.push('Puerto del servidor inválido');
  }

  // Validar path de base de datos
  if (!config.database.path) {
    errors.push('Path de base de datos no configurado');
  }

  // En producción, validar configuraciones críticas
  if (config.server.env === 'production') {
    if (config.security.cookieSecret === 'lista-chicos-secret-key') {
      errors.push('Cookie secret debe ser cambiado en producción');
    }
    
    if (config.cors.origins.production.length === 0) {
      errors.push('Orígenes CORS de producción no configurados');
    }
  }

  if (errors.length > 0) {
    throw new Error(`Errores de configuración: ${errors.join(', ')}`);
  }
};

// Obtener configuración según el entorno
const getConfig = () => {
  validateConfig();
  
  // Combinar configuración base con overrides del entorno
  const envConfig = {
    ...config,
    cors: {
      ...config.cors,
      currentOrigins: config.cors.origins[config.server.env] || config.cors.origins.development
    }
  };

  return envConfig;
};

module.exports = getConfig();
