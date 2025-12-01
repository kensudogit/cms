@echo off
echo Starting CMS Backend Services...
echo.

REM PostgreSQLデータベースの起動（Docker Compose）
echo [1/5] Starting PostgreSQL databases...
cd /d %~dp0
docker-compose up -d
timeout /t 5 /nobreak >nul
echo PostgreSQL databases started.
echo.

REM Auth Service
echo [2/5] Starting Auth Service (port 8081)...
start "Auth Service" cmd /k "cd /d %~dp0services\auth-service && ..\gradlew.bat :services:auth-service:bootRun"
timeout /t 10 /nobreak >nul
echo.

REM Content Service
echo [3/5] Starting Content Service (port 8082)...
start "Content Service" cmd /k "cd /d %~dp0services\content-service && ..\gradlew.bat :services:content-service:bootRun"
timeout /t 10 /nobreak >nul
echo.

REM API Gateway
echo [4/5] Starting API Gateway (port 8080)...
start "API Gateway" cmd /k "cd /d %~dp0services\api-gateway && ..\gradlew.bat :services:api-gateway:bootRun"
timeout /t 10 /nobreak >nul
echo.

echo [5/5] All services starting...
echo.
echo Services are starting in separate windows.
echo Please wait for all services to fully start before using the frontend.
echo.
echo Service URLs:
echo   - API Gateway: http://localhost:8080
echo   - Auth Service: http://localhost:8081
echo   - Content Service: http://localhost:8082
echo.
echo Press any key to exit this window (services will continue running)...
pause >nul

