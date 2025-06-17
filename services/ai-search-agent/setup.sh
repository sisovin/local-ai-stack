#!/bin/bash

# AI Search Agent Setup Script
# This script sets up the complete AI-powered web search infrastructure

echo "🚀 Setting up AI Search Agent with SearXNG..."

# Create necessary directories
mkdir -p logs ssl

# Set permissions
chmod 755 logs ssl

# Create environment file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating environment file..."
    cp .env.example .env
    echo "⚠️  Please edit .env file with your configuration"
fi

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Build and start services
echo "🏗️  Building and starting services..."
docker-compose up -d --build

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 10

# Health checks
echo "🔍 Checking service health..."

# Check SearXNG
echo "Testing SearXNG..."
if curl -f http://localhost:8080 > /dev/null 2>&1; then
    echo "✅ SearXNG is running on http://localhost:8080"
else
    echo "❌ SearXNG is not responding"
fi

# Check AI Search Agent
echo "Testing AI Search Agent..."
if curl -f http://localhost:8001/health > /dev/null 2>&1; then
    echo "✅ AI Search Agent is running on http://localhost:8001"
else
    echo "❌ AI Search Agent is not responding"
fi

# Check Redis
echo "Testing Redis..."
if docker exec local-ai-redis redis-cli ping > /dev/null 2>&1; then
    echo "✅ Redis is running"
else
    echo "❌ Redis is not responding"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📋 Available services:"
echo "- SearXNG Web UI: http://localhost:8080"
echo "- AI Search Agent API: http://localhost:8001"
echo "- API Documentation: http://localhost:8001/docs"
echo "- Health Check: http://localhost:8001/health"
echo ""
echo "📖 Test the API:"
echo "curl -X POST http://localhost:8001/search/simple \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -d '{\"query\": \"artificial intelligence trends 2024\", \"analyze\": true}'"
echo ""
echo "🔧 To stop services: docker-compose down"
echo "🗂️  To view logs: docker-compose logs -f"
