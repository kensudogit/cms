@echo off
echo Starting Auth Service only...
cd /d %~dp0
gradlew.bat :services:auth-service:bootRun
pause

