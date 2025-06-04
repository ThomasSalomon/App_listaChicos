@echo off
echo 🧒 Lista de Chicos - Aplicacion de Escritorio
echo =============================================
echo.
echo Selecciona una opcion:
echo 1. Ejecutar en modo desarrollo
echo 2. Construir para produccion
echo 3. Crear distribucion (instalador)
echo 4. Limpiar archivos temporales
echo 5. Salir
echo.
set /p choice="Ingresa tu opcion (1-5): "

if "%choice%"=="1" (
    echo.
    echo 🚀 Iniciando aplicacion en modo desarrollo...
    npm run dev
) else if "%choice%"=="2" (
    echo.
    echo 🔨 Construyendo aplicacion...
    npm run build
    echo ✅ Construccion completada!
) else if "%choice%"=="3" (
    echo.
    echo 📦 Creando distribucion...
    npm run dist:win
    echo ✅ Distribucion creada en la carpeta 'dist'!
) else if "%choice%"=="4" (
    echo.
    echo 🧹 Limpiando archivos temporales...
    if exist node_modules rmdir /s /q node_modules
    if exist frontend\node_modules rmdir /s /q frontend\node_modules
    if exist frontend\dist rmdir /s /q frontend\dist
    if exist dist rmdir /s /q dist
    echo ✅ Limpieza completada!
) else if "%choice%"=="5" (
    echo.
    echo 👋 ¡Hasta luego!
) else (
    echo.
    echo ❌ Opcion invalida. Por favor selecciona 1-5.
)

pause
