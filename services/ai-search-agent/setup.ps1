# AI Search Agent Setup Script for Windows
# PowerShell script to set up the complete AI-powered web search infrastructure

Write-Host "🚀 Setting up AI Search Agent with SearXNG..." -ForegroundColor Green

# Create necessary directories
New-Item -ItemType Directory -Force -Path "logs", "ssl" | Out-Null
Write-Host "📁 Created directories" -ForegroundColor Yellow

# Create environment file if it doesn't exist
if (-not (Test-Path ".env")) {
    Write-Host "📝 Creating environment file..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "⚠️  Please edit .env file with your configuration" -ForegroundColor Yellow
}

# Check if Docker is running
try {
    docker info | Out-Null
    Write-Host "✅ Docker is running" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker is not running. Please start Docker Desktop first." -ForegroundColor Red
    exit 1
}

# Build and start services
Write-Host "🏗️  Building and starting services..." -ForegroundColor Yellow
docker-compose up -d --build

# Wait for services to be ready
Write-Host "⏳ Waiting for services to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

# Health checks
Write-Host "🔍 Checking service health..." -ForegroundColor Yellow

# Check SearXNG
Write-Host "Testing SearXNG..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080" -TimeoutSec 5 -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ SearXNG is running on http://localhost:8080" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ SearXNG is not responding" -ForegroundColor Red
}

# Check AI Search Agent
Write-Host "Testing AI Search Agent..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8001/health" -TimeoutSec 5 -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ AI Search Agent is running on http://localhost:8001" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ AI Search Agent is not responding" -ForegroundColor Red
}

# Check Redis
Write-Host "Testing Redis..." -ForegroundColor Cyan
try {
    $redisTest = docker exec local-ai-redis redis-cli ping 2>$null
    if ($redisTest -eq "PONG") {
        Write-Host "✅ Redis is running" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Redis is not responding" -ForegroundColor Red
}

Write-Host ""
Write-Host "🎉 Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Available services:" -ForegroundColor Yellow
Write-Host "- SearXNG Web UI: http://localhost:8080" -ForegroundColor White
Write-Host "- AI Search Agent API: http://localhost:8001" -ForegroundColor White
Write-Host "- API Documentation: http://localhost:8001/docs" -ForegroundColor White
Write-Host "- Health Check: http://localhost:8001/health" -ForegroundColor White
Write-Host ""
Write-Host "📖 Test the API:" -ForegroundColor Yellow
Write-Host 'Invoke-RestMethod -Uri "http://localhost:8001/search/simple" -Method POST -ContentType "application/json" -Body ''{"query": "artificial intelligence trends 2024", "analyze": true}''' -ForegroundColor White
Write-Host ""
Write-Host "🔧 Management commands:" -ForegroundColor Yellow
Write-Host "- Stop services: docker-compose down" -ForegroundColor White
Write-Host "- View logs: docker-compose logs -f" -ForegroundColor White
Write-Host "- Restart: docker-compose restart" -ForegroundColor White
