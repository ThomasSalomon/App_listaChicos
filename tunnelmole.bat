@echo off
echo ===================================
echo  Lista de Chicos - Tunnelmole
echo ===================================
echo.
echo Creando tuneles publicos con tunnelmole...
echo.
echo IMPORTANTE: Asegurate de tener npm run dev:network ejecutandose
echo.
echo Presiona cualquier tecla para continuar...
pause >nul
echo.

echo Creando tunel para Frontend (puerto 3000)...
start "Frontend - Tunnelmole" cmd /k "echo === FRONTEND TUNNEL (Puerto 3000) === && echo. && npx tunnelmole 3000"

echo Esperando 3 segundos...
ping localhost -n 4 >nul

echo.
echo Creando tunel para Backend (puerto 3001)...
start "Backend - Tunnelmole" cmd /k "echo === BACKEND TUNNEL (Puerto 3001) === && echo. && npx tunnelmole 3001"

echo.
echo ================================================
echo  INSTRUCCIONES:
echo ================================================
echo.
echo 1. Espera a que ambos tuneles se conecten
echo 2. En la ventana BACKEND, copia la URL (ej: https://abc123.tunnelmole.net)
echo 3. Ejecuta config-api.bat y selecciona opcion 3
echo 4. Pega la URL del backend
echo 5. Usa la URL del FRONTEND desde cualquier dispositivo
echo.
echo VENTAJAS DE TUNNELMOLE:
echo - Gratuito sin limites
echo - Sin registro requerido
echo - URLs mas simples
echo.
echo Las ventanas de tunnelmole seguiran abiertas.
echo Presiona cualquier tecla para salir de este script...
pause >nul
