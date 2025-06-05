const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow;
let backendProcess;

function startBackend() {
  if (app.isPackaged) {
    const backendPath = path.join(process.resourcesPath, 'app.asar.unpacked', 'backend', 'server.js');
    
    // Intentar usar node.exe desde resources, si no existe usar process.execPath con argumentos específicos
    let nodePath = path.join(process.resourcesPath, 'node.exe');
    const fs = require('fs');
    
    console.log('Intentando iniciar backend...');
    console.log('Backend path:', backendPath);
    console.log('Node path:', nodePath);
      if (!fs.existsSync(nodePath)) {
      // Si no existe node.exe en resources, usar Electron pero con argumentos específicos para evitar crear ventana
      console.log('node.exe no encontrado, usando Electron con argumentos específicos');
      nodePath = process.execPath;
        // Usar ELECTRON_RUN_AS_NODE para que Electron actúe como Node.js
      backendProcess = spawn(nodePath, [backendPath], {
        stdio: ['pipe', 'pipe', 'pipe'], // Capturar stdout/stderr
        env: { 
          ...process.env, 
          NODE_ENV: 'development', // Usar desarrollo para evitar validaciones estrictas
          IS_ELECTRON_BACKEND: '1',
          ELECTRON_RUN_AS_NODE: '1' // Esto hace que Electron actúe como Node.js
        }
      });
    } else {
      // Usar Node.js puro
      console.log('Usando node.exe desde resources');
      backendProcess = spawn(nodePath, [backendPath], {
        stdio: ['pipe', 'pipe', 'pipe'], // Capturar stdout/stderr
        env: { ...process.env, NODE_ENV: 'development', IS_ELECTRON_BACKEND: '1' }
      });
    }
    
    // Capturar logs del backend
    if (backendProcess.stdout) {
      backendProcess.stdout.on('data', (data) => {
        console.log('Backend stdout:', data.toString());
      });
    }
    
    if (backendProcess.stderr) {
      backendProcess.stderr.on('data', (data) => {
        console.log('Backend stderr:', data.toString());
      });
    }
    
    backendProcess.on('error', (err) => {
      console.error('Error al iniciar backend:', err);
    });
    backendProcess.on('exit', (code) => {
      console.log('Backend finalizó con código:', code);
    });
    
    console.log('Backend process iniciado con PID:', backendProcess.pid);
  }
}

function createWindow() {
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

  // Menú personalizado (puedes ajustar esto a tu gusto)
  const template = [
    {
      label: 'Archivo',
      submenu: [
        {
          label: 'Salir',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click: () => app.quit()
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

  // Cargar la app
  function loadApp() {
    if (app.isPackaged) {
      // Cargar el index.html desde el asar
      const indexPath = path.join(__dirname, 'frontend', 'dist', 'index.html');
      mainWindow.loadFile(indexPath).catch((error) => {
        console.error('No se pudo cargar la app:', error);
        mainWindow.loadURL('data:text/html,<h1>Error: No se pudo cargar la aplicación</h1>');
      });
    } else {
      // En desarrollo, cargar desde Vite
      mainWindow.loadURL('http://localhost:5173');
    }
  }

  if (app.isPackaged) {
    startBackend();
  }
  loadApp();

  mainWindow.once('ready-to-show', () => mainWindow.show());
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (backendProcess) {
    backendProcess.kill();
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
