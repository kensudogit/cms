@echo off
echo ========================================
echo CMS Backend Services Startup
echo ========================================
echo.

REM PostgreSQLの確認
echo [1/4] Checking PostgreSQL...
docker ps | findstr postgres >nul
if %errorlevel% equ 0 (
    echo [OK] PostgreSQL is running
) else (
    echo [STARTING] Starting PostgreSQL...
    docker-compose up -d
    timeout /t 5 /nobreak >nul
)
echo.

REM Auth Service
echo [2/4] Starting Auth Service (port 8081)...
cd /d %~dp0
start "CMS - Auth Service" cmd /k "cd /d %~dp0 && gradlew.bat :services:auth-service:bootRun"
timeout /t 15 /nobreak >nul
echo [OK] Auth Service starting...
echo.

REM Content Service
echo [3/4] Starting Content Service (port 8082)...
start "CMS - Content Service" cmd /k "cd /d %~dp0 && gradlew.bat :services:content-service:bootRun"
timeout /t 15 /nobreak >nul
echo [OK] Content Service starting...
echo.

REM API Gateway
echo [4/4] Starting API Gateway (port 8080)...
start "CMS - API Gateway" cmd /k "cd /d %~dp0 && gradlew.bat :services:api-gateway:bootRun"
timeout /t 15 /nobreak >nul
echo [OK] API Gateway starting...
echo.

echo ========================================
echo All services are starting...
echo ========================================
echo.
echo Please wait 30-60 seconds for services to fully start.
echo.
echo Service URLs:
echo   - API Gateway: http://localhost:8080
echo   - Auth Service: http://localhost:8081
echo   - Content Service: http://localhost:8082
echo.
echo To check service status, run: check-services.bat
echo.
echo Press any key to exit (services will continue running)...
pause >nul

