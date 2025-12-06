@echo off
echo ========================================
echo CMS Complete Startup Guide
echo ========================================
echo.

echo This script will help you start all services.
echo.
echo Step 1: Starting Backend Services...
echo.
call START_ALL.bat

echo.
echo ========================================
echo Step 2: Starting Frontend
echo ========================================
echo.
echo Please wait for backend services to start (60-90 seconds)
echo Then run: RESTART_FRONTEND.bat
echo.
echo Or manually start frontend:
echo   cd frontend
echo   npm run dev
echo.
pause

