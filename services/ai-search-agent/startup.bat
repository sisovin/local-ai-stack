@echo off
setlocal enabledelayedexpansion

echo ========================================
echo AI Search Agent Service Startup
echo ========================================

:: Set the current directory to the script location
cd /d "%~dp0"

:: Check if Python is available
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.8 or higher
    pause
    exit /b 1
)

:: Display Python version
echo Checking Python version...
python --version

:: Check if virtual environment exists
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
    if errorlevel 1 (
        echo ERROR: Failed to create virtual environment
        pause
        exit /b 1
    )
    echo Virtual environment created successfully
) else (
    echo Virtual environment already exists
)

:: Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat
if errorlevel 1 (
    echo ERROR: Failed to activate virtual environment
    pause
    exit /b 1
)

:: Upgrade pip if needed
echo Upgrading pip...
python -m pip install --upgrade pip

:: Install/update requirements
echo Installing requirements...
if exist "requirements.txt" (
    pip install -r requirements.txt
    if errorlevel 1 (
        echo ERROR: Failed to install requirements
        pause
        exit /b 1
    )
    echo Requirements installed successfully
) else (
    echo WARNING: requirements.txt not found
)

:: Check if main.py exists
if not exist "main.py" (
    echo ERROR: main.py not found in current directory
    pause
    exit /b 1
)

:: Start the service
echo ========================================
echo Starting AI Search Agent Service...
echo ========================================
echo Service will be available at: http://localhost:8000
echo API Documentation: http://localhost:8000/docs
echo Press Ctrl+C to stop the service
echo ========================================

:: Run the FastAPI application
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload

:: Deactivate virtual environment when done
call venv\Scripts\deactivate.bat

echo Service stopped
pause
