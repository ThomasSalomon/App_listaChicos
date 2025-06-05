# 🧒 Lista de Chicos

Una aplicación de escritorio moderna para gestionar listas de niños, construida con React, Vite y Electron.

## 📋 Características

### Gestión de Equipos
- ✅ **Crear Equipos**: Botón flotante moderno para crear nuevos equipos
- 🎨 **Personalización**: Selección de color y descripción para cada equipo
- 📝 **Validación**: Formularios con validación completa (nombre obligatorio 2-50 caracteres)
- 🎯 **Interfaz Intuitiva**: Diseño centrado con animaciones fluidas
- 📱 **Responsive**: Optimizado para dispositivos móviles

### Gestión de Niños
- ✅ Agregar niños a la lista con nombre y edad
- ❌ Eliminar niños de la lista individualmente  
- 🗑️ Limpiar toda la lista con confirmación
- 💾 Persistencia de datos con base de datos SQLite
- 📊 Contador total de niños

### Interfaz y Experiencia
- 🎨 Interfaz moderna y atractiva con gradientes
- ✨ **Botón Flotante**: Diseño elevado con efectos shimmer y hover
- 🌈 **Efectos Visuales**: Gradientes, sombras y animaciones suaves
- 💻 Aplicación de escritorio nativa
- ⚡ Rendimiento rápido con Vite
- 🇪🇸 Menú en español
- 📱 Diseño completamente responsive

### Tecnología
- 🔧 Configuración de distribución para Windows
- 🌐 API REST con Express.js
- 🔄 Sincronización automática entre frontend y backend

## ✅ Estado del Proyecto

### Completado
- ✅ Aplicación React funcional con TypeScript
- ✅ Interfaz de usuario moderna y responsiva
- ✅ Funcionalidad completa de gestión de lista
- ✅ **Sistema de Equipos**: Gestión completa de equipos con base de datos
- ✅ **Creación de Equipos**: Botón flotante con formulario completo
- ✅ **Validación de Formularios**: Control de entrada y mensajes de error
- ✅ **Diseño Responsive**: Optimización para móviles y tablets
- ✅ **Efectos Visuales**: Animaciones shimmer y hover avanzadas
- ✅ Persistencia de datos
- ✅ Integración con Electron
- ✅ Configuración de desarrollo
- ✅ Configuración de distribución
- ✅ Menú personalizado en español
- ✅ Scripts de automatización
- ✅ **Resolución de Base de Datos**: Corrección de errores SQLITE_CANTOPEN
- ✅ **Eliminación de Equipo Automático**: Solucionado problema de creación de "Equipo Principal"
- ✅ **Modo Desarrollo Reparado**: npm run dev funciona correctamente con frontend y backend
- ✅ **Backend Corregido**: Inicialización asíncrona y soporte para desarrollo/producción
- ✅ **Ejecutable Actualizado**: Nueva versión sin creación automática de equipos por defecto

### En Progreso
- 🔄 Optimización de icono de aplicación

### Pendiente
- ⏳ Icono personalizado (.ico)
- ⏳ Instalador automático con firma digital

## 🛠️ Tecnologías

- **Frontend**: React + TypeScript + Vite
- **Backend**: Node.js + Express + SQLite
- **Desktop**: Electron
- **Estilos**: CSS personalizado con gradientes modernos

## 🚀 Desarrollo

### Requisitos previos
- Node.js (versión 16 o superior)
- npm

### Instalación
```bash
# Clonar el repositorio
git clone https://github.com/ThomasSalomon/Aplicacion_listaChicos.git
cd Aplicacion_listaChicos

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

### Ejecutar en modo desarrollo

#### Backend (API Server)
```bash
# Navegar al directorio backend
cd backend

# Ejecutar el servidor de desarrollo
npm run dev
```

El servidor API estará disponible en `http://localhost:3001`

#### Frontend (Electron App)
```bash
# En la raíz del proyecto
npm run dev
```

### Construir para producción
```bash
npm run build
```

### Crear distribución
```bash
npm run dist
```

## 📁 Estructura del proyecto

```
Aplicacion_listaChicos/
├── main.js                 # Proceso principal de Electron
├── package.json            # Configuración del proyecto
├── backend/                # API Server (Node.js + Express)
│   ├── server.js           # Servidor principal
│   ├── config/             # Configuración de DB y app
│   ├── controllers/        # Controladores de API
│   ├── models/             # Modelos de datos
│   ├── routes/             # Rutas de API
│   ├── middleware/         # Middleware personalizado
│   ├── database/           # Base de datos SQLite (carpeta creada)
│   │   └── teams.db        # Base de datos de equipos y niños
│   └── package.json
├── frontend/               # Aplicación React
│   ├── src/
│   │   ├── App.tsx         # Componente principal
│   │   ├── App.css         # Estilos principales
│   │   └── index.css       # Estilos globales
│   ├── public/
│   └── package.json
└── README.md
```

