# Configuración para Acceso Remoto - Lista de Chicos

## 🌐 Configuración para Desarrollo en Red Local

### Opción 1: Usar el script de red (Recomendado)
```bash
npm run dev:network
```

### Opción 2: Comandos manuales
```bash
# Terminal 1 - Backend
cd backend
HOST=0.0.0.0 node server.js

# Terminal 2 - Frontend
cd frontend
npm run dev -- --host 0.0.0.0
```

## 📱 Cómo acceder desde otros dispositivos

### 🏠 Red Local (Misma WiFi)
- **Frontend**: `http://TU_IP:3000`
- **Backend API**: `http://TU_IP:3001`
- **Ejemplo**: `http://192.168.1.100:3000`

### 🌍 Acceso desde Internet (Datos móviles/Otras redes)

#### Opción A: Túneles Temporales (Ngrok) - Para Testing Rápido
```bash
# 1. Instalar ngrok (solo una vez)
npm install -g ngrok

# 2. Ejecutar tu aplicación en modo network
npm run dev:network

# 3. En nuevas terminales, crear túneles públicos
ngrok http 3000  # Para frontend
### Opción A: Túneles Temporales (ngrok)

#### Configuración Inicial de ngrok

**⚠️ Configuración requerida una sola vez:**

1. **Instalar ngrok:**
   - Ve a [ngrok.com/download](https://ngrok.com/download)
   - Descarga ngrok para Windows
   - Extrae `ngrok.exe` y agrégalo a tu PATH o ponlo en la carpeta del proyecto

2. **Crear cuenta gratuita:**
   - Ve a [ngrok.com/signup](https://ngrok.com/signup)
   - Regístrate con email o GitHub

3. **Configurar authtoken:**
   - Ve al [dashboard de ngrok](https://dashboard.ngrok.com/get-started/your-authtoken)
   - Copia tu authtoken
   - Ejecuta: `ngrok config add-authtoken TU_TOKEN_AQUI`

   Ejemplo:
   ```bash
   ngrok config add-authtoken 2abcdefghijklmnop_1234567890abcdef
   ```

#### Crear Túneles Públicos

**Método Manual:**
```bash
# 1. Iniciar app en modo red
npm run dev:network

# 2. En otra terminal - Frontend
ngrok http 3000

# 3. En otra terminal - Backend  
ngrok http 3001  # Para backend

# 4. Configurar frontend para usar backend público
config-api.bat   # Seleccionar opción 3, pegar URL de ngrok del backend
```

**Script automático:**
```bash
expose-public.bat  # Crea ambos túneles automáticamente
```

El script verificará automáticamente si ngrok está instalado y configurado, y te guiará si falta algo.

#### Opción B: Deploy Permanente (Para Producción)

##### Backend en Railway/Heroku
```bash
# 1. Crear cuenta en Railway.app o Heroku
# 2. Conectar repositorio
# 3. Configurar variables de entorno:
PORT=3001
HOST=0.0.0.0
NODE_ENV=production

# 4. Deploy automático desde GitHub
```

##### Frontend en Netlify/Vercel
```bash
# 1. Build local
npm run build

# 2. Subir carpeta frontend/dist a Netlify
# O conectar repositorio para deploy automático

# 3. Configurar API en .env
VITE_API_BASE_URL=https://tu-backend.railway.app
```

## � Configuración de Firewall (Windows)

### Verificar puertos
```bash
netstat -ano | findstr :3000
netstat -ano | findstr :3001
```

### Permitir en firewall
1. Windows Defender Firewall → Permitir una aplicación
2. Buscar "Node.js" y marcar ambas casillas (Privada y Pública)
3. O crear reglas específicas para puertos 3000 y 3001

## 🚨 Limitaciones de Red Local

### ✅ Funciona:
- Misma red WiFi
- Dispositivos conectados al mismo router
- Red corporativa/escolar (si permite)

### ❌ NO funciona automáticamente:
- Datos móviles
- Otras redes WiFi
- Internet público

### � Solución:
**Para acceso desde internet necesitas:**
1. **IP pública** + configuración del router (complejo)
2. **Túneles temporales** (ngrok, localtunnel)
3. **Deploy en la nube** (Railway, Heroku, Netlify)

## 📊 Comparación de Opciones

| Método | Facilidad | Costo | Permanencia | Uso Recomendado |
|--------|-----------|-------|-------------|-----------------|
| Red Local | ⭐⭐⭐⭐⭐ | Gratis | Temporal | Desarrollo local |
| Ngrok | ⭐⭐⭐⭐ | Gratis* | Temporal | Testing rápido |
| Railway/Heroku | ⭐⭐⭐ | Gratis* | Permanente | Demos/Producción |
| Netlify/Vercel | ⭐⭐⭐⭐ | Gratis | Permanente | Frontend público |

*Gratis con limitaciones, planes pagos disponibles

## 🎯 Recomendaciones por Uso

### 🧪 **Testing Personal**
```bash
npm run dev:network  # Red local
expose-public.bat    # Testing desde datos móviles
```

### 👥 **Demos a Clientes**
- Deploy backend: Railway.app
- Deploy frontend: Netlify.com
- URL permanente y profesional

### 🚀 **Producción**
- Backend: Railway/Heroku con dominio personalizado
- Frontend: Netlify/Vercel con dominio personalizado
- Base de datos: PostgreSQL en la nube
- HTTPS obligatorio
