/**
 * Rutas para gestión de equipos
 * @author Tommy
 * @version 1.0.0
 */

const express = require('express');
const router = express.Router();
const teamsController = require('../controllers/teamsController');
const { validateTeam, validateTeamId, validateMoveChildren } = require('../middleware/validation');

/**
 * @route GET /api/teams
 * @desc Obtener todos los equipos
 * @access Public
 */
router.get('/', teamsController.getAllTeams);

/**
 * @route GET /api/teams/:id
 * @desc Obtener un equipo por ID
 * @access Public
 */
router.get('/:id', validateTeamId, teamsController.getTeamById);

/**
 * @route GET /api/teams/:id/children
 * @desc Obtener los niños de un equipo específico
 * @access Public
 */
router.get('/:id/children', validateTeamId, teamsController.getTeamChildren);

/**
 * @route GET /api/teams/:id/stats
 * @desc Obtener estadísticas de un equipo
 * @access Public
 */
router.get('/:id/stats', validateTeamId, teamsController.getTeamStats);

/**
 * @route POST /api/teams
 * @desc Crear un nuevo equipo
 * @access Public
 */
router.post('/', validateTeam, teamsController.createTeam);

/**
 * @route PUT /api/teams/:id
 * @desc Actualizar un equipo
 * @access Public
 */
router.put('/:id', validateTeamId, validateTeam, teamsController.updateTeam);

/**
 * @route DELETE /api/teams/:id
 * @desc Eliminar un equipo
 * @access Public
 */
router.delete('/:id', validateTeamId, teamsController.deleteTeam);

/**
 * @route POST /api/teams/:id/move-children
 * @desc Mover niños de un equipo a otro
 * @access Public
 */
router.post('/:id/move-children', validateTeamId, validateMoveChildren, teamsController.moveChildren);

module.exports = router;
