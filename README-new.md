# 🧒 Lista de Chicos

Una aplicación de escritorio moderna para gestionar listas de niños, construida con React, TypeScript, Vite y Electron.

## 📋 Características

### 🏆 Gestión de Equipos
- ✅ **Crear Equipos**: Botón flotante moderno para crear nuevos equipos
- 🎨 **Personalización**: Selección de color y descripción para cada equipo
- 📝 **Validación**: Formularios con validación completa (nombre obligatorio 2-50 caracteres)
- 🎯 **Interfaz Intuitiva**: Diseño centrado con animaciones fluidas
- 📱 **Responsive**: Optimizado para dispositivos móviles

### 👶 Gestión de Niños
- ✅ Agregar niños a la lista con nombre y edad
- ❌ Eliminar niños de la lista individualmente  
- 🗑️ Limpiar toda la lista con confirmación
- 💾 Persistencia de datos con base de datos SQLite
- 📊 Contador total de niños

### 🎨 Interfaz y Experiencia
- 🌈 Interfaz moderna con efectos glassmorphism
- ✨ **Botón Flotante**: Diseño elevado con efectos shimmer y hover
- 🎭 **Efectos Visuales**: Gradientes, sombras y animaciones suaves
- 💻 Aplicación de escritorio nativa
- ⚡ Rendimiento rápido con Vite
- 🇪🇸 Menú en español

## 🛠️ Tecnologías

- **Frontend**: React + TypeScript + Vite
- **Backend**: Node.js + Express + SQLite
- **Desktop**: Electron
- **Estilos**: CSS personalizado con efectos modernos

## 🚀 Instalación y Desarrollo

### 📋 Requisitos Previos
- Node.js (versión 16 o superior)
- npm (viene incluido con Node.js)
- Git (para clonar el repositorio)

### 💾 Instalación Completa

#### 1. Clonar el Repositorio
```bash
git clone https://github.com/ThomasSalomon/Aplicacion_listaChicos.git
cd Aplicacion_listaChicos
```

#### 2. Instalar Todas las Dependencias
```bash
# Instalar dependencias del proyecto principal
npm install

# Instalar dependencias del frontend
cd frontend
npm install
cd ..

# Instalar dependencias del backend
cd backend
npm install
cd ..
```

### 🔧 Comandos de Desarrollo

#### Ejecutar en Modo Desarrollo (Recomendado)
```bash
# Ejecuta frontend, backend y Electron simultáneamente
npm run dev
```
Este comando inicia:
- 🖥️ **Backend API** en `http://localhost:3001`
- 🌐 **Frontend Vite** en `http://localhost:5173`
- ⚡ **Aplicación Electron** conectando ambos

#### Ejecutar Componentes por Separado
```bash
# Solo backend (API Server)
npm run dev:backend

# Solo frontend (React + Vite)
npm run dev:frontend

# Solo Electron
npm run dev:electron
```

### 🏗️ Construcción y Distribución

#### Construir para Producción
```bash
npm run build
```

#### Crear Ejecutable para Windows
```bash
# Instalador NSIS profesional (recomendado)
npm run dist:installer

# Versión portable
npm run dist:portable

# Ambas versiones
npm run dist:both
```

#### Archivos Generados
- **Instalador**: `dist-installer/Lista de Chicos Setup 1.0.0.exe`
- **Portable**: `dist-installer/win-unpacked/Lista de Chicos.exe`

### 📦 Instalación para Usuario Final

#### Opción 1: Instalador Profesional (Recomendado)
1. Descargar `Lista de Chicos Setup 1.0.0.exe`
2. Ejecutar el instalador como administrador
3. Seguir las instrucciones del asistente de instalación
4. La aplicación se instalará automáticamente con:
   - ✅ Acceso directo en el escritorio
   - ✅ Entrada en el menú de inicio
   - ✅ Registro en programas instalados
   - ✅ Desinstalador automático

#### Opción 2: Versión Portable
1. Descargar la carpeta `win-unpacked` completa
2. Extraer en cualquier ubicación de tu computadora
3. Ejecutar `Lista de Chicos.exe` directamente
4. **Ventajas**: No requiere instalación, se ejecuta desde cualquier lugar

#### Requisitos del Sistema
- ✅ Windows 10/11 (64 bits)
- ✅ Sin requisitos adicionales (todo incluido)
- ✅ No necesita Node.js, npm o dependencias externas
- ✅ Funciona sin conexión a internet

## 📁 Estructura del Proyecto

