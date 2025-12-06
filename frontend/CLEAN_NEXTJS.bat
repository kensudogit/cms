@echo off
echo ========================================
echo Next.js Clean Restart Script
echo ========================================
echo.

echo [1/4] Stopping all Node.js processes...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 >nul
echo Done.

echo.
echo [2/4] Clearing Next.js build cache...
cd /d "%~dp0"
if exist .next (
    rmdir /s /q .next
    echo .next directory removed.
)
if exist node_modules\.cache (
    rmdir /s /q node_modules\.cache
    echo node_modules\.cache removed.
)
echo Done.

echo.
echo [3/4] Starting development server...
echo Please wait for "Ready" message before accessing http://localhost:3002
echo.
npm run dev

pause

