const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class Database {
  constructor() {
    this.db = null;
    this.dbPath = path.join(__dirname, '..', 'database', 'children.sqlite');
  }
  // Conectar a la base de datos
  connect() {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(this.dbPath, (err) => {
        if (err) {
          console.error('❌ Error al conectar con la base de datos:', err.message);
          reject(err);
        } else {
          console.log('✅ Conectado a la base de datos SQLite');
          // Configurar UTF-8 para caracteres especiales
          this.db.exec("PRAGMA encoding = 'UTF-8'", (pragmaErr) => {
            if (pragmaErr) {
              console.warn('⚠️ Warning: No se pudo configurar UTF-8:', pragmaErr.message);
            } else {
              console.log('✅ Codificación UTF-8 configurada');
            }
            resolve(this.db);
          });
        }
      });
    });
  }
  // Inicializar base de datos completa
  async initialize() {
    try {
      await this.connect();
      await this.initializeTables();
      return this.db;
    } catch (error) {
      throw error;
    }
  }  // Inicializar tablas
  async initializeTables() {
    return new Promise((resolve, reject) => {
      // Verificar si la tabla children existe
      this.db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='children'", (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        
        if (!row) {
          // La tabla no existe, crearla desde cero
          console.log('🔧 Creando tablas desde cero...');
          this.createTablesFromScratch(resolve, reject);
        } else {
          // La tabla existe, verificar si tiene team_id
          this.db.all("PRAGMA table_info(children)", (err, columns) => {
            if (err) {
              reject(err);
              return;
            }
              const hasTeamId = columns.some(col => col.name === 'team_id');
            if (!hasTeamId) {
              // Migrar tabla existente
              this.migrateExistingTable(resolve, reject);
            } else {
              // La tabla ya está actualizada
              resolve();
            }
          });
        }
      });
    });
  }

  // Migrar tabla existente agregando team_id
  async migrateExistingTable(resolve, reject) {
    console.log('🔄 Migrando tabla children existente...');
      // Como la tabla está vacía, simplemente agregamos la columna team_id
    const migrateSteps = [
      // 1. Agregar columna team_id
      `ALTER TABLE children ADD COLUMN team_id INTEGER`
    ];

    let currentStep = 0;
    
    const executeNextStep = () => {
      if (currentStep >= migrateSteps.length) {
        console.log('✅ Migración completada exitosamente');
        resolve();
        return;
      }

      console.log(`🔄 Ejecutando paso ${currentStep + 1}/${migrateSteps.length} de migración...`);
      
      this.db.run(migrateSteps[currentStep], (err) => {
        if (err) {
          console.error(`❌ Error en paso de migración ${currentStep + 1}:`, err.message);
          reject(err);
          return;
        }
        
        console.log(`✅ Paso ${currentStep + 1} completado`);
        currentStep++;
        executeNextStep();
      });
    };

    executeNextStep();
  }
  // Crear tablas desde cero
  createTablesFromScratch(resolve, reject) {
    const createTeamsTable = `
      CREATE TABLE IF NOT EXISTS teams (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL UNIQUE,
        descripcion TEXT,
        color TEXT DEFAULT '#3B82F6',
        activo BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;    const createChildrenTable = `
      CREATE TABLE IF NOT EXISTS children (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        apellido TEXT NOT NULL,
        edad INTEGER NOT NULL CHECK(edad >= 1 AND edad <= 18),
        team_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (team_id) REFERENCES teams (id) ON DELETE CASCADE
      )
    `;this.db.serialize(() => {
      // Crear tabla de equipos
      this.db.run(createTeamsTable, (err) => {
        if (err) {
          console.error('❌ Error al crear la tabla teams:', err.message);
          reject(err);
          return;
        }
        console.log('✅ Tabla "teams" verificada/creada');

        // Crear tabla de niños
        this.db.run(createChildrenTable, (err) => {
          if (err) {
            console.error('❌ Error al crear la tabla children:', err.message);
            reject(err);
            return;
          }
          console.log('✅ Tabla "children" verificada/creada');
          resolve();        });
      });
    });
  }

  // Verificar si está conectado
  isConnected() {
    return this.db !== null;
  }

  // Obtener instancia de la base de datos
  getDB() {
    return this.db;
  }

  // Cerrar conexión
  close() {
    return new Promise((resolve, reject) => {
      if (this.db) {
        this.db.close((err) => {
          if (err) {
            console.error('❌ Error al cerrar la base de datos:', err.message);
            reject(err);
          } else {
            console.log('✅ Base de datos cerrada correctamente');
            resolve();
          }
        });
      } else {
        resolve();
      }
    });
  }
}

module.exports = new Database();
