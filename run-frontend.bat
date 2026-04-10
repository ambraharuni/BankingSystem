@echo off
echo ========================================
echo   Starting Banking System Frontend
echo   Vite React on http://localhost:5173
echo ========================================
cd /d "%~dp0frontend"
if not exist node_modules (
    echo Installing dependencies...
    call npm install
)
call npm run dev
pause
