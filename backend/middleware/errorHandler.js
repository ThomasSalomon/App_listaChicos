/**
 * Error Handling Middleware
 * Middleware centralizado para manejo de errores
 */

/**
 * Wrapper para funciones async que maneja errores automáticamente
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Middleware de manejo de errores global
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log del error para debugging
  console.error('Error capturado:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  // Error de SQLite - Constraint violation
  if (err.code === 'SQLITE_CONSTRAINT') {
    const message = 'Violación de restricción en la base de datos';
    error = {
      message,
      statusCode: 400
    };
  }

  // Error de SQLite - Database locked
  if (err.code === 'SQLITE_BUSY') {
    const message = 'La base de datos está ocupada, intenta nuevamente';
    error = {
      message,
      statusCode: 503
    };
  }

  // Error de SQLite - Database corrupt
  if (err.code === 'SQLITE_CORRUPT') {
    const message = 'Error en la base de datos';
    error = {
      message,
      statusCode: 500
    };
  }

  // Error de validación
  if (err.name === 'ValidationError') {
    const message = 'Error de validación de datos';
    error = {
      message,
      statusCode: 400
    };
  }

  // Error de JSON malformado
  if (err.type === 'entity.parse.failed') {
    const message = 'Formato JSON inválido';
    error = {
      message,
      statusCode: 400
    };
  }

  // Error de tamaño de payload muy grande
  if (err.type === 'entity.too.large') {
    const message = 'El tamaño de los datos es muy grande';
    error = {
      message,
      statusCode: 413
    };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Error interno del servidor',
    timestamp: new Date().toISOString(),
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
};

/**
 * Middleware para manejar rutas no encontradas
 */
const notFound = (req, res, next) => {
  const error = new Error(`Ruta no encontrada: ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * Middleware de logging de requests
 */
const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  // Capturar la respuesta original
  const originalSend = res.send;
  res.send = function(data) {
    const duration = Date.now() - start;
    
    // Log de la request
    console.log(`${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`);
    
    // Log adicional para errores
    if (res.statusCode >= 400) {
      console.log(`Error details: ${data}`);
    }
    
    originalSend.call(this, data);
  };
  
  next();
};

/**
 * Middleware para rate limiting básico
 */
const rateLimiter = () => {
  const requests = new Map();
  const WINDOW_MS = 15 * 60 * 1000; // 15 minutos
  const MAX_REQUESTS = 100; // máximo 100 requests por ventana

  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    
    if (!requests.has(ip)) {
      requests.set(ip, { count: 1, resetTime: now + WINDOW_MS });
      return next();
    }
    
    const userData = requests.get(ip);
    
    if (now > userData.resetTime) {
      userData.count = 1;
      userData.resetTime = now + WINDOW_MS;
      return next();
    }
    
    if (userData.count >= MAX_REQUESTS) {
      return res.status(429).json({
        error: 'Demasiadas solicitudes',
        message: 'Has excedido el límite de solicitudes. Intenta nuevamente en 15 minutos.',
        retryAfter: Math.ceil((userData.resetTime - now) / 1000)
      });
    }
    
    userData.count++;
    next();
  };
};

module.exports = {
  asyncHandler,
  errorHandler,
  notFound,
  requestLogger,
  rateLimiter
};
