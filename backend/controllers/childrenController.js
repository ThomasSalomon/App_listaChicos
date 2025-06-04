/**
 * Children Controller
 * Maneja la lógica de negocio para las operaciones de niños
 */

const ChildrenModel = require('../models/Children');

class ChildrenController {
  /**
   * Obtener todos los niños
   */
  static async getAllChildren(req, res) {
    try {
      const children = await ChildrenModel.getAll();
      res.json(children);
    } catch (error) {
      console.error('Error al obtener niños:', error.message);
      res.status(500).json({ 
        error: 'Error interno del servidor',
        message: 'No se pudieron obtener los datos de los niños'
      });
    }
  }

  /**
   * Obtener un niño por ID
   */
  static async getChildById(req, res) {
    try {
      const { id } = req.params;
      
      // Validar que el ID sea un número válido
      if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({ 
          error: 'ID inválido',
          message: 'El ID debe ser un número válido'
        });
      }

      const child = await ChildrenModel.getById(parseInt(id));
      
      if (!child) {
        return res.status(404).json({ 
          error: 'Niño no encontrado',
          message: `No se encontró un niño con ID: ${id}`
        });
      }

      res.json(child);
    } catch (error) {
      console.error('Error al obtener niño:', error.message);
      res.status(500).json({ 
        error: 'Error interno del servidor',
        message: 'No se pudo obtener la información del niño'
      });
    }
  }
  /**
   * Crear un nuevo niño
   */
  static async createChild(req, res) {
    try {
      const { nombre, apellido, edad, team_id } = req.body;
      
      // Validaciones básicas
      if (!nombre || !apellido || edad === undefined || edad === null) {
        return res.status(400).json({ 
          error: 'Campos requeridos faltantes',
          message: 'Los campos nombre, apellido y edad son obligatorios'
        });
      }

      // Validar edad
      const edadNum = parseInt(edad);
      if (isNaN(edadNum) || edadNum < 1 || edadNum > 18) {
        return res.status(400).json({ 
          error: 'Edad inválida',
          message: 'La edad debe ser un número entre 1 y 18 años'
        });
      }

      // Validar nombres (no solo espacios)
      if (!nombre.trim() || !apellido.trim()) {
        return res.status(400).json({ 
          error: 'Nombres inválidos',
          message: 'El nombre y apellido no pueden estar vacíos'
        });
      }

      // Validar team_id si se proporciona
      const teamId = team_id ? parseInt(team_id) : 1; // Default al equipo principal
      if (isNaN(teamId) || teamId < 1) {
        return res.status(400).json({ 
          error: 'Team ID inválido',
          message: 'El team_id debe ser un número válido mayor a 0'
        });
      }

      const childData = {
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        edad: edadNum,
        team_id: teamId
      };

      const newChild = await ChildrenModel.create(childData);
      
      res.status(201).json({
        ...newChild,
        message: 'Niño agregado exitosamente'
      });
    } catch (error) {
      console.error('Error al crear niño:', error.message);
      res.status(500).json({ 
        error: 'Error interno del servidor',
        message: 'No se pudo guardar la información del niño'
      });
    }
  }

  /**
   * Actualizar un niño existente
   */
  static async updateChild(req, res) {
    try {
      const { id } = req.params;
      const { nombre, apellido, edad } = req.body;
      
      // Validar ID
      if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({ 
          error: 'ID inválido',
          message: 'El ID debe ser un número válido'
        });
      }

      // Validaciones básicas
      if (!nombre || !apellido || edad === undefined || edad === null) {
        return res.status(400).json({ 
          error: 'Campos requeridos faltantes',
          message: 'Los campos nombre, apellido y edad son obligatorios'
        });
      }

      // Validar edad
      const edadNum = parseInt(edad);
      if (isNaN(edadNum) || edadNum < 1 || edadNum > 18) {
        return res.status(400).json({ 
          error: 'Edad inválida',
          message: 'La edad debe ser un número entre 1 y 18 años'
        });
      }

      // Validar nombres
      if (!nombre.trim() || !apellido.trim()) {
        return res.status(400).json({ 
          error: 'Nombres inválidos',
          message: 'El nombre y apellido no pueden estar vacíos'
        });
      }

      const childData = {
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        edad: edadNum
      };

      const updatedChild = await ChildrenModel.update(parseInt(id), childData);
      
      if (!updatedChild) {
        return res.status(404).json({ 
          error: 'Niño no encontrado',
          message: `No se encontró un niño con ID: ${id}`
        });
      }

      res.json({
        ...updatedChild,
        message: 'Niño actualizado exitosamente'
      });
    } catch (error) {
      console.error('Error al actualizar niño:', error.message);
      res.status(500).json({ 
        error: 'Error interno del servidor',
        message: 'No se pudo actualizar la información del niño'
      });
    }
  }

  /**
   * Eliminar un niño
   */
  static async deleteChild(req, res) {
    try {
      const { id } = req.params;
      
      // Validar ID
      if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({ 
          error: 'ID inválido',
          message: 'El ID debe ser un número válido'
        });
      }

      const deleted = await ChildrenModel.delete(parseInt(id));
      
      if (!deleted) {
        return res.status(404).json({ 
          error: 'Niño no encontrado',
          message: `No se encontró un niño con ID: ${id}`
        });
      }

      res.json({ 
        message: 'Niño eliminado exitosamente',
        deletedId: parseInt(id)
      });
    } catch (error) {
      console.error('Error al eliminar niño:', error.message);
      res.status(500).json({ 
        error: 'Error interno del servidor',
        message: 'No se pudo eliminar el niño'
      });
    }
  }

  /**
   * Eliminar todos los niños
   */
  static async deleteAllChildren(req, res) {
    try {
      const deletedCount = await ChildrenModel.deleteAll();
      
      res.json({ 
        message: `Se eliminaron ${deletedCount} niño(s) exitosamente`,
        deletedCount
      });
    } catch (error) {
      console.error('Error al eliminar todos los niños:', error.message);
      res.status(500).json({ 
        error: 'Error interno del servidor',
        message: 'No se pudieron eliminar los niños'
      });
    }
  }

  /**
   * Obtener estadísticas de los niños
   */
  static async getStats(req, res) {
    try {
      const stats = await ChildrenModel.getStats();
      res.json(stats);
    } catch (error) {
      console.error('Error al obtener estadísticas:', error.message);
      res.status(500).json({ 
        error: 'Error interno del servidor',
        message: 'No se pudieron obtener las estadísticas'
      });
    }
  }

  /**
   * Health check del controlador
   */
  static healthCheck(req, res) {
    res.json({ 
      status: 'OK', 
      controller: 'ChildrenController',
      message: 'Controlador funcionando correctamente',
      timestamp: new Date().toISOString()
    });
  }
}

module.exports = ChildrenController;
