# AI Search Agent

A privacy-focused web search service with AI-powered analysis using SearXNG and local LLMs.

## Features

- **Privacy-First Search**: Uses SearXNG to search multiple engines without tracking
- **AI-Powered Analysis**: Local LLM analysis with DeepSeek R1 and Qwen 3
- **Real-time Results**: Fast search with intelligent summaries
- **Caching**: Redis-based caching for improved performance
- **RESTful API**: OpenAPI-documented endpoints
- **Docker Integration**: Complete containerized deployment

## Quick Start

### Prerequisites

- Docker and Docker Compose
- Ollama running locally (port 11434)
- At least one LLM model pulled in Ollama (e.g., `ollama pull deepseek-r1:7b`)

### Installation

1. **Clone and Setup**
   ```bash
   cd services/ai-search-agent
   ./setup.sh
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

3. **Start Services**
   ```bash
   docker-compose up -d
   ```

### Usage

#### Simple Search API
```bash
curl -X POST http://localhost:8001/search/simple \
  -H "Content-Type: application/json" \
  -d '{"query": "quantum computing", "analyze": true}'
```

#### Advanced Search API
```bash
curl -X POST http://localhost:8001/search \
  -H "Content-Type: application/json" \
  -d '{
    "query": "artificial intelligence trends",
    "analyze_with_ai": true,
    "ai_context": "Focus on 2024 developments",
    "model": "deepseek-r1:7b"
  }'
```

#### Health Check
```bash
curl http://localhost:8001/health
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Service information |
| `/health` | GET | Health status of all services |
| `/search` | POST | Advanced web search with AI analysis |
| `/search/simple` | POST | Simplified search endpoint |
| `/analyze` | POST | Analyze provided search results |
| `/docs` | GET | Interactive API documentation |

## Configuration

### Environment Variables

```bash
# SearXNG Configuration
SEARXNG_BASE_URL=http://localhost:8080
SEARXNG_API_KEY=optional-api-key

# Local LLM Configuration
OLLAMA_BASE_URL=http://localhost:11434
DEFAULT_MODEL=deepseek-r1:7b

# Redis Configuration
REDIS_URL=redis://localhost:6379

# API Configuration
API_HOST=0.0.0.0
API_PORT=8001
```

### SearXNG Settings

Edit `searxng_settings.yml` to configure:
- Search engines to use
- UI themes and preferences
- Rate limiting and timeouts
- Category configurations

## Frontend Integration

The service includes a React component for the Next.js frontend:

```tsx
import { WebSearchInterface } from "@/components/WebSearchInterface"

export default function SearchPage() {
  return <WebSearchInterface />
}
```

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js UI    │───▶│  AI Search      │───▶│    SearXNG      │
│                 │    │    Agent        │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │                        │
                              ▼                        ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │   Local LLM     │    │     Redis       │
                       │   (Ollama)      │    │   (Caching)     │
                       └─────────────────┘    └─────────────────┘
```

## Service Components

### 1. SearXNG
- Privacy-focused meta search engine
- Aggregates results from multiple search engines
- No tracking or data retention
- Configurable engine selection

### 2. AI Search Agent
- FastAPI-based service
- Interfaces with SearXNG and Ollama
- Provides AI analysis of search results
- Caches results for performance

### 3. Redis
- Result caching
- Session storage
- Performance optimization

### 4. Local LLM (Ollama)
- DeepSeek R1 for reasoning tasks
- Qwen 3 for general analysis
- Configurable model selection
- Local processing for privacy

## Development

### Running Locally

```bash
# Install dependencies
pip install -r requirements.txt

# Start supporting services
docker-compose up -d redis searxng

# Run the API server
python main.py
```

### Testing

```bash
# Test search functionality
python -c "
import asyncio
from main import app
from fastapi.testclient import TestClient

client = TestClient(app)
response = client.post('/search/simple', json={'query': 'test'})
print(response.json())
"
```

## Monitoring

### Logs
```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f ai-search-agent
docker-compose logs -f searxng
```

### Metrics
- Health endpoint provides service status
- Prometheus metrics available (if enabled)
- Search performance tracking

## Troubleshooting

### Common Issues

1. **SearXNG not responding**
   ```bash
   docker-compose restart searxng
   ```

2. **AI analysis failing**
   - Check Ollama is running: `curl http://localhost:11434/api/tags`
   - Verify model is available: `ollama list`

3. **Redis connection issues**
   ```bash
   docker-compose restart redis
   ```

4. **Search results empty**
   - Check SearXNG configuration
   - Verify internet connectivity
   - Review engine configurations

### Debug Mode

Enable debug logging:
```bash
docker-compose -f docker-compose.yml -f docker-compose.debug.yml up
```

## Security

- No data persistence of search queries
- Local AI processing only
- Rate limiting enabled
- CORS protection
- No external API keys required

## Performance

- Redis caching reduces repeated searches
- Async processing for better throughput
- Configurable timeouts
- Connection pooling

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Submit a pull request

## License

This project is part of the Local AI Stack and follows the same license terms.
