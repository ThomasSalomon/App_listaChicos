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
  }  /**
   * Crear un nuevo niño
   */  static async createChild(req, res) {
    try {
      const { nombre, apellido, fecha_nacimiento, estado_fisico, condicion_pago, team_id } = req.body;
      
      // Validaciones básicas
      if (!nombre || !apellido || !fecha_nacimiento) {
        return res.status(400).json({ 
          error: 'Campos requeridos faltantes',
          message: 'Los campos nombre, apellido y fecha de nacimiento son obligatorios'
        });
      }

      // Validar fecha de nacimiento
      const birthDate = new Date(fecha_nacimiento);
      if (isNaN(birthDate.getTime())) {
        return res.status(400).json({ 
          error: 'Fecha de nacimiento inválida',
          message: 'La fecha de nacimiento debe ser una fecha válida'
        });
      }

      // Validar que no sea fecha futura
      const today = new Date();
      if (birthDate > today) {
        return res.status(400).json({ 
          error: 'Fecha de nacimiento inválida',
          message: 'La fecha de nacimiento no puede ser futura'
        });
      }

      // Validar nombres (no solo espacios)
      if (!nombre.trim() || !apellido.trim()) {
        return res.status(400).json({ 
          error: 'Nombres inválidos',
          message: 'El nombre y apellido no pueden estar vacíos'
        });
      }// Validar team_id - debe ser proporcionado
      if (!team_id) {
        return res.status(400).json({ 
          error: 'Team ID requerido',
          message: 'Debe especificar un equipo válido'
        });
      }

      const teamId = parseInt(team_id);
      if (isNaN(teamId) || teamId < 1) {
        return res.status(400).json({ 
          error: 'Team ID inválido',
          message: 'El team_id debe ser un número válido mayor a 0'
        });      }      // Validar valores de los nuevos campos
      if (estado_fisico && !['En forma', 'Lesionado'].includes(estado_fisico)) {
        return res.status(400).json({ 
          error: 'Estado físico inválido',
          message: 'El estado físico debe ser "En forma" o "Lesionado"'
        });
      }

      if (condicion_pago && !['Al dia', 'En deuda'].includes(condicion_pago)) {
        return res.status(400).json({ 
          error: 'Condición de pago inválida',
          message: 'La condición de pago debe ser "Al dia" o "En deuda"'
        });
      }

      const childData = {
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        fecha_nacimiento: fecha_nacimiento,
        estado_fisico: estado_fisico || 'En forma',
        condicion_pago: condicion_pago || 'Al dia',
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
   */  static async updateChild(req, res) {
    try {
      const { id } = req.params;
      const { nombre, apellido, fecha_nacimiento, estado_fisico, condicion_pago, team_id } = req.body;
      
      // Validar ID
      if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({ 
          error: 'ID inválido',
          message: 'El ID debe ser un número válido'
        });
      }

      // Validaciones básicas
      if (!nombre || !apellido || !fecha_nacimiento) {
        return res.status(400).json({ 
          error: 'Campos requeridos faltantes',
          message: 'Los campos nombre, apellido y fecha de nacimiento son obligatorios'
        });
      }

      // Validar fecha de nacimiento
      const birthDate = new Date(fecha_nacimiento);
      if (isNaN(birthDate.getTime())) {
        return res.status(400).json({ 
          error: 'Fecha de nacimiento inválida',
          message: 'La fecha de nacimiento debe ser una fecha válida'
        });
      }

      // Validar que no sea fecha futura
      const today = new Date();
      if (birthDate > today) {
        return res.status(400).json({ 
          error: 'Fecha de nacimiento inválida',
          message: 'La fecha de nacimiento no puede ser futura'
        });
      }      // Validar nombres
      if (!nombre.trim() || !apellido.trim()) {
        return res.status(400).json({ 
          error: 'Nombres inválidos',
          message: 'El nombre y apellido no pueden estar vacíos'
        });
      }

      // Validar team_id si se proporciona
      if (team_id && (isNaN(parseInt(team_id)) || parseInt(team_id) <= 0)) {
        return res.status(400).json({ 
          error: 'Team ID inválido',
          message: 'El ID del equipo debe ser un número válido mayor a 0'
        });
      }

      // Validar valores de los nuevos campos
      if (estado_fisico && !['En forma', 'Lesionado'].includes(estado_fisico)) {
        return res.status(400).json({ 
          error: 'Estado físico inválido',
          message: 'El estado físico debe ser "En forma" o "Lesionado"'
        });
      }

      if (condicion_pago && !['Al dia', 'En deuda'].includes(condicion_pago)) {
        return res.status(400).json({ 
          error: 'Condición de pago inválida',
          message: 'La condición de pago debe ser "Al dia" o "En deuda"'
        });
      }

      const childData = {
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        fecha_nacimiento: fecha_nacimiento,
        estado_fisico: estado_fisico || 'En forma',
        condicion_pago: condicion_pago || 'Al dia',
        team_id: team_id ? parseInt(team_id) : undefined
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
