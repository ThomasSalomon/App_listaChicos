@echo off
echo =========================================
echo  Lista de Chicos - Setup Completo Publico
echo =========================================
echo.
echo Este script hara TODO automaticamente:
echo 1. Iniciara la aplicacion en modo red
echo 2. Creara tuneles publicos con ngrok
echo 3. Te dara las URLs para compartir
echo.
echo IMPORTANTE: Asegurate de tener ngrok instalado
echo npm install -g ngrok
echo.
pause

echo ✅ Paso 1: Iniciando aplicacion en modo red...
start "App Backend+Frontend" cmd /k "npm run dev:network"

echo ⏳ Esperando 10 segundos para que la app se inicie...
timeout /t 10

echo ✅ Paso 2: Creando tunel para Frontend...
start "Frontend Public" cmd /k "ngrok http 3000"

timeout /t 3

echo ✅ Paso 3: Creando tunel para Backend...
start "Backend Public" cmd /k "ngrok http 3001"

echo.
echo ================================================
echo  PASOS FINALES (MANUAL):
echo ================================================
echo.
echo 1. Espera que ngrok se conecte (30 segundos aprox)
echo 2. Ve a las ventanas de ngrok y copia las URLs
echo 3. Ejecuta: config-api.bat
echo 4. Selecciona opcion 3
echo 5. Pega la URL del BACKEND
echo 6. Comparte la URL del FRONTEND con otros
echo.
echo La URL del FRONTEND es la que envias a otras personas
echo Ejemplo: https://abc123.ngrok.io
echo.
echo ✨ Una vez configurado, cualquiera puede acceder
echo desde datos moviles, otra WiFi, etc.
echo.
pause
