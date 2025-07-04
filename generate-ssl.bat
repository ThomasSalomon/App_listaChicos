@echo off
echo ======================================
echo  Generando Certificados SSL para HTTPS
echo ======================================
echo.
echo Este script creara certificados SSL auto-firmados
echo para desarrollo local con HTTPS
echo.

REM Verificar si OpenSSL esta disponible
where openssl >nul 2>&1
if errorlevel 1 (
    echo ❌ OpenSSL no esta disponible
    echo.
    echo Para instalar OpenSSL:
    echo 1. Descarga desde: https://slproweb.com/products/Win32OpenSSL.html
    echo 2. O usa Chocolatey: choco install openssl
    echo 3. O usa Git Bash que incluye OpenSSL
    echo.
    pause
    exit /b 1
)

echo ✅ OpenSSL encontrado
echo.

REM Crear directorio de certificados
if not exist "frontend\certs" mkdir "frontend\certs"

echo Generando clave privada...
openssl genrsa -out frontend\certs\key.pem 2048

echo.
echo Generando certificado auto-firmado...
openssl req -new -x509 -key frontend\certs\key.pem -out frontend\certs\cert.pem -days 365 -subj "/C=ES/ST=State/L=City/O=Organization/CN=localhost"

echo.
echo ✅ Certificados SSL generados exitosamente!
echo.
echo Archivos creados:
echo - frontend\certs\key.pem
echo - frontend\certs\cert.pem
echo.
echo IMPORTANTE:
echo - Los certificados son auto-firmados (solo para desarrollo)
echo - El navegador mostrara una advertencia de seguridad
echo - Haz clic en "Avanzado" y "Continuar" para acceder
echo.
echo Ahora puedes usar: npm run dev:network
echo Y acceder via: https://localhost:3000
echo.
pause
