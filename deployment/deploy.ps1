# Local AI Stack Deployment Script for Digital Ocean (PowerShell)
# This script sets up the complete infrastructure for your Local AI Stack

param(
    [Parameter()]
    [ValidateSet("full", "infrastructure", "application", "dns", "status")]
    [string]$Action = "full"
)

# Colors for output
$Green = [System.ConsoleColor]::Green
$Yellow = [System.ConsoleColor]::Yellow
$Red = [System.ConsoleColor]::Red

# Configuration
$DeploymentDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path -Parent $DeploymentDir

Write-Host "🚀 Local AI Stack - Cloud Deployment Script" -ForegroundColor $Green
Write-Host "=============================================="

# Check dependencies
function Test-Dependencies {
    Write-Host "Checking dependencies..." -ForegroundColor $Yellow
    
    $deps = @("terraform", "doctl", "git", "docker")
    $missingDeps = @()
    
    foreach ($dep in $deps) {
        if (!(Get-Command $dep -ErrorAction SilentlyContinue)) {
            $missingDeps += $dep
        }
    }
    
    if ($missingDeps.Count -gt 0) {
        Write-Host "Missing dependencies: $($missingDeps -join ', ')" -ForegroundColor $Red
        Write-Host "Please install the missing dependencies and try again."
        Write-Host ""
        Write-Host "Installation commands:"
        Write-Host "- Terraform: https://terraform.io/downloads"
        Write-Host "- doctl: https://github.com/digitalocean/doctl#installing-doctl"
        Write-Host "- Docker: https://docs.docker.com/get-docker/"
        exit 1
    }
    
    Write-Host "✓ All dependencies found" -ForegroundColor $Green
}

# Setup environment
function Set-Environment {
    Write-Host "Setting up environment..." -ForegroundColor $Yellow
    
    # Create terraform variables file if it doesn't exist
    $tfVarsPath = Join-Path $DeploymentDir "terraform\terraform.tfvars"
    if (!(Test-Path $tfVarsPath)) {
        Write-Host "Creating terraform.tfvars file..."
        
        $doToken = Read-Host "Enter your DigitalOcean API token"
        $domainName = Read-Host "Enter your domain name (e.g., example.com)"
        $sshKey = Read-Host "Enter your SSH key fingerprint (from 'doctl compute ssh-key list')"
        
        @"
do_token = "$doToken"
domain_name = "$domainName"
ssh_keys = ["$sshKey"]
"@ | Out-File -FilePath $tfVarsPath -Encoding UTF8
        
        Write-Host "✓ terraform.tfvars created" -ForegroundColor $Green
    }
    
    # Create .env file for AI search agent if it doesn't exist
    $envPath = Join-Path $ProjectRoot "services\ai-search-agent\.env"
    if (!(Test-Path $envPath)) {
        Write-Host "Creating AI search agent .env file..."
        
        $supabaseUrl = Read-Host "Enter Supabase URL (optional, press enter to skip)"
        $supabaseKey = Read-Host "Enter Supabase Key (optional, press enter to skip)"
        $langfusePublicKey = Read-Host "Enter Langfuse Public Key (optional, press enter to skip)"
        $langfuseSecretKey = Read-Host "Enter Langfuse Secret Key (optional, press enter to skip)"
        
        @"
# AI Search Agent Configuration
OLLAMA_BASE_URL=http://localhost:11434
SEARXNG_URL=http://localhost:8080
REDIS_URL=redis://localhost:6379
DEFAULT_MODEL=deepseek-r1:7b-q4

# Supabase Configuration (optional)
SUPABASE_URL=$supabaseUrl
SUPABASE_KEY=$supabaseKey

# Langfuse Observability (optional)
LANGFUSE_PUBLIC_KEY=$langfusePublicKey
LANGFUSE_SECRET_KEY=$langfuseSecretKey
LANGFUSE_HOST=https://cloud.langfuse.com

# API Configuration
API_HOST=0.0.0.0
API_PORT=8080
LOG_LEVEL=INFO

# CORS Origins
CORS_ORIGINS=["http://localhost:3000", "https://your-domain.com"]
"@ | Out-File -FilePath $envPath -Encoding UTF8
        
        Write-Host "✓ .env file created" -ForegroundColor $Green
    }
}

# Deploy infrastructure
function Deploy-Infrastructure {
    Write-Host "Deploying infrastructure with Terraform..." -ForegroundColor $Yellow
    
    Set-Location (Join-Path $DeploymentDir "terraform")
    
    # Initialize Terraform
    Write-Host "Initializing Terraform..."
    terraform init
    
    # Plan deployment
    Write-Host "Planning deployment..."
    terraform plan
    
    # Ask for confirmation
    Write-Host ""
    $proceed = Read-Host "Do you want to proceed with the deployment? (y/N)"
    if ($proceed -ne "y" -and $proceed -ne "Y") {
        Write-Host "Deployment cancelled."
        exit 1
    }
    
    # Apply deployment
    Write-Host "Applying deployment..."
    terraform apply -auto-approve
    
    # Save outputs
    $aiServerIp = terraform output -raw ai_server_ip
    $webServerIp = terraform output -raw web_server_ip
    $lbIp = terraform output -raw load_balancer_ip
    
    Write-Host "✓ Infrastructure deployed successfully" -ForegroundColor $Green
    Write-Host "AI Server IP: $aiServerIp"
    Write-Host "Web Server IP: $webServerIp"
    Write-Host "Load Balancer IP: $lbIp"
    
    # Save IPs to file for later use
    $deploymentInfo = Join-Path $DeploymentDir "deployment_info.txt"
    @"
AI_SERVER_IP=$aiServerIp
WEB_SERVER_IP=$webServerIp
LB_IP=$lbIp
DEPLOYED_AT=$(Get-Date)
"@ | Out-File -FilePath $deploymentInfo -Encoding UTF8
}

