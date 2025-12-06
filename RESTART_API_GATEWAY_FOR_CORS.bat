@echo off
echo ========================================
echo API Gateway Restart for CORS Fix
echo ========================================
echo.

REM API Gatewayのプロセスを検索
echo Finding API Gateway process...
for /f "tokens=2" %%a in ('netstat -ano ^| findstr ":8080" ^| findstr "LISTENING"') do (
    set PID=%%a
    echo Found API Gateway process: PID %%a
    echo Stopping API Gateway...
    taskkill /F /PID %%a >nul 2>&1
    timeout /t 3 /nobreak >nul
)

echo.
echo Starting API Gateway...
cd /d %~dp0
start "CMS API Gateway" cmd /k "gradlew.bat :services:api-gateway:bootRun"

echo.
echo ========================================
echo API Gateway is restarting...
echo ========================================
echo.
echo Please wait 30-60 seconds for the service to fully start.
echo.
echo The CORS configuration has been updated to include:
echo   - http://localhost:3000
echo   - http://localhost:3001
echo   - http://localhost:3002
echo.
echo Press any key to exit this window (service will continue running)...
pause >nul

