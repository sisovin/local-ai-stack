from langfuse import Langfuse
import os
from typing import Optional, Dict
import structlog

logger = structlog.get_logger()

class LangfuseConfig:
    """Centralized Langfuse configuration and utilities"""
    
    def __init__(self):
        self.public_key = os.getenv("LANGFUSE_PUBLIC_KEY")
        self.secret_key = os.getenv("LANGFUSE_SECRET_KEY")
        self.host = os.getenv("LANGFUSE_HOST", "https://cloud.langfuse.com")
        self.enabled = bool(self.public_key and self.secret_key)
        
        if self.enabled:
            self.client = Langfuse(
                public_key=self.public_key,
                secret_key=self.secret_key,
                host=self.host,
                debug=os.getenv("LANGFUSE_DEBUG", "false").lower() == "true"
            )
            logger.info("Langfuse initialized", host=self.host)
        else:
            self.client = None
            logger.warning("Langfuse not configured - monitoring disabled")
    
    def create_trace(self, name: str, user_id: Optional[str] = None, 
                    session_id: Optional[str] = None, metadata: Optional[Dict] = None):
        """Create a new trace for tracking interactions"""
        if not self.enabled:
            return None
            
        return self.client.trace(
            name=name,
            user_id=user_id,
            session_id=session_id,
            metadata=metadata or {}
        )
    
    def flush(self):
        """Flush pending observations"""
        if self.enabled:
            self.client.flush()

# Global instance
langfuse_config = LangfuseConfig()
