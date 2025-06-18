# AI Search Agent Service Startup Script
param(
    [switch]$SkipVenv,
    [switch]$SkipUpgrade,
    [string]$Port = "8000",
    [string]$HostAddress = "0.0.0.0"
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "AI Search Agent Service Startup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Set location to script directory
Set-Location $PSScriptRoot

# Check Python installation
try {
    $pythonVersion = python --version 2>&1
    Write-Host "Found Python: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Python is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Python 3.8 or higher" -ForegroundColor Yellow
    exit 1
}

# Virtual environment setup
if (-not $SkipVenv) {
    if (-not (Test-Path "venv")) {
        Write-Host "Creating virtual environment..." -ForegroundColor Yellow
        python -m venv venv
        if ($LASTEXITCODE -ne 0) {
            Write-Host "ERROR: Failed to create virtual environment" -ForegroundColor Red
            exit 1
        }
        Write-Host "Virtual environment created successfully" -ForegroundColor Green
    } else {
        Write-Host "Virtual environment already exists" -ForegroundColor Green
    }

    # Activate virtual environment
    Write-Host "Activating virtual environment..." -ForegroundColor Yellow
    & "venv\Scripts\Activate.ps1"
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Failed to activate virtual environment" -ForegroundColor Red
        exit 1
    }
}

# Upgrade pip
if (-not $SkipUpgrade) {
    Write-Host "Upgrading pip..." -ForegroundColor Yellow
    python -m pip install --upgrade pip
}

# Install requirements
if (Test-Path "requirements.txt") {
    Write-Host "Installing requirements..." -ForegroundColor Yellow
    pip install -r requirements.txt
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Failed to install requirements" -ForegroundColor Red
        exit 1
    }
    Write-Host "Requirements installed successfully" -ForegroundColor Green
} else {
    Write-Host "WARNING: requirements.txt not found" -ForegroundColor Yellow
}

# Check main.py exists
if (-not (Test-Path "main.py")) {
    Write-Host "ERROR: main.py not found in current directory" -ForegroundColor Red
    exit 1
}

# Start the service
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Starting AI Search Agent Service..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Service will be available at: http://${HostAddress}:${Port}" -ForegroundColor Green
Write-Host "API Documentation: http://${HostAddress}:${Port}/docs" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop the service" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan

# Run the FastAPI application
try {
    python -m uvicorn main:app --host $HostAddress --port $Port --reload
} catch {
    Write-Host "Service interrupted" -ForegroundColor Yellow
} finally {
    Write-Host "Service stopped" -ForegroundColor Yellow
}
