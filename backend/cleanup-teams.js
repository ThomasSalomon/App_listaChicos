const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database', 'children.sqlite');
console.log('🧹 Limpiando base de datos...');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Error al conectar con la base de datos:', err.message);
    return;
  }
  console.log('✅ Conectado a la base de datos SQLite.');
});

// Eliminar equipos inactivos físicamente
console.log('\n🗑️ Eliminando equipos inactivos...');
db.run("DELETE FROM teams WHERE activo = 0", function(err) {
  if (err) {
    console.error('❌ Error al eliminar equipos inactivos:', err.message);
  } else {
    console.log(`✅ Se eliminaron ${this.changes} equipos inactivos`);
  }
  
  // Mostrar estado final
  console.log('\n📊 Estado final de equipos:');
  db.all("SELECT id, nombre, activo FROM teams ORDER BY id", (err, rows) => {
    if (err) {
      console.error('❌ Error al consultar equipos:', err.message);
    } else {
      console.log(`Total de equipos activos: ${rows.length}`);
      if (rows.length > 0) {
        rows.forEach(team => {
          console.log(`  - ID: ${team.id}, Nombre: "${team.nombre}", Activo: ${team.activo}`);
        });
      } else {
        console.log('✅ No hay equipos en la base de datos. Listo para empezar desde cero.');
      }
    }
    
    db.close((err) => {
      if (err) {
        console.error('Error al cerrar:', err.message);
      } else {
        console.log('\n🔚 Limpieza completada.');
        console.log('\n✨ Ahora puedes crear equipos sin problemas de nombres duplicados.');
      }
    });
  });
});
