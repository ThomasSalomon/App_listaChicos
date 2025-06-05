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
          this.createTablesFromScratch(resolve, reject);        } else {
          // La tabla existe, verificar estructura
          this.db.all("PRAGMA table_info(children)", (err, columns) => {
            if (err) {
              reject(err);
              return;
            }
            
            const hasTeamId = columns.some(col => col.name === 'team_id');
            const hasFechaNacimiento = columns.some(col => col.name === 'fecha_nacimiento');
            const hasEdad = columns.some(col => col.name === 'edad');
            
            if (!hasTeamId || (hasEdad && !hasFechaNacimiento)) {
              // Necesita migración
              this.migrateExistingTable(resolve, reject, { hasTeamId, hasFechaNacimiento, hasEdad });
            } else {
              // La tabla ya está actualizada
              resolve();
            }
          });
        }
      });
    });
  }
  // Migrar tabla existente
  async migrateExistingTable(resolve, reject, flags = {}) {
    console.log('🔄 Migrando tabla children existente...');
    
    const { hasTeamId, hasFechaNacimiento, hasEdad } = flags;
    const migrateSteps = [];
    
    // Agregar columna team_id si no existe
    if (!hasTeamId) {
      migrateSteps.push(`ALTER TABLE children ADD COLUMN team_id INTEGER`);
    }
    
    // Migrar de edad a fecha_nacimiento si es necesario
    if (hasEdad && !hasFechaNacimiento) {
      // Primero agregar la nueva columna
      migrateSteps.push(`ALTER TABLE children ADD COLUMN fecha_nacimiento DATE`);
      
      // Calcular fecha de nacimiento aproximada basada en edad actual
      // Asumiendo que la edad era correcta al momento de creación
      migrateSteps.push(`
        UPDATE children 
        SET fecha_nacimiento = date('now', '-' || edad || ' years')
        WHERE fecha_nacimiento IS NULL
      `);
      
      // Crear nueva tabla temporal con la estructura correcta
      migrateSteps.push(`
        CREATE TABLE children_new (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nombre TEXT NOT NULL,
          apellido TEXT NOT NULL,
          fecha_nacimiento DATE NOT NULL,
          team_id INTEGER,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (team_id) REFERENCES teams (id) ON DELETE CASCADE
        )
      `);
      
      // Copiar datos a la nueva tabla
      migrateSteps.push(`
        INSERT INTO children_new (id, nombre, apellido, fecha_nacimiento, team_id, created_at, updated_at)
        SELECT id, nombre, apellido, fecha_nacimiento, team_id, created_at, updated_at
        FROM children
      `);
      
      // Reemplazar tabla antigua con nueva
      migrateSteps.push(`DROP TABLE children`);
      migrateSteps.push(`ALTER TABLE children_new RENAME TO children`);
    }

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
        fecha_nacimiento DATE NOT NULL,
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
