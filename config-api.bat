@echo off
echo ===================================
echo  Lista de Chicos - Configuracion API
echo ===================================
echo.
echo Selecciona el modo de configuracion:
echo.
echo 1. Red Local (deteccion automatica)
echo 2. IP especifica
echo 3. Servidor externo
echo.
set /p choice="Ingresa tu opcion (1-3): "

cd frontend

if "%choice%"=="1" (
    echo VITE_API_BASE_URL= > .env
    echo ✅ Configurado para red local (deteccion automatica)
    echo El frontend detectara automaticamente la IP del servidor
    goto :end
)

if "%choice%"=="2" (
    set /p ip="Ingresa la IP del servidor (ej: 192.168.1.104): "
    echo VITE_API_BASE_URL=http://%ip%:3001 > .env
    echo ✅ Configurado para IP especifica: %ip%
    goto :end
)

if "%choice%"=="3" (
    set /p url="Ingresa la URL completa del backend (ej: https://tu-servidor.com:3001): "
    echo VITE_API_BASE_URL=%url% > .env
    echo ✅ Configurado para servidor externo: %url%
    goto :end
)

echo ❌ Opcion invalida
goto :end

:end
echo.
echo Configuracion guardada en frontend/.env
echo Ejecuta 'npm run dev:network' para iniciar en modo red
echo.
pause
