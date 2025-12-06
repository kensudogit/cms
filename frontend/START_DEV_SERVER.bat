@echo off
echo ========================================
echo CMS Frontend Development Server
echo ========================================
echo.

cd /d %~dp0

echo [1/3] Clearing build cache...
if exist .next rmdir /s /q .next
if exist node_modules\.cache rmdir /s /q node_modules\.cache
echo Cache cleared.
echo.

echo [2/3] Starting development server on port 3002...
echo.
echo Please wait for the build to complete...
echo You will see "Ready" message when it's ready.
echo.
echo Access: http://localhost:3002
echo.
echo Press Ctrl+C to stop the server
echo.

npm run dev

pause

