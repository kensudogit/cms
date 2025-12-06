@echo off
echo ========================================
echo Restarting API Gateway
echo ========================================
echo.

echo [1/3] Stopping API Gateway...
for /f "tokens=2" %%a in ('netstat -ano ^| findstr ":8080" ^| findstr "LISTENING"') do (
    taskkill /F /PID %%a >nul 2>&1
    echo Stopped process on port 8080 (PID: %%a)
)
timeout /t 3 /nobreak >nul

echo.
echo [2/3] Rebuilding API Gateway...
cd /d "%~dp0"
call gradlew.bat :services:api-gateway:clean :services:api-gateway:build -x test
if %errorlevel% neq 0 (
    echo [ERROR] Build failed!
    pause
    exit /b 1
)

echo.
echo [3/3] Starting API Gateway...
start "CMS API Gateway" cmd /k "cd /d %~dp0 && gradlew.bat :services:api-gateway:bootRun"

echo.
echo ========================================
echo API Gateway is restarting...
echo Please wait 30-60 seconds for it to fully start.
echo ========================================
echo.
echo Press any key to exit this window (API Gateway will continue running)...
pause >nul

