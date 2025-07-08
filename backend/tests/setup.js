/**
 * Configuración global para tests
 */

const testDatabase = require('./testDatabase');

// Configurar base de datos en memoria para tests
beforeAll(async () => {
  // Inicializar base de datos de testing
  await testDatabase.initialize();
});

// Limpiar base de datos después de cada test
afterEach(async () => {
  if (testDatabase.getDB()) {
    await testDatabase.cleanTables();
  }
});

// Cerrar base de datos después de todos los tests
afterAll(async () => {
  if (testDatabase.getDB()) {
    await testDatabase.close();
  }
});
