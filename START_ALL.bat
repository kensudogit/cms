@echo off
echo ========================================
echo CMS Backend Services Startup
echo ========================================
echo.

REM データベースの起動
echo [1/4] Starting PostgreSQL databases...
cd /d %~dp0
docker-compose up -d
if %errorlevel% neq 0 (
    echo ERROR: Failed to start databases. Make sure Docker is running.
    pause
    exit /b 1
)
echo Waiting for databases to be ready...
timeout /t 10 /nobreak >nul
echo Databases started.
echo.

REM Auth Serviceの起動
echo [2/4] Starting Auth Service (port 8081)...
start "CMS Auth Service" cmd /k "cd /d %~dp0 && gradlew.bat :services:auth-service:bootRun"
timeout /t 15 /nobreak >nul
echo Auth Service starting...
echo.

REM Content Serviceの起動
echo [3/4] Starting Content Service (port 8082)...
start "CMS Content Service" cmd /k "cd /d %~dp0 && gradlew.bat :services:content-service:bootRun"
timeout /t 15 /nobreak >nul
echo Content Service starting...
echo.

REM API Gatewayの起動
echo [4/4] Starting API Gateway (port 8080)...
start "CMS API Gateway" cmd /k "cd /d %~dp0 && gradlew.bat :services:api-gateway:bootRun"
timeout /t 15 /nobreak >nul
echo API Gateway starting...
echo.

echo ========================================
echo All services are starting...
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


