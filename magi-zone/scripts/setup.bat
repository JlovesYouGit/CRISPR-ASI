@echo off
REM Magi Zone Setup Script
REM This script sets up the Magi Zone service for persistent execution

echo ========================================
echo Magi Zone Service Setup
echo ========================================
echo.

REM Check if running as Administrator
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo ERROR: This script must be run as Administrator
    echo Right-click the script and select "Run as administrator"
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorLevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js detected
echo.

REM Build the project
echo Building project...
call npm run build
if %errorLevel% neq 0 (
    echo ERROR: Build failed
    pause
    exit /b 1
)

echo Build completed successfully
echo.

REM Install the service
echo Installing Windows service...
powershell -ExecutionPolicy Bypass -File "%~dp0install-service.ps1"
if %errorLevel% neq 0 (
    echo ERROR: Service installation failed
    pause
    exit /b 1
)

echo.
echo ========================================
echo Setup completed successfully!
echo ========================================
echo.
echo The Magi Zone service is now installed and running.
echo It will automatically start when Windows boots.
echo.
echo Service management commands:
echo   Start:    net start MagiZoneService
echo   Stop:     net stop MagiZoneService
echo   Status:   sc query MagiZoneService
echo   Logs:     type n:\magi-zone\logs\*.log
echo.
echo To uninstall: Run uninstall-service.ps1 as Administrator
echo.
pause
