/**
 * Script para crear las tablas e insertar datos de prueba
 * Usa la configuración existente del proyecto
 */

const Database = require('./config/database');

async function insertarDatosPrueba() {
  console.log('🚀 Iniciando inserción de datos de prueba...');
  
  const database = new Database();
  
  try {
    // Inicializar base de datos (crea tablas si no existen)
    const db = await database.initialize();
    console.log('✅ Base de datos inicializada');
    
    // Equipos de prueba
    const equipos = [
      { nombre: 'Los Tigres', descripcion: 'Equipo de fútbol juvenil', color: '#FF6B35' },
      { nombre: 'Águilas Doradas', descripcion: 'Equipo de básquet mixto', color: '#4ECDC4' },
      { nombre: 'Leones Valientes', descripcion: 'Equipo de handball', color: '#45B7D1' },
      { nombre: 'Estrellas Azules', descripcion: 'Equipo de natación', color: '#9B59B6' },
      { nombre: 'Rayos Veloces', descripcion: 'Equipo de atletismo', color: '#F39C12' }
    ];
    
    // Datos para niños
    const nombres = ['Santiago', 'Valentina', 'Mateo', 'Isabella', 'Nicolás', 'Sofía', 'Samuel', 'Camila', 'Daniel', 'Martina', 'Alejandro', 'Valeria', 'Diego', 'Lucía', 'Sebastián', 'Emma', 'Matías', 'Abril', 'Lucas', 'Olivia', 'Tomás', 'Julieta', 'Joaquín', 'Renata', 'Benjamín', 'Victoria'];
    const apellidos = ['García', 'Rodríguez', 'González', 'Fernández', 'López', 'Martínez', 'Sánchez', 'Pérez', 'Gómez', 'Martín', 'Jiménez', 'Ruiz', 'Hernández', 'Díaz', 'Moreno', 'Álvarez', 'Muñoz', 'Romero', 'Torres', 'Navarro'];
    
    function generarFecha() {
      const año = 2024 - Math.floor(Math.random() * 13) - 5; // Entre 5 y 17 años
      const mes = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
      const día = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
      return `${año}-${mes}-${día}`;
    }
    
    function aleatorio(array) {
      return array[Math.floor(Math.random() * array.length)];
    }
    
    // Limpiar datos existentes
    console.log('🧹 Limpiando datos existentes...');
    await new Promise((resolve, reject) => {
      db.run('DELETE FROM children', (err) => {
        if (err) reject(err);
        else {
          db.run('DELETE FROM teams', (err) => {
            if (err) reject(err);
            else resolve();
          });
        }
      });
    });
    
    console.log('⚽ Insertando equipos...');
    
    // Insertar equipos y niños
    for (let i = 0; i < equipos.length; i++) {
      const equipo = equipos[i];
      
      // Insertar equipo
      const teamId = await new Promise((resolve, reject) => {
        db.run('INSERT INTO teams (nombre, descripcion, color) VALUES (?, ?, ?)', 
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
      const cantidadNiños = Math.floor(Math.random() * 5) + 12; // 12-16 niños
      
      for (let j = 0; j < cantidadNiños; j++) {
        const niño = {
          nombre: aleatorio(nombres),
          apellido: aleatorio(apellidos),
          fecha_nacimiento: generarFecha(),
          estado_fisico: aleatorio(['En forma', 'Lesionado']),
          condicion_pago: aleatorio(['Al dia', 'En deuda']),
          team_id: teamId
        };
        
        await new Promise((resolve, reject) => {
          db.run('INSERT INTO children (nombre, apellido, fecha_nacimiento, estado_fisico, condicion_pago, team_id) VALUES (?, ?, ?, ?, ?, ?)',
            [niño.nombre, niño.apellido, niño.fecha_nacimiento, niño.estado_fisico, niño.condicion_pago, niño.team_id],
            function(err) {
              if (err) reject(err);
              else resolve();
            }
          );
        });
      }
      
      console.log(`👶 ${cantidadNiños} niños insertados para "${equipo.nombre}"`);
    }
    
    // Mostrar resumen
    const totalEquipos = await new Promise((resolve) => {
      db.get('SELECT COUNT(*) as total FROM teams', (err, row) => {
        resolve(row ? row.total : 0);
      });
    });
    
    const totalNiños = await new Promise((resolve) => {
      db.get('SELECT COUNT(*) as total FROM children', (err, row) => {
        resolve(row ? row.total : 0);
      });
    });
    
    console.log(`📊 Resumen final:`);
    console.log(`   • ${totalEquipos} equipos creados`);
    console.log(`   • ${totalNiños} niños creados`);
    console.log('🎉 ¡Datos de prueba insertados exitosamente!');
    console.log('🎯 Ahora puedes probar las optimizaciones con datos reales');
    
    db.close();
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Ejecutar
insertarDatosPrueba();
