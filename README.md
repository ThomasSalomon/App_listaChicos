# 🧒 Lista de Chicos

Una aplicación de escritorio moderna para gestionar listas de niños, construida con React, TypeScript, Vite y Electron.

## 📋 Características

### 🏆 Gestión de Equipos
- ✅ **Crear Equipos**: Botón flotante moderno para crear nuevos equipos
- 🎨 **Personalización**: Selección de color y descripción para cada equipo
- 📝 **Validación**: Formularios con validación completa (nombre obligatorio 2-50 caracteres)
- 🎯 **Interfaz Intuitiva**: Diseño centrado con animaciones fluidas
- 📱 **Responsive**: Optimizado para dispositivos móviles
- 🗑️ **Eliminar Equipos**: Sistema completo de eliminación de equipos con confirmación
  - 🔒 **Protección de Datos**: No permite eliminar equipos que tienen niños asignados (previene pérdida de datos)
  - ⚠️ **Confirmación Doble**: Dialog de confirmación personalizado antes de eliminar
  - 🔄 **Navegación Inteligente**: Si eliminas el equipo actualmente seleccionado, automáticamente regresa al menú principal
  - 💾 **Eliminación Suave**: Los equipos se marcan como inactivos en lugar de ser borrados físicamente (recuperables)
  - 🎨 **Botón Estilizado**: Botón de eliminar con diseño glassmorphism y efectos hover modernos

### 👶 Gestión de Niños

---

## 🌐 Uso en Móvil/Web

La aplicación puede usarse perfectamente desde el navegador de un teléfono móvil si la subes a una página web pública. Para una experiencia óptima en móviles, sigue estos pasos:

### 1. CSS Responsive
Agrega al final de tu archivo `frontend/src/App.css` los estilos recomendados para móviles (ver ejemplo en la respuesta anterior). Esto hará que los formularios, botones y listas sean cómodos para usar con el dedo.

### 2. Meta Tags para Móvil
Asegúrate de que tu `frontend/index.html` incluya:
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<meta name="theme-color" content="#3B82F6">
```

### 3. Backend en la Nube
Para que funcione desde cualquier lugar, sube tu backend a Railway, Heroku, Vercel, etc. Cambia la variable `API_BASE_URL` en el frontend para que apunte a la URL pública de tu backend.

### 4. Hosting del Frontend
Puedes subir el frontend a Netlify, Vercel, GitHub Pages, etc. Solo necesitas subir la carpeta `dist` generada por `npm run build`.

### 5. Resultado
- La app será 100% funcional desde el navegador móvil
- Se verá y sentirá como una app nativa
- Puedes agregarla a la pantalla de inicio como PWA

---

- ✅ **Registro con Fecha de Nacimiento**: Sistema moderno que registra la fecha de nacimiento en lugar de edad manual
- 🎂 **Cálculo Automático de Edad**: La edad se calcula automáticamente basada en la fecha de nacimiento
- 📅 **Actualización de Cumpleaños**: La edad se actualiza automáticamente cuando es el cumpleaños del niño
- 💪 **Estado Físico**: Seguimiento del estado físico de cada niño
  - 💪 "En forma" - Niño disponible para actividades completas
  - 🤕 "Lesionado" - Niño con limitaciones físicas temporales
- 💰 **Condición de Pago**: Gestión del estado de pagos
  - ✅ "Al día" - Pagos actualizados sin pendientes
  - ⚠️ "En deuda" - Pagos pendientes que requieren atención
- 🏷️ **Etiquetas de Estado**: Badges visuales con iconos y colores para identificación rápida
- ✏️ **Edición In-Situ**: Sistema completo de edición de niños existentes
  - 📝 Edición en línea sin ventanas emergentes
  - 🔄 Actualización de todos los campos (nombre, apellido, fecha nacimiento, estado físico, condición pago)
  - ⌨️ Atajos de teclado (Enter para guardar, Escape para cancelar)
  - 🚫 Exclusividad mutua entre agregar y editar
  - ✅ Validación completa igual que en formulario de agregar
- ↔️ **Mover Entre Equipos**: Sistema completo para transferir niños entre equipos
  - 🔄 **Transferencia Inteligente**: Modal intuitivo para seleccionar equipo destino
  - 🎨 **Selector Visual**: Radio buttons con indicadores de color de cada equipo
  - 🛡️ **Validación Completa**: Verificación de existencia de niño y equipo destino
  - 🚫 **Prevención de Errores**: No permite mover al mismo equipo actual
  - ✅ **Confirmación Visual**: Mensaje de éxito con nombres de equipos involucrados
  - 🔒 **Integridad de Datos**: Mantiene toda la información del niño intacta
  - ⚡ **Actualización Inmediata**: La interfaz se actualiza automáticamente tras el movimiento
- 📝 **Validación Inteligente**: 
  - Fechas futuras no permitidas
  - Validación de edad entre 0-25 años
  - Formato de fecha intuitivo (DD/MM/AAAA)
  - Validación de campos obligatorios y opcionales
- ❌ Eliminar niños de la lista individualmente  
- 🗑️ Limpiar toda la lista con confirmación
- 💾 Persistencia de datos con base de datos SQLite
- 📊 Contador total de niños
- 👁️ **Visualización Completa**: Muestra nombre, edad actual, fecha de nacimiento, estado físico y condición de pago

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

## 🚀 Instalación y Configuración

### 📋 Requisitos del Sistema
- **Para Desarrollo**:
  - Node.js (versión 16 o superior)
  - npm (viene incluido con Node.js)
  - Git (para clonar el repositorio)
- **Para Usuario Final**:
  - Windows 10/11 (64 bits)
  - Sin requisitos adicionales (todo incluido)
  - No necesita Node.js, npm o dependencias externas
  - Funciona sin conexión a internet

### 💻 Instalación para Desarrolladores

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

#### 3. Comandos de Desarrollo
```bash
# Ejecutar en Modo Desarrollo (Recomendado)
npm run dev
# Inicia: Backend API (puerto 3001) + Frontend Vite (puerto 5173) + Electron

