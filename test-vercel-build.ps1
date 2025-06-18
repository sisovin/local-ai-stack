#!/usr/bin/env pwsh

# Test build script for local verification before Vercel deployment

Write-Host "Starting local build test..." -ForegroundColor Green

# Set working directory to the project root
Set-Location $PSScriptRoot

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Yellow
pnpm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}

# Install specific packages for build
Write-Host "Installing build-specific dependencies..." -ForegroundColor Yellow
pnpm install --filter=web --filter=@workspace/ui --filter=@workspace/eslint-config --filter=@workspace/typescript-config

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install build dependencies" -ForegroundColor Red
    exit 1
}

# Run type checking
Write-Host "Running type check..." -ForegroundColor Yellow
pnpm --filter=web run typecheck

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Type check failed" -ForegroundColor Red
    exit 1
}

# Run linting
Write-Host "Running linter..." -ForegroundColor Yellow
pnpm --filter=web run lint

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Linting failed" -ForegroundColor Red
    exit 1
}

# Build the web app
Write-Host "Building web application..." -ForegroundColor Yellow
pnpm --filter=web build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build test completed successfully!" -ForegroundColor Green
Write-Host "The application should now deploy successfully to Vercel." -ForegroundColor Cyan
