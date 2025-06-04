const database = require('../config/database');

class ChildrenModel {  // Obtener todos los niños
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
          resolve(rows);
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
          resolve(rows);
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
          resolve(row);
        }
      });
    });
  }
  // Crear un nuevo niño
  static create(childData) {
    return new Promise((resolve, reject) => {
      const { nombre, apellido, edad, team_id } = childData;
      const sql = 'INSERT INTO children (nombre, apellido, edad, team_id) VALUES (?, ?, ?, ?)';
      
      database.getDB().run(sql, [nombre.trim(), apellido.trim(), edad, team_id || 1], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({
            id: this.lastID,
            nombre: nombre.trim(),
            apellido: apellido.trim(),
            edad: edad,
            team_id: team_id || 1,
            created_at: new Date().toISOString()
          });
        }
      });
    });
  }
  // Actualizar un niño
  static update(id, childData) {
    return new Promise((resolve, reject) => {
      const { nombre, apellido, edad, team_id } = childData;
      const sql = 'UPDATE children SET nombre = ?, apellido = ?, edad = ?, team_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
      
      database.getDB().run(sql, [nombre.trim(), apellido.trim(), edad, team_id || 1, id], function(err) {
        if (err) {
          reject(err);
        } else if (this.changes === 0) {
          resolve(null); // No se encontró el registro
        } else {
          resolve({
            id: parseInt(id),
            nombre: nombre.trim(),
            apellido: apellido.trim(),
            edad: edad,
            team_id: team_id || 1,
            updated_at: new Date().toISOString()
          });
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

  // Obtener estadísticas
  static getStats() {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT 
          COUNT(*) as total,
          AVG(edad) as edadPromedio,
          MIN(edad) as edadMinima,
          MAX(edad) as edadMaxima
        FROM children
      `;
      
      database.getDB().get(sql, [], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve({
            total: row.total,
            edadPromedio: Math.round(row.edadPromedio * 100) / 100,
            edadMinima: row.edadMinima,
            edadMaxima: row.edadMaxima
          });
        }
      });
    });
  }
}

module.exports = ChildrenModel;
