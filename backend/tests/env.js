/**
 * Configuración de variables de entorno para testing
 */

process.env.NODE_ENV = 'test';
process.env.PORT = 3002;
process.env.DATABASE_PATH = ':memory:';
process.env.LOG_LEVEL = 'error';
