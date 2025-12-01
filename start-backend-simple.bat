@echo off
echo Starting CMS Backend Services (Simple Mode)...
echo.

REM PostgreSQLデータベースの起動
echo Starting PostgreSQL databases...
docker-compose up -d
timeout /t 5 /nobreak >nul

REM 各サービスを順番に起動（バックグラウンド）
echo Starting Auth Service...
cd /d %~dp0
start /B gradlew.bat :services:auth-service:bootRun

timeout /t 5 /nobreak >nul

echo Starting Content Service...
start /B gradlew.bat :services:content-service:bootRun

timeout /t 5 /nobreak >nul

echo Starting API Gateway...
start /B gradlew.bat :services:api-gateway:bootRun

echo.
echo All services are starting...
echo Please wait 30-60 seconds for services to fully start.
echo.
echo Check service status:
echo   - API Gateway: http://localhost:8080/api/auth/health
echo   - Auth Service: http://localhost:8081/api/auth/health
echo   - Content Service: http://localhost:8082/api/content
echo.

