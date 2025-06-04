# 🧒 Lista de Chicos

Una aplicación de escritorio moderna para gestionar listas de niños, construida con React, Vite y Electron.

## 📋 Características

- ✅ Agregar niños a la lista con nombre y edad
- ❌ Eliminar niños de la lista individualmente  
- 🗑️ Limpiar toda la lista con confirmación
- 💾 Persistencia de datos con localStorage
- 📊 Contador total de niños
- 🎨 Interfaz moderna y atractiva con gradientes
- 💻 Aplicación de escritorio nativa
- ⚡ Rendimiento rápido con Vite
- 🇪🇸 Menú en español
- 🔧 Configuración de distribución para Windows

## ✅ Estado del Proyecto

### Completado
- ✅ Aplicación React funcional con TypeScript
- ✅ Interfaz de usuario moderna y responsiva
- ✅ Funcionalidad completa de gestión de lista
- ✅ Persistencia de datos
- ✅ Integración con Electron
- ✅ Configuración de desarrollo
- ✅ Configuración de distribución
- ✅ Menú personalizado en español
- ✅ Scripts de automatización

### En Progreso
- 🔄 Generación de instalador de Windows
- 🔄 Optimización de icono de aplicación

### Pendiente
- ⏳ Pruebas de distribución final
- ⏳ Icono personalizado (.ico)
- ⏳ Pruebas de persistencia entre sesiones

## 🛠️ Tecnologías

- **Frontend**: React + TypeScript + Vite
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
```

### Ejecutar en modo desarrollo
```bash
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

1. **Agregar un niño**: Escribe el nombre y la edad, luego presiona "Agregar" o Enter
2. **Eliminar un niño**: Haz clic en el botón ❌ junto al nombre
3. **Ver estadísticas**: El contador se actualiza automáticamente

## 🔧 Configuración

La aplicación se puede personalizar editando:
- `frontend/src/App.tsx` - Lógica principal
- `frontend/src/App.css` - Estilos de la aplicación
- `main.js` - Configuración de Electron

## 🏗️ Distribución

Para crear un instalador para Windows:
```bash
npm run dist:win
```

El instalador se generará en la carpeta `dist/`.

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

### Cambios Recientes (Junio 2025)
- ✅ **Nueva Paleta de Colores**: Migración a tema oscuro y elegante
- ✅ **Efectos Glassmorphism**: Aplicación de transparencias y blur effects
- ✅ **Animaciones Sutiles**: Transiciones suaves y efectos de entrada
- ✅ **Scrollbar Personalizado**: Para listas largas con estilo consistente
- ✅ **Mejoras en Botones**: Efectos hover y estados activos mejorados

### Paleta de Colores Actual
- **Fondo Principal**: Gradiente oscuro (#1a1d21 → #2d3436)
- **Contenedores**: Glassmorphism con rgba(44, 62, 80, 0.95)
- **Acentos**: Azul elegante (#3498db) y rojo sofisticado (#e74c3c)
- **Texto**: Blanco suave (#ecf0f1) y grises elegantes (#95a5a6)
- **Bordes**: Transparencias sutiles con rgba values
