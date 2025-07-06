/**
 * Export Controller
 * Controlador para exportación de datos a archivos Excel/CSV
 * 
 * @author Tommy
 * @version 1.0.0
 */

const XLSX = require('xlsx');
const database = require('../config/database');
const { successResponse, errorResponse } = require('../utils/response');
const { formatDate, calculateAge } = require('../utils/helpers');

class ExportController {
  /**
   * Función auxiliar para devolver errores de manera consistente
   */
  sendError(res, message, statusCode = 500) {
    return errorResponse(res, message, statusCode);
  }

  /**
   * Función auxiliar para ejecutar consultas SQL
   */
  async executeQuery(sql, params = []) {
    return new Promise((resolve, reject) => {
      database.getDB().all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  /**
   * Función auxiliar para ejecutar consulta única
   */
  async executeGet(sql, params = []) {
    return new Promise((resolve, reject) => {
      database.getDB().get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  /**
   * Exportar todos los niños a Excel
   */
  async exportAllChildren(req, res) {
    try {
      // Consultar todos los niños con información de equipos
      const children = await this.executeQuery(`
        SELECT 
          c.id,
          c.nombre as name,
          c.edad as age,
          c.fecha_nacimiento as birth_date,
          c.notas as notes,
          c.created_at,
          c.updated_at,
          t.nombre as team_name,
          t.color as team_color
        FROM children c
        LEFT JOIN teams t ON c.team_id = t.id
        ORDER BY c.nombre ASC
      `);

      if (children.length === 0) {
        return this.sendError(res, 'No hay niños registrados para exportar', 404);
      }

      // Generar archivo Excel
      const buffer = this.generateChildrenExcel(children, 'Todos los Niños');

      // Configurar headers de respuesta
      const timestamp = new Date().toISOString().slice(0, 10);
      const filename = `lista_ninos_${timestamp}.xlsx`;

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Length', buffer.length);

      res.send(buffer);
    } catch (error) {
      console.error('Error al exportar niños:', error);
      return this.sendError(res, 'Error interno del servidor al exportar niños', 500);
    }
  }

  /**
   * Exportar niños por equipo
   */
  async exportChildrenByTeam(req, res) {
    try {
      const { teamId } = req.query;

      // Verificar que el equipo existe
      const team = await this.executeGet('SELECT * FROM teams WHERE id = ?', [teamId]);
      if (!team) {
        return this.sendError(res, 'Equipo no encontrado', 404);
      }

      // Consultar niños del equipo
      const children = await this.executeQuery(`
        SELECT 
          c.id,
          c.nombre as name,
          c.edad as age,
          c.fecha_nacimiento as birth_date,
          c.notas as notes,
          c.created_at,
          c.updated_at,
          t.nombre as team_name,
          t.color as team_color
        FROM children c
        LEFT JOIN teams t ON c.team_id = t.id
        WHERE c.team_id = ?
        ORDER BY c.nombre ASC
      `, [teamId]);

      if (children.length === 0) {
        return this.sendError(res, `No hay niños registrados en el equipo "${team.nombre}"`, 404);
      }

      // Generar archivo Excel
      const buffer = this.generateChildrenExcel(children, `Equipo: ${team.nombre}`);

      // Configurar headers de respuesta
      const timestamp = new Date().toISOString().slice(0, 10);
      const teamNameClean = team.nombre.replace(/[^a-zA-Z0-9]/g, '_');
      const filename = `equipo_${teamNameClean}_${timestamp}.xlsx`;

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Length', buffer.length);

      res.send(buffer);
    } catch (error) {
      console.error('Error al exportar niños por equipo:', error);
      this.sendError(res, 'Error interno del servidor al exportar niños por equipo', 500);
    }
  }

  /**
   * Exportar todos los equipos a Excel
   */
  async exportAllTeams(req, res) {
    try {
      // Consultar todos los equipos con conteo de niños
      const teams = await this.executeQuery(`
        SELECT 
          t.id,
          t.nombre as name,
          t.descripcion as description,
          t.color,
          t.activo as active,
          t.created_at,
          t.updated_at,
          COUNT(c.id) as children_count
        FROM teams t
        LEFT JOIN children c ON t.id = c.team_id
        WHERE t.activo = 1
        GROUP BY t.id, t.nombre, t.descripcion, t.color, t.activo, t.created_at, t.updated_at
        ORDER BY t.nombre ASC
      `);

      if (teams.length === 0) {
        return this.sendError(res, 'No hay equipos registrados para exportar', 404);
      }

      // Generar archivo Excel
      const buffer = this.generateTeamsExcel(teams, 'Lista de Equipos');

      // Configurar headers de respuesta
      const timestamp = new Date().toISOString().slice(0, 10);
      const filename = `lista_equipos_${timestamp}.xlsx`;

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Length', buffer.length);

      res.send(buffer);
    } catch (error) {
      console.error('Error al exportar equipos:', error);
      this.sendError(res, 'Error interno del servidor al exportar equipos', 500);
    }
  }

  /**
   * Exportar reporte completo (equipos + niños + estadísticas)
   */
  async exportCompleteReport(req, res) {
    try {
      // Consultar datos para el reporte
      const [children, teams, stats] = await Promise.all([
        this.executeQuery(`
          SELECT 
            c.id,
            c.nombre as name,
            c.edad as age,
            c.fecha_nacimiento as birth_date,
            c.notas as notes,
            c.created_at,
            c.updated_at,
            t.nombre as team_name,
            t.color as team_color
          FROM children c
          LEFT JOIN teams t ON c.team_id = t.id
          ORDER BY t.nombre ASC, c.nombre ASC
        `),
        this.executeQuery(`
          SELECT 
            t.id,
            t.nombre as name,
            t.descripcion as description,
            t.color,
            t.activo as active,
            t.created_at,
            t.updated_at,
            COUNT(c.id) as children_count
          FROM teams t
          LEFT JOIN children c ON t.id = c.team_id
          WHERE t.activo = 1
          GROUP BY t.id, t.nombre, t.descripcion, t.color, t.activo, t.created_at, t.updated_at
          ORDER BY t.nombre ASC
        `),
        this.executeQuery(`
          SELECT 
            COUNT(DISTINCT t.id) as total_teams,
            COUNT(c.id) as total_children,
            COUNT(CASE WHEN c.edad IS NOT NULL THEN 1 END) as children_with_age,
            COUNT(CASE WHEN c.team_id IS NOT NULL THEN 1 END) as children_with_team,
            COUNT(CASE WHEN c.team_id IS NULL THEN 1 END) as children_without_team,
            AVG(CASE WHEN c.edad IS NOT NULL THEN c.edad END) as avg_age,
            MIN(CASE WHEN c.edad IS NOT NULL THEN c.edad END) as min_age,
            MAX(CASE WHEN c.edad IS NOT NULL THEN c.edad END) as max_age
          FROM children c
          LEFT JOIN teams t ON c.team_id = t.id
        `)
      ]);

      // Generar archivo Excel completo
      const buffer = this.generateCompleteReportExcel(children, teams, stats[0]);

      // Configurar headers de respuesta
      const timestamp = new Date().toISOString().slice(0, 10);
      const filename = `reporte_completo_${timestamp}.xlsx`;

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Length', buffer.length);

      res.send(buffer);
    } catch (error) {
      console.error('Error al exportar reporte completo:', error);
      this.sendError(res, 'Error interno del servidor al exportar reporte completo', 500);
    }
  }

  /**
   * Exportar niños a CSV
   */
  async exportChildrenCSV(req, res) {
    try {
      const children = await this.executeQuery(`
        SELECT 
          c.nombre as "Nombre",
          c.edad as "Edad",
          c.fecha_nacimiento as "Fecha Nacimiento",
          c.notas as "Notas",
          t.nombre as "Equipo",
          c.created_at as "Fecha Registro"
        FROM children c
        LEFT JOIN teams t ON c.team_id = t.id
        ORDER BY c.nombre ASC
      `);

      if (children.length === 0) {
        return this.sendError(res, 'No hay niños registrados para exportar', 404);
      }

      // Generar CSV
      const csvContent = this.generateCSV(children);

      // Configurar headers de respuesta
      const timestamp = new Date().toISOString().slice(0, 10);
      const filename = `lista_ninos_${timestamp}.csv`;

      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Length', Buffer.byteLength(csvContent, 'utf8'));

      res.send(csvContent);
    } catch (error) {
      console.error('Error al exportar niños a CSV:', error);
      this.sendError(res, 'Error interno del servidor al exportar niños a CSV', 500);
    }
  }

  // ==================== MÉTODOS AUXILIARES ====================

  /**
   * Generar archivo Excel para niños
   */
  generateChildrenExcel(children, sheetName = 'Niños') {
    // Preparar datos para Excel
    const excelData = children.map(child => ({
      'ID': child.id,
      'Nombre': child.name,
      'Edad': child.age,
      'Fecha Nacimiento': child.birth_date ? formatDate(new Date(child.birth_date)) : '',
      'Equipo': child.team_name || 'Sin equipo',
      'Color Equipo': child.team_color || '',
      'Notas': child.notes || '',
      'Fecha Registro': formatDate(new Date(child.created_at))
    }));

    // Crear workbook
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Agregar la hoja al workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    // Generar buffer
    return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  }

  /**
   * Generar archivo Excel para equipos
   */
  generateTeamsExcel(teams, sheetName = 'Equipos') {
    // Preparar datos para Excel
    const excelData = teams.map(team => ({
      'ID': team.id,
      'Nombre': team.name,
      'Descripción': team.description || '',
      'Color': team.color,
      'Niños Registrados': team.children_count,
      'Estado': team.active ? 'Activo' : 'Inactivo',
      'Fecha Creación': formatDate(new Date(team.created_at))
    }));

    // Crear workbook
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Agregar la hoja al workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    // Generar buffer
    return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  }

  /**
   * Generar reporte completo en Excel
   */
  generateCompleteReportExcel(children, teams, stats) {
    const workbook = XLSX.utils.book_new();

    // Hoja 1: Resumen/Estadísticas
    const statsData = [
      ['RESUMEN GENERAL'],
      [''],
      ['Total de equipos:', stats.total_teams],
      ['Total de niños:', stats.total_children],
      ['Con edad registrada:', stats.children_with_age],
      ['Con equipo asignado:', stats.children_with_team],
      ['Sin equipo:', stats.children_without_team],
      [''],
      ['EDADES'],
      ['Edad promedio:', stats.avg_age ? stats.avg_age.toFixed(1) : 'N/A'],
      ['Edad mínima:', stats.min_age || 'N/A'],
      ['Edad máxima:', stats.max_age || 'N/A'],
      [''],
      ['Reporte generado:', formatDate(new Date(), true)]
    ];

    const statsSheet = XLSX.utils.aoa_to_sheet(statsData);
    XLSX.utils.book_append_sheet(workbook, statsSheet, 'Resumen');

    // Hoja 2: Equipos
    if (teams.length > 0) {
      const teamsData = teams.map(team => ({
        'ID': team.id,
        'Nombre': team.name,
        'Descripción': team.description || '',
        'Color': team.color,
        'Niños Registrados': team.children_count,
        'Estado': team.active ? 'Activo' : 'Inactivo',
        'Fecha Creación': formatDate(new Date(team.created_at))
      }));
      const teamsSheet = XLSX.utils.json_to_sheet(teamsData);
      XLSX.utils.book_append_sheet(workbook, teamsSheet, 'Equipos');
    }

    // Hoja 3: Niños
    if (children.length > 0) {
      const childrenData = children.map(child => ({
        'ID': child.id,
        'Nombre': child.name,
        'Edad': child.age,
        'Fecha Nacimiento': child.birth_date ? formatDate(new Date(child.birth_date)) : '',
        'Equipo': child.team_name || 'Sin equipo',
        'Color Equipo': child.team_color || '',
        'Notas': child.notes || '',
        'Fecha Registro': formatDate(new Date(child.created_at))
      }));
      const childrenSheet = XLSX.utils.json_to_sheet(childrenData);
      XLSX.utils.book_append_sheet(workbook, childrenSheet, 'Niños');
    }

    // Generar buffer
    return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  }

  /**
   * Generar contenido CSV
   */
  generateCSV(data) {
    if (!data || data.length === 0) {
      return '';
    }

    // Obtener headers
    const headers = Object.keys(data[0]);
    
    // Función para escapar valores CSV
    const escapeCSV = (value) => {
      if (value === null || value === undefined) return '';
      const str = String(value);
      if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    // Crear contenido CSV
    const csvRows = [
      headers.map(escapeCSV).join(','),
      ...data.map(row => 
        headers.map(header => escapeCSV(row[header])).join(',')
      )
    ];

    return csvRows.join('\n');
  }

  /**
   * Método unificado para exportar niños
   * Maneja filtros por equipo y formato
   */
  async exportChildren(req, res) {
    try {
      const { format = 'excel', teamId } = req.query;
      
      if (format === 'csv') {
        return this.exportChildrenCSV(req, res);
      }
      
      if (teamId) {
        return this.exportChildrenByTeam(req, res);
      }
      
      return this.exportAllChildren(req, res);
    } catch (error) {
      console.error('Error en exportChildren:', error);
      this.sendError(res, 'Error interno del servidor al exportar niños', 500);
    }
  }
  
  /**
   * Método unificado para exportar equipos
   * Maneja formato y opción de incluir niños
   */
  async exportTeams(req, res) {
    try {
      const { format = 'excel', includeChildren = 'false' } = req.query;
      
      if (format === 'csv') {
        // Para CSV, llamar directamente al método de equipos
        return this.exportAllTeams(req, res);
      }
      
      // Para Excel, usar el método normal
      return this.exportAllTeams(req, res);
    } catch (error) {
      console.error('Error en exportTeams:', error);
      this.sendError(res, 'Error interno del servidor al exportar equipos', 500);
    }
  }
}

module.exports = new ExportController();
