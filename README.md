# 🚀 LocalAI Stack Project

A comprehensive, privacy-first AI infrastructure stack that runs entirely on your local environment. This monorepo combines a modern Next.js frontend, Python-based AI search agent, and containerized AI services for a complete local AI experience.

## ✨ Features

- 🔒 **Privacy-First**: All AI processing happens locally on your infrastructure
- 🎨 **Modern UI**: Futuristic Next.js frontend with glassmorphism and neon effects
- 🤖 **Multiple AI Models**: Support for DeepSeek R1, Qwen 3, and other Ollama models
- 🔍 **AI-Powered Search**: Intelligent web search with SearXNG and local AI analysis
- 💬 **Real-time Chat**: Live chat interface with local LLM models
- 📊 **Observability**: Integrated monitoring with Langfuse and Prometheus
- 🐳 **Containerized**: Complete Docker-based deployment
- 🌩️ **Cloud Ready**: Terraform scripts for production deployment

## 📁 Project Structure

```
local-ai-stack/
├── apps/                           # Frontend applications
│   ├── web/                        # Next.js web application
│   └── api/                        # API services
├── packages/                       # Shared packages
│   ├── ui/                         # Reusable UI components (shadcn/ui)
│   ├── eslint-config/              # Shared ESLint configuration
│   └── typescript-config/          # Shared TypeScript configuration
├── services/                       # Backend services
│   └── ai-search-agent/            # Python AI search service
├── deployment/                     # Deployment configurations
│   ├── terraform/                  # Infrastructure as Code
│   └── monitoring/                 # Monitoring stack
└── docs/                          # Documentation
```

## 🚀 Quick Start

### Prerequisites

- **Node.js 20+** and **pnpm** (latest)
- **Docker** and **Docker Compose**
- **Ollama** for local AI models
- **Supabase** account (for authentication and data storage)

### 1. Clone and Install

```bash
git clone <repository-url>
cd local-ai-stack
pnpm install
```

### 2. Set Up Local AI Infrastructure

Follow our comprehensive setup guide:

```bash
# See detailed instructions in docs/LOCAL_AI_SETUP_GUIDE.md
```

**Key components to install:**
- Ollama with AI models (DeepSeek R1, Qwen 3)
- Open Web UI (AI chat interface)
- SearXNG (privacy-focused search engine)

### 3. Configure Environment

**Frontend Configuration:**
```bash
cd apps/web
cp .env.example .env.local
```

Edit `.env.local`:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Open Web UI Configuration
NEXT_PUBLIC_OPENWEBUI_URL=http://localhost:3000

# AI Search Agent
NEXT_PUBLIC_AI_SEARCH_URL=http://localhost:8001
```

**AI Search Agent Configuration:**
```bash
cd services/ai-search-agent
cp .env.example .env
```

### 4. Start Development

**Option A: Start Everything**
```bash
pnpm dev
```

**Option B: Start Individual Services**
```bash
# Frontend
cd apps/web && pnpm dev

# AI Search Agent
cd services/ai-search-agent && docker-compose up -d
```

## 🏗️ Architecture

### Frontend Stack
- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React hooks and context
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL

### Backend Stack
- **AI Search**: FastAPI with SearXNG integration
- **LLM Integration**: Ollama for local model inference
- **Caching**: Redis for performance optimization
- **Observability**: Langfuse for AI monitoring
- **Metrics**: Prometheus and Grafana

### Infrastructure
- **Containerization**: Docker and Docker Compose
- **Orchestration**: Turbo for monorepo management
- **Deployment**: Terraform for cloud infrastructure
- **Monitoring**: Prometheus, Grafana, Langfuse stack

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [Frontend Setup](docs/FRONTEND_SETUP.md) | Complete frontend installation and configuration |
| [Local AI Setup](docs/LOCAL_AI_SETUP_GUIDE.md) | Comprehensive local AI infrastructure setup |
| [Cloud Deployment](deployment/CLOUD_DEPLOYMENT.md) | Production deployment guide |
| [Observability](deployment/LANGFUSE_OBSERVABILITY.md) | Monitoring and observability setup |
| [Performance](deployment/PERFORMANCE_OPTIMIZATION.md) | Performance optimization guide |

## 🛠️ Available Scripts

### Root Level
```bash
pnpm dev          # Start all development servers
pnpm build        # Build all applications
pnpm lint         # Lint all packages
pnpm format       # Format code with Prettier
```

### Frontend (apps/web)
```bash
pnpm dev          # Start Next.js development server
pnpm build        # Build production application
pnpm start        # Start production server
pnpm lint         # Lint frontend code
```

### AI Search Agent (services/ai-search-agent)
```bash
./setup.sh        # Initial setup (Linux/macOS)
./setup.ps1       # Initial setup (Windows)
docker-compose up # Start AI search services
```

## 🚀 Deployment

### Local Development
1. Follow the [Local AI Setup Guide](docs/LOCAL_AI_SETUP_GUIDE.md)
2. Run `pnpm dev` in the project root
3. Access the application at `http://localhost:3001`

### Production Deployment
1. Review [Cloud Deployment Guide](deployment/CLOUD_DEPLOYMENT.md)
2. Configure Terraform variables
3. Run deployment scripts:

**Linux/macOS:**
```bash
cd deployment && ./deploy.sh
```

**Windows:**
```powershell
cd deployment && .\deploy.ps1 -Action full
```

## 🔧 Configuration

### Environment Variables

**Frontend (apps/web/.env.local):**
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `NEXT_PUBLIC_OPENWEBUI_URL` - Open Web UI endpoint
- `NEXT_PUBLIC_AI_SEARCH_URL` - AI Search Agent endpoint

**AI Search Agent (services/ai-search-agent/.env):**
- `OLLAMA_BASE_URL` - Ollama API endpoint
- `SEARXNG_URL` - SearXNG search engine URL
- `REDIS_URL` - Redis cache connection string
- `LANGFUSE_SECRET_KEY` - Langfuse observability key

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style and formatting
- Add tests for new features
- Update documentation as needed
- Ensure all CI checks pass

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Ollama](https://ollama.ai/) - Local LLM inference
- [SearXNG](https://searxng.org/) - Privacy-focused search
- [Supabase](https://supabase.com/) - Backend as a Service
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Langfuse](https://langfuse.com/) - AI observability platform

## 📞 Support

- 📖 Check the [documentation](docs/)
- 🐛 Report bugs via [GitHub Issues]
- 💬 Join our community discussions
- 📧 Contact the maintainers

---

**Built with ❤️ for the privacy-conscious AI community**