```
Lista-de-Chicos/
├── main.js                 # Proceso principal de Electron
├── package.json            # Configuración del proyecto y scripts
├── README.md               # Documentación completa
├── 
├── backend/                # Servidor API (Node.js + Express)
│   ├── server.js           # Servidor principal
│   ├── package.json        # Dependencias del backend
│   ├── config/             # Configuración
│   │   ├── app.js          # Configuración de la aplicación
│   │   └── database.js     # Configuración de SQLite
│   ├── controllers/        # Controladores de API
│   │   ├── childrenController.js  # Gestión de niños
│   │   └── teamsController.js     # Gestión de equipos
│   ├── models/             # Modelos de datos
│   ├── routes/             # Rutas de API REST
│   ├── middleware/         # Middleware personalizado
│   ├── database/           # Base de datos (generada automáticamente)
│   │   └── children.sqlite # Base de datos SQLite
│   └── utils/              # Utilidades
├── 
├── frontend/               # Aplicación React con TypeScript
│   ├── src/
│   │   ├── App.tsx         # Componente principal
│   │   ├── App.css         # Estilos modernos
│   │   ├── main.tsx        # Punto de entrada de React
│   │   └── index.css       # Estilos globales
│   ├── public/
│   │   ├── app-icon.ico    # Icono de la aplicación
│   │   └── vite.svg        # Logo de Vite
│   ├── package.json        # Dependencias del frontend
│   ├── vite.config.ts      # Configuración de Vite
│   └── tsconfig.json       # Configuración de TypeScript
├── 
└── dist-installer/         # Archivos de distribución (generados)
    ├── Lista de Chicos Setup 1.0.0.exe  # Instalador NSIS
    ├── latest.yml          # Metadatos de la versión
    └── win-unpacked/       # Versión portable
        ├── Lista de Chicos.exe    # Ejecutable principal
        └── resources/      # Recursos empaquetados
```

## 🔧 Configuración Técnica

### API Endpoints Disponibles
- `GET /api/teams` - Obtener todos los equipos
- `POST /api/teams` - Crear nuevo equipo (con validación)
- `PUT /api/teams/:id` - Actualizar equipo existente
- `DELETE /api/teams/:id` - Eliminar equipo
- `GET /api/children` - Obtener todos los niños
- `POST /api/children` - Agregar nuevo niño
- `DELETE /api/children/:id` - Eliminar niño

### Base de Datos SQLite
```sql
-- Tabla de equipos
CREATE TABLE teams (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    color TEXT DEFAULT '#3498db',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de niños
CREATE TABLE children (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    age INTEGER,
    team_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (team_id) REFERENCES teams(id)
);
```

### Personalización
- `frontend/src/App.tsx` - Lógica principal y gestión de equipos
- `frontend/src/App.css` - Estilos y efectos visuales
- `main.js` - Configuración de ventana de Electron
- `package.json` - Scripts de construcción y configuración de electron-builder

## 📝 Uso

### Gestión de Equipos
1. **Crear un equipo**: 
   - Haz clic en el botón flotante "Crear Nuevo Equipo"
   - Completa el formulario:
     - **Nombre**: Obligatorio (2-50 caracteres)
     - **Descripción**: Opcional (hasta 100 caracteres)
     - **Color**: Selecciona con el color picker
   - Presiona "Crear Equipo" para guardar

### Gestión de Niños
1. **Agregar un niño**: Escribe el nombre y la edad, luego presiona "Agregar"
2. **Eliminar un niño**: Haz clic en el botón ❌ junto al nombre
3. **Ver estadísticas**: El contador se actualiza automáticamente

## 🔄 Historial de Versiones

### v2.0 (Junio 2025) - "Eliminación de Equipo Automático"
**🎯 Problema Resuelto**: Ya no se crea automáticamente "Equipo Principal"

**🔧 Correcciones Principales**:
- ✅ Eliminada creación automática de equipo por defecto
- ✅ Corregido modo desarrollo (`npm run dev`)
- ✅ Backend soporta desarrollo y producción
- ✅ Instalador NSIS profesional implementado

**🚀 Distribución Actual**:
- **Instalador**: `dist-installer/Lista de Chicos Setup 1.0.0.exe`
- **Portable**: `dist-installer/win-unpacked/Lista de Chicos.exe`
- **Tamaño**: ~87 MB (instalador) / ~193 MB (portable)

### v1.0 (Diciembre 2024) - "Sistema de Equipos"
**✨ Características Iniciales**:
- Sistema completo de gestión de equipos
- Botón flotante con efectos visuales
- Diseño responsive y moderno
- Base de datos SQLite integrada

## 🔍 Solución de Problemas

### Problemas Comunes de Instalación

#### Error: "npm install falla"
```bash
# Limpiar cache y reinstalar
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

#### Error: "electron-builder falla"
```bash
# Instalar electron-builder globalmente
npm install -g electron-builder
npm run dist:installer
```

#### Error: "Backend no inicia"
```bash
# Verificar dependencias del backend
cd backend
npm install
cd ..
npm run dev:backend
```

### Problemas del Usuario Final

#### "La aplicación no abre"
- ✅ Verificar Windows 10/11 64-bit
- ✅ Ejecutar como administrador
- ✅ Verificar antivirus no bloquee el ejecutable

#### "Se crean equipos duplicados"
- ✅ Verificar versión v2.0 o superior
- ✅ Eliminar base de datos antigua: `backend/database/children.sqlite`
- ✅ Reiniciar aplicación

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## ✨ Autor

**Tommy Salomon** - [GitHub](https://github.com/ThomasSalomon)

---

*Aplicación de escritorio moderna para gestión de listas de niños - Construida con React, TypeScript, Electron y SQLite*
