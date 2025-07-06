/**
 * Script para generar datos de prueba masivos
 * Ejecutar con: node generate-test-data.js
 */

const database = require('./config/database');

// Datos de equipos de prueba
const teamsData = [
  {
    nombre: "Los Tigres",
    descripcion: "Equipo de fútbol juvenil con espíritu competitivo",
    color: "#FF6B35"
  },
  {
    nombre: "Águilas Doradas",
    descripcion: "Equipo de baloncesto con tradición ganadora",
    color: "#FFD23F"
  },
  {
    nombre: "Leones Valientes",
    descripcion: "Equipo de atletismo con gran disciplina",
    color: "#06FFA5"
  },
  {
    nombre: "Delfines Azules",
    descripcion: "Equipo de natación con técnica excepcional",
    color: "#4D96FF"
  },
  {
    nombre: "Panteras Negras",
    descripcion: "Equipo de artes marciales con honor",
    color: "#9B59B6"
  },
  {
    nombre: "Halcones Veloces",
    descripcion: "Equipo de ciclismo con velocidad extrema",
    color: "#E74C3C"
  },
  {
    nombre: "Lobos Grises",
    descripcion: "Equipo de rugby con trabajo en equipo",
    color: "#95A5A6"
  },
  {
    nombre: "Serpientes Verdes",
    descripcion: "Equipo de tenis con estrategia inteligente",
    color: "#27AE60"
  },
  {
    nombre: "Tortugas Ninja",
    descripcion: "Equipo de skateboarding con estilo urbano",
    color: "#F39C12"
  },
  {
    nombre: "Unicornios Mágicos",
    descripcion: "Equipo de gimnasia artística con elegancia",
    color: "#E91E63"
  }
];

// Nombres y apellidos para generar niños
const nombres = [
  "Alejandro", "Sofía", "Diego", "Valentina", "Santiago", "Isabella", "Mateo", "Camila",
  "Sebastián", "Martina", "Nicolás", "Emma", "Samuel", "Lucía", "Benjamín", "Regina",
  "Gabriel", "Victoria", "Lucas", "Mariana", "Emiliano", "Fernanda", "Leonardo", "Daniela",
  "Thiago", "Renata", "Máximo", "Julia", "Joaquín", "Zoe", "Gael", "Amanda", "Ian", "Abril",
  "Adrián", "Constanza", "Bruno", "Agustina", "Tomás", "Antonella", "Lautaro", "Guadalupe",
  "Facundo", "Elena", "Franco", "Bianca", "Ignacio", "Catalina", "Patricio", "Julieta",
  "Rodrigo", "Amparo", "Santino", "Emilia", "Agustín", "Mora", "Enzo", "Delfina",
  "Bautista", "Alma", "Gaspar", "Olivia", "Dante", "Mía", "Juan", "Ana", "Pablo", "María",
  "Carlos", "Luciana", "Andrés", "Natalia", "Fernando", "Andrea", "Ricardo", "Carolina",
  "Antonio", "Paola", "Manuel", "Alejandra", "José", "Gabriela", "Luis", "Patricia",
  "Miguel", "Laura", "Ángel", "Carmen", "Rafael", "Rosa", "Pedro", "Teresa", "Francisco", "Luz"
];

const apellidos = [
  "García", "Rodríguez", "González", "Fernández", "López", "Martínez", "Sánchez", "Pérez",
  "Gómez", "Martín", "Jiménez", "Ruiz", "Hernández", "Díaz", "Moreno", "Muñoz",
  "Álvarez", "Romero", "Alonso", "Gutiérrez", "Navarro", "Torres", "Domínguez", "Vázquez",
  "Ramos", "Gil", "Ramírez", "Serrano", "Blanco", "Suárez", "Molina", "Morales",
  "Ortega", "Delgado", "Castro", "Ortiz", "Rubio", "Marín", "Sanz", "Núñez",
  "Iglesias", "Medina", "Garrido", "Cortés", "Castillo", "Santos", "Lozano", "Guerrero",
  "Cano", "Prieto", "Méndez", "Cruz", "Flores", "Herrera", "Peña", "León", "Márquez", "Cabrera"
];

// Función para generar fecha de nacimiento aleatoria (5-25 años)
function generateRandomBirthDate() {
  const today = new Date();
  const minAge = 5;
  const maxAge = 25;
  
  const age = Math.floor(Math.random() * (maxAge - minAge + 1)) + minAge;
  const birthYear = today.getFullYear() - age;
  const birthMonth = Math.floor(Math.random() * 12);
  const birthDay = Math.floor(Math.random() * 28) + 1; // Usamos 28 para evitar problemas con febrero
  
  const birthDate = new Date(birthYear, birthMonth, birthDay);
  return birthDate.toISOString().split('T')[0]; // Formato YYYY-MM-DD
}

