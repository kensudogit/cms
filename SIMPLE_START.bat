@echo off
echo ========================================
echo Simple CMS Backend Startup
echo ========================================
echo.

echo Starting Auth Service...
start "Auth" cmd /k "cd /d %~dp0 && gradlew.bat :services:auth-service:bootRun"
timeout /t 15 /nobreak >nul

echo Starting Content Service...
start "Content" cmd /k "cd /d %~dp0 && gradlew.bat :services:content-service:bootRun"
timeout /t 15 /nobreak >nul

echo Starting API Gateway...
start "Gateway" cmd /k "cd /d %~dp0 && gradlew.bat :services:api-gateway:bootRun"
timeout /t 15 /nobreak >nul

echo.
echo All services are starting...
echo Please wait 60-90 seconds, then check:
echo   http://localhost:8080/api/auth/health
echo.
pause



