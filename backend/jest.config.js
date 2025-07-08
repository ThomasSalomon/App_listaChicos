module.exports = {
  // Entorno de testing
  testEnvironment: 'node',
  
  // Directorio de tests
  testMatch: [
    '**/__tests__/**/*.js',
    '**/?(*.)+(spec|test).js'
  ],
  
  // Cobertura de código
  collectCoverageFrom: [
    'controllers/**/*.js',
    'models/**/*.js',
    'routes/**/*.js',
    'utils/**/*.js',
    'config/**/*.js',
    '!**/*.test.js',
    '!**/*.spec.js',
    '!**/node_modules/**'
  ],
  
  // Configuración de cobertura
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  
  // Configuración para base de datos de testing
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  
  // Timeout para tests
  testTimeout: 10000,
  
  // Variables de entorno para testing
  setupFiles: ['<rootDir>/tests/env.js'],
  
  // Transformaciones
  transform: {},
  
  // Archivos a ignorar
  testPathIgnorePatterns: [
    '/node_modules/',
    '/database/'
  ]
};