## 📝 Uso

### Gestión de Equipos
1. **Crear un equipo**: 
   - Haz clic en el botón flotante "Crear Nuevo Equipo" (con efecto shimmer)
   - Completa el formulario:
     - **Nombre**: Obligatorio (2-50 caracteres)
     - **Descripción**: Opcional (hasta 100 caracteres)
     - **Color**: Selecciona con el color picker (vista previa en tiempo real)
   - Presiona "Crear Equipo" para guardar

### Gestión de Niños
1. **Agregar un niño**: Escribe el nombre y la edad, luego presiona "Agregar" o Enter
2. **Eliminar un niño**: Haz clic en el botón ❌ junto al nombre
3. **Ver estadísticas**: El contador se actualiza automáticamente

### Navegación
- La interfaz es completamente responsive y se adapta a cualquier dispositivo
- Los formularios incluyen validación en tiempo real
- Las animaciones proporcionan feedback visual intuitivo

## 🔧 Configuración

La aplicación se puede personalizar editando:
- `frontend/src/App.tsx` - Lógica principal y gestión de equipos
- `frontend/src/App.css` - Estilos de la aplicación y efectos visuales
- `main.js` - Configuración de Electron

### API Endpoints
- `GET /api/teams` - Obtener todos los equipos
- `POST /api/teams` - Crear nuevo equipo
- `PUT /api/teams/:id` - Actualizar equipo
- `DELETE /api/teams/:id` - Eliminar equipo

### Base de Datos
La aplicación utiliza SQLite con las siguientes tablas:
- **teams**: id, name, description, color, created_at
- **children**: id, name, age, team_id, created_at

## 🏗️ Distribución

### Crear Ejecutable para Windows
```bash
npm run build
npm run dist:win
```

### Versión Portable (Recomendada)
El ejecutable está disponible en: `dist-final-v10/win-unpacked/Lista de Chicos.exe`

**🆕 Versión Actual (Junio 2025)**: Sin creación automática de equipos por defecto

Para compartir la aplicación:
1. Comprime la carpeta `dist-final-v10/win-unpacked/` en un ZIP
2. Envía el ZIP a la persona
3. La persona descomprime y ejecuta `Lista de Chicos.exe`

### Archivo de Distribución
- **Ubicación**: `dist-final-v10/Lista-de-Chicos-v2-SinEquipoPorDefecto.zip` (~127 MB)
- **Contenido**: Aplicación completa con frontend, backend y base de datos
- **Requisitos**: Ninguno (incluye todo lo necesario)
- **Cambios v2**: Eliminada creación automática de "Equipo Principal"

### Instalación para el Usuario Final
1. Descargar `Lista-de-Chicos-Portable.zip`
2. Extraer en cualquier carpeta
3. Ejecutar `Lista de Chicos.exe`
4. ¡Listo! La aplicación funciona sin instalar Node.js, npm o dependencias

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

## 🎨 Actualización de Diseño

### Cambios Recientes (Junio 2025) - Corrección de Equipo Por Defecto
- ✅ **Eliminación de Equipo Automático**: Resuelto problema donde se creaba automáticamente "Equipo Principal"
- ✅ **Corrección de Base de Datos**: Eliminada lógica que insertaba equipo por defecto en `database.js`
- ✅ **Backend Mejorado**: Corregida inicialización asíncrona del servidor para desarrollo y producción
- ✅ **Modo Desarrollo Reparado**: Solucionado problema donde `npm run dev` no funcionaba correctamente
- ✅ **Controladores Actualizados**: Eliminadas referencias hardcodeadas al equipo con id=1
- ✅ **Frontend Integrado**: Corregido script de desarrollo para incluir frontend, backend y Electron
- ✅ **Ejecutable Actualizado**: Nueva versión empaquetada sin creación automática de equipos

### Problemas Resueltos (Junio 2025)
#### 🔧 Problema Principal: Creación Automática de Equipo
**Descripción**: Cuando la base de datos estaba vacía y se creaba el primer equipo, el sistema automáticamente creaba un "Equipo Principal" adicional no deseado.

**Solución Implementada**:
1. **Eliminado `ensureDefaultTeam()`**: Método que creaba automáticamente el equipo por defecto
2. **Limpieza de `createTablesFromScratch()`**: Removida inserción automática de equipo principal
3. **Actualizado `migrateExistingTable()`**: Cambiado DEFAULT 1 por NULL en team_id
4. **Corregido controlador de niños**: Ya no asume existencia de equipo con id=1

