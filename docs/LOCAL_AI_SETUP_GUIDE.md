# Local AI Infrastructure Setup Guide

This guide will walk you through setting up a complete local AI infrastructure including Docker, Ollama for LLMs, Supabase for database, and Open Web UI for the frontend interface.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Docker Installation](#docker-installation)
3. [Ollama Setup](#ollama-setup)
4. [Supabase Local Setup](#supabase-local-setup)
5. [Open Web UI Setup](#open-web-ui-setup)
6. [Environment Configuration](#environment-configuration)
7. [Running the Complete Stack](#running-the-complete-stack)
8. [Troubleshooting](#troubleshooting)

## Prerequisites

### System Requirements
- **RAM**: Minimum 8GB, Recommended 16GB+
- **Storage**: At least 20GB free space
- **CPU**: Modern multi-core processor
- **GPU**: Optional but recommended for faster LLM inference (NVIDIA with CUDA support)

### Required Software
- Git
- Node.js (v18 or later)
- Python 3.8+
- Docker Desktop

## Docker Installation

### Windows

1. **Download Docker Desktop**
   ```bash
   # Visit https://www.docker.com/products/docker-desktop/
   # Download Docker Desktop for Windows
   ```

2. **Install Docker Desktop**
   - Run the installer as Administrator
   - Enable WSL 2 integration when prompted
   - Restart your computer

3. **Verify Installation**
   ```powershell
   docker --version
   docker-compose --version
   ```

4. **Configure Docker Settings**
   - Open Docker Desktop
   - Go to Settings > Resources
   - Allocate at least 4GB RAM and 2 CPUs
   - Enable WSL 2 based engine

### macOS

1. **Download Docker Desktop**
   ```bash
   # Visit https://www.docker.com/products/docker-desktop/
   # Choose the appropriate version (Intel or Apple Silicon)
   ```

2. **Install Docker Desktop**
   ```bash
   # Drag Docker.app to Applications folder
   # Launch Docker Desktop from Applications
   ```

3. **Verify Installation**
   ```bash
   docker --version
   docker-compose --version
   ```

4. **Configure Resources**
   - Open Docker Desktop preferences
   - Go to Resources tab
   - Allocate at least 4GB RAM and 2 CPUs

### Linux (Ubuntu/Debian)

1. **Update Package Index**
   ```bash
   sudo apt update
   sudo apt install apt-transport-https ca-certificates curl gnupg lsb-release
   ```

2. **Add Docker's Official GPG Key**
   ```bash
   curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
   ```

3. **Add Docker Repository**
   ```bash
   echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
   ```

4. **Install Docker Engine**
   ```bash
   sudo apt update
   sudo apt install docker-ce docker-ce-cli containerd.io docker-compose-plugin
   ```

5. **Add User to Docker Group**
   ```bash
   sudo usermod -aG docker $USER
   newgrp docker
   ```

6. **Verify Installation**
   ```bash
   docker --version
   docker compose version
   ```

## Ollama Setup

### Installation

#### Windows
```powershell
# Download from https://ollama.ai/download
# Run the installer
# Or use winget
winget install Ollama.Ollama
```

#### macOS
```bash
# Download from https://ollama.ai/download
# Or use Homebrew
brew install ollama
```

#### Linux
```bash
curl -fsSL https://ollama.ai/install.sh | sh
```

### Running Ollama

1. **Start Ollama Service**
   ```bash
   # This will start the Ollama server on localhost:11434
   ollama serve
   ```

2. **Pull and Run Models**
   ```bash
   # Pull a lightweight model for testing
   ollama pull llama2:7b
   
   # Pull other popular models
   ollama pull codellama:7b
   ollama pull mistral:7b
   ollama pull phi:2.7b
   
   # Test the model
   ollama run llama2:7b "Hello, how are you?"
   ```

3. **Docker Alternative**
   ```bash
   # Run Ollama in Docker
   docker run -d -v ollama:/root/.ollama -p 11434:11434 --name ollama ollama/ollama
   
   # Pull models through Docker
   docker exec -it ollama ollama pull llama2:7b
   ```

### GPU Support (NVIDIA)

```bash
# Install NVIDIA Container Toolkit first
# Then run with GPU support
docker run -d --gpus=all -v ollama:/root/.ollama -p 11434:11434 --name ollama ollama/ollama
```

## Supabase Local Setup

### Prerequisites
```bash
# Install Supabase CLI
npm install -g supabase
# Or
brew install supabase/tap/supabase
```

### Initialize Supabase Project

1. **Create Project Directory**
   ```bash
   mkdir local-ai-project
   cd local-ai-project
   ```

2. **Initialize Supabase**
   ```bash
   supabase init
   ```

3. **Start Local Supabase**
   ```bash
   supabase start
   ```

   This will start:
   - PostgreSQL database on `localhost:54322`
   - Supabase Studio on `http://localhost:54323`
   - API Gateway on `http://localhost:54321`
   - Auth server
   - Storage server
   - Edge Functions runtime

4. **Access Supabase Studio**
   - Open `http://localhost:54323` in your browser
   - Default credentials will be displayed in terminal

### Database Schema Setup

1. **Create Migration Files**
   ```bash
   supabase migration new create_ai_tables
   ```

2. **Example Schema (supabase/migrations/xxx_create_ai_tables.sql)**
   ```sql
   -- Create conversations table
   CREATE TABLE conversations (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     title TEXT NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     user_id UUID REFERENCES auth.users(id)
   );
   
   -- Create messages table
   CREATE TABLE messages (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
     content TEXT NOT NULL,
     role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     metadata JSONB DEFAULT '{}'
   );
   
   -- Create indexes
   CREATE INDEX idx_conversations_user_id ON conversations(user_id);
   CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
   CREATE INDEX idx_messages_created_at ON messages(created_at);
   
   -- Enable RLS
   ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
   ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
   
   -- Create policies
   CREATE POLICY "Users can view their own conversations" ON conversations
     FOR SELECT USING (auth.uid() = user_id);
   
   CREATE POLICY "Users can insert their own conversations" ON conversations
     FOR INSERT WITH CHECK (auth.uid() = user_id);
   
   CREATE POLICY "Users can view messages from their conversations" ON messages
     FOR SELECT USING (
       conversation_id IN (
         SELECT id FROM conversations WHERE user_id = auth.uid()
       )
     );
   
   CREATE POLICY "Users can insert messages to their conversations" ON messages
     FOR INSERT WITH CHECK (
       conversation_id IN (
         SELECT id FROM conversations WHERE user_id = auth.uid()
       )
     );
   ```

3. **Apply Migrations**
   ```bash
   supabase db push
   ```

## Open Web UI Setup

### Method 1: Docker (Recommended)

1. **Run Open Web UI with Docker**
   ```bash
   docker run -d -p 3000:8080 \
     -e OLLAMA_BASE_URL=http://host.docker.internal:11434 \
     -v open-webui:/app/backend/data \
     --name open-webui \
     --restart always \
     ghcr.io/open-webui/open-webui:main
   ```

2. **For Linux (use different host reference)**
   ```bash
   docker run -d -p 3000:8080 \
     -e OLLAMA_BASE_URL=http://172.17.0.1:11434 \
     -v open-webui:/app/backend/data \
     --name open-webui \
     --restart always \
     ghcr.io/open-webui/open-webui:main
   ```

### Method 2: Manual Installation

1. **Clone Repository**
   ```bash
   git clone https://github.com/open-webui/open-webui.git
   cd open-webui
   ```

2. **Install Dependencies**
   ```bash
   # Backend
   cd backend
   pip install -r requirements.txt
   
   # Frontend
   cd ../frontend
   npm install
   ```

3. **Configure Environment**
   ```bash
   # Create .env file in backend directory
   echo "OLLAMA_BASE_URL=http://localhost:11434" > backend/.env
   ```

4. **Run Services**
   ```bash
   # Terminal 1 - Backend
   cd backend
   python main.py
   
   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

## Environment Configuration

### Create Docker Compose File

Create `docker-compose.yml` in your project root:

```yaml
version: '3.8'

services:
  # Ollama Service
  ollama:
    image: ollama/ollama:latest
    container_name: ollama
    ports:
      - "11434:11434"
    volumes:
      - ollama_data:/root/.ollama
    environment:
      - OLLAMA_HOST=0.0.0.0
    restart: unless-stopped
    # Uncomment for GPU support
    # deploy:
    #   resources:
    #     reservations:
    #       devices:
    #         - driver: nvidia
    #           count: 1
    #           capabilities: [gpu]

  # Open Web UI
  open-webui:
    image: ghcr.io/open-webui/open-webui:main
    container_name: open-webui
    ports:
      - "3000:8080"
    environment:
      - OLLAMA_BASE_URL=http://ollama:11434
      - WEBUI_SECRET_KEY=your-secret-key-here
    volumes:
      - open_webui_data:/app/backend/data
    depends_on:
      - ollama
    restart: unless-stopped

  # PostgreSQL for Supabase (if not using Supabase CLI)
  postgres:
    image: postgres:15
    container_name: postgres
    environment:
      - POSTGRES_DB=postgres
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=your-password-here
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  # Redis for caching (optional)
  redis:
    image: redis:7-alpine
    container_name: redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    restart: unless-stopped

volumes:
  ollama_data:
  open_webui_data:
  postgres_data:
  redis_data:
```

### Environment Variables

Create `.env` file:

```bash
# Ollama Configuration
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_API_KEY=

# Supabase Configuration
SUPABASE_URL=http://localhost:54321
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Database Configuration
DATABASE_URL=postgresql://postgres:your-password@localhost:5432/postgres

# Open Web UI Configuration
WEBUI_SECRET_KEY=your-secret-key-here
WEBUI_JWT_SECRET_KEY=your-jwt-secret-key

# Optional: OpenAI API (for fallback)
OPENAI_API_KEY=your-openai-key

# Optional: Other LLM APIs
ANTHROPIC_API_KEY=your-anthropic-key
GOOGLE_API_KEY=your-google-key
```

## Running the Complete Stack

### Option 1: Using Docker Compose (Recommended)

1. **Start All Services**
   ```bash
   docker-compose up -d
   ```

2. **Check Service Status**
   ```bash
   docker-compose ps
   ```

3. **View Logs**
   ```bash
   # All services
   docker-compose logs -f
   
   # Specific service
   docker-compose logs -f ollama
   ```

4. **Pull Ollama Models**
   ```bash
   docker-compose exec ollama ollama pull llama2:7b
   docker-compose exec ollama ollama pull codellama:7b
   ```

### Option 2: Manual Startup

1. **Start Supabase**
   ```bash
   supabase start
   ```

2. **Start Ollama**
   ```bash
   ollama serve
   ```

3. **Start Open Web UI**
   ```bash
   docker run -d -p 3000:8080 \
     -e OLLAMA_BASE_URL=http://localhost:11434 \
     -v open-webui:/app/backend/data \
     --name open-webui \
     ghcr.io/open-webui/open-webui:main
   ```

### Accessing Services

Once everything is running, you can access:

- **Open Web UI**: http://localhost:3000
- **Supabase Studio**: http://localhost:54323
- **Ollama API**: http://localhost:11434
- **PostgreSQL**: localhost:5432 (or 54322 for Supabase)

## Initial Setup and Testing

### 1. Create First User in Open Web UI
- Navigate to http://localhost:3000
- Create an admin account (first user becomes admin)
- Configure Ollama connection if needed

### 2. Test Ollama Integration
```bash
# Test Ollama directly
curl http://localhost:11434/api/generate -d '{
  "model": "llama2:7b",
  "prompt": "Hello, world!",
  "stream": false
}'
```

### 3. Test Supabase Connection
```bash
# Test Supabase API
curl -X GET 'http://localhost:54321/rest/v1/conversations' \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Authorization: Bearer YOUR_ANON_KEY"
```

## Troubleshooting

### Common Issues

#### Docker Issues
```bash
# Reset Docker if having issues
docker system prune -a
docker volume prune

# Restart Docker Desktop (Windows/Mac)
# Or restart Docker service (Linux)
sudo systemctl restart docker
```

#### Ollama Issues
```bash
# Check Ollama status
curl http://localhost:11434/api/tags

# Restart Ollama
pkill ollama
ollama serve

# Clear Ollama cache
rm -rf ~/.ollama
```

#### Supabase Issues
```bash
# Reset Supabase
supabase stop
supabase start

# Check Supabase status
supabase status

# View Supabase logs
supabase logs
```

#### Open Web UI Issues
```bash
# Restart Open Web UI container
docker restart open-webui

# Check logs
docker logs open-webui

# Reset Open Web UI data
docker volume rm open_webui_data
```

### Performance Optimization

#### For Better LLM Performance
1. **Use GPU acceleration** (NVIDIA GPUs)
2. **Increase Docker memory allocation** (8GB+)
3. **Use SSD storage** for better I/O
4. **Choose appropriate model sizes** based on your hardware

#### Model Recommendations by Hardware
- **8GB RAM**: phi:2.7b, llama2:7b
- **16GB RAM**: llama2:13b, codellama:13b
- **32GB+ RAM**: llama2:70b, codellama:34b

### Security Considerations

1. **Change default passwords** in production
2. **Use environment variables** for sensitive data
3. **Enable authentication** in Open Web UI
4. **Configure firewall rules** appropriately
5. **Use HTTPS** in production environments

### Backup and Maintenance

```bash
# Backup Docker volumes
docker run --rm -v ollama_data:/data -v $(pwd):/backup alpine tar czf /backup/ollama_backup.tar.gz -C /data .

# Backup Supabase
supabase db dump --file backup.sql

# Update services
docker-compose pull
docker-compose up -d

# Update Ollama models
ollama pull llama2:7b
```

## Integrating Local LLMs with Backend Services

### Overview

This comprehensive guide demonstrates how to integrate local LLMs (like DeepSeek R1 and Qwen 3) into backend services using Ollama's OpenAI-compatible API. You'll learn to build a production-ready FastAPI server with advanced features including streaming, conversation management, error handling, and Docker integration.

### Key Features Covered

- **Model Setup Instructions**: How to pull and configure DeepSeek R1 and Qwen 3 models
- **Complete FastAPI Implementation**: Full working server with multiple endpoints
- **Advanced LLM Service Class**: Reusable service for complex integrations
- **Multiple API Endpoints**: OpenAI-compatible, simplified chat, model listing, and streaming
- **Practical Examples**: Ready-to-run code snippets for testing
- **Docker Integration**: Containerization setup with docker-compose
- **Best Practices**: Error handling, performance optimization, and security

### Model Setup and Configuration

#### 1. Pull Required Models

```bash
# Pull DeepSeek R1 models (various sizes)
ollama pull deepseek-r1:1.5b    # Lightweight for testing
ollama pull deepseek-r1:7b      # Balanced performance
ollama pull deepseek-r1:14b     # Higher quality (requires more RAM)
ollama pull deepseek-r1:32b     # Best quality (requires 32GB+ RAM)

# Pull Qwen 3 models
ollama pull qwen2.5:0.5b        # Ultra-lightweight
ollama pull qwen2.5:1.5b        # Lightweight
ollama pull qwen2.5:3b          # Small but capable
ollama pull qwen2.5:7b          # Recommended balance
ollama pull qwen2.5:14b         # High performance
ollama pull qwen2.5:32b         # Maximum quality

# Pull specialized models
ollama pull qwen2.5-coder:7b    # Code-focused Qwen model
ollama pull deepseek-coder-v2:16b # Code-focused DeepSeek model

# List all available models
ollama list

# Test a model
ollama run deepseek-r1:7b "Explain the difference between AI and machine learning"
```

#### 2. Model Recommendations by Hardware

| RAM Available | Recommended Models | Use Case |
|---------------|-------------------|----------|
| 8GB | deepseek-r1:1.5b, qwen2.5:3b | Testing, lightweight apps |
| 16GB | deepseek-r1:7b, qwen2.5:7b | Production apps, balanced performance |
| 32GB | deepseek-r1:14b, qwen2.5:14b | High-quality responses |
| 64GB+ | deepseek-r1:32b, qwen2.5:32b | Maximum quality, research |

### Complete FastAPI Backend Implementation

#### 1. Project Structure

```
backend/
├── main.py                 # FastAPI application entry point
├── llm_service.py         # Advanced LLM service class
├── models.py              # Pydantic models
├── config.py              # Configuration management
├── examples.py            # Usage examples
├── requirements.txt       # Python dependencies
├── Dockerfile             # Container configuration
└── .env                   # Environment variables
```

#### 2. Install Required Dependencies

Create `requirements.txt`:

```text
fastapi==0.104.1
uvicorn[standard]==0.24.0
openai==1.3.0
python-dotenv==1.0.0
pydantic==2.5.0
httpx==0.25.0
python-multipart==0.0.6
prometheus-client==0.19.0
structlog==23.2.0
```

Install dependencies:

```bash
pip install -r requirements.txt
```

#### 3. Configuration Management

Create `config.py`:

```python
from pydantic_settings import BaseSettings
from typing import List
import os

class Settings(BaseSettings):
    # Ollama Configuration
    ollama_base_url: str = "http://localhost:11434"
    ollama_timeout: int = 300
    default_model: str = "deepseek-r1:7b"
    
    # API Configuration
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    api_title: str = "Local LLM API"
    api_version: str = "1.0.0"
    
    # Performance Settings
    max_concurrent_requests: int = 10
    request_timeout: int = 300
    max_tokens_default: int = 2000
    temperature_default: float = 0.7
    
    # Security
    api_key_required: bool = False
    allowed_origins: List[str] = ["*"]
    
    # Logging
    log_level: str = "INFO"
    
    class Config:
        env_file = ".env"
        case_sensitive = False

settings = Settings()
```

#### 4. Pydantic Models

Create `models.py`:

```python
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from enum import Enum

class MessageRole(str, Enum):
    USER = "user"
    ASSISTANT = "assistant"
    SYSTEM = "system"

class ChatMessage(BaseModel):
    role: MessageRole
    content: str
    name: Optional[str] = None

class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    model: Optional[str] = None
    temperature: Optional[float] = Field(default=0.7, ge=0.0, le=2.0)
    max_tokens: Optional[int] = Field(default=1000, ge=1, le=4000)
    top_p: Optional[float] = Field(default=1.0, ge=0.0, le=1.0)
    frequency_penalty: Optional[float] = Field(default=0.0, ge=-2.0, le=2.0)
    presence_penalty: Optional[float] = Field(default=0.0, ge=-2.0, le=2.0)
    stream: Optional[bool] = False
    stop: Optional[List[str]] = None

class ChatChoice(BaseModel):
    index: int
    message: ChatMessage
    finish_reason: Optional[str] = None

class Usage(BaseModel):
    prompt_tokens: int
    completion_tokens: int
    total_tokens: int

class ChatResponse(BaseModel):
    id: str
    object: str = "chat.completion"
    created: int
    model: str
    choices: List[ChatChoice]
    usage: Usage

class SimpleChatRequest(BaseModel):
    message: str
    model: Optional[str] = None
    temperature: Optional[float] = Field(default=0.7, ge=0.0, le=2.0)
    max_tokens: Optional[int] = Field(default=1000, ge=1, le=4000)
    system_prompt: Optional[str] = None

class SimpleChatResponse(BaseModel):
    message: str
    response: str
    model: str
    usage: Usage
    conversation_id: Optional[str] = None

class ModelInfo(BaseModel):
    id: str
    object: str = "model"
    created: int
    owned_by: str = "ollama"

class ModelsResponse(BaseModel):
    object: str = "list"
    data: List[ModelInfo]

class HealthResponse(BaseModel):
    status: str
    ollama_connected: bool
    available_models: List[str]
    version: str

class ErrorResponse(BaseModel):
    error: str
    detail: Optional[str] = None
    type: str = "api_error"
```

#### 5. Environment Configuration

Create `.env` file:

```bash
# Ollama Configuration
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_TIMEOUT=300
DEFAULT_MODEL=deepseek-r1:7b

# API Configuration
API_HOST=0.0.0.0
API_PORT=8000
API_TITLE=Local LLM API with DeepSeek R1 & Qwen 3
API_VERSION=1.0.0

# Performance Settings
MAX_CONCURRENT_REQUESTS=10
REQUEST_TIMEOUT=300
MAX_TOKENS_DEFAULT=2000
TEMPERATURE_DEFAULT=0.7

# Security (set to true in production)
API_KEY_REQUIRED=false
ALLOWED_ORIGINS=["*"]

# Logging
LOG_LEVEL=INFO

# Optional: Fallback API keys
# OPENAI_API_KEY=your-openai-key
# ANTHROPIC_API_KEY=your-anthropic-key
```

#### 6. Advanced LLM Service Class

Create `llm_service.py`:

```python
from openai import OpenAI
import httpx
import asyncio
from typing import List, Dict, Optional, AsyncGenerator, Tuple
from datetime import datetime
import json
import uuid
import structlog
from config import settings
from models import ChatMessage, Usage

logger = structlog.get_logger()

class LLMService:
    def __init__(self, base_url: str = None, default_model: str = None):
        self.base_url = base_url or settings.ollama_base_url
        self.default_model = default_model or settings.default_model
        
        # Initialize OpenAI client for Ollama
        self.client = OpenAI(
            base_url=f"{self.base_url}/v1",
            api_key="ollama",  # Ollama doesn't require a real API key
            timeout=httpx.Timeout(settings.ollama_timeout)
        )
        
        # Conversation storage (in production, use Redis or database)
        self.conversations = {}
        
        logger.info("LLM Service initialized", 
                   base_url=self.base_url, 
                   default_model=self.default_model)
    
    async def health_check(self) -> Tuple[bool, List[str]]:
        """Check if Ollama is running and return available models"""
        try:
            models = self.client.models.list()
            model_ids = [model.id for model in models.data]
            logger.info("Health check successful", models_count=len(model_ids))
            return True, model_ids
        except Exception as e:
            logger.error("Health check failed", error=str(e))
            return False, []
    
    def get_available_models(self) -> List[str]:
        """Get list of available models from Ollama"""
        try:
            models = self.client.models.list()
            return [model.id for model in models.data]
        except Exception as e:
            logger.error("Failed to fetch models", error=str(e))
            raise Exception(f"Failed to fetch models: {str(e)}")
    
    async def chat_completion(
        self,
        messages: List[Dict[str, str]],
        model: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: int = 1000,
        top_p: float = 1.0,
        frequency_penalty: float = 0.0,
        presence_penalty: float = 0.0,
        stop: Optional[List[str]] = None,
        conversation_id: Optional[str] = None
    ) -> Dict:
        """Generate chat completion with comprehensive options"""
        try:
            selected_model = model or self.default_model
            
            # Log the request
            logger.info("Chat completion request", 
                       model=selected_model,
                       message_count=len(messages),
                       conversation_id=conversation_id)
            
            response = self.client.chat.completions.create(
                model=selected_model,
                messages=messages,
                temperature=temperature,
                max_tokens=max_tokens,
                top_p=top_p,
                frequency_penalty=frequency_penalty,
                presence_penalty=presence_penalty,
                stop=stop
            )
            
            result = {
                "id": f"chatcmpl-{uuid.uuid4()}",
                "object": "chat.completion",
                "created": int(datetime.now().timestamp()),
                "model": response.model,
                "choices": [{
                    "index": 0,
                    "message": {
                        "role": "assistant",
                        "content": response.choices[0].message.content
                    },
                    "finish_reason": response.choices[0].finish_reason
                }],
                "usage": {
                    "prompt_tokens": response.usage.prompt_tokens,
                    "completion_tokens": response.usage.completion_tokens,
                    "total_tokens": response.usage.total_tokens
                }
            }
            
            # Store conversation if ID provided
            if conversation_id:
                self.save_conversation(conversation_id, messages + [
                    {"role": "assistant", "content": response.choices[0].message.content}
                ])
            
            logger.info("Chat completion successful",
                       model=selected_model,
                       tokens_used=result["usage"]["total_tokens"])
            
            return result
            
        except Exception as e:
            logger.error("Chat completion failed", 
                        model=selected_model,
                        error=str(e))
            raise Exception(f"Chat completion failed: {str(e)}")
    
    async def stream_chat_completion(
        self,
        messages: List[Dict[str, str]],
        model: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: int = 1000,
        conversation_id: Optional[str] = None
    ) -> AsyncGenerator[str, None]:
        """Generate streaming chat completion"""
        try:
            selected_model = model or self.default_model
            
            logger.info("Streaming chat completion request",
                       model=selected_model,
                       conversation_id=conversation_id)
            
            stream = self.client.chat.completions.create(
                model=selected_model,
                messages=messages,
                temperature=temperature,
                max_tokens=max_tokens,
                stream=True
            )
            
            full_content = ""
            for chunk in stream:
                if chunk.choices[0].delta.content is not None:
                    content = chunk.choices[0].delta.content
                    full_content += content
                    
                    # Format as Server-Sent Events
                    yield f"data: {json.dumps({'content': content})}\n\n"
            
            # Store conversation if ID provided
            if conversation_id and full_content:
                self.save_conversation(conversation_id, messages + [
                    {"role": "assistant", "content": full_content}
                ])
            
            yield "data: [DONE]\n\n"
            
        except Exception as e:
            logger.error("Streaming completion failed",
                        model=selected_model,
                        error=str(e))
            yield f"data: {json.dumps({'error': str(e)})}\n\n"
    
    def save_conversation(self, conversation_id: str, messages: List[Dict[str, str]]):
        """Save conversation history"""
        self.conversations[conversation_id] = {
            "messages": messages,
            "updated_at": datetime.now().isoformat(),
            "message_count": len(messages)
        }
        logger.debug("Conversation saved", 
                    conversation_id=conversation_id,
                    message_count=len(messages))
    
    def get_conversation(self, conversation_id: str) -> Optional[List[Dict[str, str]]]:
        """Retrieve conversation history"""
        conv = self.conversations.get(conversation_id)
        if conv:
            logger.debug("Conversation retrieved", 
                        conversation_id=conversation_id,
                        message_count=conv["message_count"])
            return conv["messages"]
        return None
    
    def list_conversations(self) -> List[Dict[str, any]]:
        """List all conversation summaries"""
        return [
            {
                "id": conv_id,
                "message_count": conv["message_count"],
                "updated_at": conv["updated_at"]
            }
            for conv_id, conv in self.conversations.items()
        ]
    
    async def generate_embeddings(self, 
                                 text: str, 
                                 model: str = "nomic-embed-text") -> List[float]:
        """Generate embeddings using embedding model"""
        try:
            # Note: Requires embedding model to be pulled first
            # ollama pull nomic-embed-text
            response = self.client.embeddings.create(
                model=model,
                input=text
            )
            logger.info("Embeddings generated", 
                       model=model, 
                       text_length=len(text))
            return response.data[0].embedding
        except Exception as e:
            logger.error("Embedding generation failed", 
                        model=model,
                        error=str(e))
            raise Exception(f"Embedding generation failed: {str(e)}")
    
    async def simple_chat(self, 
                         message: str, 
                         model: Optional[str] = None,
                         system_prompt: Optional[str] = None,
                         conversation_id: Optional[str] = None) -> Dict:
        """Simplified chat interface"""
        messages = []
        
        # Add system prompt if provided
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        
        # Get conversation history if ID provided
        if conversation_id:
            history = self.get_conversation(conversation_id)
            if history:
                # Only add the last few messages to avoid token limits
                messages.extend(history[-10:])  # Last 10 messages
        
        messages.append({"role": "user", "content": message})
        
        response = await self.chat_completion(
            messages=messages,
            model=model,
            conversation_id=conversation_id
        )
        
        return {
            "message": message,
            "response": response["choices"][0]["message"]["content"],
            "model": response["model"],
            "usage": response["usage"],
            "conversation_id": conversation_id
        }
```

#### 7. Complete FastAPI Server Implementation

Create `main.py`:

```python
from fastapi import FastAPI, HTTPException, Depends, Request, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, JSONResponse
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import structlog
import time
import uuid
from contextlib import asynccontextmanager
from typing import Optional

from config import settings
from models import *
from llm_service import LLMService

# Configure structured logging
structlog.configure(
    processors=[
        structlog.stdlib.filter_by_level,
        structlog.stdlib.add_logger_name,
        structlog.stdlib.add_log_level,
        structlog.stdlib.PositionalArgumentsFormatter(),
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.StackInfoRenderer(),
        structlog.processors.format_exc_info,
        structlog.processors.UnicodeDecoder(),
        structlog.processors.JSONRenderer()
    ],
    context_class=dict,
    logger_factory=structlog.stdlib.LoggerFactory(),
    cache_logger_on_first_use=True,
)

logger = structlog.get_logger()

# Global LLM service instance
llm_service = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan management"""
    global llm_service
    
    # Startup
    logger.info("Starting Local LLM API", version=settings.api_version)
    
    # Initialize LLM service
    llm_service = LLMService()
    
    # Test connection to Ollama
    is_healthy, models = await llm_service.health_check()
    if is_healthy:
        logger.info("Connected to Ollama", available_models=models)
    else:
        logger.warning("Could not connect to Ollama - service will have limited functionality")
    
    yield
    
    # Shutdown
    logger.info("Shutting down Local LLM API")

# Initialize FastAPI app
app = FastAPI(
    title=settings.api_title,
    description="Production-ready FastAPI server with local LLM integration via Ollama. Supports DeepSeek R1, Qwen 3, and other models.",
    version=settings.api_version,
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security (optional)
security = HTTPBearer(auto_error=False) if settings.api_key_required else None

def verify_api_key(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Verify API key if required"""
    if settings.api_key_required and not credentials:
        raise HTTPException(status_code=401, detail="API key required")
    return credentials

# Middleware for request logging
@app.middleware("http")
async def log_requests(request: Request, call_next):
    """Log all requests"""
    start_time = time.time()
    request_id = str(uuid.uuid4())
    
    logger.info("Request started",
               request_id=request_id,
               method=request.method,
               url=str(request.url),
               client_ip=request.client.host)
    
    response = await call_next(request)
    
    process_time = time.time() - start_time
    logger.info("Request completed",
               request_id=request_id,
               status_code=response.status_code,
               process_time=f"{process_time:.3f}s")
    
    return response

# Routes
@app.get("/", response_model=Dict[str, str])
async def root():
    """Root endpoint with service information"""
    return {
        "message": "Local LLM API is running",
        "version": settings.api_version,
        "docs": "/docs",
        "health": "/health"
    }

@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    is_healthy, models = await llm_service.health_check()
    
    return HealthResponse(
        status="healthy" if is_healthy else "degraded",
        ollama_connected=is_healthy,
        available_models=models,
        version=settings.api_version
    )

@app.get("/models", response_model=ModelsResponse)
async def list_models(credentials: HTTPAuthorizationCredentials = Depends(verify_api_key)):
    """List available models from Ollama"""
    try:
        models = llm_service.get_available_models()
        model_objects = [
            ModelInfo(
                id=model,
                created=int(time.time()),
                owned_by="ollama"
            )
            for model in models
        ]
        
        return ModelsResponse(data=model_objects)
        
    except Exception as e:
        logger.error("Failed to list models", error=str(e))
        raise HTTPException(status_code=500, detail=f"Error fetching models: {str(e)}")

@app.post("/chat/completions", response_model=ChatResponse)
async def chat_completions(
    request: ChatRequest,
    credentials: HTTPAuthorizationCredentials = Depends(verify_api_key)
):
    """OpenAI-compatible chat completions endpoint"""
    try:
        if request.stream:
            # Return streaming response
            return StreamingResponse(
                llm_service.stream_chat_completion(
                    messages=[msg.dict() for msg in request.messages],
                    model=request.model,
                    temperature=request.temperature,
                    max_tokens=request.max_tokens
                ),
                media_type="text/plain",
                headers={
                    "Cache-Control": "no-cache",
                    "Connection": "keep-alive",
                    "Content-Type": "text/event-stream"
                }
            )
        else:
            # Non-streaming response
            response = await llm_service.chat_completion(
                messages=[msg.dict() for msg in request.messages],
                model=request.model,
                temperature=request.temperature,
                max_tokens=request.max_tokens,
                top_p=request.top_p,
                frequency_penalty=request.frequency_penalty,
                presence_penalty=request.presence_penalty,
                stop=request.stop
            )
            
            return ChatResponse(**response)
            
    except Exception as e:
        logger.error("Chat completion failed", error=str(e))
        raise HTTPException(status_code=500, detail=f"Error generating response: {str(e)}")

@app.post("/simple-chat", response_model=SimpleChatResponse)
async def simple_chat(
    request: SimpleChatRequest,
    conversation_id: Optional[str] = None,
    credentials: HTTPAuthorizationCredentials = Depends(verify_api_key)
):
    """Simplified chat endpoint for quick testing"""
    try:
        response = await llm_service.simple_chat(
            message=request.message,
            model=request.model,
            system_prompt=request.system_prompt,
            conversation_id=conversation_id
        )
        
        return SimpleChatResponse(**response)
        
    except Exception as e:
        logger.error("Simple chat failed", error=str(e))
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

@app.get("/conversations")
async def list_conversations(credentials: HTTPAuthorizationCredentials = Depends(verify_api_key)):
    """List all conversation summaries"""
    try:
        conversations = llm_service.list_conversations()
        return {"conversations": conversations}
    except Exception as e:
        logger.error("Failed to list conversations", error=str(e))
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

@app.get("/conversations/{conversation_id}")
async def get_conversation(
    conversation_id: str,
    credentials: HTTPAuthorizationCredentials = Depends(verify_api_key)
):
    """Get specific conversation history"""
    try:
        messages = llm_service.get_conversation(conversation_id)
        if messages is None:
            raise HTTPException(status_code=404, detail="Conversation not found")
        
        return {"conversation_id": conversation_id, "messages": messages}
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Failed to get conversation", conversation_id=conversation_id, error=str(e))
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

@app.post("/embeddings")
async def create_embeddings(
    text: str,
    model: str = "nomic-embed-text",
    credentials: HTTPAuthorizationCredentials = Depends(verify_api_key)
):
    """Generate embeddings for text"""
    try:
        embeddings = await llm_service.generate_embeddings(text, model)
        return {
            "object": "list",
            "data": [{
                "object": "embedding",
                "embedding": embeddings,
                "index": 0
            }],
            "model": model,
            "usage": {
                "prompt_tokens": len(text.split()),
                "total_tokens": len(text.split())
            }
        }
    except Exception as e:
        logger.error("Embedding generation failed", error=str(e))
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

# Error handlers
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    """Custom HTTP exception handler"""
    logger.error("HTTP exception",
                url=str(request.url),
                status_code=exc.status_code,
                detail=exc.detail)
    
    return JSONResponse(
        status_code=exc.status_code,
        content=ErrorResponse(
            error=f"HTTP {exc.status_code}",
            detail=exc.detail,
            type="http_error"
        ).dict()
    )

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    """General exception handler"""
    logger.error("Unhandled exception",
                url=str(request.url),
                error=str(exc),
                exc_info=True)
    
    return JSONResponse(
        status_code=500,
        content=ErrorResponse(
            error="Internal Server Error",
            detail="An unexpected error occurred",
            type="internal_error"
        ).dict()
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.api_host,
        port=settings.api_port,
        reload=True,
        log_level=settings.log_level.lower(),
        access_log=True
    )
```

#### 8. Practical Usage Examples

Create `examples.py`:

```python
import asyncio
import requests
import httpx
import json
from llm_service import LLMService

# Example 1: Direct API usage
def test_simple_api():
    """Test the simple chat endpoint"""
    print("=== Testing Simple API ===")
    
    response = requests.post(
        "http://localhost:8000/simple-chat",
        json={
            "message": "Explain quantum computing in simple terms",
            "model": "deepseek-r1:7b",
            "system_prompt": "You are a helpful science teacher."
        }
    )
    
    if response.status_code == 200:
        data = response.json()
        print(f"Question: {data['message']}")
        print(f"Answer: {data['response']}")
        print(f"Model: {data['model']}")
        print(f"Tokens used: {data['usage']['total_tokens']}")
    else:
        print(f"Error: {response.status_code} - {response.text}")

# Example 2: OpenAI-compatible endpoint
def test_chat_completions():
    """Test the OpenAI-compatible chat completions endpoint"""
    print("\n=== Testing Chat Completions ===")
    
    payload = {
        "messages": [
            {"role": "system", "content": "You are a helpful programming assistant specializing in Python and AI."},
            {"role": "user", "content": "Write a Python function to implement binary search with detailed comments"}
        ],
        "model": "deepseek-r1:7b",
        "temperature": 0.2,
        "max_tokens": 1000
    }
    
    response = requests.post(
        "http://localhost:8000/chat/completions",
        json=payload
    )
    
    if response.status_code == 200:
        data = response.json()
        print(f"Response: {data['choices'][0]['message']['content']}")
        print(f"Model: {data['model']}")
        print(f"Tokens: {data['usage']['total_tokens']}")
    else:
        print(f"Error: {response.status_code} - {response.text}")

# Example 3: Streaming response
async def test_streaming():
    """Test streaming chat completion"""
    print("\n=== Testing Streaming Response ===")
    
    payload = {
        "messages": [
            {"role": "user", "content": "Write a detailed story about a programmer who discovers AI"}
        ],
        "model": "qwen2.5:7b",
        "temperature": 0.8,
        "max_tokens": 1500,
        "stream": True
    }
    
    async with httpx.AsyncClient() as client:
        async with client.stream(
            "POST",
            "http://localhost:8000/chat/completions",
            json=payload,
            timeout=60.0
        ) as response:
            print("Streaming response:")
            async for line in response.aiter_lines():
                if line.startswith("data: "):
                    data_str = line[6:]  # Remove "data: " prefix
                    if data_str == "[DONE]":
                        break
                    try:
                        data = json.loads(data_str)
                        if "content" in data:
                            print(data["content"], end="", flush=True)
                    except json.JSONDecodeError:
                        pass
    print("\n\nStreaming complete.")

# Example 4: Using the LLM service directly
async def test_llm_service():
    """Test the LLM service class directly"""
    print("\n=== Testing LLM Service Directly ===")
    
    llm = LLMService()
    
    # Health check
    is_healthy, models = await llm.health_check()
    print(f"Service Health: {'✓' if is_healthy else '✗'}")
    print(f"Available models: {models}")
    
    # Simple chat with conversation tracking
    conversation_id = "test-conv-123"
    
    # First message
    response1 = await llm.simple_chat(
        message="What is machine learning?",
        system_prompt="You are an AI expert.",
        conversation_id=conversation_id
    )
    print(f"\nQ1: What is machine learning?")
    print(f"A1: {response1['response'][:200]}...")
    
    # Follow-up message (should remember context)
    response2 = await llm.simple_chat(
        message="Can you give me a practical example?",
        conversation_id=conversation_id
    )
    print(f"\nQ2: Can you give me a practical example?")
    print(f"A2: {response2['response'][:200]}...")
    
    # Check conversation history
    history = llm.get_conversation(conversation_id)
    print(f"\nConversation has {len(history)} messages")

# Example 5: Embeddings generation
async def test_embeddings():
    """Test embeddings generation"""
    print("\n=== Testing Embeddings ===")
    
    try:
        response = requests.post(
            "http://localhost:8000/embeddings",
            params={
                "text": "Machine learning is a subset of artificial intelligence",
                "model": "nomic-embed-text"
            }
        )
        
        if response.status_code == 200:
            data = response.json()
            embeddings = data["data"][0]["embedding"]
            print(f"Generated embeddings with {len(embeddings)} dimensions")
            print(f"First 5 values: {embeddings[:5]}")
        else:
            print(f"Embeddings failed: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"Embeddings test failed: {e}")

# Example 6: Model comparison
async def test_model_comparison():
    """Compare responses from different models"""
    print("\n=== Model Comparison ===")
    
    models = ["deepseek-r1:7b", "qwen2.5:7b"]
    question = "Explain the difference between supervised and unsupervised learning in 100 words."
    
    for model in models:
        try:
            response = requests.post(
                "http://localhost:8000/simple-chat",
                json={
                    "message": question,
                    "model": model,
                    "max_tokens": 150
                }
            )
            
            if response.status_code == 200:
                data = response.json()
                print(f"\n{model}:")
                print(f"Response: {data['response']}")
                print(f"Tokens: {data['usage']['total_tokens']}")
            else:
                print(f"{model} failed: {response.status_code}")
        except Exception as e:
            print(f"{model} error: {e}")

# Example 7: Conversation management
def test_conversations():
    """Test conversation management endpoints"""
    print("\n=== Testing Conversation Management ===")
    
    # Create a conversation
    conv_id = "demo-conversation"
    
    # Send a few messages
    messages = [
        "Hello, I'm learning about AI",
        "Can you explain neural networks?",
        "What about deep learning?"
    ]
    
    for i, msg in enumerate(messages):
        response = requests.post(
            f"http://localhost:8000/simple-chat?conversation_id={conv_id}",
            json={"message": msg}
        )
        print(f"Message {i+1}: {msg}")
        if response.status_code == 200:
            print(f"Response: {response.json()['response'][:100]}...")
    
    # List conversations
    convs_response = requests.get("http://localhost:8000/conversations")
    if convs_response.status_code == 200:
        conversations = convs_response.json()["conversations"]
        print(f"\nTotal conversations: {len(conversations)}")
    
    # Get specific conversation
    conv_response = requests.get(f"http://localhost:8000/conversations/{conv_id}")
    if conv_response.status_code == 200:
        conv_data = conv_response.json()
        print(f"Conversation '{conv_id}' has {len(conv_data['messages'])} messages")

# Main execution
async def main():
    """Run all examples"""
    print("🚀 Running Local LLM API Examples")
    print("=" * 50)
    
    # Check if API is running
    try:
        health_response = requests.get("http://localhost:8000/health")
        if health_response.status_code != 200:
            print("❌ API is not running. Please start the server first:")
            print("   python main.py")
            return
        
        health_data = health_response.json()
        print(f"✅ API Status: {health_data['status']}")
        print(f"Available models: {health_data['available_models']}")
        print()
        
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to API. Please start the server first:")
        print("   python main.py")
        return
    
    # Run synchronous tests
    test_simple_api()
    test_chat_completions()
    test_conversations()
    
    # Run asynchronous tests
    await test_streaming()
    await test_llm_service()
    await test_embeddings()
    await test_model_comparison()
    
    print("\n✅ All examples completed!")

if __name__ == "__main__":
    asyncio.run(main())
```

#### 9. Docker Integration and Deployment

##### Dockerfile for FastAPI Service

Create `Dockerfile`:

```dockerfile
# Use Python 3.11 slim image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better layer caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create non-root user for security
RUN useradd --create-home --shell /bin/bash app && \
    chown -R app:app /app
USER app

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Run application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "1"]
```

##### Docker Compose with Full Stack

Update your `docker-compose.yml`:

```yaml
version: '3.8'

services:
  # Ollama Service
  ollama:
    image: ollama/ollama:latest
    container_name: local-ai-ollama
    ports:
      - "11434:11434"
    volumes:
      - ollama_data:/root/.ollama
      - ./models:/models  # Optional: for sharing model files
    environment:
      - OLLAMA_HOST=0.0.0.0
      - OLLAMA_ORIGINS=*
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:11434/api/tags"]
      interval: 30s
      timeout: 10s
      retries: 3
    # Uncomment for GPU support
    # deploy:
    #   resources:
    #     reservations:
    #       devices:
    #         - driver: nvidia
    #           count: 1
    #           capabilities: [gpu]

  # FastAPI Backend Service
  api-server:
    build: 
      context: .
      dockerfile: Dockerfile
    container_name: local-ai-api
    ports:
      - "8000:8000"
    environment:
      - OLLAMA_BASE_URL=http://ollama:11434
      - DEFAULT_MODEL=deepseek-r1:7b
      - API_HOST=0.0.0.0
      - API_PORT=8000
      - LOG_LEVEL=INFO
      - MAX_CONCURRENT_REQUESTS=10
    volumes:
      - ./logs:/app/logs  # Optional: persist logs
    depends_on:
      ollama:
        condition: service_healthy
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Open Web UI (Optional)
  open-webui:
    image: ghcr.io/open-webui/open-webui:main
    container_name: local-ai-webui
    ports:
      - "3000:8080"
    environment:
      - OLLAMA_BASE_URL=http://ollama:11434
      - WEBUI_SECRET_KEY=your-secret-key-change-this
      - WEBUI_NAME=Local AI Stack
    volumes:
      - open_webui_data:/app/backend/data
    depends_on:
      ollama:
        condition: service_healthy
    restart: unless-stopped

  # Redis for Caching (Optional)
  redis:
    image: redis:7-alpine
    container_name: local-ai-redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    command: redis-server --appendonly yes
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 30s
      timeout: 10s
      retries: 3

  # PostgreSQL for Data Persistence (Optional)
  postgres:
    image: postgres:15-alpine
    container_name: local-ai-postgres
    environment:
      - POSTGRES_DB=localai
      - POSTGRES_USER=localai
      - POSTGRES_PASSWORD=change-this-password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql  # Optional: init script
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U localai"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Nginx Reverse Proxy (Optional)
  nginx:
    image: nginx:alpine
    container_name: local-ai-nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro  # Optional: SSL certificates
    depends_on:
      - api-server
      - open-webui
    restart: unless-stopped

volumes:
  ollama_data:
    driver: local
  open_webui_data:
    driver: local
  redis_data:
    driver: local
  postgres_data:
    driver: local
```

##### Running the Complete Stack

Create a `setup.sh` script:

```bash
#!/bin/bash
# setup.sh - Complete setup script for Local AI Stack

echo "🚀 Setting up Local AI Stack..."

# Create necessary directories
mkdir -p logs models ssl

# Set proper permissions
chmod 755 logs models

# Start the services
echo "Starting services..."
docker-compose up -d

# Wait for Ollama to be ready
echo "Waiting for Ollama to start..."
while ! curl -s http://localhost:11434/api/tags > /dev/null; do
    sleep 2
    echo "Waiting for Ollama..."
done

echo "✅ Ollama is ready!"

# Pull essential models
echo "Pulling essential models..."
docker-compose exec ollama ollama pull deepseek-r1:7b
docker-compose exec ollama ollama pull qwen2.5:7b
docker-compose exec ollama ollama pull nomic-embed-text

# Test the API
echo "Testing API..."
sleep 5
curl -X GET http://localhost:8000/health

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Available services:"
echo "- FastAPI Backend: http://localhost:8000"
echo "- API Documentation: http://localhost:8000/docs"
echo "- Open Web UI: http://localhost:3000"
echo "- Ollama API: http://localhost:11434"
echo ""
echo "Run examples:"
echo "python examples.py"
```

Make it executable:

```bash
chmod +x setup.sh
./setup.sh
```

### Testing and Validation

#### 1. Unit Tests

Create `test_llm_service.py`:

```python
import pytest
import asyncio
from unittest.mock import Mock, patch
from llm_service import LLMService

class TestLLMService:
    @pytest.fixture
    def llm_service(self):
        return LLMService(base_url="http://localhost:11434", default_model="deepseek-r1:7b")
    
    @pytest.mark.asyncio
    async def test_health_check_success(self, llm_service):
        """Test successful health check"""
        with patch.object(llm_service.client.models, 'list') as mock_list:
            mock_list.return_value.data = [Mock(id="deepseek-r1:7b")]
            
            is_healthy, models = await llm_service.health_check()
            assert is_healthy == True
            assert len(models) == 1
    
    @pytest.mark.asyncio
    async def test_chat_completion(self, llm_service):
        """Test chat completion"""
        with patch.object(llm_service.client.chat.completions, 'create') as mock_create:
            mock_response = Mock()
            mock_response.choices[0].message.content = "Test response"
            mock_response.model = "deepseek-r1:7b"
            mock_response.usage.prompt_tokens = 10
            mock_response.usage.completion_tokens = 20
            mock_response.usage.total_tokens = 30
            mock_create.return_value = mock_response
            
            messages = [{"role": "user", "content": "Hello"}]
            response = await llm_service.chat_completion(messages)
            
            assert response["content"] == "Test response"
            assert response["model"] == "deepseek-r1:7b"
            assert response["usage"]["total_tokens"] == 30

# Run tests with: pytest test_llm_service.py -v
```

#### 2. Integration Tests

Create `test_api.py`:

```python
import pytest
import httpx
import asyncio
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

class TestAPI:
    def test_root_endpoint(self):
        """Test root endpoint"""
        response = client.get("/")
        assert response.status_code == 200
        assert "Local LLM API is running" in response.json()["message"]
    
    def test_health_endpoint(self):
        """Test health check endpoint"""
        response = client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert "status" in data
        assert "available_models" in data
    
    def test_models_endpoint(self):
        """Test models listing endpoint"""
        response = client.get("/models")
        assert response.status_code == 200
        data = response.json()
        assert "data" in data
        assert isinstance(data["data"], list)
    
    def test_simple_chat_endpoint(self):
        """Test simple chat endpoint"""
        response = client.post(
            "/simple-chat",
            json={
                "message": "Hello, world!",
                "model": "deepseek-r1:7b"
            }
        )
        
        # Note: This test requires Ollama to be running
        if response.status_code == 200:
            data = response.json()
            assert "response" in data
            assert "model" in data
            assert "usage" in data

# Run tests with: pytest test_api.py -v
```

#### 3. Load Testing

Create `load_test.py`:

```python
import asyncio
import aiohttp
import time
from concurrent.futures import ThreadPoolExecutor
import statistics

async def single_request(session, url, payload):
    """Single API request"""
    start_time = time.time()
    try:
        async with session.post(url, json=payload) as response:
            await response.json()
            return time.time() - start_time, response.status
    except Exception as e:
        return time.time() - start_time, 500

async def load_test(concurrent_requests=10, total_requests=100):
    """Run load test against the API"""
    url = "http://localhost:8000/simple-chat"
    payload = {
        "message": "What is 2+2?",
        "model": "deepseek-r1:7b",
        "max_tokens": 50
    }
    
    async with aiohttp.ClientSession() as session:
        # Warm up
        await single_request(session, url, payload)
        
        # Run load test
        semaphore = asyncio.Semaphore(concurrent_requests)
        
        async def limited_request():
            async with semaphore:
                return await single_request(session, url, payload)
        
        print(f"Running load test: {total_requests} requests, {concurrent_requests} concurrent")
        
        start_time = time.time()
        tasks = [limited_request() for _ in range(total_requests)]
        results = await asyncio.gather(*tasks)
        total_time = time.time() - start_time
        
        # Analyze results
        response_times = [r[0] for r in results]
        status_codes = [r[1] for r in results]
        
        success_count = sum(1 for status in status_codes if status == 200)
        
        print(f"\nLoad Test Results:")
        print(f"Total time: {total_time:.2f}s")
        print(f"Requests per second: {total_requests/total_time:.2f}")
        print(f"Success rate: {success_count/total_requests*100:.1f}%")
        print(f"Average response time: {statistics.mean(response_times):.3f}s")
        print(f"Median response time: {statistics.median(response_times):.3f}s")
        print(f"95th percentile: {sorted(response_times)[int(0.95*len(response_times))]:.3f}s")

if __name__ == "__main__":
    asyncio.run(load_test())
```

### Best Practices and Performance Optimization

#### 1. Security Best Practices

```python
# security.py - Security enhancements

from fastapi import HTTPException, Depends
from fastapi.security import HTTPBearer
import jwt
import time
from typing import Optional

security = HTTPBearer()

class SecurityManager:
    def __init__(self, secret_key: str):
        self.secret_key = secret_key
        self.rate_limits = {}  # Simple in-memory rate limiting
    
    def create_token(self, user_id: str, expires_in: int = 3600) -> str:
        """Create JWT token"""
        payload = {
            "user_id": user_id,
            "exp": time.time() + expires_in,
            "iat": time.time()
        }
        return jwt.encode(payload, self.secret_key, algorithm="HS256")
    
    def verify_token(self, token: str) -> dict:
        """Verify JWT token"""
        try:
            payload = jwt.decode(token, self.secret_key, algorithms=["HS256"])
            if payload["exp"] < time.time():
                raise HTTPException(status_code=401, detail="Token expired")
            return payload
        except jwt.InvalidTokenError:
            raise HTTPException(status_code=401, detail="Invalid token")
    
    def check_rate_limit(self, client_ip: str, limit: int = 100, window: int = 3600):
        """Simple rate limiting"""
        current_time = time.time()
        
        if client_ip not in self.rate_limits:
            self.rate_limits[client_ip] = []
        
        # Remove old requests outside the window
        self.rate_limits[client_ip] = [
            req_time for req_time in self.rate_limits[client_ip]
            if current_time - req_time < window
        ]
        
        # Check if limit exceeded
        if len(self.rate_limits[client_ip]) >= limit:
            raise HTTPException(status_code=429, detail="Rate limit exceeded")
        
        # Add current request
        self.rate_limits[client_ip].append(current_time)

# Usage in main.py:
# security_manager = SecurityManager("your-secret-key")
# 
# @app.middleware("http")
# async def rate_limit_middleware(request: Request, call_next):
#     security_manager.check_rate_limit(request.client.host)
#     return await call_next(request)
```

#### 2. Caching Implementation

```python
# cache.py - Response caching

import redis
import json
import hashlib
from typing import Optional, Any
import pickle

class CacheManager:
    def __init__(self, redis_url: str = "redis://localhost:6379/0"):
        self.redis_client = redis.from_url(redis_url)
        self.default_ttl = 3600  # 1 hour
    
    def _make_key(self, prefix: str, **kwargs) -> str:
        """Create cache key from parameters"""
        key_data = json.dumps(kwargs, sort_keys=True)
        key_hash = hashlib.md5(key_data.encode()).hexdigest()
        return f"{prefix}:{key_hash}"
    
    def get_response(self, messages: list, model: str, **params) -> Optional[dict]:
        """Get cached response"""
        try:
            key = self._make_key("chat", messages=messages, model=model, **params)
            cached = self.redis_client.get(key)
            if cached:
                return pickle.loads(cached)
        except Exception:
            pass
        return None
    
    def set_response(self, messages: list, model: str, response: dict, ttl: int = None, **params):
        """Cache response"""
        try:
            key = self._make_key("chat", messages=messages, model=model, **params)
            ttl = ttl or self.default_ttl
            self.redis_client.setex(key, ttl, pickle.dumps(response))
        except Exception:
            pass
    
    def invalidate_pattern(self, pattern: str):
        """Invalidate cache entries matching pattern"""
        try:
            keys = self.redis_client.keys(pattern)
            if keys:
                self.redis_client.delete(*keys)
        except Exception:
            pass

# Usage in llm_service.py:
# cache = CacheManager()
# 
# async def chat_completion(self, messages, model, **kwargs):
#     # Check cache first
#     cached_response = cache.get_response(messages, model, **kwargs)
#     if cached_response:
#         return cached_response
#     
#     # Generate response
#     response = await self._generate_response(messages, model, **kwargs)
#     
#     # Cache the response
#     cache.set_response(messages, model, response, **kwargs)
#     
#     return response
```

#### 3. Monitoring and Metrics

```python
# monitoring.py - Application monitoring

from prometheus_client import Counter, Histogram, Gauge, generate_latest
import time
import psutil
import structlog

# Metrics
REQUEST_COUNT = Counter('llm_requests_total', 'Total requests', ['model', 'endpoint'])
REQUEST_DURATION = Histogram('llm_request_duration_seconds', 'Request duration', ['model', 'endpoint'])
ACTIVE_CONNECTIONS = Gauge('llm_active_connections', 'Active connections')
MODEL_USAGE = Counter('llm_model_usage_total', 'Model usage count', ['model'])
TOKEN_USAGE = Counter('llm_tokens_total', 'Total tokens used', ['model', 'type'])

logger = structlog.get_logger()

class MetricsCollector:
    def __init__(self):
        self.start_time = time.time()
    
    def record_request(self, model: str, endpoint: str, duration: float, tokens: dict):
        """Record request metrics"""
        REQUEST_COUNT.labels(model=model, endpoint=endpoint).inc()
        REQUEST_DURATION.labels(model=model, endpoint=endpoint).observe(duration)
        MODEL_USAGE.labels(model=model).inc()
        
        if tokens:
            TOKEN_USAGE.labels(model=model, type='prompt').inc(tokens.get('prompt_tokens', 0))
            TOKEN_USAGE.labels(model=model, type='completion').inc(tokens.get('completion_tokens', 0))
    
    def get_system_metrics(self):
        """Get system metrics"""
        return {
            "cpu_percent": psutil.cpu_percent(),
            "memory_percent": psutil.virtual_memory().percent,
            "disk_percent": psutil.disk_usage('/').percent,
            "uptime_seconds": time.time() - self.start_time
        }
    
    def export_metrics(self):
        """Export Prometheus metrics"""
        return generate_latest()

metrics = MetricsCollector()

# Add to main.py:
# @app.get("/metrics")
# async def get_metrics():
#     return Response(metrics.export_metrics(), media_type="text/plain")
```

#### 4. Performance Configuration

```python
# performance.py - Performance optimizations

import asyncio
from concurrent.futures import ThreadPoolExecutor
from typing import Optional

class PerformanceManager:
    def __init__(self, max_workers: int = 4):
        self.executor = ThreadPoolExecutor(max_workers=max_workers)
        self.model_cache = {}  # Keep models in memory
        self.connection_pool = None
    
    async def preload_models(self, models: list):
        """Preload frequently used models"""
        for model in models:
            try:
                # Warm up the model with a simple request
                await self._warm_up_model(model)
                logger.info("Model preloaded", model=model)
            except Exception as e:
                logger.error("Failed to preload model", model=model, error=str(e))
    
    async def _warm_up_model(self, model: str):
        """Send a simple request to warm up the model"""
        # Implementation depends on your LLM service
        pass
    
    def optimize_request_batching(self, requests: list, batch_size: int = 5):
        """Batch requests for better throughput"""
        batches = []
        for i in range(0, len(requests), batch_size):
            batches.append(requests[i:i + batch_size])
        return batches

# Configuration recommendations:
PERFORMANCE_SETTINGS = {
    "worker_processes": 2,  # Number of Uvicorn workers
    "worker_connections": 1000,  # Max connections per worker
    "keepalive_timeout": 5,  # Keep connection alive
    "max_request_size": 10 * 1024 * 1024,  # 10MB max request
    "timeout": 300,  # 5 minute timeout for long requests
}
```

### Production Deployment Considerations

#### 1. Environment-Specific Configuration

```yaml
# docker-compose.prod.yml - Production configuration
version: '3.8'

services:
  ollama:
    image: ollama/ollama:latest
    deploy:
      replicas: 2
      resources:
        limits:
          memory: 16G
        reservations:
          memory: 8G
    environment:
      - OLLAMA_HOST=0.0.0.0
      - OLLAMA_KEEP_ALIVE=24h
      - OLLAMA_MAX_LOADED_MODELS=3
    networks:
      - ai-network

  api-server:
    image: your-registry/local-ai-api:latest
    deploy:
      replicas: 3
      resources:
        limits:
          memory: 2G
        reservations:
          memory: 1G
    environment:
      - LOG_LEVEL=WARNING
      - API_KEY_REQUIRED=true
      - MAX_CONCURRENT_REQUESTS=50
    networks:
      - ai-network
    secrets:
      - api_secret_key

networks:
  ai-network:
    driver: overlay

secrets:
  api_secret_key:
    external: true
```

#### 2. Nginx Configuration

Create `nginx.conf`:

```nginx
# nginx.conf - Production nginx configuration
events {
    worker_connections 1024;
}

http {
    upstream api_backend {
        least_conn;
        server api-server-1:8000;
        server api-server-2:8000;
        server api-server-3:8000;
    }
    
    upstream ollama_backend {
        server ollama-1:11434;
        server ollama-2:11434;
    }
    
    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=ollama_limit:10m rate=5r/s;
    
    server {
        listen 80;
        server_name your-domain.com;
        
        # API endpoints
        location /api/ {
            limit_req zone=api_limit burst=20 nodelay;
            
            proxy_pass http://api_backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            
            # Timeouts for long LLM responses
            proxy_connect_timeout 60s;
            proxy_send_timeout 300s;
            proxy_read_timeout 300s;
        }
        
        # Direct Ollama access (if needed)
        location /ollama/ {
            limit_req zone=ollama_limit burst=10 nodelay;
            
            proxy_pass http://ollama_backend/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }
        
        # Health checks
        location /health {
            proxy_pass http://api_backend/health;
            access_log off;
        }
    }
}
```

#### 3. Monitoring and Alerting

```yaml
# monitoring/docker-compose.yml - Monitoring stack
version: '3.8'

services:
  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--web.console.libraries=/etc/prometheus/console_libraries'
      - '--web.console.templates=/etc/prometheus/consoles'
    
  grafana:
    image: grafana/grafana:latest
    ports:
      - "3001:3000"
    volumes:
      - grafana_data:/var/lib/grafana
      - ./grafana/dashboards:/etc/grafana/provisioning/dashboards
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin

volumes:
  prometheus_data:
  grafana_data:
```

### Summary and Next Steps

This comprehensive integration guide provides:

1. **Complete Model Setup**: Instructions for DeepSeek R1 and Qwen 3 models with hardware recommendations
2. **Production-Ready FastAPI Server**: Full implementation with advanced features
3. **Advanced LLM Service**: Reusable service class with conversation management
4. **Multiple API Endpoints**: OpenAI-compatible, simplified chat, streaming, and utility endpoints
5. **Docker Integration**: Complete containerization with docker-compose
6. **Practical Examples**: Ready-to-run code for testing and integration
7. **Testing Framework**: Unit tests, integration tests, and load testing
8. **Security Features**: Authentication, rate limiting, and input validation
9. **Performance Optimization**: Caching, monitoring, and scaling strategies
10. **Production Deployment**: Configuration for production environments

#### Quick Start Commands

```bash
# 1. Start the full stack
docker-compose up -d

# 2. Pull models
docker-compose exec ollama ollama pull deepseek-r1:7b
docker-compose exec ollama ollama pull qwen2.5:7b

# 3. Test the API
python examples.py

# 4. View API documentation
# Visit http://localhost:8000/docs

# 5. Access Web UI
# Visit http://localhost:3000
```

Your local LLM backend is now ready for production use with comprehensive error handling, monitoring, and scaling capabilities!

#### 6. Running the Server

```bash
# Start the FastAPI server
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Or run directly
python main.py
```

#### 7. Docker Integration

Create `Dockerfile` for the FastAPI service:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

Update your `docker-compose.yml` to include the FastAPI service:

```yaml
services:
  # ... existing services ...
  
  # FastAPI Backend
  api-server:
    build: .
    container_name: api-server
    ports:
      - "8000:8000"
    environment:
      - OLLAMA_BASE_URL=http://ollama:11434
      - OLLAMA_MODEL=deepseek-r1:7b
    depends_on:
      - ollama
    restart: unless-stopped
```

### Testing the Integration

#### 1. Test Ollama Connection
```bash
# Test Ollama directly
curl http://localhost:11434/api/generate -d '{
  "model": "deepseek-r1:7b",
  "prompt": "Hello, how are you?",
  "stream": false
}'
```

#### 2. Test FastAPI Endpoints
```bash
# Test simple chat
curl -X POST "http://localhost:8000/simple-chat?message=Hello&model=deepseek-r1:7b"

# Test chat completions
curl -X POST "http://localhost:8000/chat/completions" \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "What is machine learning?"}
    ],
    "model": "deepseek-r1:7b",
    "temperature": 0.7
  }'
```

### Best Practices

1. **Error Handling**: Always implement proper error handling for network issues and model failures
2. **Rate Limiting**: Implement rate limiting to prevent abuse
3. **Logging**: Add comprehensive logging for debugging and monitoring
4. **Caching**: Cache responses for repeated queries to improve performance
5. **Model Management**: Implement model switching and loading strategies
6. **Security**: Add authentication and authorization for production use

### Performance Considerations

- **Model Size**: Choose appropriate model sizes based on your hardware
- **Concurrent Requests**: Ollama can handle multiple concurrent requests
- **Memory Management**: Monitor memory usage, especially with larger models
- **Response Streaming**: Use streaming for long responses to improve user experience

## Next Steps

After completing this setup, you can:

1. **Integrate with your application** using the APIs
2. **Customize Open Web UI** with your branding
3. **Add more LLM models** based on your needs
4. **Set up monitoring** and logging
5. **Configure automated backups**
6. **Scale horizontally** with multiple Ollama instances

## Additional Resources

- [Ollama Documentation](https://github.com/ollama/ollama)
- [Supabase Documentation](https://supabase.com/docs)
- [Open Web UI Documentation](https://github.com/open-webui/open-webui)
- [Docker Documentation](https://docs.docker.com/)

This setup provides a complete local AI infrastructure that you can use for development, testing, or production workloads while maintaining full control over your data and models.