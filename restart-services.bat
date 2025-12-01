@echo off
echo ========================================
echo Restarting CMS Backend Services
echo ========================================
echo.

REM 既存のJavaプロセスを停止
echo [1/5] Stopping existing Java processes...
taskkill /F /IM java.exe >nul 2>&1
timeout /t 2 /nobreak >nul
echo [OK] Java processes stopped
echo.

REM PostgreSQLの確認
echo [2/5] Checking PostgreSQL...
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
echo [3/5] Starting Auth Service (port 8081)...
start "CMS - Auth Service" cmd /k "cd /d %~dp0 && gradlew.bat :services:auth-service:bootRun"
timeout /t 20 /nobreak >nul
echo [OK] Auth Service starting...
echo.

REM Content Service
echo [4/5] Starting Content Service (port 8082)...
start "CMS - Content Service" cmd /k "cd /d %~dp0 && gradlew.bat :services:content-service:bootRun"
timeout /t 20 /nobreak >nul
echo [OK] Content Service starting...
echo.

REM API Gateway
echo [5/5] Starting API Gateway (port 8080)...
start "CMS - API Gateway" cmd /k "cd /d %~dp0 && gradlew.bat :services:api-gateway:bootRun"
timeout /t 20 /nobreak >nul
echo [OK] API Gateway starting...
echo.

echo ========================================
echo All services are starting...
echo ========================================
echo.
echo IMPORTANT: Please wait 60-90 seconds for all services to fully start.
echo.
echo Check service status:
echo   - API Gateway: http://localhost:8080/api/auth/health
echo   - Auth Service: http://localhost:8081/api/auth/health
echo   - Content Service: http://localhost:8082/api/content
echo.
echo After services start, reload your frontend page (Ctrl+F5).
echo.
pause



