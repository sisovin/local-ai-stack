#!/usr/bin/env pwsh

# Final deployment fix for outputFileTracingRoot absolute path

Write-Host "🔧 Applying final outputFileTracingRoot fix..." -ForegroundColor Green

# Add all files
Write-Host "📝 Adding final fix..." -ForegroundColor Yellow
git add .

# Check git status
Write-Host "📋 Current changes:" -ForegroundColor Yellow
git status --short

# Create final fix commit
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$commitMessage = "fix: use absolute path for outputFileTracingRoot ($timestamp)

- Fixed outputFileTracingRoot to use absolute path with path.join(__dirname, '../../')
- Eliminated the warning: 'outputFileTracingRoot should be absolute'
- Updated both next.config.ts and next.config.mjs
- Build now completes without path warnings
- Timestamp: $timestamp

This resolves the final configuration warning for Vercel deployment."

Write-Host "💾 Creating final fix commit..." -ForegroundColor Yellow
git commit -m $commitMessage

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Final fix committed successfully!" -ForegroundColor Green
    Write-Host "🚀 Ready to push final Vercel deployment fix:" -ForegroundColor Cyan
    Write-Host "   git push origin main" -ForegroundColor White
    Write-Host ""
    Write-Host "📝 This final commit includes:" -ForegroundColor Yellow
    Write-Host "   • Absolute path fix for outputFileTracingRoot" -ForegroundColor White
    Write-Host "   • No more build warnings" -ForegroundColor White
    Write-Host "   • Clean successful build verification" -ForegroundColor White
} else {
    Write-Host "❌ Commit failed. Please check the error above." -ForegroundColor Red
    exit 1
}
