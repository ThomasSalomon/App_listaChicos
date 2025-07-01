// Script limpio para insertar datos de testing
// Se ejecutará desde el directorio backend

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

console.log('🚀 Iniciando script de inyección de datos de prueba');
console.log('📁 Directorio actual:', __dirname);

// Ruta de la base de datos existente
const dbPath = path.join(__dirname, 'database', 'database.sqlite');
console.log('🗄️ Ruta de la base de datos:', dbPath);

// Datos de equipos para insertar
const equipos = [
  { nombre: 'Los Tigres', descripcion: 'Equipo veloz y feroz', color: '#FF6B35' },
  { nombre: 'Las Águilas', descripcion: 'Volando hacia la victoria', color: '#1E88E5' },
  { nombre: 'Los Leones', descripcion: 'Fuerza y coraje', color: '#8E24AA' },
  { nombre: 'Las Panteras', descripcion: 'Agilidad y precisión', color: '#00ACC1' },
  { nombre: 'Los Halcones', descripcion: 'Visión y velocidad', color: '#43A047' }
];

// Arrays de nombres y apellidos
const nombres = [
  'Mateo', 'Sofía', 'Santiago', 'Isabella', 'Sebastián', 'Camila', 'Matías', 'Valentina',
  'Diego', 'Martina', 'Nicolás', 'Emma', 'Samuel', 'Lucía', 'Daniel', 'Regina',
  'Alejandro', 'Valeria', 'Leonardo', 'Mariana', 'Gabriel', 'Antonella', 'Pablo', 'Constanza'
];

const apellidos = [
  'García', 'Rodríguez', 'González', 'Fernández', 'López', 'Martínez', 'Sánchez', 'Pérez',
  'Gómez', 'Martín', 'Jiménez', 'Ruiz', 'Hernández', 'Díaz', 'Moreno', 'Muñoz'
];

// Funciones auxiliares
function elementoAleatorio(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function generarFechaNacimiento() {
  const añoActual = new Date().getFullYear();
  const añoNacimiento = añoActual - Math.floor(Math.random() * 12) - 6; // Entre 6 y 17 años
  const mes = Math.floor(Math.random() * 12) + 1;
  const dia = Math.floor(Math.random() * 28) + 1;
  
  return `${añoNacimiento}-${mes.toString().padStart(2, '0')}-${dia.toString().padStart(2, '0')}`;
}

// Función principal para insertar datos
async function insertarDatos() {
  const db = new sqlite3.Database(dbPath);
  
  console.log('\n🏆 Insertando equipos...');
  
  // Insertar equipos y niños
  for (let i = 0; i < equipos.length; i++) {
    const equipo = equipos[i];
    
    // Insertar equipo
    const equipoResult = await new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO teams (nombre, descripcion, color, activo) VALUES (?, ?, ?, 1)',
        [equipo.nombre, equipo.descripcion, equipo.color],
        function(err) {
          if (err) reject(err);
          else {
            console.log(`✅ Equipo "${equipo.nombre}" insertado con ID: ${this.lastID}`);
            resolve(this.lastID);
          }
        }
      );
    });
    
    // Insertar niños para este equipo
    const cantidadNiños = 13 + Math.floor(Math.random() * 3); // Entre 13 y 15
    console.log(`👶 Insertando ${cantidadNiños} niños para ${equipo.nombre}...`);
    
    for (let j = 0; j < cantidadNiños; j++) {
      const nombre = elementoAleatorio(nombres);
      const apellido = elementoAleatorio(apellidos);
      const fechaNacimiento = generarFechaNacimiento();
      const estadoFisico = Math.random() > 0.8 ? 'Lesionado' : 'En forma';
      const condicionPago = Math.random() > 0.7 ? 'En deuda' : 'Al dia';
      
      await new Promise((resolve, reject) => {
        db.run(
          'INSERT INTO children (nombre, apellido, fecha_nacimiento, estado_fisico, condicion_pago, team_id) VALUES (?, ?, ?, ?, ?, ?)',
          [nombre, apellido, fechaNacimiento, estadoFisico, condicionPago, equipoResult],
          function(err) {
            if (err) reject(err);
            else resolve();
          }
        );
      });
    }
  }
  
  db.close();
  console.log('\n🎉 ¡Datos insertados exitosamente!');
}

// Ejecutar el script
insertarDatos().catch(console.error);
