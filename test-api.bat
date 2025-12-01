@echo off
echo Testing API endpoints...
echo.

echo [1] Testing API Gateway...
curl -s http://localhost:8080/api/auth/health
if %errorlevel% equ 0 (
    echo [OK] API Gateway is responding
) else (
    echo [FAIL] API Gateway is not responding
)
echo.

echo [2] Testing Auth Service...
curl -s http://localhost:8081/api/auth/health
if %errorlevel% equ 0 (
    echo [OK] Auth Service is responding
) else (
    echo [FAIL] Auth Service is not responding
)
echo.

echo [3] Testing Content Service...
curl -s http://localhost:8082/api/content
if %errorlevel% equ 0 (
    echo [OK] Content Service is responding
) else (
    echo [FAIL] Content Service is not responding
)
echo.

pause



