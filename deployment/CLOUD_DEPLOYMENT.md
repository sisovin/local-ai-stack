# Cloud Deployment Guide - Digital Ocean

This guide covers deploying your Local AI Stack to Digital Ocean with proper DNS, SSL, and GPU resource management.

## Table of Contents

1. [Infrastructure Setup](#infrastructure-setup)
2. [DNS Configuration](#dns-configuration)
3. [SSL/TLS with Caddy](#ssl-tls-with-caddy)
4. [GPU Management](#gpu-management)
5. [Container Orchestration](#container-orchestration)
6. [Monitoring & Logging](#monitoring--logging)
7. [Security & Hardening](#security--hardening)
8. [CI/CD Pipeline](#cicd-pipeline)

## Infrastructure Setup

### 1. Digital Ocean Droplet Creation

```bash
# Install doctl (Digital Ocean CLI)
# macOS
brew install doctl

# Linux
wget https://github.com/digitalocean/doctl/releases/download/v1.94.0/doctl-1.94.0-linux-amd64.tar.gz
tar xf doctl-1.94.0-linux-amd64.tar.gz
sudo mv doctl /usr/local/bin

# Authenticate
doctl auth init
```

**Recommended Specifications:**

- **Basic Setup**: 8GB RAM, 4 vCPUs, 160GB SSD ($48/month)
- **Production**: GPU Droplet with NVIDIA RTX 4000 ($816/month)
- **High Performance**: GPU Droplet with A100 ($2,880/month)

### 2. Create Infrastructure with Terraform

Create `deployment/terraform/main.tf`:

```hcl
terraform {
  required_providers {
    digitalocean = {
      source  = "digitalocean/digitalocean"
      version = "~> 2.0"
    }
  }
}

# Configure the DigitalOcean Provider
provider "digitalocean" {
  token = var.do_token
}

# Variables
variable "do_token" {
  description = "DigitalOcean API Token"
  type        = string
  sensitive   = true
}

variable "domain_name" {
  description = "Domain name for the deployment"
  type        = string
  default     = "your-domain.com"
}

variable "ssh_keys" {
  description = "SSH key fingerprints"
  type        = list(string)
}

# VPC
resource "digitalocean_vpc" "local_ai_vpc" {
  name     = "local-ai-vpc"
  region   = "nyc3"
  ip_range = "10.10.0.0/16"
}

# Main GPU Droplet for AI Services
resource "digitalocean_droplet" "ai_server" {
  image    = "ubuntu-22-04-x64"
  name     = "local-ai-server"
  region   = "nyc3"
  size     = "gd-8vcpu-32gb-nvidia-l4"  # GPU instance
  vpc_uuid = digitalocean_vpc.local_ai_vpc.id
  ssh_keys = var.ssh_keys
  
  user_data = templatefile("${path.module}/cloud-init.yml", {
    domain_name = var.domain_name
  })

  tags = ["ai-server", "production"]
}

# Web Server Droplet
resource "digitalocean_droplet" "web_server" {
  image    = "ubuntu-22-04-x64"
  name     = "local-ai-web"
  region   = "nyc3"
  size     = "s-4vcpu-8gb"
  vpc_uuid = digitalocean_vpc.local_ai_vpc.id
  ssh_keys = var.ssh_keys
  
  user_data = templatefile("${path.module}/web-cloud-init.yml", {
    domain_name = var.domain_name
    ai_server_ip = digitalocean_droplet.ai_server.ipv4_address_private
  })

  tags = ["web-server", "production"]
}

# Load Balancer
resource "digitalocean_loadbalancer" "web_lb" {
  name   = "local-ai-lb"
  region = "nyc3"
  vpc_uuid = digitalocean_vpc.local_ai_vpc.id

  forwarding_rule {
    entry_protocol  = "http"
    entry_port      = 80
    target_protocol = "http"
    target_port     = 80
  }

  forwarding_rule {
    entry_protocol  = "https"
    entry_port      = 443
    target_protocol = "https"
    target_port     = 443
    tls_passthrough = true
  }

  healthcheck {
    protocol = "http"
    port     = 80
    path     = "/health"
  }

  droplet_ids = [digitalocean_droplet.web_server.id]
}

# Firewall Rules
resource "digitalocean_firewall" "web_fw" {
  name = "local-ai-web-fw"

  droplet_ids = [digitalocean_droplet.web_server.id]

  inbound_rule {
    protocol         = "tcp"
    port_range       = "22"
    source_addresses = ["0.0.0.0/0", "::/0"]
  }

  inbound_rule {
    protocol         = "tcp"
    port_range       = "80"
    source_addresses = ["0.0.0.0/0", "::/0"]
  }

  inbound_rule {
    protocol         = "tcp"
    port_range       = "443"
    source_addresses = ["0.0.0.0/0", "::/0"]
  }

  outbound_rule {
    protocol              = "tcp"
    port_range            = "1-65535"
    destination_addresses = ["0.0.0.0/0", "::/0"]
  }

  outbound_rule {
    protocol              = "udp"
    port_range            = "1-65535"
    destination_addresses = ["0.0.0.0/0", "::/0"]
  }
}

resource "digitalocean_firewall" "ai_fw" {
  name = "local-ai-server-fw"

  droplet_ids = [digitalocean_droplet.ai_server.id]

  inbound_rule {
    protocol         = "tcp"
    port_range       = "22"
    source_addresses = ["0.0.0.0/0", "::/0"]
  }

  inbound_rule {
    protocol         = "tcp"
    port_range       = "11434"
    source_addresses = [digitalocean_vpc.local_ai_vpc.ip_range]
  }

  inbound_rule {
    protocol         = "tcp"
    port_range       = "8001"
    source_addresses = [digitalocean_vpc.local_ai_vpc.ip_range]
  }

  outbound_rule {
    protocol              = "tcp"
    port_range            = "1-65535"
    destination_addresses = ["0.0.0.0/0", "::/0"]
  }
}

# Domain and DNS
resource "digitalocean_domain" "main" {
  name       = var.domain_name
  ip_address = digitalocean_loadbalancer.web_lb.ip
}

resource "digitalocean_record" "www" {
  domain = digitalocean_domain.main.name
  type   = "CNAME"
  name   = "www"
  value  = "@"
}

resource "digitalocean_record" "api" {
  domain = digitalocean_domain.main.name
  type   = "A"
  name   = "api"
  value  = digitalocean_loadbalancer.web_lb.ip
}

# Outputs
output "web_server_ip" {
  value = digitalocean_droplet.web_server.ipv4_address
}

output "ai_server_ip" {
  value = digitalocean_droplet.ai_server.ipv4_address
}

output "load_balancer_ip" {
  value = digitalocean_loadbalancer.web_lb.ip
}

output "domain_name" {
  value = digitalocean_domain.main.name
}
```

### 3. Cloud-Init Configuration

Create `deployment/terraform/cloud-init.yml`:

```yaml
#cloud-config
package_update: true
package_upgrade: true

packages:
  - docker.io
  - docker-compose
  - nginx
  - certbot
  - python3-certbot-nginx
  - htop
  - curl
  - wget
  - git
  - fail2ban
  - ufw

groups:
  - docker

system_info:
  default_user:
    groups: [docker]

runcmd:
  # Install NVIDIA drivers and Docker runtime
  - curl -fsSL https://nvidia.github.io/libnvidia-container/gpgkey | sudo gpg --dearmor -o /usr/share/keyrings/nvidia-container-toolkit-keyring.gpg
  - curl -s -L https://nvidia.github.io/libnvidia-container/stable/deb/nvidia-container-toolkit.list | sed 's#deb https://#deb [signed-by=/usr/share/keyrings/nvidia-container-toolkit-keyring.gpg] https://#g' | sudo tee /etc/apt/sources.list.d/nvidia-container-toolkit.list
  - apt-get update
  - apt-get install -y nvidia-container-toolkit
  - nvidia-ctk runtime configure --runtime=docker
  - systemctl restart docker
  
  # Clone repository
  - git clone https://github.com/your-org/local-ai-stack.git /opt/local-ai-stack
  - chown -R ubuntu:ubuntu /opt/local-ai-stack
  
  # Create environment files
  - cp /opt/local-ai-stack/.env.production /opt/local-ai-stack/.env
  
  # Start services
  - cd /opt/local-ai-stack && docker-compose -f docker-compose.prod.yml up -d
  
  # Configure firewall
  - ufw default deny incoming
  - ufw default allow outgoing
  - ufw allow ssh
  - ufw allow 80
  - ufw allow 443
  - ufw --force enable

write_files:
  - path: /etc/systemd/system/local-ai.service
    content: |
      [Unit]
      Description=Local AI Stack
      After=docker.service
      Requires=docker.service

      [Service]
      Type=oneshot
      RemainAfterExit=yes
      WorkingDirectory=/opt/local-ai-stack
      ExecStart=/usr/bin/docker-compose -f docker-compose.prod.yml up -d
      ExecStop=/usr/bin/docker-compose -f docker-compose.prod.yml down
      TimeoutStartSec=0

      [Install]
      WantedBy=multi-user.target
    permissions: '0644'

final_message: "Local AI Stack cloud initialization complete!"
```

## DNS Configuration

### 1. Domain Setup

```bash
# Add your domain to Digital Ocean
doctl compute domain create your-domain.com --ip-address YOUR_LOAD_BALANCER_IP

# Add DNS records
doctl compute domain records create your-domain.com \
  --record-type A --record-name api --record-data YOUR_LOAD_BALANCER_IP

doctl compute domain records create your-domain.com \
  --record-type CNAME --record-name www --record-data @
```

### 2. DNS Records Structure

| Record Type | Name | Value | Purpose |
|-------------|------|-------|---------|
| A | @ | Load Balancer IP | Main domain |
| CNAME | www | @ | WWW redirect |
| A | api | Load Balancer IP | API endpoints |
| TXT | @ | Verification codes | Domain verification |

## SSL/TLS with Caddy

### 1. Caddy Configuration

Create `deployment/caddy/Caddyfile`:

```caddyfile
# Main website
your-domain.com, www.your-domain.com {
    reverse_proxy web:3000 {
        header_up Host {host}
        header_up X-Real-IP {remote}
        header_up X-Forwarded-For {remote}
        header_up X-Forwarded-Proto {scheme}
    }

    # Security headers
    header {
        # Enable HSTS
        Strict-Transport-Security max-age=31536000;
        # Prevent MIME sniffing
        X-Content-Type-Options nosniff
        # Prevent clickjacking
        X-Frame-Options DENY
        # XSS protection
        X-XSS-Protection "1; mode=block"
        # Content Security Policy
        Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' wss: ws:;"
    }

    # Gzip compression
    encode gzip

    # Logging
    log {
        output file /var/log/caddy/access.log
        format json
    }
}

# API endpoints
api.your-domain.com {
    reverse_proxy ai-search-agent:8001 {
        header_up Host {host}
        header_up X-Real-IP {remote}
        header_up X-Forwarded-For {remote}
        header_up X-Forwarded-Proto {scheme}
    }

    # API-specific headers
    header {
        Access-Control-Allow-Origin *
        Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
        Access-Control-Allow-Headers "Authorization, Content-Type"
    }

    # Handle preflight requests
    @options method OPTIONS
    respond @options 200

    # Rate limiting
    rate_limit {
        zone api {
            key {remote}
            events 100
            window 1m
        }
    }
}

# Health check endpoint
health.your-domain.com {
    respond /health 200
    respond /* "Not Found" 404
}

# Admin interface (protected)
admin.your-domain.com {
    basicauth {
        admin $2a$14$hashed_password_here
    }

    reverse_proxy monitoring:3001
}
```

### 2. Production Docker Compose

Create `deployment/docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  # Caddy Reverse Proxy with Auto-SSL
  caddy:
    image: caddy:latest
    container_name: local-ai-caddy
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./caddy/Caddyfile:/etc/caddy/Caddyfile
      - caddy_data:/data
      - caddy_config:/config
      - ./logs/caddy:/var/log/caddy
    environment:
      - ACME_AGREE=true
    networks:
      - web_network
      - ai_network

  # Next.js Frontend
  web:
    build: 
      context: ./apps/web
      dockerfile: Dockerfile.prod
    container_name: local-ai-web
    restart: unless-stopped
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_API_URL=https://api.your-domain.com
      - NEXT_PUBLIC_SUPABASE_URL=${SUPABASE_URL}
      - NEXT_PUBLIC_SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}
    networks:
      - web_network
    depends_on:
      - ai-search-agent

  # Ollama Service with GPU
  ollama:
    image: ollama/ollama:latest
    container_name: local-ai-ollama
    restart: unless-stopped
    volumes:
      - ollama_data:/root/.ollama
    environment:
      - OLLAMA_HOST=0.0.0.0
      - NVIDIA_VISIBLE_DEVICES=all
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: 1
              capabilities: [gpu]
    networks:
      - ai_network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:11434/api/tags"]
      interval: 30s
      timeout: 10s
      retries: 3

  # AI Search Agent
  ai-search-agent:
    build: 
      context: ./services/ai-search-agent
      dockerfile: Dockerfile
    container_name: local-ai-search-agent
    restart: unless-stopped
    environment:
      - OLLAMA_BASE_URL=http://ollama:11434
      - SEARXNG_BASE_URL=http://searxng:8080
      - REDIS_URL=redis://redis:6379
      - LOG_LEVEL=INFO
      - ENVIRONMENT=production
    networks:
      - ai_network
      - web_network
    depends_on:
      - ollama
      - redis
      - searxng

  # SearXNG
  searxng:
    image: searxng/searxng:latest
    container_name: local-ai-searxng
    restart: unless-stopped
    volumes:
      - ./services/ai-search-agent/searxng_settings.yml:/etc/searxng/settings.yml:ro
    networks:
      - ai_network
    depends_on:
      - redis

  # Redis
  redis:
    image: redis:alpine
    container_name: local-ai-redis
    restart: unless-stopped
    command: redis-server --appendonly yes --maxmemory 512mb --maxmemory-policy allkeys-lru
    volumes:
      - redis_data:/data
    networks:
      - ai_network

  # PostgreSQL Database
  postgres:
    image: postgres:15-alpine
    container_name: local-ai-postgres
    restart: unless-stopped
    environment:
      - POSTGRES_DB=${POSTGRES_DB}
      - POSTGRES_USER=${POSTGRES_USER}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backups:/backups
    networks:
      - ai_network

  # Monitoring Stack
  prometheus:
    image: prom/prometheus:latest
    container_name: local-ai-prometheus
    restart: unless-stopped
    volumes:
      - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--web.console.libraries=/etc/prometheus/console_libraries'
      - '--web.console.templates=/etc/prometheus/consoles'
    networks:
      - ai_network

  grafana:
    image: grafana/grafana:latest
    container_name: local-ai-grafana
    restart: unless-stopped
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=${GRAFANA_PASSWORD}
    volumes:
      - grafana_data:/var/lib/grafana
      - ./monitoring/grafana/dashboards:/etc/grafana/provisioning/dashboards
      - ./monitoring/grafana/datasources:/etc/grafana/provisioning/datasources
    networks:
      - ai_network

volumes:
  caddy_data:
  caddy_config:
  ollama_data:
  redis_data:
  postgres_data:
  prometheus_data:
  grafana_data:

networks:
  web_network:
    driver: bridge
  ai_network:
    driver: bridge
```

## GPU Management

### 1. GPU Resource Allocation

```yaml
# GPU-optimized service configuration
services:
  ollama:
    deploy:
      resources:
        limits:
          memory: 24G
        reservations:
          devices:
            - driver: nvidia
              count: 1
              capabilities: [gpu]
              device_ids: ['0']  # Specific GPU
    environment:
      - CUDA_VISIBLE_DEVICES=0
      - NVIDIA_VISIBLE_DEVICES=0
```

### 2. GPU Monitoring Script

Create `deployment/scripts/gpu-monitor.sh`:

```bash
#!/bin/bash

# GPU monitoring and alerting script

LOG_FILE="/var/log/gpu-monitor.log"
ALERT_THRESHOLD=90  # GPU utilization percentage
WEBHOOK_URL="YOUR_SLACK_WEBHOOK_URL"

while true; do
    # Get GPU utilization
    GPU_UTIL=$(nvidia-smi --query-gpu=utilization.gpu --format=csv,noheader,nounits)
    GPU_MEMORY=$(nvidia-smi --query-gpu=utilization.memory --format=csv,noheader,nounits)
    GPU_TEMP=$(nvidia-smi --query-gpu=temperature.gpu --format=csv,noheader,nounits)
    
    # Log metrics
    echo "$(date): GPU Util: ${GPU_UTIL}%, Memory: ${GPU_MEMORY}%, Temp: ${GPU_TEMP}°C" >> $LOG_FILE
    
    # Check for alerts
    if [ "$GPU_UTIL" -gt "$ALERT_THRESHOLD" ]; then
        curl -X POST -H 'Content-type: application/json' \
        --data "{\"text\":\"⚠️ GPU utilization high: ${GPU_UTIL}%\"}" \
        $WEBHOOK_URL
    fi
    
    sleep 60
done
```

## Deployment Script

Create `deployment/deploy.sh`:

```bash
#!/bin/bash

set -e

# Production deployment script for Local AI Stack

DOMAIN="${1:-your-domain.com}"
ENVIRONMENT="${2:-production}"

echo "🚀 Deploying Local AI Stack to $DOMAIN..."

# Validate environment
if [ ! -f ".env.${ENVIRONMENT}" ]; then
    echo "❌ Environment file .env.${ENVIRONMENT} not found"
    exit 1
fi

# Setup
echo "📝 Setting up environment..."
cp ".env.${ENVIRONMENT}" .env
chmod 600 .env

# Build images
echo "🏗️ Building Docker images..."
docker-compose -f docker-compose.prod.yml build --parallel

# Pull Ollama models
echo "🤖 Pulling AI models..."
docker-compose -f docker-compose.prod.yml run --rm ollama ollama pull deepseek-r1:7b
docker-compose -f docker-compose.prod.yml run --rm ollama ollama pull qwen2.5:7b

# Deploy
echo "🚢 Deploying services..."
docker-compose -f docker-compose.prod.yml up -d

# Health checks
echo "🔍 Running health checks..."
sleep 30

services=("web:3000" "ai-search-agent:8001" "ollama:11434")
for service in "${services[@]}"; do
    name=$(echo $service | cut -d: -f1)
    port=$(echo $service | cut -d: -f2)
    
    if curl -f "http://localhost:$port/health" > /dev/null 2>&1; then
        echo "✅ $name is healthy"
    else
        echo "❌ $name health check failed"
        exit 1
    fi
done

# SSL verification
echo "🔒 Verifying SSL..."
if curl -f "https://$DOMAIN" > /dev/null 2>&1; then
    echo "✅ SSL certificate is working"
else
    echo "⚠️ SSL verification failed - may take a few minutes to provision"
fi

echo "🎉 Deployment complete!"
echo "🌐 Website: https://$DOMAIN"
echo "📡 API: https://api.$DOMAIN"
echo "📊 Monitoring: https://admin.$DOMAIN"
```

## Security Hardening

### 1. Fail2Ban Configuration

Create `deployment/security/jail.local`:

```ini
[DEFAULT]
bantime = 1h
findtime = 10m
maxretry = 5

[sshd]
enabled = true
port = ssh
logpath = /var/log/auth.log

[nginx-http-auth]
enabled = true
port = http,https
logpath = /var/log/nginx/error.log

[docker-rate-limit]
enabled = true
port = 80,443
logpath = /var/log/caddy/access.log
maxretry = 100
findtime = 1m
```

### 2. Environment Variables

Create `.env.production`:

```bash
# Production Environment Configuration

# Database
POSTGRES_DB=local_ai_prod
POSTGRES_USER=local_ai_user
POSTGRES_PASSWORD=secure_random_password_here

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_key

# Security
JWT_SECRET=your_jwt_secret_here
API_KEY=your_api_key_here

# Monitoring
GRAFANA_PASSWORD=secure_grafana_password

# External Services
OPENAI_API_KEY=optional_fallback_key
ANTHROPIC_API_KEY=optional_fallback_key

# Performance
OLLAMA_MAX_MODELS=3
REDIS_MAXMEMORY=1gb
```

This comprehensive deployment guide provides:

1. **Infrastructure as Code** with Terraform
2. **Automated SSL** with Caddy
3. **GPU resource management** for AI workloads
4. **Security hardening** with firewalls and monitoring
5. **Health checks** and monitoring
6. **Production-ready** Docker Compose setup

The setup ensures your Local AI Stack is production-ready with proper security, monitoring, and scalability on Digital Ocean.