# Ejecutar Componentes por Separado
npm run dev:backend    # Solo backend (API Server)
npm run dev:frontend   # Solo frontend (React + Vite)
npm run dev:electron   # Solo Electron
```

#### 4. Construcción y Distribución
```bash
# Construir para Producción
npm run build

# Crear Ejecutable para Windows
npm run dist:installer  # Instalador NSIS profesional (recomendado)
npm run dist:portable   # Versión portable
npm run dist:both       # Ambas versiones
```

### 📦 Instalación para Usuario Final

#### 🌟 Opción 1: Instalador Profesional (Recomendado)
1. **Descargar**: `Lista de Chicos Setup 1.0.0.exe` desde la carpeta `dist-installer/`
2. **Ejecutar**: Como administrador haciendo clic derecho → "Ejecutar como administrador"
3. **Seguir**: Las instrucciones del asistente de instalación
4. **Resultado**: La aplicación se instala automáticamente con:
   - ✅ Acceso directo en el escritorio
   - ✅ Entrada en el menú de inicio
   - ✅ Registro en programas instalados
   - ✅ Desinstalador automático

#### 📁 Opción 2: Versión Portable
1. **Descargar**: La carpeta `win-unpacked` completa desde `dist-installer/`
2. **Extraer**: En cualquier ubicación de tu computadora
3. **Ejecutar**: `Lista de Chicos.exe` directamente
4. **Ventajas**: 
   - No requiere instalación
   - Se ejecuta desde cualquier lugar
   - Perfecto para USB o dispositivos removibles

#### 📊 Archivos Generados
- **Instalador**: `dist-installer/Lista de Chicos Setup 1.0.0.exe` (~87 MB)
- **Portable**: `dist-installer/win-unpacked/Lista de Chicos.exe` (~193 MB)
- **Metadatos**: `dist-installer/latest.yml` (información de versión)

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
- `DELETE /api/teams/:id` - **Eliminar equipo** (con validación de niños asignados, implementado en v3.3)
- `GET /api/children` - Obtener todos los niños (con edad calculada)
- `POST /api/children` - Agregar nuevo niño (requiere fecha_nacimiento)
- `PUT /api/children/:id` - **Actualizar niño existente** (nombre, apellido, fecha_nacimiento, estado_fisico, condicion_pago)
- `PUT /api/children/:id/move` - **🆕 Mover niño a otro equipo** (requiere new_team_id, implementado en v3.4)
- `DELETE /api/children/:id` - Eliminar niño
- `GET /api/teams/:id/children` - Obtener niños de un equipo específico

### Base de Datos SQLite
```sql
-- Tabla de equipos
CREATE TABLE teams (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    descripcion TEXT,
    color TEXT DEFAULT '#3498db',
    activo BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de niños
CREATE TABLE children (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    apellido TEXT NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    estado_fisico TEXT DEFAULT 'En forma' CHECK (estado_fisico IN ('En forma', 'Lesionado')),
    condicion_pago TEXT DEFAULT 'Al dia' CHECK (condicion_pago IN ('Al dia', 'En deuda')),
    team_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (team_id) REFERENCES teams(id)
);

-- Notas:
-- • La edad se calcula dinámicamente usando fecha_nacimiento
-- • estado_fisico: 'En forma' (💪) | 'Lesionado' (🤕)
-- • condicion_pago: 'Al dia' (✅) | 'En deuda' (⚠️)
-- • Funciones auxiliares de cálculo disponibles en backend/utils/helpers.js
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

2. **Seleccionar un equipo**: 
   - Haz clic en cualquier tarjeta de equipo para acceder a la gestión de niños

3. **Eliminar un equipo**: 
   - Haz clic en el botón 🗑️ debajo de la tarjeta del equipo que deseas eliminar
   - Confirma la eliminación en el diálogo que aparece
   - **Nota importante**: 
     - ⚠️ Los equipos con niños asignados **NO** se pueden eliminar (protección de datos)
     - 🔄 Si eliminas el equipo actualmente seleccionado, automáticamente regresarás al menú principal
     - 💾 Los equipos se eliminan de forma "suave" (marcados como inactivos, no borrados físicamente)

### Gestión de Niños
1. **Agregar un niño**: 
   - Completa el formulario con:
     - **Nombre**: Obligatorio (2-50 caracteres)
     - **Apellido**: Obligatorio (2-50 caracteres)
     - **Fecha de Nacimiento**: Selecciona usando el calendario (no se permiten fechas futuras)
     - **Estado Físico**: Selecciona entre "💪 En forma" o "🤕 Lesionado"
     - **Condición de Pago**: Selecciona entre "✅ Al día" o "⚠️ En deuda"
   - La edad se calcula automáticamente
   - Presiona "Agregar" para guardar
2. **Editar un niño existente**: 
   - Haz clic en el botón de editar (✏️) junto al nombre del niño
   - Se abre un formulario de edición en línea con todos los datos actuales
   - Modifica los campos que desees:
     - **Nombre y Apellido**: Edita directamente en los campos de texto
     - **Fecha de Nacimiento**: Cambia la fecha usando el selector de fecha
     - **Estado Físico**: Selecciona entre las opciones disponibles
     - **Condición de Pago**: Actualiza el estado de pagos
   - **Guardar cambios**: 
     - Presiona el botón guardar (💾) o usa Enter
     - Los cambios se validan antes de guardarse
   - **Cancelar edición**: 
     - Presiona el botón cancelar (❌) o usa Escape
     - Se descartan todos los cambios no guardados
   - **Nota**: No puedes agregar nuevos niños mientras editas uno existente
3. **Mover un niño a otro equipo**: 
   - Haz clic en el botón de mover (↔️) junto al nombre del niño
   - Se abre un modal con la lista de equipos disponibles
   - Selecciona el equipo destino usando los radio buttons
   - Cada equipo muestra su color característico para fácil identificación
   - **Validaciones automáticas**:
     - 🚫 No aparece el equipo actual (no se puede mover al mismo equipo)
     - ✅ Solo muestra equipos activos y disponibles
   - Presiona "Mover" para confirmar la transferencia
   - **Resultado**: 
     - ✅ Mensaje de confirmación con nombres de equipos involucrados
     - 🔄 La interfaz se actualiza automáticamente
     - 💾 Toda la información del niño se mantiene intacta
4. **Ver información**: Cada niño muestra:
   - Nombre completo y edad actual
   - Fecha de nacimiento formateada
   - Estado físico con badge visual e icono
   - Condición de pago con badge visual e icono
4. **Eliminar un niño**: Haz clic en el botón ❌ junto al nombre con confirmación de seguridad
5. **Actualización automática**: Las edades se actualizan automáticamente en tiempo real

### Cerrar la Aplicación
1. **Botón de Salir**: Ubicado en la parte inferior del menú principal
2. **Confirmación Segura**: Al hacer clic aparece un diálogo de confirmación
3. **Cierre Automático**: Confirma para cerrar la aplicación de forma segura

## 🔄 Historial de Versiones

### v3.4 (Junio 2025) - "Transferencia Entre Equipos"
**🎯 Nueva Funcionalidad**: Sistema completo para mover niños entre equipos de forma intuitiva y segura

**🔧 Cambios Principales**:
- ✅ **Botón de Mover**: Nuevo botón ↔️ junto a cada niño para transferir entre equipos
- ✅ **Modal Intuitivo**: Interfaz modal elegante para seleccionar equipo destino
- ✅ **Selector Visual**: Radio buttons con indicadores de color de cada equipo
- ✅ **Validación Completa**: Verificación de existencia de niño y equipo destino en backend
- ✅ **Prevención de Errores**: No permite mover al mismo equipo actual
- ✅ **Confirmación Visual**: Mensaje de éxito con nombres de equipos involucrados
- ✅ **Integridad de Datos**: Mantiene toda la información del niño durante la transferencia

**🚀 Funcionalidades Nuevas**:
- ↔️ Transferencia de niños entre equipos con un clic
- 🎨 Modal con diseño glassmorphism consistente con la aplicación
- 🔄 Actualización automática de la interfaz tras el movimiento
- 🛡️ Sistema robusto de validaciones en frontend y backend
- ⚡ Operación rápida sin pérdida de datos

**🛠️ Cambios Técnicos**:
- `frontend/src/App.tsx` - Estados `showMoveChild`, `childToMove`, `targetTeamId` y funciones `moveChildToTeam()`, `startMoveChild()`
- `frontend/src/App.css` - Estilos para `.move-child-modal`, `.team-option`, `.move-buttons`
- `backend/controllers/childrenController.js` - Nuevo método `moveChildToTeam()` con validaciones completas
- `backend/routes/children.js` - Nueva ruta `PUT /api/children/:id/move` con middleware de validación
- `backend/models/Teams.js` - Corrección en eliminación: cambio a hard delete para prevenir conflictos de nombres

### v3.3 (Junio 2025) - "Eliminación Segura de Equipos"
**🎯 Nueva Funcionalidad**: Sistema completo para eliminar equipos con protecciones de seguridad

**🔧 Cambios Principales**:
- ✅ **Botón de Eliminar**: Nuevo botón 🗑️ con diseño glassmorphism debajo de cada tarjeta de equipo
- ✅ **Protección de Datos**: Previene eliminación de equipos que tienen niños asignados (backend valida)
- ✅ **Confirmación Doble**: Diálogo personalizado de confirmación antes de proceder con la eliminación
- ✅ **Navegación Inteligente**: Si eliminas el equipo seleccionado, automáticamente regresa al menú principal
- ✅ **Eliminación Suave**: Los equipos se marcan como `activo = 0` en lugar de ser borrados físicamente
- ✅ **Responsive**: Botón de eliminar optimizado para móviles con tamaño táctil adecuado

**🚀 Funcionalidades Nuevas**:
- 🗑️ Interfaz moderna para eliminar equipos con efectos hover
- 🔒 Sistema de protección que preserva integridad de datos
- ⚠️ Mensajes de error informativos cuando no se puede eliminar
- 🎨 Diseño consistente con el resto de la aplicación
- 📱 Experiencia optimizada en dispositivos móviles

**🛠️ Cambios Técnicos**:
- `frontend/src/App.tsx` - Nueva función `deleteTeam()` con confirmación y navegación
- `frontend/src/App.css` - Estilos para `.team-card-container` y `.team-delete-btn`
- `backend/controllers/teamsController.js` - Validación existente de niños antes de eliminar
- `backend/routes/teams.js` - Endpoint DELETE ya implementado con seguridad
- Backend ya tenía todas las protecciones necesarias implementadas

### v3.2 (Junio 2025) - "Sistema de Edición In-Situ"
**🎯 Nueva Funcionalidad**: Sistema completo de edición de niños existentes sin ventanas emergentes

**🔧 Cambios Principales**:
- ✅ **Edición In-Línea**: Formulario de edición que reemplaza la vista del niño durante la edición
- ✅ **Actualización Completa**: Permite editar todos los campos (nombre, apellido, fecha nacimiento, estado físico, condición pago)
- ✅ **Atajos de Teclado**: Enter para guardar, Escape para cancelar
- ✅ **Exclusividad Mutua**: No se puede agregar nuevos niños mientras se edita uno existente
- ✅ **Validación Completa**: Mismas validaciones que el formulario de agregar
- ✅ **Persistencia Backend**: Utiliza endpoint PUT `/api/children/:id` existente

**🚀 Funcionalidades Nuevas**:
- ✏️ Botón de editar (✏️) junto a cada niño
- 📝 Formulario inline con todos los campos editables
- 💾 Botón guardar con validación completa
- ❌ Botón cancelar que descarta cambios
- ⌨️ Navegación por teclado (Enter/Escape)
- 🔄 Actualización inmediata de la lista tras guardar

**🛠️ Cambios Técnicos**:
- `frontend/src/App.tsx` - Estados y funciones para edición: `editingChild`, `startEditChild()`, `cancelEdit()`, `saveEditChild()`
- `frontend/src/App.css` - Estilos para formulario de edición: `.edit-child-form`, `.edit-input-group`, `.save-btn`, `.cancel-edit-btn`
- Reutilización del controlador `updateChild` existente en backend
- Manejo de estados mutuamente exclusivos entre agregar y editar

### v3.1 (Junio 2025) - "Estado Físico y Condición de Pago"
**🎯 Nueva Funcionalidad**: Sistema completo de seguimiento de estado físico y pagos

**🔧 Cambios Principales**:
- ✅ **Estado Físico**: Nuevo campo con opciones "En forma" y "Lesionado"
- ✅ **Condición de Pago**: Nuevo campo con opciones "Al día" y "En deuda"
- ✅ **Etiquetas Visuales**: Badges con iconos y colores para identificación rápida
- ✅ **Base de Datos Actualizada**: Nuevas columnas con restricciones CHECK
- ✅ **Migración Automática**: Conversión de datos existentes con valores por defecto
- ✅ **Formulario Mejorado**: Labels descriptivos arriba de cada campo
- ✅ **Validación Completa**: Backend y frontend validan nuevos campos

**🚀 Funcionalidades Nuevas**:
- 💪 Seguimiento de estado físico con iconos
- 💰 Gestión de pagos con alertas visuales
- 🏷️ Sistema de badges con colores temáticos
- 📝 Etiquetas en formularios para mejor UX
- 🔄 Migración automática preservando datos existentes

**🛠️ Cambios Técnicos**:
- `backend/config/database.js` - Schema actualizado con nuevos campos
- `backend/models/Children.js` - Soporte para estado_fisico y condicion_pago
- `backend/controllers/childrenController.js` - Validación de nuevos campos
- `backend/middleware/validation.js` - Middleware actualizado
- `frontend/src/App.tsx` - Interfaz con selects y badges
- `frontend/src/App.css` - Estilos para badges y contenedores

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

#### Error: "Nuevos campos no se guardan correctamente"
```bash
# Verificar migración de base de datos para nuevos campos
cd backend
node debug-db.js  # Ver estructura actual con estado_fisico y condicion_pago
# La migración se ejecuta automáticamente al iniciar
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

#### "Formulario no acepta campos nuevos"
- ✅ Verificar versión v3.1 o superior
- ✅ Comprobar que los campos de estado físico y condición de pago estén disponibles
- ✅ Verificar que los selects muestren las opciones correctas

#### "No puedo editar niños existentes"
- ✅ Verificar versión v3.2 o superior
- ✅ Buscar el botón de editar (✏️) junto a cada niño
- ✅ Comprobar que no esté activo el modo "agregar niño"
- ✅ Verificar que el formulario de edición aparezca en línea

#### "Los cambios de edición no se guardan"
- ✅ Verificar conexión con backend (PUT /api/children/:id)
- ✅ Comprobar validación de campos (todos los campos son obligatorios)
- ✅ Usar el botón guardar (💾) o presionar Enter
- ✅ Verificar que no haya errores en el formulario

#### "No puedo eliminar equipos"
- ✅ Verificar versión v3.3 o superior
- ✅ Buscar el botón 🗑️ debajo de cada tarjeta de equipo
- ✅ **Equipos con niños NO se pueden eliminar** (por seguridad de datos)
- ✅ Eliminar primero todos los niños del equipo, luego eliminar el equipo
- ✅ Verificar conexión con backend (DELETE /api/teams/:id)

#### "El botón de eliminar equipo no aparece"
- ✅ Verificar que estés en la vista del menú principal (no en gestión de equipo)
- ✅ Comprobar que los estilos CSS estén cargando correctamente
- ✅ Verificar que tengas equipos creados para mostrar
- ✅ Recargar la aplicación si es necesario

#### "Error: 'No se puede eliminar el equipo porque tiene niños asignados'"
- ✅ **Comportamiento normal de seguridad**
- ✅ Ir al equipo y eliminar todos los niños primero
- ✅ Luego regresar al menú y eliminar el equipo
- ✅ Esta protección previene pérdida accidental de datos

#### "Los cambios de edición no se guardan"
- ✅ Verificar conexión con backend (PUT /api/children/:id)
- ✅ Comprobar validación de campos (todos los campos son obligatorios)
- ✅ Usar el botón guardar (💾) o presionar Enter
- ✅ Verificar que no haya errores en el formulario

#### "El formulario de edición no se cancela correctamente"
- ✅ Usar el botón cancelar (❌) o presionar Escape
- ✅ Verificar que el estado se restablezca a la vista normal
- ✅ Comprobar que los campos se limpien correctamente

#### "Badges de estado no se muestran correctamente"
- ✅ Verificar que los datos incluyan estado_fisico y condicion_pago
- ✅ Recargar la aplicación para ver los cambios
- ✅ Verificar que los estilos CSS estén aplicados correctamente

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
