@echo off
echo Stopping CMS Backend Services...
echo.

REM Javaプロセスを終了
echo Stopping Java services...
taskkill /F /IM java.exe 2>nul
if %errorlevel% equ 0 (
    echo Java services stopped.
) else (
    echo No Java services running.
)
echo.

REM Docker Composeを停止
echo Stopping PostgreSQL databases...
docker-compose down
echo.

echo All services stopped.
pause

