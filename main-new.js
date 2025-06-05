const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

// Variables para el servidor de desarrollo y la ventana principal
let mainWindow;
let devServer;
let backendStarted = false;

function createWindow() {
  console.log('Creating window...');
  console.log('App packaged:', app.isPackaged);
  console.log('Current directory:', __dirname);
  
  // Crear la ventana del navegador
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    icon: path.join(__dirname, 'frontend/public/idealSportLogo.jpg'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      webSecurity: true
    },
    titleBarStyle: 'default',
    show: false
  });

  // En desarrollo, abrir DevTools automáticamente
  if (!app.isPackaged) {
    mainWindow.webContents.openDevTools();
  }

  // Personalizar el menú
  const template = [
    {
      label: 'Archivo',
      submenu: [
        {
          label: 'Salir',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: 'Ver',
      submenu: [
        { label: 'Recargar', accelerator: 'CmdOrCtrl+R', role: 'reload' },
        { label: 'Herramientas de desarrollador', accelerator: 'F12', role: 'toggleDevTools' },
        { label: 'Pantalla completa', accelerator: 'F11', role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Ayuda',
      submenu: [
        {
          label: 'Acerca de',
          click: () => {
            const { dialog } = require('electron');
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'Acerca de Lista de Chicos',
              message: 'Lista de Chicos v1.0.0',
              detail: 'Aplicación de escritorio para gestionar listas de niños.\nCreada con React + Vite + Electron'
            });
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  // Función para cargar la aplicación
  function loadApp() {
    if (app.isPackaged) {
      // En producción, cargar desde los archivos construidos
      const indexPath = path.join(__dirname, 'frontend/dist/index.html');
      console.log('Loading app from:', indexPath);
      
      // Verificar si el archivo existe
      const fs = require('fs');
      if (fs.existsSync(indexPath)) {
        console.log('Index file exists, loading...');
        mainWindow.loadFile(indexPath).then(() => {
          console.log('App loaded successfully');
        }).catch((error) => {
          console.error('Failed to load app:', error);
        });
      } else {
        console.error('Index file not found:', indexPath);
        // Cargar una página de error simple
        mainWindow.loadURL('data:text/html,<h1>Error: No se pudo cargar la aplicación</h1><p>Archivo no encontrado: ' + indexPath + '</p>');
      }
    } else {
      // En desarrollo, cargar desde el servidor de Vite con retraso
      setTimeout(() => {
        console.log('Loading from dev server...');
        mainWindow.loadURL('http://localhost:5173').catch((error) => {
          console.error('Failed to load dev server:', error);
        });
      }, 3000);
    }
  }

  // Iniciar el backend y luego cargar la app
  startBackendServer().then(() => {
    console.log('Backend started successfully, loading app...');
    loadApp();
  }).catch((error) => {
    console.error('Failed to start backend:', error);
    // Cargar la aplicación incluso si el backend falla
    loadApp();
  });

  // En desarrollo, iniciar el servidor de Vite
  if (!app.isPackaged) {
    startDevServer();
  }

  // Mostrar la ventana cuando esté lista
  mainWindow.once('ready-to-show', () => {
    console.log('Window ready to show');
    mainWindow.show();
  });

  // Manejar errores de carga
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Failed to load page:', errorCode, errorDescription);
  });

  // Log cuando la página termine de cargar
  mainWindow.webContents.on('did-finish-load', () => {
    console.log('Page finished loading');
  });

  // Emitido cuando la ventana se cierra
  mainWindow.on('closed', () => {
    mainWindow = null;
    if (devServer) {
      devServer.kill();
    }
  });
}

async function startBackendServer() {
  if (backendStarted) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    try {
      const backendPath = app.isPackaged 
        ? path.join(__dirname, 'backend')
        : path.join(__dirname, 'backend');
      
      console.log('Starting backend from:', backendPath);
      
      // Verificar si existe el archivo server.js
      const fs = require('fs');
      const serverPath = path.join(backendPath, 'server.js');
      
      if (!fs.existsSync(serverPath)) {
        console.error('Backend server.js not found:', serverPath);
        reject(new Error('Backend server.js not found'));
        return;
      }

      // Cambiar el directorio de trabajo al backend
      const originalCwd = process.cwd();
      process.chdir(backendPath);
      
      console.log('Changed working directory to:', process.cwd());
      
      // Requerir el servidor backend directamente
      require(serverPath);
      
      // Restaurar el directorio original
      process.chdir(originalCwd);
      
      backendStarted = true;
      console.log('Backend server started successfully');
      
      // Esperar un poco para que el servidor se inicie completamente
      setTimeout(() => {
        resolve();
      }, 1000);
      
    } catch (error) {
      console.error('Failed to start backend server:', error);
      reject(error);
    }
  });
}

function startDevServer() {
  console.log('Starting Vite dev server...');
  
  devServer = spawn('npm', ['run', 'dev'], {
    cwd: path.join(__dirname, 'frontend'),
    shell: true,
    stdio: 'pipe'
  });

  devServer.stdout.on('data', (data) => {
    console.log(`Vite: ${data}`);
  });

  devServer.stderr.on('data', (data) => {
    console.error(`Vite Error: ${data}`);
  });

  devServer.on('error', (error) => {
    console.error('Vite process error:', error);
  });
}

// Este método será llamado cuando Electron haya terminado la inicialización
app.whenReady().then(() => {
  console.log('Electron app ready');
  createWindow();
});

// Salir cuando todas las ventanas estén cerradas
app.on('window-all-closed', () => {
  console.log('All windows closed');
  if (devServer) {
    devServer.kill();
  }
  
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  console.log('App activated');
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Manejar errores no capturados
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
