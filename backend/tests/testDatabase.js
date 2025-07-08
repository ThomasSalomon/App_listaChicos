const sqlite3 = require('sqlite3').verbose();

class TestDatabase {
  constructor() {
    this.db = null;
  }

  // Conectar a base de datos en memoria para tests
  connect() {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(':memory:', (err) => {
        if (err) {
          console.error('❌ Error al conectar con la base de datos de test:', err.message);
          reject(err);
        } else {
          console.log('✅ Conectado a la base de datos SQLite en memoria (test)');
          this.db.exec("PRAGMA encoding = 'UTF-8'", (pragmaErr) => {
            if (pragmaErr) {
              console.warn('⚠️ Warning: No se pudo configurar UTF-8:', pragmaErr.message);
            } else {
              console.log('✅ Codificación UTF-8 configurada (test)');
            }
            resolve(this.db);
          });
        }
      });
    });
  }

  // Inicializar tablas para testing
  async initializeTables() {
    return new Promise((resolve, reject) => {
      const createTablesSQL = `
        CREATE TABLE IF NOT EXISTS teams (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nombre TEXT NOT NULL UNIQUE,
          descripcion TEXT DEFAULT '',
          color TEXT DEFAULT '#3B82F6',
          activo INTEGER DEFAULT 1,
          fechaCreacion DATETIME DEFAULT CURRENT_TIMESTAMP,
          fechaActualizacion DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS children (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          age INTEGER NOT NULL,
          weight REAL NOT NULL,
          position TEXT NOT NULL,
          team_id INTEGER,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (team_id) REFERENCES teams (id)
        );
      `;

      this.db.exec(createTablesSQL, (err) => {
        if (err) {
          console.error('❌ Error al crear tablas de test:', err);
          reject(err);
        } else {
          console.log('✅ Tablas de test creadas correctamente');
          resolve();
        }
      });
    });
  }

  // Inicializar base de datos completa para testing
  async initialize() {
    try {
      await this.connect();
      await this.initializeTables();
      return this.db;
    } catch (error) {
      throw error;
    }
  }

  // Limpiar datos de testing
  async cleanTables() {
    return new Promise((resolve, reject) => {
      this.db.exec('DELETE FROM children; DELETE FROM teams;', (err) => {
        if (err) {
          console.error('❌ Error al limpiar tablas de test:', err);
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  // Obtener instancia de DB
  getDB() {
    return this.db;
  }

  // Cerrar conexión
  close() {
    return new Promise((resolve, reject) => {
      if (this.db) {
        this.db.close((err) => {
          if (err) {
            console.error('❌ Error al cerrar la base de datos de test:', err);
            reject(err);
          } else {
            console.log('✅ Base de datos de test cerrada correctamente');
            resolve();
          }
        });
      } else {
        resolve();
      }
    });
  }

  // Métodos de ayuda para testing
  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, changes: this.changes });
        }
      });
    });
  }

  get(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  all(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  prepare(sql) {
    const stmt = this.db.prepare(sql);
    return {
      run: (params = []) => {
        return new Promise((resolve, reject) => {
          stmt.run(params, function(err) {
            if (err) {
              reject(err);
            } else {
              resolve({ id: this.lastID, changes: this.changes });
            }
          });
        });
      },
      get: (params = []) => {
        return new Promise((resolve, reject) => {
          stmt.get(params, (err, row) => {
            if (err) {
              reject(err);
            } else {
              resolve(row);
            }
          });
        });
      },
      all: (params = []) => {
        return new Promise((resolve, reject) => {
          stmt.all(params, (err, rows) => {
            if (err) {
              reject(err);
            } else {
              resolve(rows);
            }
          });
        });
      },
      finalize: () => {
        return new Promise((resolve, reject) => {
          stmt.finalize((err) => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          });
        });
      }
    };
  }
}

// Crear instancia singleton para testing
const testDatabase = new TestDatabase();

module.exports = testDatabase;
