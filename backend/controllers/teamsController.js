/**
 * Teams Controller
 * Maneja la lógica de negocio para las operaciones de equipos
 */

const TeamsModel = require('../models/Teams');
const ChildrenModel = require('../models/Children');

class TeamsController {
  /**
   * Obtener todos los equipos
   */
  static async getAllTeams(req, res) {
    try {
      const teams = await TeamsModel.getAll();
      res.json(teams);
    } catch (error) {
      console.error('Error al obtener equipos:', error.message);
      res.status(500).json({ 
        error: 'Error interno del servidor',
        message: 'No se pudieron obtener los datos de los equipos'
      });
    }
  }

  /**
   * Obtener todos los equipos con estadísticas
   */
  static async getAllTeamsWithStats(req, res) {
    try {
      const teams = await TeamsModel.getAllWithStats();
      res.json(teams);
    } catch (error) {
      console.error('Error al obtener equipos con estadísticas:', error.message);
      res.status(500).json({ 
        error: 'Error interno del servidor',
        message: 'No se pudieron obtener las estadísticas de los equipos'
      });
    }
  }

  /**
   * Obtener un equipo por ID
   */
  static async getTeamById(req, res) {
    try {
      const { id } = req.params;
      
      if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({ 
          error: 'ID inválido',
          message: 'El ID debe ser un número válido'
        });
      }

      const team = await TeamsModel.getById(parseInt(id));
      
      if (!team) {
        return res.status(404).json({ 
          error: 'Equipo no encontrado',
          message: `No se encontró un equipo con ID: ${id}`
        });
      }

      res.json(team);
    } catch (error) {
      console.error('Error al obtener equipo:', error.message);
      res.status(500).json({ 
        error: 'Error interno del servidor',
        message: 'No se pudo obtener la información del equipo'
      });
    }
  }

  /**
   * Crear un nuevo equipo
   */
  static async createTeam(req, res) {
    try {
      const { nombre, descripcion, color } = req.body;
      
      // Validaciones básicas
      if (!nombre) {
        return res.status(400).json({ 
          error: 'Nombre requerido',
          message: 'El nombre del equipo es obligatorio'
        });
      }

      // Validar nombre (no solo espacios)
      if (!nombre.trim()) {
        return res.status(400).json({ 
          error: 'Nombre inválido',
          message: 'El nombre del equipo no puede estar vacío'
        });
      }

      // Validar longitud del nombre
      if (nombre.trim().length < 2 || nombre.trim().length > 50) {
        return res.status(400).json({ 
          error: 'Nombre inválido',
          message: 'El nombre debe tener entre 2 y 50 caracteres'
        });
      }

      // Validar color si se proporciona
      if (color && !/^#[0-9A-F]{6}$/i.test(color)) {
        return res.status(400).json({ 
          error: 'Color inválido',
          message: 'El color debe ser un código hexadecimal válido (ej: #FF0000)'
        });
      }

      const teamData = {
        nombre: nombre.trim(),
        descripcion: descripcion?.trim() || '',
        color: color || '#3B82F6'
      };

      const newTeam = await TeamsModel.create(teamData);
      
      res.status(201).json({
        ...newTeam,
        message: 'Equipo creado exitosamente'
      });
    } catch (error) {
      console.error('Error al crear equipo:', error.message);
      
      // Error de nombre duplicado
      if (error.message.includes('UNIQUE constraint failed')) {
        return res.status(409).json({ 
          error: 'Nombre duplicado',
          message: 'Ya existe un equipo con ese nombre'
        });
      }
      
      res.status(500).json({ 
        error: 'Error interno del servidor',
        message: 'No se pudo crear el equipo'
      });
    }
  }

  /**
   * Actualizar un equipo existente
   */
  static async updateTeam(req, res) {
    try {
      const { id } = req.params;
      const { nombre, descripcion, color } = req.body;
      
      // Validar ID
      if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({ 
          error: 'ID inválido',
          message: 'El ID debe ser un número válido'
        });
      }

      // Validaciones básicas
      if (!nombre) {
        return res.status(400).json({ 
          error: 'Nombre requerido',
          message: 'El nombre del equipo es obligatorio'
        });
      }

      // Validar nombre
      if (!nombre.trim() || nombre.trim().length < 2 || nombre.trim().length > 50) {
        return res.status(400).json({ 
          error: 'Nombre inválido',
          message: 'El nombre debe tener entre 2 y 50 caracteres'
        });
      }

      // Validar color si se proporciona
      if (color && !/^#[0-9A-F]{6}$/i.test(color)) {
        return res.status(400).json({ 
          error: 'Color inválido',
          message: 'El color debe ser un código hexadecimal válido'
        });
      }

      const teamData = {
        nombre: nombre.trim(),
        descripcion: descripcion?.trim() || '',
        color: color || '#3B82F6'
      };

      const updatedTeam = await TeamsModel.update(parseInt(id), teamData);
      
      if (!updatedTeam) {
        return res.status(404).json({ 
          error: 'Equipo no encontrado',
          message: `No se encontró un equipo con ID: ${id}`
        });
      }

      res.json({
        ...updatedTeam,
        message: 'Equipo actualizado exitosamente'
      });
    } catch (error) {
      console.error('Error al actualizar equipo:', error.message);
      
      if (error.message.includes('UNIQUE constraint failed')) {
        return res.status(409).json({ 
          error: 'Nombre duplicado',
          message: 'Ya existe un equipo con ese nombre'
        });
      }
      
      res.status(500).json({ 
        error: 'Error interno del servidor',
        message: 'No se pudo actualizar el equipo'
      });
    }
  }

  /**
   * Eliminar un equipo
   */
  static async deleteTeam(req, res) {
    try {
      const { id } = req.params;
      
      // Validar ID
      if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({ 
          error: 'ID inválido',
          message: 'El ID debe ser un número válido'
        });
      }

      // No permitir eliminar el equipo por defecto
      if (parseInt(id) === 1) {
        return res.status(400).json({ 
          error: 'Operación no permitida',
          message: 'No se puede eliminar el equipo principal'
        });
      }

      const deleted = await TeamsModel.delete(parseInt(id));
      
      if (!deleted) {
        return res.status(404).json({ 
          error: 'Equipo no encontrado',
          message: `No se encontró un equipo con ID: ${id}`
        });
      }

      res.json({ 
        message: 'Equipo eliminado exitosamente',
        deletedId: parseInt(id)
      });
    } catch (error) {
      console.error('Error al eliminar equipo:', error.message);
      
      if (error.message.includes('niños asignados')) {
        return res.status(400).json({ 
          error: 'Operación no permitida',
          message: 'No se puede eliminar un equipo que tiene niños asignados. Mueve los niños a otro equipo primero.'
        });
      }
      
      res.status(500).json({ 
        error: 'Error interno del servidor',
        message: 'No se pudo eliminar el equipo'
      });
    }
  }

  /**
   * Obtener estadísticas de un equipo
   */
  static async getTeamStats(req, res) {
    try {
      const { id } = req.params;
      
      if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({ 
          error: 'ID inválido',
          message: 'El ID debe ser un número válido'
        });
      }

      const stats = await TeamsModel.getTeamStats(parseInt(id));
      
      if (!stats) {
        return res.status(404).json({ 
          error: 'Equipo no encontrado',
          message: `No se encontró un equipo con ID: ${id}`
        });
      }

      res.json(stats);
    } catch (error) {
      console.error('Error al obtener estadísticas del equipo:', error.message);
      res.status(500).json({ 
        error: 'Error interno del servidor',
        message: 'No se pudieron obtener las estadísticas del equipo'
      });
    }
  }

  /**
   * Obtener niños de un equipo específico
   */
  static async getTeamChildren(req, res) {
    try {
      const { id } = req.params;
      
      if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({ 
          error: 'ID inválido',
          message: 'El ID debe ser un número válido'
        });
      }

      // Verificar que el equipo existe
      const teamExists = await TeamsModel.exists(parseInt(id));
      if (!teamExists) {
        return res.status(404).json({ 
          error: 'Equipo no encontrado',
          message: `No se encontró un equipo con ID: ${id}`
        });
      }

      const children = await ChildrenModel.getByTeam(parseInt(id));
      res.json(children);
    } catch (error) {
      console.error('Error al obtener niños del equipo:', error.message);
      res.status(500).json({ 
        error: 'Error interno del servidor',
        message: 'No se pudieron obtener los niños del equipo'
      });
    }
  }

  /**
   * Mover niños de un equipo a otro
   */
  static async moveChildren(req, res) {
    try {
      const { fromTeamId, toTeamId } = req.body;
      
      // Validaciones
      if (!fromTeamId || !toTeamId || isNaN(parseInt(fromTeamId)) || isNaN(parseInt(toTeamId))) {
        return res.status(400).json({ 
          error: 'IDs inválidos',
          message: 'Los IDs de origen y destino deben ser números válidos'
        });
      }

      if (parseInt(fromTeamId) === parseInt(toTeamId)) {
        return res.status(400).json({ 
          error: 'Operación inválida',
          message: 'El equipo de origen y destino no pueden ser el mismo'
        });
      }

      // Verificar que ambos equipos existen
      const fromTeamExists = await TeamsModel.exists(parseInt(fromTeamId));
      const toTeamExists = await TeamsModel.exists(parseInt(toTeamId));

      if (!fromTeamExists) {
        return res.status(404).json({ 
          error: 'Equipo de origen no encontrado',
          message: `No se encontró el equipo con ID: ${fromTeamId}`
        });
      }

      if (!toTeamExists) {
        return res.status(404).json({ 
          error: 'Equipo de destino no encontrado',
          message: `No se encontró el equipo con ID: ${toTeamId}`
        });
      }

      const movedCount = await TeamsModel.moveChildren(parseInt(fromTeamId), parseInt(toTeamId));
      
      res.json({ 
        message: `Se movieron ${movedCount} niño(s) exitosamente`,
        movedCount,
        fromTeamId: parseInt(fromTeamId),
        toTeamId: parseInt(toTeamId)
      });
    } catch (error) {
      console.error('Error al mover niños:', error.message);
      res.status(500).json({ 
        error: 'Error interno del servidor',
        message: 'No se pudieron mover los niños'
      });
    }
  }
}

module.exports = TeamsController;
