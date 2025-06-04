/**
 * Database Utilities
 * Funciones utilitarias para operaciones de base de datos
 */

/**
 * Construye una consulta SQL con paginación
 */
const buildPaginatedQuery = (baseQuery, options = {}) => {
  const { limit, offset, sort = 'id', order = 'ASC' } = options;
  
  let query = baseQuery;
  
  // Agregar ORDER BY
  query += ` ORDER BY ${sort} ${order}`;
  
  // Agregar LIMIT y OFFSET
  if (limit) {
    query += ` LIMIT ${limit}`;
    if (offset) {
      query += ` OFFSET ${offset}`;
    }
  }
  
  return query;
};

/**
 * Valida campos SQL para prevenir inyección
 */
const validateSqlField = (field, allowedFields) => {
  if (!allowedFields.includes(field)) {
    throw new Error(`Campo no permitido: ${field}`);
  }
  return field;
};

/**
 * Sanitiza valores para consultas SQL
 */
const sanitizeSqlValue = (value) => {
  if (typeof value === 'string') {
    // Escapar caracteres especiales
    return value.replace(/'/g, "''");
  }
  return value;
};

/**
 * Convierte timestamp de SQLite a formato ISO
 */
const formatTimestamp = (timestamp) => {
  if (!timestamp) return null;
  return new Date(timestamp).toISOString();
};

/**
 * Construye condiciones WHERE dinámicamente
 */
const buildWhereConditions = (filters = {}) => {
  const conditions = [];
  const params = [];
  
  Object.keys(filters).forEach(key => {
    const value = filters[key];
    if (value !== undefined && value !== null && value !== '') {
      switch (key) {
        case 'nombre':
        case 'apellido':
          conditions.push(`${key} LIKE ?`);
          params.push(`%${value}%`);
          break;
        case 'edad':
          conditions.push(`${key} = ?`);
          params.push(value);
          break;
        case 'edadMin':
          conditions.push(`edad >= ?`);
          params.push(value);
          break;
        case 'edadMax':
          conditions.push(`edad <= ?`);
          params.push(value);
          break;
        case 'fechaDesde':
          conditions.push(`created_at >= ?`);
          params.push(value);
          break;
        case 'fechaHasta':
          conditions.push(`created_at <= ?`);
          params.push(value);
          break;
      }
    }
  });
  
  return {
    whereClause: conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '',
    params
  };
};

module.exports = {
  buildPaginatedQuery,
  validateSqlField,
  sanitizeSqlValue,
  formatTimestamp,
  buildWhereConditions
};
