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
- 💪 **Estado Físico**: Seguimiento del estado físico de cada niño
  - 💪 "En forma" - Niño disponible para actividades completas
  - 🤕 "Lesionado" - Niño con limitaciones físicas temporales
- 💰 **Condición de Pago**: Gestión del estado de pagos
  - ✅ "Al día" - Pagos actualizados sin pendientes
  - ⚠️ "En deuda" - Pagos pendientes que requieren atención
- 🏷️ **Etiquetas de Estado**: Badges visuales con iconos y colores para identificación rápida
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
2. **Ver información**: Cada niño muestra:
   - Nombre completo y edad actual
   - Fecha de nacimiento formateada
   - Estado físico con badge visual e icono
   - Condición de pago con badge visual e icono
3. **Eliminar un niño**: Haz clic en el botón ❌ junto al nombre con confirmación de seguridad
4. **Actualización automática**: Las edades se actualizan automáticamente en tiempo real

### Cerrar la Aplicación
1. **Botón de Salir**: Ubicado en la parte inferior del menú principal
2. **Confirmación Segura**: Al hacer clic aparece un diálogo de confirmación
3. **Cierre Automático**: Confirma para cerrar la aplicación de forma segura

## 🔄 Historial de Versiones

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
