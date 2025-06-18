#!/usr/bin/env pwsh

# Fresh deployment trigger for Vercel

Write-Host "🚀 Creating fresh deployment for Vercel..." -ForegroundColor Green

# Add all files
Write-Host "📝 Adding all changes..." -ForegroundColor Yellow
git add .

# Check git status
Write-Host "📋 Current changes:" -ForegroundColor Yellow
git status --short

# Create a fresh commit with timestamp
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$commitMessage = "feat: trigger fresh Vercel deployment ($timestamp)

- Force fresh deployment to resolve redeployment blocking
- Updated deployment status tracking
- Added regional configuration for Vercel
- Ensured all Vercel deployment fixes are included
- Timestamp: $timestamp

This commit ensures a completely fresh deployment on Vercel."

Write-Host "💾 Creating fresh commit..." -ForegroundColor Yellow
git commit -m $commitMessage

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Fresh commit created successfully!" -ForegroundColor Green
    Write-Host "🚀 Ready to push for fresh Vercel deployment:" -ForegroundColor Cyan
    Write-Host "   git push origin main" -ForegroundColor White
    Write-Host ""
    Write-Host "📝 This fresh commit includes:" -ForegroundColor Yellow
    Write-Host "   • Updated deployment status files" -ForegroundColor White
    Write-Host "   • Enhanced Vercel configuration" -ForegroundColor White
    Write-Host "   • Timestamp to ensure uniqueness" -ForegroundColor White
    Write-Host "   • All previous deployment fixes" -ForegroundColor White
} else {
    Write-Host "❌ Commit failed. Please check the error above." -ForegroundColor Red
    exit 1
}