#### 🔧 Problema Secundario: Modo Desarrollo
**Descripción**: El comando `npm run dev` no funcionaba correctamente, mostrando pantalla en blanco.

**Solución Implementada**:
1. **Corregido `server.js`**: Eliminada restricción que impedía ejecución en desarrollo
2. **Inicialización asíncrona**: Movida inicialización de base de datos al método `start()`
3. **Script de desarrollo**: Agregado frontend al comando `dev` para ejecutar Vite
4. **Dependencias frontend**: Instaladas dependencias faltantes en directorio frontend

### Cambios Técnicos Detallados (Junio 2025)

#### Backend (`backend/server.js`)
```javascript
// ANTES: Solo se ejecutaba con IS_ELECTRON_BACKEND
if (!process.env.IS_ELECTRON_BACKEND) {
  process.exit(0);
}

// DESPUÉS: Funciona en desarrollo y producción
const isDevelopment = !process.env.IS_ELECTRON_BACKEND;
const isElectronBackend = process.env.IS_ELECTRON_BACKEND;

if (isDevelopment) {
  console.log('🚀 Iniciando servidor en modo desarrollo...');
} else if (isElectronBackend) {
  console.log('🚀 Iniciando servidor backend de Electron...');
}
```

#### Base de Datos (`backend/config/database.js`)
```javascript
// ELIMINADO: Creación automática de equipo por defecto
// const insertDefaultTeam = `
//   INSERT OR IGNORE INTO teams (id, nombre, descripcion, color) 
//   VALUES (1, 'Equipo Principal', 'Equipo por defecto del sistema', '#3B82F6')
// `;

// ELIMINADO: Método ensureDefaultTeam()
// ensureDefaultTeam(resolve, reject) { ... }

// ACTUALIZADO: createTablesFromScratch() - Solo crea tablas
this.db.serialize(() => {
  this.db.run(createTeamsTable, (err) => {
    // Crear tabla de equipos
    this.db.run(createChildrenTable, (err) => {
      // Crear tabla de niños - SIN insertar equipo por defecto
      resolve();
    });
  });
});
```

#### Scripts de Desarrollo (`package.json`)
```json
// ANTES: Solo backend y electron
"dev": "concurrently \"npm run dev:backend\" \"npm run dev:electron\""

// DESPUÉS: Incluye frontend completo
"dev": "concurrently \"npm run dev:backend\" \"npm run dev:frontend\" \"npm run dev:electron\""
```

#### Controlador de Niños (`backend/controllers/childrenController.js`)
```javascript
// ANTES: Asumía equipo por defecto
const teamId = team_id ? parseInt(team_id) : 1; // Default al equipo principal

// DESPUÉS: Requiere team_id explícito
if (!team_id) {
  return res.status(400).json({ 
    error: 'Team ID requerido',
    message: 'Debe especificar un equipo válido'
  });
}
```

### Flujo de Trabajo Mejorado (Junio 2025)

#### Desarrollo Local
```bash
# 1. Instalar dependencias (solo primera vez)
npm install
cd frontend && npm install && cd ..
cd backend && npm install && cd ..

# 2. Ejecutar en modo desarrollo
npm run dev
# Esto ahora inicia:
# - Backend en http://localhost:3001
# - Frontend en http://localhost:5173  
# - Electron conectando ambos
```

#### Construcción y Distribución
```bash
# 1. Construir para producción
npm run build

# 2. Crear ejecutable
npm run dist

