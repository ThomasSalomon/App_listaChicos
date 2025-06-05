/**
 * Response Utilities
 * Funciones utilitarias para standardizar respuestas de la API
 */

/**
 * Respuesta exitosa standardizada
 */
const successResponse = (res, data, message = 'Operación exitosa', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  });
};

/**
 * Respuesta de error standardizada
 */
const errorResponse = (res, message = 'Error interno', statusCode = 500, details = null) => {
  const response = {
    success: false,
    error: message,
    timestamp: new Date().toISOString()
  };
  
  if (details) {
    response.details = details;
  }
  
  return res.status(statusCode).json(response);
};

/**
 * Respuesta para recursos no encontrados
 */
const notFoundResponse = (res, resource = 'Recurso') => {
  return errorResponse(res, `${resource} no encontrado`, 404);
};

/**
 * Respuesta para datos inválidos
 */
const validationErrorResponse = (res, errors) => {
  return res.status(400).json({
    success: false,
    error: 'Datos de entrada inválidos',
    details: Array.isArray(errors) ? errors : [errors],
    timestamp: new Date().toISOString()
  });
};

/**
 * Respuesta paginada
 */
const paginatedResponse = (res, data, pagination, message = 'Datos obtenidos exitosamente') => {
  return res.status(200).json({
    success: true,
    message,
    data,
    pagination: {
      total: pagination.total,
      page: pagination.page,
      limit: pagination.limit,
      totalPages: Math.ceil(pagination.total / pagination.limit),
      hasNext: pagination.page * pagination.limit < pagination.total,
      hasPrev: pagination.page > 1
    },
    timestamp: new Date().toISOString()
  });
};

/**
 * Respuesta de creación exitosa
 */
const createdResponse = (res, data, message = 'Recurso creado exitosamente') => {
  return successResponse(res, data, message, 201);
};

/**
 * Respuesta sin contenido
 */
const noContentResponse = (res) => {
  return res.status(204).send();
};

/**
 * Headers para respuestas con cache
 */
const setCacheHeaders = (res, maxAge = 3600) => {
  res.setHeader('Cache-Control', `public, max-age=${maxAge}`);
  res.setHeader('ETag', `"${Date.now()}"`);
};

/**
 * Headers para respuestas sin cache
 */
const setNoCacheHeaders = (res) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
};

module.exports = {
  successResponse,
  errorResponse,
  notFoundResponse,
  validationErrorResponse,
  paginatedResponse,
  createdResponse,
  noContentResponse,
  setCacheHeaders,
  setNoCacheHeaders
};