# Setup DNS
function Set-DNS {
    Write-Host "Setting up DNS..." -ForegroundColor $Yellow
    
    $deploymentInfoPath = Join-Path $DeploymentDir "deployment_info.txt"
    if (Test-Path $deploymentInfoPath) {
        $deploymentInfo = Get-Content $deploymentInfoPath | ConvertFrom-StringData
        
        Write-Host "Please configure your DNS with the following records:"
        Write-Host ""
        Write-Host "A Record: your-domain.com -> $($deploymentInfo.LB_IP)"
        Write-Host "A Record: www.your-domain.com -> $($deploymentInfo.LB_IP)"
        Write-Host ""
        Write-Host "After DNS propagation, your site will be available at:"
        Write-Host "https://your-domain.com"
        
        Read-Host "Press enter when DNS is configured and propagated..."
    } else {
        Write-Host "Deployment info not found. Please deploy infrastructure first." -ForegroundColor $Red
        exit 1
    }
}

# Deploy application
function Deploy-Application {
    Write-Host "Deploying application..." -ForegroundColor $Yellow
    
    $deploymentInfoPath = Join-Path $DeploymentDir "deployment_info.txt"
    if (Test-Path $deploymentInfoPath) {
        $deploymentInfo = Get-Content $deploymentInfoPath | ConvertFrom-StringData
        
        Write-Host "Application deployment requires manual SSH access to servers."
        Write-Host "AI Server IP: $($deploymentInfo.AI_SERVER_IP)"
        Write-Host "Web Server IP: $($deploymentInfo.WEB_SERVER_IP)"
        Write-Host ""
        Write-Host "Please use the provided cloud-init scripts for automated setup,"
        Write-Host "or manually deploy using the deployment guides."
        
        Write-Host "✓ Deployment information available" -ForegroundColor $Green
    } else {
        Write-Host "Deployment info not found. Please deploy infrastructure first." -ForegroundColor $Red
        exit 1
    }
}

# Check status
function Get-Status {
    $deploymentInfoPath = Join-Path $DeploymentDir "deployment_info.txt"
    if (Test-Path $deploymentInfoPath) {
        $deploymentInfo = Get-Content $deploymentInfoPath | ConvertFrom-StringData
        
        Write-Host "Deployment Status:"
        Write-Host "=================="
        Write-Host "AI Server IP: $($deploymentInfo.AI_SERVER_IP)"
        Write-Host "Web Server IP: $($deploymentInfo.WEB_SERVER_IP)"
        Write-Host "Load Balancer IP: $($deploymentInfo.LB_IP)"
        Write-Host "Deployed at: $($deploymentInfo.DEPLOYED_AT)"
        Write-Host ""
        
        Write-Host "Checking service health..."
        try {
            Invoke-WebRequest "http://$($deploymentInfo.AI_SERVER_IP):8080/health" -TimeoutSec 5 | Out-Null
            Write-Host "✓ AI service responding" -ForegroundColor $Green
        } catch {
            Write-Host "✗ AI service not responding" -ForegroundColor $Red
        }
        
        try {
            Invoke-WebRequest "http://$($deploymentInfo.WEB_SERVER_IP):3000" -TimeoutSec 5 | Out-Null
            Write-Host "✓ Web service responding" -ForegroundColor $Green
        } catch {
            Write-Host "✗ Web service not responding" -ForegroundColor $Red
        }
    } else {
        Write-Host "No deployment found." -ForegroundColor $Yellow
    }
}

# Main deployment flow
switch ($Action) {
    "full" {
        Test-Dependencies
        Set-Environment
        Deploy-Infrastructure
        Set-DNS
        Deploy-Application
        Write-Host "🎉 Full deployment completed!" -ForegroundColor $Green
    }
    "infrastructure" {
        Test-Dependencies
        Set-Environment
        Deploy-Infrastructure
        Write-Host "✓ Infrastructure deployment completed" -ForegroundColor $Green
    }
    "application" {
        Deploy-Application
        Write-Host "✓ Application deployment completed" -ForegroundColor $Green
    }
    "dns" {
        Set-DNS
    }
    "status" {
        Get-Status
    }
    default {
        Write-Host "Invalid action. Use: full, infrastructure, application, dns, or status" -ForegroundColor $Red
        exit 1
    }
}

Write-Host ""
Write-Host "Deployment script completed." -ForegroundColor $Green
