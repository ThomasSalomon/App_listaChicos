/**
 * General Utilities
 * Funciones utilitarias generales
 */

/**
 * Genera un UUID simple
 */
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

/**
 * Formatea números con separadores de miles
 */
const formatNumber = (num) => {
  return new Intl.NumberFormat('es-ES').format(num);
};

/**
 * Convierte fecha a formato local español
 */
const formatDate = (date, includeTime = false) => {
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'America/Argentina/Buenos_Aires'
  };
  
  if (includeTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
  }
  
  return new Date(date).toLocaleDateString('es-ES', options);
};

/**
 * Calcula la edad basada en la fecha de nacimiento
 */
const calculateAge = (birthDate) => {
  const today = new Date();
  const birth = new Date(birthDate);
  
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
};

/**
 * Valida si una fecha de nacimiento es válida para niños
 */
const isValidBirthDate = (birthDate) => {
  const birth = new Date(birthDate);
  const today = new Date();
  
  // Verificar que la fecha no sea futura
  if (birth > today) {
    return false;
  }
  
  // Calcular edad
  const age = calculateAge(birthDate);
  
  // Verificar que la edad esté en rango válido (0-25 años para ser flexible)
  return age >= 0 && age <= 25;
};

/**
 * Convierte fecha de nacimiento a formato ISO (YYYY-MM-DD)
 */
const formatBirthDateForDB = (birthDate) => {
  const date = new Date(birthDate);
  return date.toISOString().split('T')[0];
};

/**
 * Formatea fecha desde la base de datos para visualización sin problemas de zona horaria
 * Evita el problema de que JavaScript interprete fechas YYYY-MM-DD como UTC
 */
const formatBirthDateForDisplay = (birthDate) => {
  if (!birthDate) return 'Fecha no disponible';
  
  // Si la fecha viene en formato YYYY-MM-DD, la parseamos de forma segura
  if (typeof birthDate === 'string' && birthDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
    const [year, month, day] = birthDate.split('-');
    // Crear fecha local específicamente (no UTC)
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    return date.toLocaleDateString('es-ES');
  }
  
  // Para otros formatos, usar conversión normal
  const date = new Date(birthDate);
  return date.toLocaleDateString('es-ES');
};

/**
 * Convierte fecha desde formato de input (YYYY-MM-DD) para uso en formularios de edición
 * Evita problemas de zona horaria en formularios
 */
const formatBirthDateForInput = (birthDate) => {
  if (!birthDate) return '';
  
  // Si la fecha viene en formato YYYY-MM-DD, devolverla tal como está
  if (typeof birthDate === 'string' && birthDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return birthDate;
  }
  
  // Para otros formatos, convertir a YYYY-MM-DD
  const date = new Date(birthDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Valida si una edad es válida para niños
 */
const isValidChildAge = (age) => {
  const numAge = parseInt(age);
  return !isNaN(numAge) && numAge >= 1 && numAge <= 18;
};

/**
 * Capitaliza la primera letra de cada palabra
 */
const capitalizeWords = (str) => {
  return str.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
};

/**
 * Sanitiza string removiendo caracteres especiales
 */
const sanitizeString = (str) => {
  if (typeof str !== 'string') return str;
  
  return str
    .trim()
    .replace(/[<>\"'%;()&+]/g, '') // Remover caracteres peligrosos
    .replace(/\s+/g, ' '); // Normalizar espacios
};

/**
 * Valida formato de nombre/apellido
 */
const isValidName = (name) => {
  if (typeof name !== 'string') return false;
  
  const sanitized = name.trim();
  
  // Debe tener entre 2 y 50 caracteres
  if (sanitized.length < 2 || sanitized.length > 50) return false;
  
  // Solo letras, espacios, acentos y algunos caracteres especiales
  const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]+$/;
  return nameRegex.test(sanitized);
};

/**
 * Genera estadísticas de edad
 */
const calculateAgeStats = (children) => {
  if (!Array.isArray(children) || children.length === 0) {
    return {
      total: 0,
      promedio: 0,
      edadMinima: 0,
      edadMaxima: 0,
      distribucion: {}
    };
  }
  
  const edades = children.map(child => child.edad);
  const total = children.length;
  const suma = edades.reduce((acc, edad) => acc + edad, 0);
  const promedio = Math.round((suma / total) * 100) / 100;
  const edadMinima = Math.min(...edades);
  const edadMaxima = Math.max(...edades);
  
  // Distribución por edad
  const distribucion = {};
  edades.forEach(edad => {
    distribucion[edad] = (distribucion[edad] || 0) + 1;
  });
  
  return {
    total,
    promedio,
    edadMinima,
    edadMaxima,
    distribucion
  };
};

/**
 * Convierte tiempo en milisegundos a formato legible
 */
const formatDuration = (ms) => {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  if (ms < 3600000) return `${(ms / 60000).toFixed(1)}m`;
  return `${(ms / 3600000).toFixed(1)}h`;
};

/**
 * Debounce function para limitar frecuencia de ejecución
 */
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function para limitar frecuencia de ejecución
 */
const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

module.exports = {
  generateUUID,
  formatNumber,
  formatDate,
  calculateAge,
  isValidBirthDate,
  formatBirthDateForDB,
  formatBirthDateForDisplay,
  formatBirthDateForInput,
  isValidChildAge,
  capitalizeWords,
  sanitizeString,
  isValidName,
  calculateAgeStats,
  formatDuration,
  debounce,
  throttle
};
