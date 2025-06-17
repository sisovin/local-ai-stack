#!/usr/bin/env pwsh

# Supabase Environment Setup Script
# This script helps you configure your Supabase environment variables

Write-Host "🚀 LocalAI Stack - Supabase Configuration" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host ""

# Check if .env.local exists
$envFile = "apps/web/.env.local"
if (-not (Test-Path $envFile)) {
    Write-Host "❌ .env.local file not found at: $envFile" -ForegroundColor Red
    Write-Host "Please run this script from the project root directory." -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Found .env.local file" -ForegroundColor Green
Write-Host ""

# Instructions for getting Supabase credentials
Write-Host "📋 To get your Supabase credentials:" -ForegroundColor Cyan
Write-Host "1. Visit: https://supabase.com/dashboard/project/plvdkvkcxqxuuvyhjojh/settings/api" -ForegroundColor White
Write-Host "2. Copy the 'anon public' key from the 'Project API keys' section" -ForegroundColor White
Write-Host ""

# Prompt for Supabase API key
$apiKey = Read-Host "Please paste your Supabase anon public key here"

if ([string]::IsNullOrWhiteSpace($apiKey)) {
    Write-Host "❌ No API key provided. Exiting." -ForegroundColor Red
    exit 1
}

# Validate the API key format (should start with eyJ)
if (-not $apiKey.StartsWith("eyJ")) {
    Write-Host "⚠️  Warning: The API key doesn't look like a valid JWT token (should start with 'eyJ')" -ForegroundColor Yellow
    $continue = Read-Host "Continue anyway? (y/N)"
    if ($continue -ne "y" -and $continue -ne "Y") {
        Write-Host "❌ Setup cancelled." -ForegroundColor Red
        exit 1
    }
}

# Update the .env.local file
try {
    $content = Get-Content $envFile -Raw
    $updatedContent = $content -replace "NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here", "NEXT_PUBLIC_SUPABASE_ANON_KEY=$apiKey"
    
    Set-Content -Path $envFile -Value $updatedContent -NoNewline
    
    Write-Host ""
    Write-Host "✅ Successfully updated $envFile" -ForegroundColor Green
    Write-Host ""
    Write-Host "🔄 Next steps:" -ForegroundColor Cyan
    Write-Host "1. Restart your development server: pnpm dev" -ForegroundColor White
    Write-Host "2. Check the browser for the connection test results" -ForegroundColor White
    Write-Host ""
    Write-Host "🎉 Setup complete!" -ForegroundColor Green
    
} catch {
    Write-Host "❌ Failed to update .env.local file: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
