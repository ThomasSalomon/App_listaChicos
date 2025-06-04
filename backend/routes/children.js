/**
 * Children Routes
 * Define todas las rutas relacionadas con niños
 */

const express = require('express');
const ChildrenController = require('../controllers/childrenController');
const { validateChild, validateId } = require('../middleware/validation');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

/**
 * GET /api/children
 * Obtiene todos los niños registrados
 */
router.get('/', asyncHandler(ChildrenController.getAllChildren));

/**
 * GET /api/children/stats
 * Obtiene estadísticas de los niños
 */
router.get('/stats', asyncHandler(ChildrenController.getStats));

/**
 * GET /api/children/:id
 * Obtiene un niño específico por su ID
 */
router.get('/:id', validateId, asyncHandler(ChildrenController.getChildById));

/**
 * POST /api/children
 * Crea un nuevo registro de niño
 */
router.post('/', validateChild, asyncHandler(ChildrenController.createChild));

/**
 * PUT /api/children/:id
 * Actualiza un niño existente
 */
router.put('/:id', validateId, validateChild, asyncHandler(ChildrenController.updateChild));

/**
 * DELETE /api/children/:id
 * Elimina un niño específico
 */
router.delete('/:id', validateId, asyncHandler(ChildrenController.deleteChild));

/**
 * DELETE /api/children
 * Elimina todos los niños (usar con precaución)
 */
router.delete('/', asyncHandler(ChildrenController.deleteAllChildren));

/**
 * GET /api/children/health/check
 * Health check específico para las rutas de niños
 */
router.get('/health/check', ChildrenController.healthCheck);

module.exports = router;
