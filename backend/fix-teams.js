const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database', 'children.sqlite');
console.log('🔧 Iniciando reparación de equipos...');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Error al conectar con la base de datos:', err.message);
    return;
  }
  console.log('✅ Conectado a la base de datos SQLite.');
});

// Arreglar los equipos existentes marcándolos como activos
console.log('\n🔧 Marcando equipos existentes como activos...');
db.run("UPDATE teams SET activo = 1 WHERE activo IS NULL OR activo != 1", function(err) {
  if (err) {
    console.error('❌ Error al actualizar equipos:', err.message);
  } else {
    console.log(`✅ Se actualizaron ${this.changes} equipos como activos`);
  }
  
  // Verificar el resultado
  console.log('\n🔍 Verificando equipos después de la reparación...');
  db.all("SELECT * FROM teams WHERE activo = 1", (err, rows) => {
    if (err) {
      console.error('❌ Error al verificar equipos:', err.message);
    } else {
      console.log(`📊 Total de equipos activos: ${rows.length}`);
      if (rows.length > 0) {
        console.log('📋 Equipos activos:');
        rows.forEach((team, index) => {
          console.log(`  ${index + 1}. ID: ${team.id}, Nombre: "${team.nombre}", Color: ${team.color}`);
        });
      }
    }
    
    // Cerrar la conexión
    db.close((err) => {
      if (err) {
        console.error('Error al cerrar la base de datos:', err.message);
      } else {
        console.log('\n🔚 Reparación completada. Conexión cerrada.');
        console.log('\n✨ Los equipos ahora deberían aparecer en la aplicación.');
      }
    });
  });
});