# 3. Ejecutable resultante
# Ubicación: dist-final-v10/win-unpacked/Lista de Chicos.exe
# Características: Sin creación automática de equipos
```

### Comportamiento Actual vs. Anterior

#### ❌ Comportamiento Anterior (Problemático)
1. Usuario abre aplicación por primera vez
2. Base de datos está vacía
3. Usuario crea equipo "Mi Equipo"
4. **Sistema automáticamente crea "Equipo Principal"** ❌
5. Usuario ve dos equipos: "Mi Equipo" + "Equipo Principal"

#### ✅ Comportamiento Actual (Corregido)
1. Usuario abre aplicación por primera vez
2. Base de datos está vacía
3. Usuario crea equipo "Mi Equipo"
4. **Solo existe "Mi Equipo"** ✅
5. Usuario ve únicamente el equipo que creó

### Validación del Fix

Para verificar que el problema está resuelto:

1. **Eliminar base de datos existente**:
   ```bash
   Remove-Item "backend/database/children.sqlite" -ErrorAction SilentlyContinue
   ```

2. **Ejecutar aplicación**:
   ```bash
   # En desarrollo
   npm run dev
   
   # O usar ejecutable
   ./dist-final-v10/win-unpacked/Lista de Chicos.exe
   ```

3. **Crear primer equipo**: Verificar que solo aparece el equipo creado

4. **Verificar base de datos**:
   ```bash
   node backend/debug-db.js
   # Debe mostrar solo el equipo creado por el usuario
   ```
- ✅ **Nueva Paleta de Colores**: Migración a tema oscuro y elegante
- ✅ **Efectos Glassmorphism**: Aplicación de transparencias y blur effects
- ✅ **Animaciones Sutiles**: Transiciones suaves y efectos de entrada
- ✅ **Scrollbar Personalizado**: Para listas largas con estilo consistente
- ✅ **Mejoras en Botones**: Efectos hover y estados activos mejorados

### Componentes Agregados
#### Botón Flotante de Creación
```css
.create-team-btn-floating {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
  /* Efectos shimmer y hover implementados */
}
```

#### Formulario de Equipos
- **Validación en tiempo real**: Nombre obligatorio 2-50 caracteres
- **Color picker**: Selección visual con preview instantáneo
- **Descripción opcional**: Hasta 100 caracteres
- **Manejo de errores**: Alertas integradas con el sistema modal existente

#### Responsive Design
- **Mobile**: Ajustes para pantallas < 768px
  - Botón adaptado al ancho de pantalla
  - Formulario optimizado para touch
  - Espaciado mejorado para dispositivos pequeños

### Estructura de Base de Datos
```sql
-- Tabla teams
CREATE TABLE teams (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    color TEXT DEFAULT '#3498db',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla children (existente, modificada para relación con teams)
CREATE TABLE children (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    age INTEGER,
    team_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (team_id) REFERENCES teams(id)
);
```

### API Implementada
- **POST /api/teams**: Creación de equipos con validación
- **GET /api/teams**: Listado de todos los equipos
- **Validación backend**: Control de datos de entrada
- **Manejo de errores**: Respuestas HTTP apropiadas

### Paleta de Colores Actual
- **Fondo Principal**: Gradiente oscuro (#1a1d21 → #2d3436)
- **Contenedores**: Glassmorphism con rgba(44, 62, 80, 0.95)
- **Botón Flotante**: Gradiente púrpura-azul (#667eea → #764ba2)
- **Acentos**: Azul elegante (#3498db) y rojo sofisticado (#e74c3c)
- **Texto**: Blanco suave (#ecf0f1) y grises elegantes (#95a5a6)
- **Bordes**: Transparencias sutiles con rgba values

### Mejoras de UX/UI
1. **Jerarquía Visual**: Botón flotante posicionado estratégicamente
2. **Feedback Visual**: Animaciones que confirman acciones del usuario
3. **Accesibilidad**: Contrastes apropiados y navegación por teclado
4. **Performance**: Animaciones optimizadas con CSS transforms
5. **Consistencia**: Integración perfecta con el diseño existente

## 🔄 Notas de Versión

### v2.0 (Junio 2025) - "Sin Equipo Por Defecto"
**🎯 Cambio Principal**: Eliminada creación automática de "Equipo Principal"

**🔧 Correcciones**:
- ✅ Ya no se crea equipo por defecto al inicializar base de datos
- ✅ Modo desarrollo (`npm run dev`) funciona correctamente
- ✅ Backend soporta tanto desarrollo como producción
- ✅ Controladores no asumen existencia de equipo con id=1
- ✅ Inicialización asíncrona del servidor corregida

**📱 Compatibilidad**:
- ✅ Mantiene compatibilidad con bases de datos existentes
- ✅ Migración automática de esquemas antiguos
- ✅ Preserva datos de equipos y niños existentes

**🚀 Distribución**:
- **Ubicación**: `dist-final-v10/win-unpacked/Lista de Chicos.exe`
- **Fecha de compilación**: Junio 4, 2025
- **Tamaño**: ~127 MB (portable, sin instalación)

### v1.0 (Diciembre 2024) - "Sistema de Equipos"
**🎯 Cambio Principal**: Implementación completa del sistema de equipos

**✨ Nuevas Características**:
- Sistema completo de gestión de equipos
- Botón flotante con efectos visuales modernos
- Formulario de creación con validación
- Color picker integrado
- Diseño responsive optimizado

---

**📋 Resumen de Cambios Críticos para Usuarios**:
- **Antes v2.0**: Al crear el primer equipo aparecían 2 equipos (el tuyo + "Equipo Principal")
- **Desde v2.0**: Solo aparece el equipo que tú creas, sin equipos automáticos adicionales
