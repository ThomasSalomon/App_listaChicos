/**
 * Teams Model
 * Modelo para gestionar equipos en la base de datos
 */

const database = require('../config/database');

class TeamsModel {
  // Obtener todos los equipos
  static getAll() {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM teams WHERE activo = 1 ORDER BY created_at DESC';
      
      database.getDB().all(sql, [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  // Obtener un equipo por ID
  static getById(id) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM teams WHERE id = ? AND activo = 1';
      
      database.getDB().get(sql, [id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }
  // Crear un nuevo equipo
  static create(teamData) {
    return new Promise((resolve, reject) => {
      const { nombre, descripcion, color } = teamData;
      const sql = 'INSERT INTO teams (nombre, descripcion, color, activo, created_at) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)';
      
      database.getDB().run(sql, [nombre.trim(), descripcion?.trim() || '', color || '#3B82F6', 1], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({
            id: this.lastID,
            nombre: nombre.trim(),
            descripcion: descripcion?.trim() || '',
            color: color || '#3B82F6',
            activo: 1,
            created_at: new Date().toISOString()
          });
        }
      });
    });
  }

  // Actualizar un equipo
  static update(id, teamData) {
    return new Promise((resolve, reject) => {
      const { nombre, descripcion, color } = teamData;
      const sql = 'UPDATE teams SET nombre = ?, descripcion = ?, color = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND activo = 1';
      
      database.getDB().run(sql, [nombre.trim(), descripcion?.trim() || '', color || '#3B82F6', id], function(err) {
        if (err) {
          reject(err);
        } else if (this.changes === 0) {
          resolve(null); // No se encontró el registro
        } else {
          resolve({
            id: parseInt(id),
            nombre: nombre.trim(),
            descripcion: descripcion?.trim() || '',
            color: color || '#3B82F6',
            updated_at: new Date().toISOString()
          });
        }
      });
    });
  }
  // Eliminar un equipo (hard delete)
  static delete(id) {
    return new Promise((resolve, reject) => {
      // Verificar si hay niños en este equipo
      const checkChildrenSql = 'SELECT COUNT(*) as count FROM children WHERE team_id = ?';
      
      database.getDB().get(checkChildrenSql, [id], (err, row) => {
        if (err) {
          reject(err);
          return;
        }

        if (row.count > 0) {
          reject(new Error('No se puede eliminar un equipo que tiene niños asignados'));
          return;
        }

        // Si no hay niños, proceder con la eliminación física
        const sql = 'DELETE FROM teams WHERE id = ?';
        
        database.getDB().run(sql, [id], function(err) {
          if (err) {
            reject(err);
          } else {
            resolve(this.changes > 0);
          }
        });
      });
    });
  }

  // Obtener estadísticas de un equipo
  static getTeamStats(teamId) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT 
          t.id,
          t.nombre as equipo_nombre,
          t.descripcion,
          t.color,
          COUNT(c.id) as total_ninos,
          AVG(c.edad) as edad_promedio,
          MIN(c.edad) as edad_minima,
          MAX(c.edad) as edad_maxima
        FROM teams t
        LEFT JOIN children c ON t.id = c.team_id
        WHERE t.id = ? AND t.activo = 1
        GROUP BY t.id
      `;
      
      database.getDB().get(sql, [teamId], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row ? {
            ...row,
            edad_promedio: row.edad_promedio ? Math.round(row.edad_promedio * 100) / 100 : 0
          } : null);
        }
      });
    });
  }

  // Obtener todos los equipos con estadísticas
  static getAllWithStats() {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT 
          t.id,
          t.nombre,
          t.descripcion,
          t.color,
          t.created_at,
          t.updated_at,
          COUNT(c.id) as total_ninos,
          AVG(c.edad) as edad_promedio
        FROM teams t
        LEFT JOIN children c ON t.id = c.team_id
        WHERE t.activo = 1
        GROUP BY t.id
        ORDER BY t.created_at DESC
      `;
      
      database.getDB().all(sql, [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          const teamsWithStats = rows.map(row => ({
            ...row,
            edad_promedio: row.edad_promedio ? Math.round(row.edad_promedio * 100) / 100 : 0
          }));
          resolve(teamsWithStats);
        }
      });
    });
  }

  // Mover niños de un equipo a otro
  static moveChildren(fromTeamId, toTeamId) {
    return new Promise((resolve, reject) => {
      const sql = 'UPDATE children SET team_id = ?, updated_at = CURRENT_TIMESTAMP WHERE team_id = ?';
      
      database.getDB().run(sql, [toTeamId, fromTeamId], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.changes);
        }
      });
    });
  }

  // Verificar si un equipo existe y está activo
  static exists(id) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT COUNT(*) as count FROM teams WHERE id = ? AND activo = 1';
      
      database.getDB().get(sql, [id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row.count > 0);
        }
      });
    });
  }
}

module.exports = TeamsModel;
