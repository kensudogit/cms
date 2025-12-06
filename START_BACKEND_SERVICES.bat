@echo off
echo ========================================
echo CMS Backend Services Startup
echo ========================================
echo.

REM 現在のポート使用状況を確認
echo Checking current port usage...
netstat -ano | findstr ":8080" >nul
if %errorlevel% equ 0 (
    echo [WARNING] Port 8080 is already in use
) else (
    echo [OK] Port 8080 is available
)

netstat -ano | findstr ":8081" >nul
if %errorlevel% equ 0 (
    echo [WARNING] Port 8081 is already in use
) else (
    echo [OK] Port 8081 is available
)

netstat -ano | findstr ":8082" >nul
if %errorlevel% equ 0 (
    echo [WARNING] Port 8082 is already in use
) else (
    echo [OK] Port 8082 is available
)

echo.
echo Starting services...
echo.

REM データベースの確認
echo [1/4] Checking PostgreSQL databases...
docker ps | findstr "cms-postgres" >nul
if %errorlevel% equ 0 (
    echo [OK] PostgreSQL databases are running
) else (
    echo [INFO] Starting PostgreSQL databases...
    docker-compose up -d
    timeout /t 5 /nobreak >nul
)

echo.
echo [2/4] Starting Auth Service (port 8081)...
start "CMS Auth Service" cmd /k "cd /d %~dp0 && gradlew.bat :services:auth-service:bootRun"
timeout /t 15 /nobreak >nul

echo.
echo [3/4] Starting Content Service (port 8082)...
start "CMS Content Service" cmd /k "cd /d %~dp0 && gradlew.bat :services:content-service:bootRun"
timeout /t 15 /nobreak >nul

echo.
echo [4/4] Starting API Gateway (port 8080)...
start "CMS API Gateway" cmd /k "cd /d %~dp0 && gradlew.bat :services:api-gateway:bootRun"
timeout /t 15 /nobreak >nul

echo.
echo ========================================
echo Services are starting...
echo ========================================
echo.
echo Please wait 60-90 seconds for all services to fully start.
echo.
echo Service URLs:
echo   - API Gateway: http://localhost:8080
echo   - Auth Service: http://localhost:8081
echo   - Content Service: http://localhost:8082
echo.
echo To check service status, run: check-services.bat
echo.
echo Press any key to exit this window (services will continue running)...
pause >nul

