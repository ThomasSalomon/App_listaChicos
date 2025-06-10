const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database', 'children.sqlite');
console.log('Conectando a la base de datos:', dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error al conectar con la base de datos:', err.message);
    return;
  }
  console.log('✅ Conectado a la base de datos SQLite.');
});

// Verificar estructura de la tabla teams
console.log('\n🔍 Verificando estructura de la tabla teams...');
db.all("PRAGMA table_info(teams)", (err, rows) => {
  if (err) {
    console.error('❌ Error al obtener estructura:', err.message);
  } else {
    console.log('📋 Estructura de la tabla teams:');
    rows.forEach(column => {
      console.log(`  - ${column.name}: ${column.type} ${column.notnull ? 'NOT NULL' : ''} ${column.pk ? 'PRIMARY KEY' : ''}`);
    });
  }
});

// Verificar TODOS los equipos (incluyendo eliminados)
console.log('\n🔍 Verificando TODOS los equipos en la base de datos...');
db.all("SELECT * FROM teams", (err, rows) => {
  if (err) {
    console.error('❌ Error al consultar equipos:', err.message);
  } else {
    console.log(`📊 Total de registros en teams: ${rows.length}`);
    if (rows.length > 0) {
      console.log('📋 Equipos encontrados:');
      rows.forEach((team, index) => {
        console.log(`  ${index + 1}. ID: ${team.id}, Nombre: "${team.nombre}", Activo: ${team.is_active}, Color: ${team.color}`);
      });
    } else {
      console.log('✅ No hay equipos en la base de datos');
    }
  }
});

// Verificar índices únicos
console.log('\n🔍 Verificando índices únicos...');
db.all("PRAGMA index_list(teams)", (err, rows) => {
  if (err) {
    console.error('❌ Error al obtener índices:', err.message);
  } else {
    console.log('📋 Índices en la tabla teams:');
    rows.forEach(index => {
      console.log(`  - ${index.name}: unique=${index.unique}`);
    });
  }
});

// Buscar específicamente el equipo "Bantaman"
console.log('\n🔍 Buscando específicamente "Bantaman"...');
db.all("SELECT * FROM teams WHERE nombre = 'Bantaman'", (err, rows) => {
  if (err) {
    console.error('❌ Error al buscar Bantaman:', err.message);
  } else {
    if (rows.length > 0) {
      console.log('⚠️ Encontrado equipo "Bantaman":');
      rows.forEach(team => {
        console.log(`  ID: ${team.id}, Activo: ${team.is_active}, Eliminado: ${team.deleted_at || 'No'}`);
      });
    } else {
      console.log('✅ No se encontró equipo "Bantaman"');
    }
  }
  
  // Cerrar la conexión
  db.close((err) => {
    if (err) {
      console.error('Error al cerrar la base de datos:', err.message);
    } else {
      console.log('\n🔚 Conexión cerrada.');
    }
  });
});
