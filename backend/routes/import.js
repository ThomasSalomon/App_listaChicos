/**
 * Import Routes
 * Rutas para importación y exportación de datos
 * 
 * @author Tommy
 * @version 1.0.0
 */

const express = require('express');
const multer = require('multer');
const router = express.Router();

// Controladores
const importController = require('../controllers/importController');
const exportController = require('../controllers/exportController');

// Configurar multer para upload de archivos
const upload = multer({
  storage: multer.memoryStorage(), // Almacenar en memoria
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB máximo
    files: 1 // Solo un archivo a la vez
  },
  fileFilter: (req, file, cb) => {
    // Aceptar solo archivos Excel y CSV
    const allowedMimes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
      'text/csv', // .csv
      'application/csv'
    ];
    
    const allowedExtensions = ['.xlsx', '.xls', '.csv'];
    const fileExtension = file.originalname.toLowerCase().substring(file.originalname.lastIndexOf('.'));
    
    if (allowedMimes.includes(file.mimetype) || allowedExtensions.includes(fileExtension)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de archivo no permitido. Solo se aceptan archivos .xlsx, .xls o .csv'), false);
    }
  }
});

// Middleware para manejo de errores de multer
const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'El archivo es demasiado grande. Máximo 10MB permitido.',
        code: 'FILE_TOO_LARGE'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        error: 'Solo se permite subir un archivo a la vez.',
        code: 'TOO_MANY_FILES'
      });
    }
  }
  
  if (error.message.includes('Tipo de archivo no permitido')) {
    return res.status(400).json({
      success: false,
      error: error.message,
      code: 'INVALID_FILE_TYPE'
    });
  }
  
  next(error);
};

/**
 * @route POST /api/import/children
 * @desc Importar niños desde archivo Excel/CSV
 * @access Public
 */
router.post('/children', 
  upload.single('file'), 
  handleUploadError,
  importController.importChildren
);

/**
 * @route POST /api/import/teams
 * @desc Importar equipos desde archivo Excel/CSV
 * @access Public
 */
router.post('/teams', 
  upload.single('file'), 
  handleUploadError,
  importController.importTeams
);

/**
 * @route GET /api/import/templates/children
 * @desc Descargar template para importar niños
 * @access Public
 */
router.get('/templates/children', importController.getChildrenTemplate);

/**
 * @route GET /api/import/templates/teams
 * @desc Descargar template para importar equipos
 * @access Public
 */
router.get('/templates/teams', importController.getTeamsTemplate);

/**
 * @route GET /api/import/info
 * @desc Información sobre los formatos de importación soportados
 * @access Public
 */
router.get('/info', (req, res) => {
  res.json({
    success: true,
    data: {
      supportedFormats: [
        {
          format: 'Excel (.xlsx)',
          description: 'Archivo Excel moderno',
          recommended: true
        },
        {
          format: 'Excel (.xls)',
          description: 'Archivo Excel legacy',
          recommended: false
        },
        {
          format: 'CSV (.csv)',
          description: 'Valores separados por comas',
          recommended: true
        }
      ],
      maxFileSize: '10MB',
      childrenColumns: [
        { name: 'Nombre', required: true, description: 'Nombre del niño' },
        { name: 'Edad', required: false, description: 'Edad en años (número)' },
        { name: 'Equipo', required: false, description: 'Nombre del equipo' },
        { name: 'Notas', required: false, description: 'Observaciones adicionales' }
      ],
      teamsColumns: [
        { name: 'Nombre', required: true, description: 'Nombre del equipo' },
        { name: 'Color', required: false, description: 'Color en formato hex (#RRGGBB)' },
        { name: 'Descripción', required: false, description: 'Descripción del equipo' }
      ],
      tips: [
        'La primera fila debe contener los nombres de las columnas',
        'Los nombres de columnas pueden estar en español o inglés',
        'Los duplicados serán reportados pero no importados',
        'Los errores serán detallados en la respuesta'
      ]
    },
    message: 'Información de importación',
    timestamp: new Date().toISOString()
  });
});

// ==================== RUTAS DE EXPORTACIÓN ====================

/**
 * @route GET /api/import/export/children
 * @desc Exportar niños a Excel
 * @access Public
 * @query format - Formato de exportación: 'excel' o 'csv' (default: excel)
 * @query teamId - ID del equipo para filtrar (opcional)
 */
router.get('/export/children', exportController.exportChildren);

/**
 * @route GET /api/import/export/teams
 * @desc Exportar equipos a Excel
 * @access Public
 * @query format - Formato de exportación: 'excel' o 'csv' (default: excel)
 * @query includeChildren - Incluir niños en cada equipo: 'true' o 'false' (default: false)
 */
router.get('/export/teams', exportController.exportTeams);

/**
 * @route GET /api/import/export/report
 * @desc Exportar reporte completo (niños y equipos) a Excel
 * @access Public
 * @query format - Formato de exportación: 'excel' o 'csv' (default: excel)
 */
router.get('/export/report', exportController.exportCompleteReport);

/**
 * @route GET /api/import/export/info
 * @desc Información sobre las opciones de exportación disponibles
 * @access Public
 */
router.get('/export/info', (req, res) => {
  res.json({
    success: true,
    data: {
      exportOptions: [
        {
          endpoint: '/api/import/export/children',
          description: 'Exportar lista de niños',
          formats: ['excel', 'csv'],
          filters: ['teamId'],
          defaultFormat: 'excel'
        },
        {
          endpoint: '/api/import/export/teams',
          description: 'Exportar lista de equipos',
          formats: ['excel', 'csv'],
          options: ['includeChildren'],
          defaultFormat: 'excel'
        },
        {
          endpoint: '/api/import/export/report',
          description: 'Exportar reporte completo',
          formats: ['excel', 'csv'],
          content: ['equipos', 'niños', 'estadísticas'],
          defaultFormat: 'excel'
        }
      ],
      supportedFormats: [
        {
          format: 'excel',
          extension: '.xlsx',
          description: 'Archivo Excel con formato avanzado',
          features: ['múltiples hojas', 'estilos', 'estadísticas'],
          recommended: true
        },
        {
          format: 'csv',
          extension: '.csv',
          description: 'Valores separados por comas',
          features: ['compatible con cualquier aplicación'],
          recommended: false,
          note: 'Solo exporta la primera hoja en reportes multi-hoja'
        }
      ],
      queryParameters: {
        format: {
          type: 'string',
          values: ['excel', 'csv'],
          default: 'excel',
          description: 'Formato del archivo de exportación'
        },
        teamId: {
          type: 'number',
          description: 'ID del equipo para filtrar niños (solo en /children)',
          example: '?teamId=1'
        },
        includeChildren: {
          type: 'boolean',
          values: ['true', 'false'],
          default: 'false',
          description: 'Incluir lista de niños en exportación de equipos'
        }
      },
      examples: [
        '/api/import/export/children?format=excel',
        '/api/import/export/children?format=csv&teamId=1',
        '/api/import/export/teams?includeChildren=true',
        '/api/import/export/report?format=excel'
      ]
    },
    message: 'Información de exportación',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
