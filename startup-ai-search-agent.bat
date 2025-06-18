@echo off
setlocal enabledelayedexpansion

echo ========================================
echo Local AI Stack - AI Search Agent Startup
echo ========================================

:: Set the workspace root directory
cd /d "%~dp0"

:: Check if the services directory exists
if not exist "services\ai-search-agent" (
    echo ERROR: AI Search Agent service directory not found
    echo Expected path: %CD%\services\ai-search-agent
    pause
    exit /b 1
)

:: Navigate to the AI search agent directory
echo Navigating to AI Search Agent directory...
cd services\ai-search-agent

:: Check if startup.bat exists in the service directory
if not exist "startup.bat" (
    echo ERROR: startup.bat not found in services\ai-search-agent
    echo Please ensure the startup.bat file exists in the service directory
    pause
    exit /b 1
)

:: Execute the service startup script
echo Launching AI Search Agent service...
echo ========================================
call startup.bat

:: Return to workspace root when done
cd /d "%~dp0"

echo Returned to workspace root: %CD%
pause
