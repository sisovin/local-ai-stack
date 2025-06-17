from pydantic_settings import BaseSettings
from typing import List, Optional

class Settings(BaseSettings):
    # SearXNG Configuration
    searxng_base_url: str = "http://localhost:8080"
    searxng_api_key: Optional[str] = None
    
    # Local LLM Configuration
    ollama_base_url: str = "http://localhost:11434"
    default_model: str = "deepseek-r1:7b"
    
    # Supabase Configuration
    supabase_url: Optional[str] = None
    supabase_service_key: Optional[str] = None
    
    # Redis Configuration
    redis_url: str = "redis://localhost:6379"
    
    # API Configuration
    api_host: str = "0.0.0.0"
    api_port: int = 8001
    log_level: str = "INFO"
    
    # Search Configuration
    max_search_results: int = 10
    cache_timeout: int = 3600
    request_timeout: int = 30
    
    # Security
    cors_origins: List[str] = ["http://localhost:3000"]
    api_key_required: bool = False
    
    class Config:
        env_file = ".env"
        case_sensitive = False

settings = Settings()
