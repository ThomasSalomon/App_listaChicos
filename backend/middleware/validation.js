/**
 * Validation Middleware
 * Middleware para validar datos de entrada
 */

/**
 * Valida los datos de un niño
 */
const validateChild = (req, res, next) => {
  const { nombre, apellido, edad, team_id } = req.body;
  const errors = [];

  // Validar nombre
  if (!nombre) {
    errors.push('El nombre es requerido');
  } else if (typeof nombre !== 'string') {
    errors.push('El nombre debe ser una cadena de texto');
  } else if (!nombre.trim()) {
    errors.push('El nombre no puede estar vacío');
  } else if (nombre.trim().length < 2) {
    errors.push('El nombre debe tener al menos 2 caracteres');
  } else if (nombre.trim().length > 50) {
    errors.push('El nombre no puede tener más de 50 caracteres');
  }

  // Validar apellido
  if (!apellido) {
    errors.push('El apellido es requerido');
  } else if (typeof apellido !== 'string') {
    errors.push('El apellido debe ser una cadena de texto');
  } else if (!apellido.trim()) {
    errors.push('El apellido no puede estar vacío');
  } else if (apellido.trim().length < 2) {
    errors.push('El apellido debe tener al menos 2 caracteres');
  } else if (apellido.trim().length > 50) {
    errors.push('El apellido no puede tener más de 50 caracteres');
  }

  // Validar edad
  if (edad === undefined || edad === null) {
    errors.push('La edad es requerida');
  } else {
    const edadNum = parseInt(edad);
    if (isNaN(edadNum)) {
      errors.push('La edad debe ser un número válido');
    } else if (edadNum < 1) {
      errors.push('La edad debe ser mayor a 0');
    } else if (edadNum > 18) {
      errors.push('La edad debe ser menor o igual a 18');
    }
  }

  // Validar team_id (opcional, si no se proporciona se asigna equipo por defecto)
  if (team_id !== undefined && team_id !== null) {
    const teamIdNum = parseInt(team_id);
    if (isNaN(teamIdNum) || teamIdNum < 1) {
      errors.push('El ID del equipo debe ser un número entero positivo');
    } else {
      req.body.team_id = teamIdNum;
    }
  }

  // Si hay errores, retornar respuesta de error
  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Datos de entrada inválidos',
      message: 'Por favor corrige los siguientes errores:',
      details: errors
    });
  }

  // Sanitizar datos
  req.body.nombre = nombre.trim();
  req.body.apellido = apellido.trim();
  req.body.edad = parseInt(edad);

  next();
};

/**
 * Valida que el ID sea un número válido
 */
const validateId = (req, res, next) => {
  const { id } = req.params;
  
  if (!id) {
    return res.status(400).json({
      error: 'ID requerido',
      message: 'El ID del niño es requerido'
    });
  }

  const idNum = parseInt(id);
  if (isNaN(idNum) || idNum < 1) {
    return res.status(400).json({
      error: 'ID inválido',
      message: 'El ID debe ser un número entero positivo'
    });
  }

  // Convertir a número para uso posterior
  req.params.id = idNum;
  next();
};

/**
 * Valida parámetros de consulta opcionales
 */
const validateQuery = (req, res, next) => {
  const { limit, offset, sort, order } = req.query;

  // Validar limit
  if (limit !== undefined) {
    const limitNum = parseInt(limit);
    if (isNaN(limitNum) || limitNum < 1 || limitNum > 1000) {
      return res.status(400).json({
        error: 'Parámetro limit inválido',
        message: 'El limit debe ser un número entre 1 y 1000'
      });
    }
    req.query.limit = limitNum;
  }

  // Validar offset
  if (offset !== undefined) {
    const offsetNum = parseInt(offset);
    if (isNaN(offsetNum) || offsetNum < 0) {
      return res.status(400).json({
        error: 'Parámetro offset inválido',
        message: 'El offset debe ser un número mayor o igual a 0'
      });
    }
    req.query.offset = offsetNum;
  }

  // Validar sort
  if (sort !== undefined) {
    const validSortFields = ['id', 'nombre', 'apellido', 'edad', 'created_at', 'updated_at'];
    if (!validSortFields.includes(sort)) {
      return res.status(400).json({
        error: 'Campo de ordenamiento inválido',
        message: `El campo de ordenamiento debe ser uno de: ${validSortFields.join(', ')}`
      });
    }
  }

  // Validar order
  if (order !== undefined) {
    const validOrders = ['ASC', 'DESC', 'asc', 'desc'];
    if (!validOrders.includes(order)) {
      return res.status(400).json({
        error: 'Orden inválido',
        message: 'El orden debe ser ASC o DESC'
      });
    }
    req.query.order = order.toUpperCase();
  }

  next();
};

/**
 * Middleware para sanitizar strings
 */
