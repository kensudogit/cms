@echo off
echo ========================================
echo CMS Frontend Restart
echo ========================================
echo.

echo Stopping any running Next.js processes...
taskkill /F /IM node.exe /FI "WINDOWTITLE eq *next*" 2>nul
timeout /t 2 /nobreak >nul

echo Cleaning build cache...
cd /d %~dp0frontend
if exist .next rmdir /s /q .next

echo Starting development server...
echo.
echo Frontend will be available at: http://localhost:3000
echo (or http://localhost:3002 if 3000 is in use)
echo.
echo Press Ctrl+C to stop the server
echo.

npm run dev

