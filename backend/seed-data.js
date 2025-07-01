/**
 * Script para inyectar datos de prueba
 * Genera 5 equipos con ~14 niños cada uno para testing
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Configuración de la base de datos
const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

// Datos de equipos de prueba
const equipos = [
  {
    nombre: 'Los Tigres',
    descripcion: 'Equipo de fútbol juvenil categoría sub-12',
    color: '#FF6B35'
  },
  {
    nombre: 'Águilas Doradas',
    descripcion: 'Equipo de básquet mixto',
    color: '#4ECDC4'
  },
  {
    nombre: 'Leones Valientes',
    descripcion: 'Equipo de handball competitivo',
    color: '#45B7D1'
  },
  {
    nombre: 'Estrellas Azules',
    descripcion: 'Equipo de natación escolar',
    color: '#9B59B6'
  },
  {
    nombre: 'Rayos Veloces',
    descripcion: 'Equipo de atletismo y carreras',
    color: '#F39C12'
  }
];

// Nombres y apellidos para generar niños
const nombres = [
  'Santiago', 'Valentina', 'Mateo', 'Isabella', 'Nicolás', 'Sofía', 'Samuel', 'Camila',
  'Daniel', 'Martina', 'Alejandro', 'Valeria', 'Diego', 'Lucía', 'Sebastián', 'Emma',
  'Matías', 'Abril', 'Lucas', 'Olivia', 'Tomás', 'Julieta', 'Joaquín', 'Renata',
  'Benjamín', 'Victoria', 'Emilio', 'Antonella', 'Agustín', 'Florencia', 'Felipe', 'Catalina',
  'Ignacio', 'Constanza', 'Maximiliano', 'Amparo', 'Rodrigo', 'Esperanza', 'Adrián', 'Pilar',
  'Facundo', 'Magdalena', 'Thiago', 'Delfina', 'Lautaro', 'Josefina', 'Bautista', 'Milagros',
  'Gael', 'Amanda', 'Ian', 'Julieta', 'Santino', 'Rocío', 'Bruno', 'Agustina',
  'Vicente', 'Emilia', 'Lorenzo', 'Guadalupe', 'Valentín', 'Francesca', 'Enzo', 'Bethania'
];

const apellidos = [
  'García', 'Rodríguez', 'González', 'Fernández', 'López', 'Martínez', 'Sánchez', 'Pérez',
  'Gómez', 'Martín', 'Jiménez', 'Ruiz', 'Hernández', 'Díaz', 'Moreno', 'Álvarez',
  'Muñoz', 'Romero', 'Alonso', 'Gutiérrez', 'Navarro', 'Torres', 'Domínguez', 'Vázquez',
  'Ramos', 'Gil', 'Ramírez', 'Serrano', 'Blanco', 'Suárez', 'Molina', 'Morales',
  'Ortega', 'Delgado', 'Castro', 'Ortiz', 'Rubio', 'Marín', 'Sanz', 'Iglesias',
  'Medina', 'Garrido', 'Cortés', 'Castillo', 'Santos', 'Lozano', 'Guerrero', 'Cano'
];

const estadosFisicos = ['En forma', 'Lesionado'];
const condicionesPago = ['Al dia', 'En deuda'];

// Función para generar fecha de nacimiento aleatoria (entre 5 y 18 años)
function generarFechaNacimiento() {
  const hoy = new Date();
  const añoActual = hoy.getFullYear();
  const añoNacimiento = añoActual - Math.floor(Math.random() * 14) - 5; // Entre 5 y 18 años
  const mes = Math.floor(Math.random() * 12) + 1;
  const dia = Math.floor(Math.random() * 28) + 1; // Usamos 28 para evitar problemas con febrero
  
  return `${añoNacimiento}-${mes.toString().padStart(2, '0')}-${dia.toString().padStart(2, '0')}`;
}

// Función para obtener elemento aleatorio de un array
function obtenerAleatorio(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// Función para generar un niño
function generarNino(teamId) {
  return {
    nombre: obtenerAleatorio(nombres),
    apellido: obtenerAleatorio(apellidos),
    fecha_nacimiento: generarFechaNacimiento(),
    estado_fisico: obtenerAleatorio(estadosFisicos),
    condicion_pago: obtenerAleatorio(condicionesPago),
    team_id: teamId
  };
}

// Función principal para insertar datos
async function insertarDatosPrueba() {
  return new Promise((resolve, reject) => {
    console.log('🚀 Iniciando inserción de datos de prueba...');
    
    db.serialize(() => {
      // Limpiar datos existentes (opcional)
      console.log('🧹 Limpiando datos existentes...');
      db.run('DELETE FROM children');
      db.run('DELETE FROM teams');
      
      // Insertar equipos
      console.log('⚽ Insertando equipos...');
      const insertTeamStmt = db.prepare('INSERT INTO teams (nombre, descripcion, color) VALUES (?, ?, ?)');
      
      equipos.forEach((equipo, index) => {
        insertTeamStmt.run(equipo.nombre, equipo.descripcion, equipo.color);
        console.log(`✅ Equipo "${equipo.nombre}" insertado`);
      });
      
      insertTeamStmt.finalize();
      
      // Insertar niños
      console.log('👶 Insertando niños...');
      const insertChildStmt = db.prepare('INSERT INTO children (nombre, apellido, fecha_nacimiento, estado_fisico, condicion_pago, team_id) VALUES (?, ?, ?, ?, ?, ?)');
      
      let totalNinos = 0;
      
      for (let teamId = 1; teamId <= 5; teamId++) {
        const cantidadNinos = Math.floor(Math.random() * 5) + 12; // Entre 12 y 16 niños por equipo
        
        for (let i = 0; i < cantidadNinos; i++) {
          const nino = generarNino(teamId);
          insertChildStmt.run(
            nino.nombre,
            nino.apellido,
            nino.fecha_nacimiento,
            nino.estado_fisico,
            nino.condicion_pago,
            nino.team_id
          );
          totalNinos++;
        }
        
        console.log(`✅ ${cantidadNinos} niños insertados en equipo ${teamId}`);
      }
      
      insertChildStmt.finalize();
      
      console.log(`🎉 ¡Datos de prueba insertados exitosamente!`);
      console.log(`📊 Total: ${equipos.length} equipos y ${totalNinos} niños`);
      
      // Verificar inserción
      db.get('SELECT COUNT(*) as total_equipos FROM teams', (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        
        db.get('SELECT COUNT(*) as total_ninos FROM children', (err, row2) => {
          if (err) {
            reject(err);
            return;
          }
          
          console.log(`✅ Verificación: ${row.total_equipos} equipos y ${row2.total_ninos} niños en la base de datos`);
          resolve();
        });
      });
    });
  });
}

// Ejecutar si se llama directamente
if (require.main === module) {
  insertarDatosPrueba()
    .then(() => {
      console.log('🎯 Datos de prueba listos para testing');
      db.close();
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error al insertar datos:', error);
      db.close();
      process.exit(1);
    });
}

module.exports = { insertarDatosPrueba };
