#!/usr/bin/env pwsh

# Git commit script for Vercel deployment fixes

Write-Host "🔧 Preparing to commit Vercel deployment fixes..." -ForegroundColor Green

# Add all files
Write-Host "📝 Adding files to git..." -ForegroundColor Yellow
git add .

# Check git status
Write-Host "📋 Git status:" -ForegroundColor Yellow
git status --short

# Commit with a descriptive message
$commitMessage = "fix: resolve Vercel deployment issues

- Add missing @eslint/js dependency to fix ESLint import error
- Update Vercel config with proper rootDirectory and outputDirectory
- Fix Next.js config to use correct outputFileTracingRoot location
- Add conditional standalone output for Vercel deployments only
- Create .vercelignore file to optimize deployment
- Add deployment info documentation

Fixes the double path issue and ESLint compilation errors"

Write-Host "💾 Committing changes..." -ForegroundColor Yellow
git commit -m $commitMessage

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Changes committed successfully!" -ForegroundColor Green
    Write-Host "🚀 Ready to push to trigger new Vercel deployment:" -ForegroundColor Cyan
    Write-Host "   git push origin main" -ForegroundColor White
    Write-Host ""
    Write-Host "📝 Summary of fixes applied:" -ForegroundColor Yellow
    Write-Host "   • Fixed ESLint configuration with missing dependency" -ForegroundColor White
    Write-Host "   • Corrected Vercel monorepo path configuration" -ForegroundColor White
    Write-Host "   • Updated Next.js config for proper deployment" -ForegroundColor White
    Write-Host "   • Added deployment optimization files" -ForegroundColor White
} else {
    Write-Host "❌ Commit failed. Please check the error above." -ForegroundColor Red
    exit 1
}
