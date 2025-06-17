# Cloud Deployment, Observability & Performance Guide

This directory contains comprehensive guides and tools for deploying your Local AI Stack to production, implementing observability with Langfuse, and optimizing performance.

## 📁 Directory Structure

```
deployment/
├── CLOUD_DEPLOYMENT.md          # Complete cloud deployment guide for Digital Ocean
├── LANGFUSE_OBSERVABILITY.md    # Langfuse setup for monitoring and observability
├── PERFORMANCE_OPTIMIZATION.md  # Performance optimization best practices
├── deploy.sh                    # Linux/macOS deployment script
├── deploy.ps1                   # Windows PowerShell deployment script
├── terraform/                   # Infrastructure as Code
│   ├── main.tf                  # Terraform configuration
│   ├── cloud-init.yml           # AI server setup
│   └── web-cloud-init.yml       # Web server setup
└── monitoring/                  # Monitoring stack configuration
    ├── docker-compose.yml       # Prometheus, Grafana, Langfuse
    └── prometheus.yml           # Prometheus configuration
```

## 🚀 Quick Start

### 1. Cloud Deployment (Digital Ocean)

**Prerequisites:**
- DigitalOcean account with API token
- Domain name configured for your deployment
- SSH key added to DigitalOcean
- Terraform and doctl CLI tools installed

**Linux/macOS:**
```bash
chmod +x deploy.sh
./deploy.sh
```

**Windows PowerShell:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\deploy.ps1 -Action full
```

**Manual Infrastructure Setup:**
```bash
cd terraform/
terraform init
terraform plan
terraform apply
```

### 2. Observability with Langfuse

**Setup Langfuse Cloud:**
1. Sign up at [langfuse.com](https://cloud.langfuse.com)
2. Create a project and get your API keys
3. Add keys to your `.env` file:

```bash
LANGFUSE_PUBLIC_KEY=pk_lf_your_public_key
LANGFUSE_SECRET_KEY=sk_lf_your_secret_key
LANGFUSE_HOST=https://cloud.langfuse.com
```

**Self-hosted Langfuse:**
```bash
cd monitoring/
docker-compose up -d langfuse-server langfuse-db
```

### 3. Performance Optimization

**Get System Recommendations:**
```bash
curl http://localhost:8080/performance/recommendations?target=balanced
```

**Check Current System Specs:**
```bash
curl http://localhost:8080/performance/system
```

**View Available Models:**
```bash
curl http://localhost:8080/performance/models
```

## 📊 Monitoring Dashboard

The monitoring stack includes:
- **Prometheus**: Metrics collection
- **Grafana**: Visualization dashboards
- **Langfuse**: LLM observability
- **Node Exporter**: System metrics
- **cAdvisor**: Container metrics

**Start Monitoring Stack:**
```bash
cd monitoring/
docker-compose up -d
```

**Access Dashboards:**
- Grafana: http://localhost:3001 (admin/admin123)
- Prometheus: http://localhost:9090
- Langfuse: http://localhost:3002

## 🛠 Configuration Files

### Environment Variables

Copy and configure `.env` files:
```bash
cp services/ai-search-agent/.env.example services/ai-search-agent/.env
```

### Terraform Variables

Create `terraform/terraform.tfvars`:
```hcl
do_token = "your_digitalocean_token"
domain_name = "example.com"
ssh_keys = ["your_ssh_key_fingerprint"]
```

## 🔧 Performance Tuning

### LLM Optimization

**Recommended Models by Use Case:**
- **Speed**: `deepseek-r1:1.5b-q4` (1.2GB)
- **Balanced**: `deepseek-r1:7b-q4` (4.1GB)
- **Quality**: `qwen2.5:14b-q4` (7.8GB)

**Ollama Configuration:**
```bash
# For GPU with 8GB+ VRAM
export OLLAMA_NUM_PARALLEL=4
export OLLAMA_MAX_LOADED_MODELS=2

# For systems with limited VRAM
export OLLAMA_LOW_VRAM=1
export OLLAMA_NUM_GPU=1
```

### System Optimization

**Memory Management:**
```bash
# Increase swap space
sudo fallocate -l 8G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

**GPU Optimization:**
```bash
# NVIDIA GPU settings
nvidia-smi -pl 300  # Power limit
nvidia-smi -lgc 1800  # GPU clock
```

## 📈 Scaling Guidelines

### Horizontal Scaling

**Multiple GPU Servers:**
- Use load balancer for LLM requests
- Implement model sharding for large models
- Cache frequently used models

**Database Scaling:**
```yaml
# docker-compose.yml
supabase-db:
  deploy:
    replicas: 3
  volumes:
    - db_data:/var/lib/postgresql/data
```

### Vertical Scaling

**Resource Allocation:**
- **CPU**: 8+ cores for concurrent requests
- **RAM**: 32GB+ for multiple loaded models
- **GPU**: 16GB+ VRAM for larger models
- **Storage**: NVMe SSD for fast model loading

## 🔒 Security Best Practices

### SSL/TLS Configuration

**Caddy Setup:**
```caddyfile
your-domain.com {
    reverse_proxy /api/* ai-server:8080
    tls {
        protocols tls1.2 tls1.3
    }
    header {
        Strict-Transport-Security "max-age=31536000"
        X-Content-Type-Options "nosniff"
        X-Frame-Options "DENY"
    }
}
```

### Firewall Configuration

**UFW Rules:**
```bash
ufw allow 22      # SSH
ufw allow 80      # HTTP
ufw allow 443     # HTTPS
ufw deny 11434    # Block direct Ollama access
ufw enable
```

## 🚨 Troubleshooting

### Common Issues

**Out of Memory Errors:**
```bash
# Check memory usage
free -h
docker stats

# Solution: Use smaller model or increase swap
```

**GPU Not Detected:**
```bash
# Check GPU availability
nvidia-smi
docker run --gpus all nvidia/cuda:11.8-runtime-ubuntu20.04 nvidia-smi
```

**Slow Response Times:**
```bash
# Check model loading
curl http://localhost:11434/api/ps

# Check system resources
htop
iotop
```

### Logs Analysis

**Container Logs:**
```bash
docker logs ai-search-agent --tail 100 -f
docker logs ollama --tail 100 -f
```

**System Logs:**
```bash
journalctl -u docker -f
tail -f /var/log/nginx/error.log
```

## 📚 Additional Resources

- [Digital Ocean GPU Droplets](https://docs.digitalocean.com/products/droplets/gpu/)
- [Ollama Documentation](https://ollama.ai/docs)
- [Langfuse Documentation](https://langfuse.com/docs)
- [Terraform DigitalOcean Provider](https://registry.terraform.io/providers/digitalocean/digitalocean/latest/docs)

## 🤝 Contributing

To contribute improvements to the deployment process:

1. Test changes in a development environment
2. Update relevant documentation
3. Submit pull request with clear description
4. Include performance benchmarks if applicable

## 📞 Support

For deployment issues:
1. Check the troubleshooting section
2. Review logs for error messages
3. Verify configuration files
4. Check resource usage and limits

---

**Next Steps:**
1. Follow the [Cloud Deployment Guide](CLOUD_DEPLOYMENT.md) for complete infrastructure setup
2. Implement [Langfuse Observability](LANGFUSE_OBSERVABILITY.md) for monitoring
3. Apply [Performance Optimization](PERFORMANCE_OPTIMIZATION.md) techniques for production readiness
