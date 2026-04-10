@echo off
echo ========================================
echo   Starting Banking System Backend
echo   Spring Boot on http://localhost:8080
echo ========================================
cd /d %~dp0
mvnw.cmd clean spring-boot:run
pause
