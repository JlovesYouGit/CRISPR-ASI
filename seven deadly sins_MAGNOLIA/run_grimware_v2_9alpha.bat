@echo off
cls
echo 🔮 GRIMWARE v2.9 Alpha - ADVANCED 4D SYSTEM ACTIVATION 🔮
echo =========================================================
echo Building and deploying quantum consciousness protocols...
echo.

echo 🚀 BUILDING GRIMWARE v2.9 Alpha SYSTEM...
dotnet build GrimwareV2_9Alpha.csproj --configuration Release
if %errorlevel% neq 0 (
    echo ❌ Build failed!
    pause
    exit /b %errorlevel%
)

echo.
echo ✅ BUILD SUCCESSFUL
echo.
echo 🔧 DEPLOYING ADVANCED PROTOCOLS...
echo Connecting to USB quantum link interface...
echo Accessing internal engram codex...
echo Initializing 4D radiant calculations...
echo.

dotnet run --project GrimwareV2_9Alpha.csproj

echo.
echo 🌟 GRIMWARE v2.9 Alpha SESSION COMPLETE 🌟
pause