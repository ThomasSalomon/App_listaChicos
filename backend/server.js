/**
 * Lista de Chicos - API Server
 * Servidor Express con arquitectura modular para gestión de niños
 * 
 * @author Tommy
 * @version 1.0.0
 */

const express = require('express');
const cors = require('cors');
const path = require('path');

// Configuración de la aplicación
const config = require('./config/app');
const Database = require('./config/database');

// Middleware
const { corsOptions, securityHeaders, corsLogger } = require('./middleware/cors');
const { errorHandler, notFound, requestLogger, rateLimiter } = require('./middleware/errorHandler');
const { sanitizeStrings } = require('./middleware/validation');

// Rutas
const childrenRoutes = require('./routes/children');
const teamsRoutes = require('./routes/teams');

// Utilidades
const { formatDuration } = require('./utils/helpers');

class Server {
  constructor() {
    this.app = express();
    this.port = config.server.port;
    this.startTime = Date.now();
    
    this.initializeDatabase();
    this.initializeMiddleware();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  /**
   * Inicializa la conexión a la base de datos
   */
  async initializeDatabase() {
    try {
      await Database.initialize();
      console.log('✅ Base de datos inicializada correctamente');
    } catch (error) {
      console.error('❌ Error al inicializar la base de datos:', error.message);
      process.exit(1);
    }
  }

  /**
   * Configura todos los middleware de la aplicación
   */
  initializeMiddleware() {
    // Rate limiting
    if (config.server.env === 'production') {
      this.app.use(rateLimiter());
    }

    // Logging de requests
    if (config.logging.enabled) {
      this.app.use(requestLogger);
    }

    // CORS
    this.app.use(corsLogger);
    this.app.use(cors(corsOptions));

    // Headers de seguridad
    this.app.use(securityHeaders);    // Parsing de JSON con codificación UTF-8
    this.app.use(express.json({ 
      limit: '10mb',
      strict: true,
      verify: (req, res, buf, encoding) => {
        // Asegurar que el buffer sea interpretado como UTF-8
        if (buf && buf.length) {
          req.rawBody = buf.toString('utf8');
        }
      }
    }));

    // Parsing de URL encoded con UTF-8
    this.app.use(express.urlencoded({ 
      extended: true, 
      limit: '10mb',
      verify: (req, res, buf, encoding) => {
        // Asegurar que el buffer sea interpretado como UTF-8
        if (buf && buf.length) {
          req.rawBody = buf.toString('utf8');
        }
      }
    }));

    // Sanitización de strings
    this.app.use(sanitizeStrings);

    // Archivos estáticos (si están habilitados)
    if (config.static.enabled) {
      this.app.use('/static', express.static(config.static.path, {
        maxAge: config.static.maxAge,
        etag: true,
        lastModified: true
      }));
    }
  }

  /**
   * Configura todas las rutas de la aplicación
   */
  initializeRoutes() {
    // Ruta de health check principal
    this.app.get('/api/health', this.healthCheck.bind(this));
    
    // Información del servidor
    this.app.get('/api/info', this.serverInfo.bind(this));    // Rutas de niños
    this.app.use('/api/children', childrenRoutes);

    // Rutas de equipos
    this.app.use('/api/teams', teamsRoutes);

    // Ruta raíz
    this.app.get('/', (req, res) => {
      res.json({
        message: 'Lista de Chicos API',
        version: config.api.version,
        status: 'OK',
        uptime: formatDuration(Date.now() - this.startTime),        endpoints: {
          health: '/api/health',
          info: '/api/info',
          children: '/api/children',
          teams: '/api/teams',
          docs: '/api/docs'
        }
      });
    });
  }

  /**
   * Configura el manejo de errores
   */
  initializeErrorHandling() {
    // Ruta no encontrada
    this.app.use(notFound);
    
    // Manejo de errores global
    this.app.use(errorHandler);
  }

  /**
   * Health check del servidor
   */
  healthCheck(req, res) {
    const uptime = Date.now() - this.startTime;
    
    res.json({
      status: 'OK',
      message: 'Servidor funcionando correctamente',
      timestamp: new Date().toISOString(),
      uptime: formatDuration(uptime),
      environment: config.server.env,
      version: config.api.version,
      database: {
        connected: Database.isConnected(),
        path: config.database.path
      },
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024)
      }
    });
  }

  /**
   * Información detallada del servidor
   */
  serverInfo(req, res) {
    res.json({
      server: {
        name: 'Lista de Chicos API',
        version: config.api.version,
        environment: config.server.env,
        uptime: formatDuration(Date.now() - this.startTime),
        startTime: new Date(this.startTime).toISOString()
      },
      api: {
        prefix: config.api.prefix,
        version: config.api.version,
        timeout: config.api.timeout
      },
      database: {
        type: 'SQLite',
        connected: Database.isConnected(),
        path: path.basename(config.database.path)
      },
      features: {
        cors: true,
        rateLimit: config.server.env === 'production',
        logging: config.logging.enabled,
        cache: config.cache.enabled,
        static: config.static.enabled
      }
    });
  }

  /**
   * Inicia el servidor
   */
  start() {
    return new Promise((resolve, reject) => {
      try {
        const server = this.app.listen(this.port, config.server.host, () => {
          console.log('\n🚀 =====================================');
          console.log(`📊 Lista de Chicos API Server`);
          console.log(`🌐 Servidor: http://${config.server.host}:${this.port}`);
          console.log(`📡 API: http://${config.server.host}:${this.port}/api`);
          console.log(`🏥 Health: http://${config.server.host}:${this.port}/api/health`);
          console.log(`🔧 Ambiente: ${config.server.env}`);
          console.log(`📊 Versión: ${config.api.version}`);
          console.log('🚀 =====================================\n');
          
          resolve(server);
        });

        server.on('error', (error) => {
          console.error('❌ Error al iniciar el servidor:', error.message);
          reject(error);
        });

        // Graceful shutdown
        this.setupGracefulShutdown(server);

      } catch (error) {
        console.error('❌ Error al configurar el servidor:', error.message);
        reject(error);
      }
    });
  }

  /**
   * Configura el cierre elegante del servidor
   */
  setupGracefulShutdown(server) {
    const shutdown = async (signal) => {
      console.log(`\n🔄 Recibida señal ${signal}, cerrando servidor...`);
      
      // Cerrar servidor HTTP
      server.close(async () => {
        console.log('✅ Servidor HTTP cerrado');
        
        try {
          // Cerrar base de datos
          await Database.close();
          console.log('✅ Base de datos cerrada correctamente');
          
          console.log('✅ Cierre completo del servidor');
          process.exit(0);
        } catch (error) {
          console.error('❌ Error durante el cierre:', error.message);
          process.exit(1);
        }
      });

      // Forzar cierre después de 10 segundos
      setTimeout(() => {
        console.error('❌ Forzando cierre del servidor...');
        process.exit(1);
      }, 10000);
    };

    // Capturar señales de terminación
    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
    
    // Capturar errores no manejados
    process.on('uncaughtException', (error) => {
      console.error('❌ Error no capturado:', error);
      shutdown('uncaughtException');
    });

    process.on('unhandledRejection', (reason, promise) => {
      console.error('❌ Promesa rechazada no manejada:', reason);
      shutdown('unhandledRejection');
    });
  }
}

// Inicializar y arrancar el servidor
const server = new Server();

if (require.main === module) {
  server.start().catch((error) => {
    console.error('❌ Fallo al iniciar el servidor:', error.message);
    process.exit(1);
  });
}

module.exports = { Server, app: server.app };