// Función para obtener elemento aleatorio de un array
function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// Función para crear equipos
async function createTeams() {
  console.log('🏆 Creando equipos...');
  
  const createdTeams = [];
  
  for (const teamData of teamsData) {
    try {
      const result = await new Promise((resolve, reject) => {
        const sql = 'INSERT INTO teams (nombre, descripcion, color, activo, created_at) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)';
        database.getDB().run(sql, [teamData.nombre, teamData.descripcion, teamData.color, 1], function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({
              id: this.lastID,
              ...teamData
            });
          }
        });
      });
      
      createdTeams.push(result);
      console.log(`✅ Equipo creado: ${result.nombre} (ID: ${result.id})`);
    } catch (error) {
      console.error(`❌ Error creando equipo ${teamData.nombre}:`, error.message);
    }
  }
  
  return createdTeams;
}

// Función para crear niños para un equipo
async function createChildrenForTeam(teamId, teamName, count = 50) {
  console.log(`👶 Creando ${count} niños para ${teamName}...`);
  
  const children = [];
  const estados = ['En forma', 'Lesionado'];
  const condiciones = ['Al dia', 'En deuda'];
  
  for (let i = 0; i < count; i++) {
    const nombre = getRandomElement(nombres);
    const apellido = getRandomElement(apellidos);
    const fechaNacimiento = generateRandomBirthDate();
    const estadoFisico = getRandomElement(estados);
    const condicionPago = getRandomElement(condiciones);
    
    try {
      const result = await new Promise((resolve, reject) => {
        const sql = `
          INSERT INTO children (nombre, apellido, fecha_nacimiento, estado_fisico, condicion_pago, team_id, created_at) 
          VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        `;
        
        database.getDB().run(sql, [nombre, apellido, fechaNacimiento, estadoFisico, condicionPago, teamId], function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({
              id: this.lastID,
              nombre,
              apellido,
              fechaNacimiento,
              estadoFisico,
              condicionPago,
              teamId
            });
          }
        });
      });
      
      children.push(result);
      
      // Mostrar progreso cada 10 niños
      if ((i + 1) % 10 === 0) {
        console.log(`   📊 Progreso: ${i + 1}/${count} niños creados`);
      }
    } catch (error) {
      console.error(`❌ Error creando niño ${nombre} ${apellido}:`, error.message);
    }
  }
  
  console.log(`✅ ${children.length} niños creados para ${teamName}`);
  return children;
}

// Función principal
async function generateTestData() {
  console.log('🚀 Iniciando generación de datos de prueba...\n');
  
  try {
    // Inicializar base de datos
    await database.initialize();
    console.log('📊 Base de datos inicializada\n');
    
    // Limpiar datos existentes
    console.log('🧹 Limpiando datos existentes...');
    await new Promise((resolve, reject) => {
      database.getDB().run('DELETE FROM children', [], function(err) {
        if (err) reject(err);
        else resolve();
      });
    });
    
    await new Promise((resolve, reject) => {
      database.getDB().run('DELETE FROM teams', [], function(err) {
        if (err) reject(err);
        else resolve();
      });
    });
    console.log('✅ Datos existentes eliminados\n');
    
    // Crear equipos
    const teams = await createTeams();
    console.log(`\n🏆 ${teams.length} equipos creados exitosamente\n`);
    
    // Crear niños para cada equipo
    let totalChildren = 0;
    for (const team of teams) {
      const childrenCount = Math.floor(Math.random() * 21) + 40; // Entre 40 y 60 niños por equipo
      const children = await createChildrenForTeam(team.id, team.nombre, childrenCount);
      totalChildren += children.length;
      console.log(''); // Línea en blanco para separar equipos
    }
    
    console.log('🎉 ¡Generación de datos completada exitosamente!');
    console.log(`📊 Resumen:`);
    console.log(`   🏆 Equipos creados: ${teams.length}`);
    console.log(`   👶 Niños creados: ${totalChildren}`);
    console.log(`   📈 Promedio por equipo: ${Math.round(totalChildren / teams.length)}`);
    
  } catch (error) {
    console.error('❌ Error durante la generación de datos:', error);
  } finally {
    // Cerrar conexión a la base de datos
    database.close();
    console.log('\n🔒 Conexión a la base de datos cerrada');
    process.exit(0);
  }
}

// Ejecutar el script
if (require.main === module) {
  generateTestData();
}

module.exports = { generateTestData };
