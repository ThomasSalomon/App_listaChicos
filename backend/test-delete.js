const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database', 'children.sqlite');
console.log('🧪 Probando eliminación de equipos...');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Error al conectar con la base de datos:', err.message);
    return;
  }
  console.log('✅ Conectado a la base de datos SQLite.');
});

console.log('\n📊 Estado inicial de equipos:');
db.all("SELECT id, nombre, activo FROM teams ORDER BY id", (err, rows) => {
  if (err) {
    console.error('❌ Error al consultar equipos:', err.message);
    return;
  }
  
  console.log(`Total de equipos: ${rows.length}`);
  rows.forEach(team => {
    console.log(`  - ID: ${team.id}, Nombre: "${team.nombre}", Activo: ${team.activo}`);
  });

  // Simular eliminación del equipo "PRUEBA" (ID 1)
  console.log('\n🗑️ Simulando eliminación del equipo "PRUEBA" (ID 1)...');
  
  // Primero verificar si tiene niños
  db.get("SELECT COUNT(*) as count FROM children WHERE team_id = 1", (err, row) => {
    if (err) {
      console.error('❌ Error al verificar niños:', err.message);
      return;
    }
    
    console.log(`Niños en el equipo: ${row.count}`);
    
    if (row.count > 0) {
      console.log('⚠️ El equipo tiene niños asignados. No se puede eliminar.');
      db.close();
      return;
    }
    
    // Proceder con eliminación física
    db.run("DELETE FROM teams WHERE id = 1", function(err) {
      if (err) {
        console.error('❌ Error al eliminar equipo:', err.message);
        db.close();
        return;
      }
      
      console.log(`✅ Equipo eliminado. Filas afectadas: ${this.changes}`);
      
      // Verificar estado después de eliminación
      console.log('\n📊 Estado después de eliminación:');
      db.all("SELECT id, nombre, activo FROM teams ORDER BY id", (err, rows) => {
        if (err) {
          console.error('❌ Error al consultar equipos:', err.message);
        } else {
          console.log(`Total de equipos: ${rows.length}`);
          rows.forEach(team => {
            console.log(`  - ID: ${team.id}, Nombre: "${team.nombre}", Activo: ${team.activo}`);
          });
        }
        
        // Intentar crear un nuevo equipo con el mismo nombre
        console.log('\n🆕 Intentando crear nuevo equipo con nombre "PRUEBA"...');
        db.run("INSERT INTO teams (nombre, descripcion, color, activo, created_at) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)", 
               ['PRUEBA', 'Equipo de prueba recreado', '#ff0000', 1], 
               function(err) {
          if (err) {
            console.error('❌ Error al crear equipo:', err.message);
          } else {
            console.log(`✅ Nuevo equipo creado con ID: ${this.lastID}`);
          }
          
          db.close((err) => {
            if (err) {
              console.error('Error al cerrar:', err.message);
            } else {
              console.log('\n🔚 Prueba completada.');
            }
          });
        });
      });
    });
  });
});