const sanitizeStrings = (req, res, next) => {
  const sanitizeValue = (value) => {
    if (typeof value === 'string') {
      // Remover caracteres especiales peligrosos pero mantener acentos y espacios
      return value
        .replace(/[<>\"'%;()&+]/g, '') // Remover caracteres peligrosos
        .trim(); // Quitar espacios al inicio y final
    }
    return value;
  };

  // Sanitizar body
  if (req.body && typeof req.body === 'object') {
    Object.keys(req.body).forEach(key => {
      req.body[key] = sanitizeValue(req.body[key]);
    });
  }

  // Sanitizar query params
  if (req.query && typeof req.query === 'object') {
    Object.keys(req.query).forEach(key => {
      req.query[key] = sanitizeValue(req.query[key]);
    });
  }

  next();
};

/**
 * Valida los datos de un equipo
 */
const validateTeam = (req, res, next) => {
  const { nombre, descripcion, color, activo } = req.body;
  const errors = [];

  // Validar nombre (requerido)
  if (!nombre) {
    errors.push('El nombre del equipo es requerido');
  } else if (typeof nombre !== 'string') {
    errors.push('El nombre debe ser una cadena de texto');
  } else if (!nombre.trim()) {
    errors.push('El nombre no puede estar vacío');
  } else if (nombre.trim().length < 2) {
    errors.push('El nombre debe tener al menos 2 caracteres');
  } else if (nombre.trim().length > 100) {
    errors.push('El nombre no puede tener más de 100 caracteres');
  }

  // Validar descripción (opcional)
  if (descripcion !== undefined && descripcion !== null) {
    if (typeof descripcion !== 'string') {
      errors.push('La descripción debe ser una cadena de texto');
    } else if (descripcion.trim().length > 500) {
      errors.push('La descripción no puede tener más de 500 caracteres');
    }
  }

  // Validar color (opcional, debe ser un color hexadecimal válido)
  if (color !== undefined && color !== null) {
    if (typeof color !== 'string') {
      errors.push('El color debe ser una cadena de texto');
    } else {
      const hexColorPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
      if (!hexColorPattern.test(color)) {
        errors.push('El color debe ser un código hexadecimal válido (ej: #FF0000)');
      }
    }
  }

  // Validar activo (opcional, debe ser booleano)
  if (activo !== undefined && activo !== null) {
    if (typeof activo !== 'boolean') {
      errors.push('El campo activo debe ser verdadero o falso');
    }
  }

  // Si hay errores, retornar respuesta de error
  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Datos de entrada inválidos',
      message: 'Por favor corrige los siguientes errores:',
      details: errors
    });
  }

  // Sanitizar datos
  req.body.nombre = nombre.trim();
  if (descripcion !== undefined) {
    req.body.descripcion = descripcion.trim();
  }

  next();
};

/**
 * Valida que el ID de equipo sea un número válido
 */
const validateTeamId = (req, res, next) => {
  const { id } = req.params;
  
  if (!id) {
    return res.status(400).json({
      error: 'ID requerido',
      message: 'El ID del equipo es requerido'
    });
  }

  const idNum = parseInt(id);
  if (isNaN(idNum) || idNum < 1) {
    return res.status(400).json({
      error: 'ID inválido',
      message: 'El ID debe ser un número entero positivo'
    });
  }

  // Convertir a número para uso posterior
  req.params.id = idNum;
  next();
};

/**
 * Valida los datos para mover niños entre equipos
 */
const validateMoveChildren = (req, res, next) => {
  const { targetTeamId, childrenIds } = req.body;
  const errors = [];

  // Validar targetTeamId
  if (!targetTeamId) {
    errors.push('El ID del equipo destino es requerido');
  } else {
    const targetTeamIdNum = parseInt(targetTeamId);
    if (isNaN(targetTeamIdNum) || targetTeamIdNum < 1) {
      errors.push('El ID del equipo destino debe ser un número entero positivo');
    } else {
      req.body.targetTeamId = targetTeamIdNum;
    }
  }

  // Validar childrenIds (opcional, si no se proporciona se mueven todos los niños del equipo)
  if (childrenIds !== undefined && childrenIds !== null) {
    if (!Array.isArray(childrenIds)) {
      errors.push('Los IDs de niños deben ser un array');
    } else if (childrenIds.length === 0) {
      errors.push('Debe proporcionar al menos un ID de niño');
    } else {
      const validIds = [];
      childrenIds.forEach((id, index) => {
        const idNum = parseInt(id);
        if (isNaN(idNum) || idNum < 1) {
          errors.push(`El ID en la posición ${index} no es válido`);
        } else {
          validIds.push(idNum);
        }
      });
      req.body.childrenIds = validIds;
    }
  }

  // Si hay errores, retornar respuesta de error
  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Datos de entrada inválidos',
      message: 'Por favor corrige los siguientes errores:',
      details: errors
    });
  }

  next();
};

module.exports = {
  validateChild,
  validateId,
  validateQuery,
  validateTeam,
  validateTeamId,
  validateMoveChildren,
  sanitizeStrings
};
