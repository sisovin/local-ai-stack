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
    port_range       = "8080"
    source_addresses = [digitalocean_vpc.local_ai_vpc.ip_range]
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

# Outputs
output "ai_server_ip" {
  value = digitalocean_droplet.ai_server.ipv4_address
}

output "web_server_ip" {
  value = digitalocean_droplet.web_server.ipv4_address
}

output "load_balancer_ip" {
  value = digitalocean_loadbalancer.web_lb.ip
}
