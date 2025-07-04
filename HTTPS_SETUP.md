# 🔒 Configuración HTTPS - Lista de Chicos

Esta guía explica cómo configurar HTTPS en tu aplicación Lista de Chicos para desarrollo local y producción.

## 📋 Tabla de Contenidos

- [Desarrollo Local con SSL](#desarrollo-local-con-ssl)
- [Producción con Certificados Válidos](#producción-con-certificados-válidos)
- [Túneles HTTPS](#túneles-https)
- [Troubleshooting](#troubleshooting)

## 🔧 Desarrollo Local con SSL

### Paso 1: Generar Certificados Auto-firmados

```bash
# Opción 1: Usar script automatizado
npm run ssl:generate

# Opción 2: Manual con OpenSSL
generate-ssl.bat
```

### Paso 2: Iniciar con HTTPS

```bash
# Iniciar aplicación con HTTPS
npm run dev:https
```

### Paso 3: Acceder

- **Frontend HTTPS**: `https://localhost:3000`
- **Backend HTTPS**: `https://localhost:3001`
- **Red local**: `https://TU_IP:3000`

### ⚠️ Advertencias del Navegador

Los certificados auto-firmados mostrarán advertencias de seguridad:

1. **Chrome/Edge**: Clic en "Avanzado" → "Continuar a localhost"
2. **Firefox**: Clic en "Avanzado" → "Aceptar el riesgo y continuar"
3. **Safari**: Clic en "Mostrar detalles" → "Visitar este sitio web"

## 🌐 Producción con Certificados Válidos

### Opción 1: Let's Encrypt (Gratuito)

```bash
# Con Certbot
sudo apt-get install certbot
sudo certbot certonly --standalone -d tu-dominio.com

# Copiar certificados
cp /etc/letsencrypt/live/tu-dominio.com/privkey.pem frontend/certs/key.pem
cp /etc/letsencrypt/live/tu-dominio.com/fullchain.pem frontend/certs/cert.pem
```

### Opción 2: Certificados Comerciales

1. **Comprar certificado** (GoDaddy, DigiCert, etc.)
2. **Generar CSR** con tu dominio
3. **Descargar certificados**
4. **Copiar a** `frontend/certs/`

### Opción 3: Deploy en Plataformas con SSL

#### Netlify/Vercel (Frontend)
- SSL automático incluido
- No requiere configuración adicional

#### Railway/Heroku (Backend)
- SSL automático para dominios `.railway.app` / `.herokuapp.com`
- Para dominios personalizados: configurar en dashboard

## 🚇 Túneles HTTPS

### ngrok con SSL
```bash
# Túnel HTTPS automático
ngrok http 3000 --scheme=https
ngrok http 3001 --scheme=https
```

### Cloudflare Tunnel
```bash
# Instalar cloudflared
# Crear túnel con SSL automático
cloudflared tunnel --url localhost:3000
```

## 🔍 Verificación SSL

### Verificar Certificados
```bash
# Verificar certificado local
openssl x509 -in frontend/certs/cert.pem -text -noout

# Verificar conexión HTTPS
curl -k https://localhost:3000
```

### Herramientas Online
- [SSL Labs Test](https://www.ssllabs.com/ssltest/)
- [SSL Checker](https://www.sslshopper.com/ssl-checker.html)

## 🛠️ Troubleshooting

### Error: "Certificate not found"
```bash
# Regenerar certificados
npm run ssl:generate
```

### Error: "Port already in use"
```bash
# Verificar puertos ocupados
netstat -ano | findstr :3000
netstat -ano | findstr :3001

# Matar procesos si es necesario
taskkill /f /pid NUMERO_PID
```

### Error: "Mixed Content" en navegador
- Asegurar que todas las APIs usen HTTPS
- Verificar que `config-api.bat` tenga URLs con `https://`

### Certificados expirados
```bash
# Ver fecha de expiración
openssl x509 -in frontend/certs/cert.pem -noout -dates

# Regenerar si están expirados
npm run ssl:generate
```

## 🏗️ Arquitectura HTTPS

```
┌─────────────────┐    HTTPS     ┌─────────────────┐
│                 │◄─────────────►│                 │
│   Frontend      │               │   Backend       │
│   Port 3000     │               │   Port 3001     │
│   SSL Enabled   │               │   SSL Enabled   │
└─────────────────┘               └─────────────────┘
        │                                 │
        │            HTTPS                │
        ▼                                 ▼
┌─────────────────────────────────────────────────────┐
│              Internet / Red Local                   │
│          🔒 Comunicación Encriptada 🔒             │
└─────────────────────────────────────────────────────┘
```

## 📚 Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run ssl:generate` | Genera certificados SSL auto-firmados |
| `npm run dev:https` | Inicia aplicación con HTTPS |
| `npm run dev:network` | Modo red (HTTP/HTTPS automático) |
| `generate-ssl.bat` | Script manual para certificados |

## 🔐 Beneficios de HTTPS

- **🛡️ Seguridad**: Encriptación de datos en tránsito
- **🔒 Autenticación**: Verificación de identidad del servidor
- **✅ Confianza**: Navegadores muestran candado verde
- **⚡ Performance**: HTTP/2 requiere HTTPS
- **📱 PWA**: Service Workers requieren HTTPS
- **🌐 APIs Modernas**: Muchas APIs requieren HTTPS

## 📝 Notas Importantes

- Los certificados auto-firmados son **solo para desarrollo**
- Para producción usa **certificados válidos** de una CA reconocida
- Los archivos de certificados están en `.gitignore` por seguridad
- Renueva certificados antes de que expiren
- Usa HTTPS para **todas** las comunicaciones en producción
