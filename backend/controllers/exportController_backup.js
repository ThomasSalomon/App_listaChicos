/**
 * Export Controller
 * Controlador para exportación de datos a archivos Excel/CSV
 * 
 * @author Tommy
 * @version 1.0.0
 */

const XLSX = require('xlsx');
const database = require('../config/database');
const { formatResponse, formatError } = require('../utils/response');
const { formatDate, calculateAge } = require('../utils/helpers');

class ExportController {
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
        return res.status(404).json(formatError('No hay niños registrados para exportar', 404));
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
      console.error('Error exportando niños:', error);
      res.status(500).json(formatError('Error interno del servidor durante la exportación', 500));
    }
  }

  /**
   * Exportar niños por equipo
   */
  async exportChildrenByTeam(req, res) {
    try {
      const { teamId } = req.params;

      // Verificar que el equipo existe
      const team = await new Promise((resolve, reject) => {
        database.getDB().get('SELECT * FROM teams WHERE id = ?', [teamId], (err, row) => {
          if (err) reject(err);
          else resolve(row);
        });
      });
      
      if (!team) {
        return res.status(404).json(formatError('Equipo no encontrado', 404));
      }

      // Consultar niños del equipo
      const children = await new Promise((resolve, reject) => {
        database.getDB().all(`
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
        `, [teamId], (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        });
      });
        LEFT JOIN teams t ON c.team_id = t.id
        WHERE c.team_id = ?
        ORDER BY c.name ASC
      `, [teamId]);

      if (children.length === 0) {
        return res.status(404).json(formatError(`No hay niños registrados en el equipo "${team.name}"`, 404));
      }

      // Generar archivo Excel
      const buffer = this.generateChildrenExcel(children, `Equipo: ${team.name}`);

      // Configurar headers de respuesta
      const timestamp = new Date().toISOString().slice(0, 10);
      const teamNameClean = team.name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
      const filename = `equipo_${teamNameClean}_${timestamp}.xlsx`;

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Length', buffer.length);

      res.send(buffer);

    } catch (error) {
      console.error('Error exportando equipo:', error);
      res.status(500).json(formatError('Error interno del servidor durante la exportación', 500));
    }
  }

  /**
   * Exportar todos los equipos a Excel
   */
  async exportAllTeams(req, res) {
    try {
      // Consultar equipos con estadísticas
      const teams = await req.db.all(`
        SELECT 
          t.id,
          t.name,
          t.color,
          t.description,
          t.created_at,
          t.updated_at,
          COUNT(c.id) as total_children,
          ROUND(AVG(c.age), 1) as average_age,
          MIN(c.age) as min_age,
          MAX(c.age) as max_age
        FROM teams t
        LEFT JOIN children c ON t.id = c.team_id
        GROUP BY t.id, t.name, t.color, t.description, t.created_at, t.updated_at
        ORDER BY t.name ASC
      `);

      if (teams.length === 0) {
        return res.status(404).json(formatError('No hay equipos registrados para exportar', 404));
      }

      // Generar archivo Excel
      const buffer = this.generateTeamsExcel(teams);

      // Configurar headers de respuesta
      const timestamp = new Date().toISOString().slice(0, 10);
      const filename = `equipos_${timestamp}.xlsx`;

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Length', buffer.length);

      res.send(buffer);

    } catch (error) {
      console.error('Error exportando equipos:', error);
      res.status(500).json(formatError('Error interno del servidor durante la exportación', 500));
    }
  }

  /**
   * Exportar reporte completo (niños + equipos + estadísticas)
   */
  async exportCompleteReport(req, res) {
    try {
      // Consultar datos completos
      const [children, teams, stats] = await Promise.all([
        // Niños con equipos
        req.db.all(`
          SELECT 
            c.id,
            c.name,
            c.age,
            c.birth_date,
            c.notes,
            c.created_at,
            t.name as team_name,
            t.color as team_color
          FROM children c
          LEFT JOIN teams t ON c.team_id = t.id
          ORDER BY t.name ASC, c.name ASC
        `),
        
        // Equipos con estadísticas
        req.db.all(`
          SELECT 
            t.id,
            t.name,
            t.color,
            t.description,
            COUNT(c.id) as total_children,
            ROUND(AVG(c.age), 1) as average_age
          FROM teams t
          LEFT JOIN children c ON t.id = c.team_id
          GROUP BY t.id
          ORDER BY t.name ASC
        `),
        
        // Estadísticas generales
        req.db.get(`
          SELECT 
            COUNT(DISTINCT c.id) as total_children,
            COUNT(DISTINCT t.id) as total_teams,
            ROUND(AVG(c.age), 1) as overall_average_age,
            MIN(c.age) as youngest,
            MAX(c.age) as oldest,
            COUNT(CASE WHEN c.team_id IS NULL THEN 1 END) as children_without_team
          FROM children c
          LEFT JOIN teams t ON c.team_id = t.id
        `)
      ]);

      // Generar archivo Excel completo
      const buffer = this.generateCompleteReport(children, teams, stats);

      // Configurar headers de respuesta
      const timestamp = new Date().toISOString().slice(0, 10);
      const filename = `reporte_completo_${timestamp}.xlsx`;

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Length', buffer.length);

      res.send(buffer);

    } catch (error) {
      console.error('Error generando reporte completo:', error);
      res.status(500).json(formatError('Error interno del servidor durante la exportación', 500));
    }
  }

  /**
   * Exportar en formato CSV
   */
  async exportChildrenCSV(req, res) {
    try {
      const children = await req.db.all(`
        SELECT 
          c.name,
          c.age,
          c.birth_date,
          c.notes,
          t.name as team_name
        FROM children c
        LEFT JOIN teams t ON c.team_id = t.id
        ORDER BY c.name ASC
      `);

      if (children.length === 0) {
        return res.status(404).json(formatError('No hay niños registrados para exportar', 404));
      }

      // Generar CSV
      const csvContent = this.generateChildrenCSV(children);

      // Configurar headers de respuesta
      const timestamp = new Date().toISOString().slice(0, 10);
      const filename = `lista_ninos_${timestamp}.csv`;

      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Length', Buffer.byteLength(csvContent, 'utf8'));

      res.send(csvContent);

    } catch (error) {
      console.error('Error exportando CSV:', error);
      res.status(500).json(formatError('Error interno del servidor durante la exportación', 500));
    }
  }

  /**
   * Generar archivo Excel para niños
   */
  generateChildrenExcel(children, sheetTitle = 'Niños') {
    const wb = XLSX.utils.book_new();

    // Preparar datos para la hoja
    const data = children.map(child => ({
      'ID': child.id,
      'Nombre': child.name,
      'Edad': child.age || '',
      'Fecha Nacimiento': child.birth_date ? formatDate(child.birth_date) : '',
      'Equipo': child.team_name || 'Sin equipo',
      'Color Equipo': child.team_color || '',
      'Notas': child.notes || '',
      'Fecha Registro': formatDate(child.created_at),
      'Última Actualización': formatDate(child.updated_at)
    }));

    // Crear hoja de trabajo
    const ws = XLSX.utils.json_to_sheet(data);

    // Configurar ancho de columnas
    const colWidths = [
      { wch: 5 },   // ID
      { wch: 25 },  // Nombre
      { wch: 8 },   // Edad
      { wch: 15 },  // Fecha Nacimiento
      { wch: 20 },  // Equipo
      { wch: 12 },  // Color Equipo
      { wch: 30 },  // Notas
      { wch: 15 },  // Fecha Registro
      { wch: 18 }   // Última Actualización
    ];
    ws['!cols'] = colWidths;

    // Agregar hoja al workbook
    XLSX.utils.book_append_sheet(wb, ws, sheetTitle);

    // Agregar hoja de estadísticas
    const statsData = this.generateChildrenStats(children);
    const statsWs = XLSX.utils.aoa_to_sheet(statsData);
    XLSX.utils.book_append_sheet(wb, statsWs, 'Estadísticas');

    // Generar buffer
    return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
  }

  /**
   * Generar archivo Excel para equipos
   */
  generateTeamsExcel(teams) {
    const wb = XLSX.utils.book_new();

    // Preparar datos
    const data = teams.map(team => ({
      'ID': team.id,
      'Nombre': team.name,
      'Color': team.color,
      'Descripción': team.description || '',
      'Total Niños': team.total_children,
      'Edad Promedio': team.average_age || '',
      'Edad Mínima': team.min_age || '',
      'Edad Máxima': team.max_age || '',
      'Fecha Creación': formatDate(team.created_at),
      'Última Actualización': formatDate(team.updated_at)
    }));

    const ws = XLSX.utils.json_to_sheet(data);

    // Configurar ancho de columnas
    ws['!cols'] = [
      { wch: 5 },   // ID
      { wch: 20 },  // Nombre
      { wch: 10 },  // Color
      { wch: 30 },  // Descripción
      { wch: 12 },  // Total Niños
      { wch: 12 },  // Edad Promedio
      { wch: 12 },  // Edad Mínima
      { wch: 12 },  // Edad Máxima
      { wch: 15 },  // Fecha Creación
      { wch: 18 }   // Última Actualización
    ];

    XLSX.utils.book_append_sheet(wb, ws, 'Equipos');

    return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
  }

  /**
   * Generar reporte completo con múltiples hojas
   */
  generateCompleteReport(children, teams, stats) {
    const wb = XLSX.utils.book_new();

    // 1. Hoja de resumen
    const summaryData = [
      ['REPORTE COMPLETO - LISTA DE CHICOS'],
      ['Fecha de generación:', formatDate(new Date(), true)],
      [''],
      ['ESTADÍSTICAS GENERALES'],
      ['Total de niños:', stats.total_children],
      ['Total de equipos:', stats.total_teams],
      ['Edad promedio general:', stats.overall_average_age + ' años'],
      ['Niño más joven:', stats.youngest + ' años'],
      ['Niño mayor:', stats.oldest + ' años'],
      ['Niños sin equipo:', stats.children_without_team],
      [''],
      ['DISTRIBUCIÓN POR EQUIPOS']
    ];

    // Agregar distribución por equipos
    teams.forEach(team => {
      summaryData.push([
        team.name,
        `${team.total_children} niños`,
        team.average_age ? `Promedio: ${team.average_age} años` : 'Sin datos de edad'
      ]);
    });

    const summaryWs = XLSX.utils.aoa_to_sheet(summaryData);
    summaryWs['!cols'] = [{ wch: 25 }, { wch: 15 }, { wch: 20 }];
    XLSX.utils.book_append_sheet(wb, summaryWs, 'Resumen');

    // 2. Hoja de niños
    const childrenData = children.map(child => ({
      'Nombre': child.name,
      'Edad': child.age || '',
      'Equipo': child.team_name || 'Sin equipo',
      'Notas': child.notes || '',
      'Fecha Registro': formatDate(child.created_at)
    }));

    const childrenWs = XLSX.utils.json_to_sheet(childrenData);
    childrenWs['!cols'] = [{ wch: 25 }, { wch: 8 }, { wch: 20 }, { wch: 30 }, { wch: 15 }];
    XLSX.utils.book_append_sheet(wb, childrenWs, 'Niños');

    // 3. Hoja de equipos
    const teamsData = teams.map(team => ({
      'Equipo': team.name,
      'Total Niños': team.total_children,
      'Edad Promedio': team.average_age || '',
      'Descripción': team.description || '',
      'Color': team.color
    }));

    const teamsWs = XLSX.utils.json_to_sheet(teamsData);
    teamsWs['!cols'] = [{ wch: 20 }, { wch: 12 }, { wch: 12 }, { wch: 30 }, { wch: 10 }];
    XLSX.utils.book_append_sheet(wb, teamsWs, 'Equipos');

    return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
  }

  /**
   * Generar CSV para niños
   */
  generateChildrenCSV(children) {
    const headers = ['Nombre', 'Edad', 'Equipo', 'Notas', 'Fecha Registro'];
    const rows = children.map(child => [
      child.name,
      child.age || '',
      child.team_name || 'Sin equipo',
      child.notes || '',
      formatDate(child.created_at)
    ]);

    const csvData = [headers, ...rows];
    
    return csvData
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');
  }

  /**
   * Generar estadísticas para la hoja de niños
   */
  generateChildrenStats(children) {
    const totalChildren = children.length;
    const withAge = children.filter(c => c.age).length;
    const withTeam = children.filter(c => c.team_name).length;
    const withoutTeam = totalChildren - withTeam;

    const ages = children.filter(c => c.age).map(c => c.age);
    const avgAge = ages.length > 0 ? (ages.reduce((a, b) => a + b, 0) / ages.length).toFixed(1) : 'N/A';
    const minAge = ages.length > 0 ? Math.min(...ages) : 'N/A';
    const maxAge = ages.length > 0 ? Math.max(...ages) : 'N/A';

    return [
      ['ESTADÍSTICAS'],
      [''],
      ['Total de niños:', totalChildren],
      ['Con edad registrada:', withAge],
      ['Con equipo asignado:', withTeam],
      ['Sin equipo:', withoutTeam],
      [''],
      ['EDADES'],
      ['Edad promedio:', avgAge],
      ['Edad mínima:', minAge],
      ['Edad máxima:', maxAge],
      [''],
      ['Reporte generado:', formatDate(new Date(), true)]
    ];
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
      res.status(500).json(formatError('Error interno del servidor al exportar niños', 500));
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
      res.status(500).json(formatError('Error interno del servidor al exportar equipos', 500));
    }
  }
}

module.exports = new ExportController();
