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
- ✅ **Registro con Fecha de Nacimiento**: Sistema moderno que registra la fecha de nacimiento en lugar de edad manual
- 🎂 **Cálculo Automático de Edad**: La edad se calcula automáticamente basada en la fecha de nacimiento
- 📅 **Actualización de Cumpleaños**: La edad se actualiza automáticamente cuando es el cumpleaños del niño
- 📝 **Validación Inteligente**: 
  - Fechas futuras no permitidas
  - Validación de edad entre 0-25 años
  - Formato de fecha intuitivo (DD/MM/AAAA)
- ❌ Eliminar niños de la lista individualmente  
- 🗑️ Limpiar toda la lista con confirmación
- 💾 Persistencia de datos con base de datos SQLite
- 📊 Contador total de niños
- 👁️ **Visualización Completa**: Muestra nombre, edad actual y fecha de nacimiento

### 🎨 Interfaz y Experiencia
- 🌈 Interfaz moderna con efectos glassmorphism
- ✨ **Botón Flotante**: Diseño elevado con efectos shimmer y hover
- 🎭 **Efectos Visuales**: Gradientes, sombras y animaciones suaves
- 💻 Aplicación de escritorio nativa
- ⚡ Rendimiento rápido con Vite
- 🇪🇸 Menú en español
- 🚪 **Botón de Salir**: Opción segura para cerrar la aplicación desde el menú principal con confirmación

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
- `GET /api/children` - Obtener todos los niños (con edad calculada)
- `POST /api/children` - Agregar nuevo niño (requiere fecha_nacimiento)
- `PUT /api/children/:id` - Actualizar niño existente
- `DELETE /api/children/:id` - Eliminar niño
- `GET /api/teams/:id/children` - Obtener niños de un equipo específico

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
    nombre TEXT NOT NULL,
    apellido TEXT NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    team_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (team_id) REFERENCES teams(id)
);

-- Nota: La edad se calcula dinámicamente usando la fecha_nacimiento
-- Funciones auxiliares de cálculo de edad disponibles en backend/utils/helpers.js
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
1. **Agregar un niño**: 
   - Completa el formulario con:
     - **Nombre**: Obligatorio (2-50 caracteres)
     - **Apellido**: Obligatorio (2-50 caracteres)
     - **Fecha de Nacimiento**: Selecciona usando el calendario (no se permiten fechas futuras)
   - La edad se calcula automáticamente
   - Presiona "Agregar" para guardar
2. **Ver información**: Cada niño muestra nombre completo, edad actual y fecha de nacimiento
3. **Eliminar un niño**: Haz clic en el botón ❌ junto al nombre con confirmación de seguridad
4. **Actualización automática**: Las edades se actualizan automáticamente en tiempo real

### Cerrar la Aplicación
1. **Botón de Salir**: Ubicado en la parte inferior del menú principal
2. **Confirmación Segura**: Al hacer clic aparece un diálogo de confirmación
3. **Cierre Automático**: Confirma para cerrar la aplicación de forma segura

## 🔄 Historial de Versiones

### v3.0 (Junio 2025) - "Sistema de Fecha de Nacimiento"
**🎯 Mejora Principal**: Reemplazo completo del sistema de edad manual por fechas de nacimiento

**🔧 Cambios Principales**:
- ✅ **Nueva Base de Datos**: Campo `fecha_nacimiento` reemplaza `edad`
- ✅ **Cálculo Automático**: Edad calculada dinámicamente en tiempo real
- ✅ **Interfaz Modernizada**: Input de tipo `date` con validaciones
- ✅ **Migración Automática**: Conversión de datos existentes preservando información
- ✅ **Validación Inteligente**: Fechas futuras bloqueadas, rangos de edad controlados
- ✅ **Funciones Auxiliares**: 
  - `calculateAge()` - Cálculo preciso de edad
  - `isValidBirthDate()` - Validación de fechas
  - `formatBirthDateForDB()` - Formateo para base de datos

**🚀 Funcionalidades Nuevas**:
- 📅 Selección de fecha con calendario nativo
- 🎂 Actualización automática de edad en cumpleaños
- 👁️ Visualización de fecha de nacimiento y edad calculada
- 🔄 Migración automática de datos existentes

**🛠️ Cambios Técnicos**:
- `backend/models/Children.js` - Reescrito completamente
- `backend/controllers/childrenController.js` - Actualizado para fecha de nacimiento
- `backend/middleware/validation.js` - Nueva validación de fechas
- `backend/utils/helpers.js` - Funciones de cálculo de edad
- `frontend/src/App.tsx` - Interfaz actualizada con inputs de fecha
- `backend/config/database.js` - Migración automática de esquema

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

#### Error: "Fechas de nacimiento no se guardan correctamente"
```bash
# Verificar migración de base de datos
cd backend
node debug-db.js  # Ver estructura actual
# La migración se ejecuta automáticamente al iniciar
```

#### Error: "Edad no se calcula correctamente"
```bash
# Verificar funciones auxiliares
cd backend/utils
# Revisar helpers.js para cálculo de edad
# La edad se calcula en tiempo real desde fecha_nacimiento
```

### Problemas del Usuario Final

#### "La aplicación no abre"
- ✅ Verificar Windows 10/11 64-bit
- ✅ Ejecutar como administrador
- ✅ Verificar antivirus no bloquee el ejecutable

#### "Formulario no acepta fechas de nacimiento"
- ✅ Verificar versión v3.0 o superior
- ✅ Comprobar que el campo de fecha esté habilitado
- ✅ Verificar que la fecha no sea futura

#### "Edad no se actualiza automáticamente"
- ✅ Verificar conexión con backend
- ✅ Recargar la aplicación
- ✅ Verificar que la fecha de nacimiento sea correcta

#### "Error al migrar datos antiguos"
- ✅ Respaldar base de datos: `backend/database/children.sqlite`
- ✅ Eliminar base de datos antigua para recrear esquema
- ✅ Reiniciar aplicación para migración automática

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
