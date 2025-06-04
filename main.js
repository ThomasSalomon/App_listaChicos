const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

// Variables para el servidor de desarrollo y la ventana principal
let mainWindow;
let devServer;

function createWindow() {
  // Crear la ventana del navegador
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    icon: path.join(__dirname, 'frontend/public/idealSportLogo.jpg'), // Ícono de la aplicación
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      webSecurity: true
    },
    titleBarStyle: 'default',
    show: false // No mostrar hasta que esté listo
  });

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
      label: 'Editar',
      submenu: [
        { label: 'Deshacer', accelerator: 'CmdOrCtrl+Z', role: 'undo' },
        { label: 'Rehacer', accelerator: 'Shift+CmdOrCtrl+Z', role: 'redo' },
        { type: 'separator' },
        { label: 'Cortar', accelerator: 'CmdOrCtrl+X', role: 'cut' },
        { label: 'Copiar', accelerator: 'CmdOrCtrl+C', role: 'copy' },
        { label: 'Pegar', accelerator: 'CmdOrCtrl+V', role: 'paste' }
      ]
    },
    {
      label: 'Ver',
      submenu: [
        { label: 'Recargar', accelerator: 'CmdOrCtrl+R', role: 'reload' },
        { label: 'Forzar recarga', accelerator: 'CmdOrCtrl+Shift+R', role: 'forceReload' },
        { label: 'Herramientas de desarrollador', accelerator: 'F12', role: 'toggleDevTools' },
        { type: 'separator' },
        { label: 'Zoom actual', accelerator: 'CmdOrCtrl+0', role: 'resetZoom' },
        { label: 'Aumentar zoom', accelerator: 'CmdOrCtrl+Plus', role: 'zoomIn' },
        { label: 'Disminuir zoom', accelerator: 'CmdOrCtrl+-', role: 'zoomOut' },
        { type: 'separator' },
        { label: 'Pantalla completa', accelerator: 'F11', role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Ventana',
      submenu: [
        { label: 'Minimizar', accelerator: 'CmdOrCtrl+M', role: 'minimize' },
        { label: 'Cerrar', accelerator: 'CmdOrCtrl+W', role: 'close' }
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

  // En desarrollo, iniciar el servidor de Vite
  if (!app.isPackaged) {
    startDevServer();
  }

  // Cargar la aplicación
  const loadApp = () => {
    if (app.isPackaged) {
      // En producción, cargar desde los archivos construidos
      mainWindow.loadFile(path.join(__dirname, 'frontend/dist/index.html'));
    } else {
      // En desarrollo, cargar desde el servidor de Vite
      mainWindow.loadURL('http://localhost:5173');
    }
  };

  // Esperar un poco antes de cargar la app en desarrollo
  if (!app.isPackaged) {
    setTimeout(loadApp, 3000); // Esperar 3 segundos para que Vite se inicie
  } else {
    loadApp();
  }

  // Mostrar la ventana cuando esté lista
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    
    // En desarrollo, abrir las herramientas de desarrollador
    if (!app.isPackaged) {
      mainWindow.webContents.openDevTools();
    }
  });

  // Emitido cuando la ventana se cierra
  mainWindow.on('closed', () => {
    mainWindow = null;
    if (devServer) {
      devServer.kill();
    }
  });
}

function startDevServer() {
  // Iniciar el servidor de desarrollo de Vite
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
}

// Este método será llamado cuando Electron haya terminado la inicialización
app.whenReady().then(createWindow);

// Salir cuando todas las ventanas estén cerradas
app.on('window-all-closed', () => {
  if (devServer) {
    devServer.kill();
  }
  
  // En macOS es común que las aplicaciones y su barra de menú permanezcan activas
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // En macOS es común recrear una ventana cuando se hace clic en el ícono del dock
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
