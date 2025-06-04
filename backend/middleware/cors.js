/**
 * CORS Middleware
 * Configuración personalizada de CORS para la aplicación
 */

/**
 * Configuración de CORS personalizada
 */
const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control',
    'X-API-Key'
  ],
  exposedHeaders: ['X-Total-Count', 'X-Page-Count'],
  credentials: true,
  maxAge: 86400,
  preflightContinue: false,
  optionsSuccessStatus: 204
};

/**
 * Middleware de seguridad adicional
 */
const securityHeaders = (req, res, next) => {
  // Prevenir clickjacking
  res.setHeader('X-Frame-Options', 'DENY');
  
  // Prevenir MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Habilitar XSS protection
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Referrer policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    // No cache para rutas de API
  if (req.path.startsWith('/api/')) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    // Asegurar codificación UTF-8 para respuestas JSON
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
  }
  
  next();
};

/**
 * Middleware para logging de CORS
 */
const corsLogger = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    console.log(`CORS Preflight: ${req.get('Origin')} -> ${req.originalUrl}`);
  }
  next();
};

module.exports = {
  corsOptions,
  securityHeaders,
  corsLogger
};
