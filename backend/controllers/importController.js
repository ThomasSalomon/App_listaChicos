/**
 * Import Controller
 * Controlador para importación de datos desde archivos Excel/CSV
 * 
 * @author Tommy
 * @version 1.0.0
 */

const XLSX = require('xlsx');
const database = require('../config/database');
const { successResponse, errorResponse } = require('../utils/response');

class ImportController {
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
   * Función auxiliar para ejecutar inserción/actualización
   */
  async executeRun(sql, params = []) {
    return new Promise((resolve, reject) => {
      database.getDB().run(sql, params, function(err) {
        if (err) reject(err);
        else resolve({ lastID: this.lastID, changes: this.changes });
      });
    });
  }

  /**
   * Importar niños desde archivo Excel/CSV
   */
  async importChildren(req, res) {
    try {
      if (!req.file) {
        return this.sendError(res, 'No se subió ningún archivo', 400);
      }

      // Leer archivo Excel/CSV
      const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0]; // Primera hoja
      const worksheet = workbook.Sheets[sheetName];
      
      // Convertir a JSON
      const rawData = XLSX.utils.sheet_to_json(worksheet, { 
        header: 1, // Usar números como headers
        defval: '' // Valor por defecto para celdas vacías
      });

      if (rawData.length < 2) {
        return this.sendError(res, 'El archivo debe tener al menos una fila de datos además del encabezado', 400);
      }

      // Primera fila son los headers
      const headers = rawData[0];
      const dataRows = rawData.slice(1);

      // Mapear headers (flexible para diferentes formatos)
      const headerMap = this.mapHeaders(headers);
      
      if (!headerMap.name) {
        return this.sendError(res, 'No se encontró una columna de nombre válida. Columnas esperadas: nombre, name, niño, child', 400);
      }

      // Procesar datos
      const results = {
        success: [],
        errors: [],
        duplicates: [],
        total: dataRows.length
      };

      for (let i = 0; i < dataRows.length; i++) {
        const row = dataRows[i];
        const rowNumber = i + 2; // +2 porque empezamos en 1 y saltamos header

        try {
          const childData = this.extractChildData(row, headerMap);
          
          if (!childData.name || childData.name.trim() === '') {
            results.errors.push({
              row: rowNumber,
              error: 'Nombre requerido',
              data: row
            });
            continue;
          }

          // Validar datos
          const validation = validateChild(childData);
          if (!validation.isValid) {
            results.errors.push({
              row: rowNumber,
              error: validation.errors.join(', '),
              data: childData
            });
            continue;
          }

          // Verificar duplicados en la DB
          const existingChild = await this.executeGet(
            'SELECT id FROM children WHERE LOWER(TRIM(nombre)) = LOWER(TRIM(?))',
            [childData.name]
          );

          if (existingChild) {
            results.duplicates.push({
              row: rowNumber,
              name: childData.name,
              existingId: existingChild.id
            });
            continue;
          }

          // Insertar en la base de datos
          const result = await this.executeRun(
            `INSERT INTO children (nombre, edad, team_id, notas, created_at, updated_at) 
             VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))`,
            [
              childData.name.trim(),
              childData.age || null,
              childData.team_id || null,
              childData.notes || ''
            ]
          );

          results.success.push({
            row: rowNumber,
            id: result.lastID,
            name: childData.name,
            data: childData
          });

        } catch (error) {
          results.errors.push({
            row: rowNumber,
            error: error.message,
            data: row
          });
        }
      }

      // Respuesta detallada
      const response = {
        message: `Importación completada: ${results.success.length} exitosos, ${results.errors.length} errores, ${results.duplicates.length} duplicados`,
        summary: {
          total: results.total,
          imported: results.success.length,
          errors: results.errors.length,
          duplicates: results.duplicates.length
        },
        details: results,
        timestamp: new Date().toISOString()
      };

      res.json(formatResponse(response, 'Importación de niños completada'));

    } catch (error) {
      console.error('Error en importación de niños:', error);
      return this.sendError(res, 'Error interno del servidor durante la importación', 500);
    }
  }

  /**
   * Importar equipos desde archivo Excel/CSV
   */
  async importTeams(req, res) {
    try {
      if (!req.file) {
        return this.sendError(res, 'No se subió ningún archivo', 400);
      }

      const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      const rawData = XLSX.utils.sheet_to_json(worksheet, { 
        header: 1,
        defval: ''
      });

      if (rawData.length < 2) {
        return this.sendError(res, 'El archivo debe tener al menos una fila de datos además del encabezado', 400);
      }

      const headers = rawData[0];
      const dataRows = rawData.slice(1);

      const headerMap = this.mapTeamHeaders(headers);
      
      if (!headerMap.name) {
        return this.sendError(res, 'No se encontró una columna de nombre válida para equipos', 400);
      }

      const results = {
        success: [],
        errors: [],
        duplicates: [],
        total: dataRows.length
      };

      for (let i = 0; i < dataRows.length; i++) {
        const row = dataRows[i];
        const rowNumber = i + 2;

        try {
          const teamData = this.extractTeamData(row, headerMap);
          
          if (!teamData.name || teamData.name.trim() === '') {
            results.errors.push({
              row: rowNumber,
              error: 'Nombre de equipo requerido',
              data: row
            });
            continue;
          }

          const validation = validateTeam(teamData);
          if (!validation.isValid) {
            results.errors.push({
              row: rowNumber,
              error: validation.errors.join(', '),
              data: teamData
            });
            continue;
          }

          const existingTeam = await this.executeGet(
            'SELECT id FROM teams WHERE LOWER(TRIM(nombre)) = LOWER(TRIM(?))',
            [teamData.name]
          );

          if (existingTeam) {
            results.duplicates.push({
              row: rowNumber,
              name: teamData.name,
              existingId: existingTeam.id
            });
            continue;
          }

          const result = await this.executeRun(
            `INSERT INTO teams (nombre, color, descripcion, created_at, updated_at) 
             VALUES (?, ?, ?, datetime('now'), datetime('now'))`,
            [
              teamData.name.trim(),
              teamData.color || '#3b82f6',
              teamData.description || ''
            ]
          );

          results.success.push({
            row: rowNumber,
            id: result.lastID,
            name: teamData.name,
            data: teamData
          });

        } catch (error) {
          results.errors.push({
            row: rowNumber,
            error: error.message,
            data: row
          });
        }
      }

      const response = {
        message: `Importación de equipos completada: ${results.success.length} exitosos, ${results.errors.length} errores, ${results.duplicates.length} duplicados`,
        summary: {
          total: results.total,
          imported: results.success.length,
          errors: results.errors.length,
          duplicates: results.duplicates.length
        },
        details: results,
        timestamp: new Date().toISOString()
      };

      res.json(formatResponse(response, 'Importación de equipos completada'));

    } catch (error) {
      console.error('Error en importación de equipos:', error);
      return this.sendError(res, 'Error interno del servidor durante la importación', 500);
    }
  }

  /**
   * Mapear headers de columnas para niños (flexible)
   */
  mapHeaders(headers) {
    const map = {};
    
    headers.forEach((header, index) => {
      const h = header.toString().toLowerCase().trim();
      
      // Nombre
      if (['nombre', 'name', 'niño', 'child', 'participante'].includes(h)) {
        map.name = index;
      }
      // Edad
      else if (['edad', 'age', 'años', 'years'].includes(h)) {
        map.age = index;
      }
      // Equipo
      else if (['equipo', 'team', 'grupo', 'group'].includes(h)) {
        map.team = index;
      }
      // Notas
      else if (['notas', 'notes', 'comentarios', 'comments', 'observaciones'].includes(h)) {
        map.notes = index;
      }
    });
    
    return map;
  }

  /**
   * Mapear headers para equipos
   */
  mapTeamHeaders(headers) {
    const map = {};
    
    headers.forEach((header, index) => {
      const h = header.toString().toLowerCase().trim();
      
      if (['nombre', 'name', 'equipo', 'team'].includes(h)) {
        map.name = index;
      }
      else if (['color', 'colour'].includes(h)) {
        map.color = index;
      }
      else if (['descripcion', 'description', 'desc', 'notas', 'notes'].includes(h)) {
        map.description = index;
      }
    });
    
    return map;
  }

  /**
   * Extraer datos de niño de una fila
   */
  extractChildData(row, headerMap) {
    const data = {
      name: row[headerMap.name] || '',
      age: null,
      team_id: null,
      notes: row[headerMap.notes] || ''
    };

    // Procesar edad
    if (headerMap.age !== undefined && row[headerMap.age]) {
      const age = parseInt(row[headerMap.age]);
      if (!isNaN(age) && age > 0 && age < 150) {
        data.age = age;
      }
    }

    // Procesar equipo (por ahora solo guardamos el nombre, después lo resolveremos)
    if (headerMap.team !== undefined && row[headerMap.team]) {
      data.team_name = row[headerMap.team].toString().trim();
    }

    return data;
  }

  /**
   * Extraer datos de equipo de una fila
   */
  extractTeamData(row, headerMap) {
    const data = {
      name: row[headerMap.name] || '',
      color: '#3b82f6',
      description: row[headerMap.description] || ''
    };

    // Procesar color
    if (headerMap.color !== undefined && row[headerMap.color]) {
      const color = row[headerMap.color].toString().trim();
      // Validar que sea un color válido (hex)
      if (/^#[0-9A-F]{6}$/i.test(color)) {
        data.color = color;
      }
    }

    return data;
  }

  /**
   * Obtener template de importación para niños
   */
  async getChildrenTemplate(req, res) {
    try {
      // Crear workbook con template
      const wb = XLSX.utils.book_new();
      
      // Headers del template
      const headers = [
        'Nombre',
        'Edad', 
        'Equipo',
        'Notas'
      ];

      // Datos de ejemplo
      const exampleData = [
        ['Juan Pérez', 12, 'Equipo Rojo', 'Ejemplo de niño'],
        ['María García', 11, 'Equipo Azul', ''],
        ['Carlos López', 13, '', 'Sin equipo asignado']
      ];

      const wsData = [headers, ...exampleData];
      const ws = XLSX.utils.aoa_to_sheet(wsData);

      // Agregar hoja al workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Niños');

      // Generar buffer
      const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

      // Configurar headers de respuesta
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename="template_ninos.xlsx"');

      res.send(buffer);

    } catch (error) {
      console.error('Error generando template:', error);
      return this.sendError(res, 'Error generando template', 500);
    }
  }

  /**
   * Obtener template de importación para equipos
   */
  async getTeamsTemplate(req, res) {
    try {
      const wb = XLSX.utils.book_new();
      
      const headers = [
        'Nombre',
        'Color',
        'Descripción'
      ];

      const exampleData = [
        ['Equipo Rojo', '#ef4444', 'Equipo de los rojos'],
        ['Equipo Azul', '#3b82f6', 'Equipo de los azules'],
        ['Equipo Verde', '#10b981', 'Equipo de los verdes']
      ];

      const wsData = [headers, ...exampleData];
      const ws = XLSX.utils.aoa_to_sheet(wsData);

      XLSX.utils.book_append_sheet(wb, ws, 'Equipos');

      const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename="template_equipos.xlsx"');

      res.send(buffer);

    } catch (error) {
      console.error('Error generando template:', error);
      return this.sendError(res, 'Error generando template', 500);
    }
  }
}

module.exports = new ImportController();
