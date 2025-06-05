const database = require('../config/database');
const { calculateAge, formatBirthDateForDB } = require('../utils/helpers');

class ChildrenModel {
  // Obtener todos los niños
  static getAll() {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT c.*, t.nombre as equipo_nombre, t.color as equipo_color
        FROM children c
        LEFT JOIN teams t ON c.team_id = t.id
        ORDER BY c.created_at DESC
      `;
      
      database.getDB().all(sql, [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          // Calcular edad para cada niño
          const childrenWithAge = rows.map(child => ({
            ...child,
            edad: calculateAge(child.fecha_nacimiento)
          }));
          resolve(childrenWithAge);
        }
      });
    });
  }

  // Obtener niños por equipo
  static getByTeam(teamId) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT c.*, t.nombre as equipo_nombre, t.color as equipo_color
        FROM children c
        LEFT JOIN teams t ON c.team_id = t.id
        WHERE c.team_id = ?
        ORDER BY c.created_at DESC
      `;
      
      database.getDB().all(sql, [teamId], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          // Calcular edad para cada niño
          const childrenWithAge = rows.map(child => ({
            ...child,
            edad: calculateAge(child.fecha_nacimiento)
          }));
          resolve(childrenWithAge);
        }
      });
    });
  }

  // Obtener un niño por ID
  static getById(id) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT c.*, t.nombre as equipo_nombre, t.color as equipo_color
        FROM children c
        LEFT JOIN teams t ON c.team_id = t.id
        WHERE c.id = ?
      `;
      
      database.getDB().get(sql, [id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          if (row) {
            // Calcular edad
            row.edad = calculateAge(row.fecha_nacimiento);
          }
          resolve(row);
        }
      });
    });
  }

  // Crear un nuevo niño
  static create(childData) {
    return new Promise((resolve, reject) => {
      const { nombre, apellido, fecha_nacimiento, team_id } = childData;
      const formattedDate = formatBirthDateForDB(fecha_nacimiento);
      const sql = 'INSERT INTO children (nombre, apellido, fecha_nacimiento, team_id) VALUES (?, ?, ?, ?)';
      
      database.getDB().run(sql, [nombre.trim(), apellido.trim(), formattedDate, team_id || 1], function(err) {
        if (err) {
          reject(err);
        } else {
          const newChild = {
            id: this.lastID,
            nombre: nombre.trim(),
            apellido: apellido.trim(),
            fecha_nacimiento: formattedDate,
            edad: calculateAge(formattedDate),
            team_id: team_id || 1,
            created_at: new Date().toISOString()
          };
          resolve(newChild);
        }
      });
    });
  }

  // Actualizar un niño
  static update(id, childData) {
    return new Promise((resolve, reject) => {
      const { nombre, apellido, fecha_nacimiento, team_id } = childData;
      const formattedDate = formatBirthDateForDB(fecha_nacimiento);
      const sql = 'UPDATE children SET nombre = ?, apellido = ?, fecha_nacimiento = ?, team_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
      
      database.getDB().run(sql, [nombre.trim(), apellido.trim(), formattedDate, team_id || 1, id], function(err) {
        if (err) {
          reject(err);
        } else if (this.changes === 0) {
          resolve(null); // No se encontró el registro
        } else {
          const updatedChild = {
            id: parseInt(id),
            nombre: nombre.trim(),
            apellido: apellido.trim(),
            fecha_nacimiento: formattedDate,
            edad: calculateAge(formattedDate),
            team_id: team_id || 1,
            updated_at: new Date().toISOString()
          };
          resolve(updatedChild);
        }
      });
    });
  }

  // Eliminar un niño
  static delete(id) {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM children WHERE id = ?';
      
      database.getDB().run(sql, [id], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.changes > 0);
        }
      });
    });
  }

  // Eliminar todos los niños
  static deleteAll() {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM children';
      
      database.getDB().run(sql, [], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.changes);
        }
      });
    });
  }

  // Obtener estadísticas (necesita actualización para calcular edades dinámicamente)
  static getStats() {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT 
          COUNT(*) as total,
          fecha_nacimiento
        FROM children
      `;
      
      database.getDB().all(sql, [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          if (rows.length === 0) {
            resolve({
              total: 0,
              edadPromedio: 0,
              edadMinima: 0,
              edadMaxima: 0
            });
          } else {
            // Calcular edades
            const edades = rows.map(row => calculateAge(row.fecha_nacimiento));
            const total = edades.length;
            const edadPromedio = edades.reduce((sum, edad) => sum + edad, 0) / total;
            const edadMinima = Math.min(...edades);
            const edadMaxima = Math.max(...edades);
            
            resolve({
              total,
              edadPromedio: Math.round(edadPromedio * 100) / 100,
              edadMinima,
              edadMaxima
            });
          }
        }
      });
    });
  }
}

module.exports = ChildrenModel;
