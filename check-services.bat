@echo off
echo Checking CMS Backend Services Status...
echo.

echo Checking ports...
netstat -ano | findstr ":8080" >nul
if %errorlevel% equ 0 (
    echo [OK] Port 8080 (API Gateway) is in use
) else (
    echo [FAIL] Port 8080 (API Gateway) is not in use
)

netstat -ano | findstr ":8081" >nul
if %errorlevel% equ 0 (
    echo [OK] Port 8081 (Auth Service) is in use
) else (
    echo [FAIL] Port 8081 (Auth Service) is not in use
)

netstat -ano | findstr ":8082" >nul
if %errorlevel% equ 0 (
    echo [OK] Port 8082 (Content Service) is in use
) else (
    echo [FAIL] Port 8082 (Content Service) is not in use
)

netstat -ano | findstr ":5432" >nul
if %errorlevel% equ 0 (
    echo [OK] Port 5432 (PostgreSQL) is in use
) else (
    echo [FAIL] Port 5432 (PostgreSQL) is not in use
)

echo.
echo Testing API endpoints...
echo.

curl -s http://localhost:8080/api/auth/health >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] API Gateway is responding
) else (
    echo [FAIL] API Gateway is not responding
)

curl -s http://localhost:8081/api/auth/health >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Auth Service is responding
) else (
    echo [FAIL] Auth Service is not responding
)

echo.
pause



