#!/bin/bash

# Local AI Stack Deployment Script for Digital Ocean
# This script sets up the complete infrastructure for your Local AI Stack

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
DEPLOYMENT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$DEPLOYMENT_DIR")"

echo -e "${GREEN}🚀 Local AI Stack - Cloud Deployment Script${NC}"
echo "================================================"

# Check dependencies
check_dependencies() {
    echo -e "${YELLOW}Checking dependencies...${NC}"
    
    local deps=("terraform" "doctl" "git" "docker")
    local missing_deps=()
    
    for dep in "${deps[@]}"; do
        if ! command -v "$dep" &> /dev/null; then
            missing_deps+=("$dep")
        fi
    done
    
    if [ ${#missing_deps[@]} -ne 0 ]; then
        echo -e "${RED}Missing dependencies: ${missing_deps[*]}${NC}"
        echo "Please install the missing dependencies and try again."
        echo ""
        echo "Installation commands:"
        echo "- Terraform: https://terraform.io/downloads"
        echo "- doctl: https://github.com/digitalocean/doctl#installing-doctl"
        echo "- Docker: https://docs.docker.com/get-docker/"
        exit 1
    fi
    
    echo -e "${GREEN}✓ All dependencies found${NC}"
}

# Setup environment
setup_environment() {
    echo -e "${YELLOW}Setting up environment...${NC}"
    
    # Create terraform variables file if it doesn't exist
    if [ ! -f "$DEPLOYMENT_DIR/terraform/terraform.tfvars" ]; then
        echo "Creating terraform.tfvars file..."
        
        read -p "Enter your DigitalOcean API token: " DO_TOKEN
        read -p "Enter your domain name (e.g., example.com): " DOMAIN_NAME
        read -p "Enter your SSH key fingerprint (from 'doctl compute ssh-key list'): " SSH_KEY
        
        cat > "$DEPLOYMENT_DIR/terraform/terraform.tfvars" << EOF
do_token = "$DO_TOKEN"
domain_name = "$DOMAIN_NAME"
ssh_keys = ["$SSH_KEY"]
EOF
        
        echo -e "${GREEN}✓ terraform.tfvars created${NC}"
    fi
    
    # Create .env file for AI search agent if it doesn't exist
    if [ ! -f "$PROJECT_ROOT/services/ai-search-agent/.env" ]; then
        echo "Creating AI search agent .env file..."
        
        read -p "Enter Supabase URL (optional, press enter to skip): " SUPABASE_URL
        read -p "Enter Supabase Key (optional, press enter to skip): " SUPABASE_KEY
        read -p "Enter Langfuse Public Key (optional, press enter to skip): " LANGFUSE_PUBLIC_KEY
        read -p "Enter Langfuse Secret Key (optional, press enter to skip): " LANGFUSE_SECRET_KEY
        
        cat > "$PROJECT_ROOT/services/ai-search-agent/.env" << EOF
# AI Search Agent Configuration
OLLAMA_BASE_URL=http://localhost:11434
SEARXNG_URL=http://localhost:8080
REDIS_URL=redis://localhost:6379
DEFAULT_MODEL=deepseek-r1:7b-q4

# Supabase Configuration (optional)
SUPABASE_URL=$SUPABASE_URL
SUPABASE_KEY=$SUPABASE_KEY

# Langfuse Observability (optional)
LANGFUSE_PUBLIC_KEY=$LANGFUSE_PUBLIC_KEY
LANGFUSE_SECRET_KEY=$LANGFUSE_SECRET_KEY
LANGFUSE_HOST=https://cloud.langfuse.com

# API Configuration
API_HOST=0.0.0.0
API_PORT=8080
LOG_LEVEL=INFO

# CORS Origins
CORS_ORIGINS=["http://localhost:3000", "https://your-domain.com"]
EOF
        
        echo -e "${GREEN}✓ .env file created${NC}"
    fi
}

# Deploy infrastructure
deploy_infrastructure() {
    echo -e "${YELLOW}Deploying infrastructure with Terraform...${NC}"
    
    cd "$DEPLOYMENT_DIR/terraform"
    
    # Initialize Terraform
    echo "Initializing Terraform..."
    terraform init
    
    # Plan deployment
    echo "Planning deployment..."
    terraform plan
    
    # Ask for confirmation
    echo ""
    read -p "Do you want to proceed with the deployment? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Deployment cancelled."
        exit 1
    fi
    
    # Apply deployment
    echo "Applying deployment..."
    terraform apply -auto-approve
    
    # Save outputs
    AI_SERVER_IP=$(terraform output -raw ai_server_ip)
    WEB_SERVER_IP=$(terraform output -raw web_server_ip)
    LB_IP=$(terraform output -raw load_balancer_ip)
    
    echo -e "${GREEN}✓ Infrastructure deployed successfully${NC}"
    echo "AI Server IP: $AI_SERVER_IP"
    echo "Web Server IP: $WEB_SERVER_IP"
    echo "Load Balancer IP: $LB_IP"
    
    # Save IPs to file for later use
    cat > "$DEPLOYMENT_DIR/deployment_info.txt" << EOF
AI_SERVER_IP=$AI_SERVER_IP
WEB_SERVER_IP=$WEB_SERVER_IP
LB_IP=$LB_IP
DEPLOYED_AT=$(date)
EOF
}

# Setup DNS
setup_dns() {
    echo -e "${YELLOW}Setting up DNS...${NC}"
    
    if [ -f "$DEPLOYMENT_DIR/deployment_info.txt" ]; then
        source "$DEPLOYMENT_DIR/deployment_info.txt"
        
        echo "Please configure your DNS with the following records:"
        echo ""
        echo "A Record: your-domain.com -> $LB_IP"
        echo "A Record: www.your-domain.com -> $LB_IP"
        echo ""
        echo "After DNS propagation, your site will be available at:"
        echo "https://your-domain.com"
        
        read -p "Press enter when DNS is configured and propagated..."
    else
        echo -e "${RED}Deployment info not found. Please deploy infrastructure first.${NC}"
        exit 1
    fi
}

# Deploy application
deploy_application() {
    echo -e "${YELLOW}Deploying application...${NC}"
    
    if [ -f "$DEPLOYMENT_DIR/deployment_info.txt" ]; then
        source "$DEPLOYMENT_DIR/deployment_info.txt"
        
        echo "Copying application files to servers..."
        
        # Copy AI search agent to AI server
        echo "Setting up AI server..."
        scp -r "$PROJECT_ROOT/services/ai-search-agent" deploy@$AI_SERVER_IP:~/
        ssh deploy@$AI_SERVER_IP "cd ~/ai-search-agent && docker-compose up -d"
        
        # Copy web application to web server
        echo "Setting up web server..."
        scp -r "$PROJECT_ROOT/apps/web" deploy@$WEB_SERVER_IP:~/
        ssh deploy@$WEB_SERVER_IP "cd ~/web && npm install && npm run build && pm2 start npm --name 'local-ai-web' -- start"
        
        echo -e "${GREEN}✓ Application deployed successfully${NC}"
    else
        echo -e "${RED}Deployment info not found. Please deploy infrastructure first.${NC}"
        exit 1
    fi
}

# Main deployment flow
main() {
    echo "Select deployment option:"
    echo "1. Full deployment (infrastructure + application)"
    echo "2. Infrastructure only"
    echo "3. Application only"
    echo "4. Setup DNS"
    echo "5. Check status"
    echo ""
    read -p "Enter your choice (1-5): " CHOICE
    
    case $CHOICE in
        1)
            check_dependencies
            setup_environment
            deploy_infrastructure
            setup_dns
            deploy_application
            echo -e "${GREEN}🎉 Full deployment completed!${NC}"
            ;;
        2)
            check_dependencies
            setup_environment
            deploy_infrastructure
            echo -e "${GREEN}✓ Infrastructure deployment completed${NC}"
            ;;
        3)
            deploy_application
            echo -e "${GREEN}✓ Application deployment completed${NC}"
            ;;
        4)
            setup_dns
            ;;
        5)
            if [ -f "$DEPLOYMENT_DIR/deployment_info.txt" ]; then
                source "$DEPLOYMENT_DIR/deployment_info.txt"
                echo "Deployment Status:"
                echo "=================="
                echo "AI Server IP: $AI_SERVER_IP"
                echo "Web Server IP: $WEB_SERVER_IP"
                echo "Load Balancer IP: $LB_IP"
                echo "Deployed at: $DEPLOYED_AT"
                echo ""
                echo "Checking service health..."
                curl -f "http://$AI_SERVER_IP:8080/health" || echo "AI service not responding"
                curl -f "http://$WEB_SERVER_IP:3000" || echo "Web service not responding"
            else
                echo "No deployment found."
            fi
            ;;
        *)
            echo "Invalid choice. Exiting."
            exit 1
            ;;
    esac
}

# Run main function
main
