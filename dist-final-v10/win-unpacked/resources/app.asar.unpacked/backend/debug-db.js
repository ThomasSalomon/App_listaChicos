const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database', 'children.sqlite');
const db = new sqlite3.Database(dbPath);

console.log('🔍 Verificando esquema de la base de datos...\n');

// Verificar esquema de la tabla children
db.all("PRAGMA table_info(children)", (err, columns) => {
  if (err) {
    console.error('❌ Error al obtener información de la tabla:', err.message);
    return;
  }
  
  console.log('📋 Columnas de la tabla children:');
  columns.forEach(col => {
    console.log(`  - ${col.name}: ${col.type} ${col.notnull ? 'NOT NULL' : ''} ${col.dflt_value ? `DEFAULT ${col.dflt_value}` : ''}`);
  });
  console.log('');
  
  // Verificar datos existentes
  db.all("SELECT * FROM children LIMIT 5", (err, rows) => {
    if (err) {
      console.error('❌ Error al obtener datos:', err.message);
    } else {
      console.log('📊 Datos existentes en children (primeros 5 registros):');
      console.table(rows);
    }
    
    // Verificar si existe la tabla teams
    db.all("SELECT name FROM sqlite_master WHERE type='table' AND name='teams'", (err, tables) => {
      if (err) {
        console.error('❌ Error al verificar tabla teams:', err.message);
      } else {
        console.log('\n🏆 Tabla teams existe:', tables.length > 0 ? 'SÍ' : 'NO');
        if (tables.length > 0) {
          db.all("SELECT * FROM teams", (err, teams) => {
            if (err) {
              console.error('❌ Error al obtener teams:', err.message);
            } else {
              console.log('📊 Equipos existentes:');
              console.table(teams);
            }
            db.close();
          });
        } else {
          db.close();
        }
      }
    });
  });
});
