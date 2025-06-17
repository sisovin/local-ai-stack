# Langfuse Observability Guide

Complete setup guide for monitoring and logging Local AI Stack interactions with Langfuse.

## Table of Contents

1. [Langfuse Overview](#langfuse-overview)
2. [Installation & Setup](#installation--setup)
3. [Integration with AI Services](#integration-with-ai-services)
4. [Custom Dashboards](#custom-dashboards)
5. [Performance Monitoring](#performance-monitoring)
6. [Production Configuration](#production-configuration)

## Langfuse Overview

Langfuse provides comprehensive LLM observability including:
- **Prompt tracking** and versioning
- **Response monitoring** and quality metrics
- **Performance analytics** (latency, cost, usage)
- **User session tracking**
- **A/B testing** for prompts
- **Debug traces** for complex workflows

## Installation & Setup

### 1. Add Langfuse to Dependencies

Update `services/ai-search-agent/requirements.txt`:

```txt
# Existing dependencies...
langfuse==2.7.3
opentelemetry-api==1.21.0
opentelemetry-sdk==1.21.0
opentelemetry-instrumentation==0.42b0
```

### 2. Langfuse Configuration

Create `services/ai-search-agent/langfuse_config.py`:

```python
from langfuse import Langfuse
from langfuse.decorators import observe, langfuse_context
from langfuse.openai import openai
import os
from typing import Optional, Dict, Any
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
```

### 3. Enhanced AI Analysis Service with Langfuse

Update `services/ai-search-agent/ai_analysis_service.py`:

```python
from openai import OpenAI
import httpx
import json
import uuid
from typing import List, Dict
from datetime import datetime
import structlog
from config import settings
from models import SearchResult, AIAnalysisRequest, AIAnalysisResponse
from langfuse_config import langfuse_config, observe, langfuse_context

logger = structlog.get_logger()

class AIAnalysisService:
    """Service for AI-powered analysis of search results with Langfuse tracking"""
    
    def __init__(self):
        self.base_url = settings.ollama_base_url
        self.default_model = settings.default_model
        
        # Initialize OpenAI client for Ollama with Langfuse wrapper
        if langfuse_config.enabled:
            # Patch OpenAI client for automatic tracking
            from langfuse.openai import OpenAI as LangfuseOpenAI
            self.client = LangfuseOpenAI(
                base_url=f"{self.base_url}/v1",
                api_key="ollama",
                timeout=httpx.Timeout(60.0)
            )
        else:
            self.client = OpenAI(
                base_url=f"{self.base_url}/v1",
                api_key="ollama",
                timeout=httpx.Timeout(60.0)
            )
    
    @observe(name="ai_search_analysis")
    async def analyze_search_results(self, request: AIAnalysisRequest, 
                                   user_id: Optional[str] = None,
                                   session_id: Optional[str] = None) -> AIAnalysisResponse:
        """Analyze search results using local LLM with comprehensive tracking"""
        start_time = datetime.now()
        
        # Create Langfuse trace
        trace_id = str(uuid.uuid4())
        
        try:
            # Update Langfuse context
            if langfuse_config.enabled:
                langfuse_context.update_current_trace(
                    name="search_analysis",
                    user_id=user_id,
                    session_id=session_id,
                    tags=["search", "analysis", request.model or self.default_model],
                    metadata={
                        "query": request.query,
                        "context": request.context,
                        "search_results_count": len(request.search_results),
                        "trace_id": trace_id
                    }
                )
            
            # Prepare the analysis prompt
            prompt = self._create_analysis_prompt(request)
            model = request.model or self.default_model
            
            # Track prompt as generation
            generation = None
            if langfuse_config.enabled:
                generation = langfuse_context.update_current_observation(
                    name="llm_analysis",
                    input=prompt,
                    model=model,
                    metadata={
                        "search_results_count": len(request.search_results),
                        "context_provided": bool(request.context)
                    }
                )
            
            # Get AI analysis
            response = self.client.chat.completions.create(
                model=model,
                messages=[
                    {
                        "role": "system",
                        "content": self._get_system_prompt()
                    },
                    {
                        "role": "user", 
                        "content": prompt
                    }
                ],
                temperature=0.3,
                max_tokens=2000,
                metadata={
                    "trace_id": trace_id,
                    "user_id": user_id,
                    "session_id": session_id
                } if langfuse_config.enabled else {}
            )
            
            # Parse the AI response
            ai_content = response.choices[0].message.content
            analysis_data = self._parse_ai_response(ai_content, request)
            
            analysis_time = (datetime.now() - start_time).total_seconds()
            
            # Create response
            analysis_response = AIAnalysisResponse(
                query=request.query,
                summary=analysis_data.get("summary", "Analysis completed"),
                key_points=analysis_data.get("key_points", []),
                sources=analysis_data.get("sources", []),
                confidence_score=analysis_data.get("confidence_score", 0.7),
                model_used=response.model,
                analysis_time=analysis_time
            )
            
            # Update Langfuse generation with results
            if langfuse_config.enabled and generation:
                generation.end(
                    output=analysis_response.model_dump(),
                    usage={
                        "promptTokens": response.usage.prompt_tokens if response.usage else 0,
                        "completionTokens": response.usage.completion_tokens if response.usage else 0,
                        "totalTokens": response.usage.total_tokens if response.usage else 0
                    },
                    level="INFO" if analysis_response.confidence_score >= 0.7 else "WARNING"
                )
                
                # Add custom scores
                langfuse_context.score_current_trace(
                    name="confidence_score",
                    value=analysis_response.confidence_score,
                    comment=f"AI confidence in analysis quality"
                )
                
                langfuse_context.score_current_trace(
                    name="response_time",
                    value=1.0 / max(analysis_time, 0.1),  # Inverse of time for scoring
                    comment=f"Analysis completed in {analysis_time:.2f}s"
                )
            
            logger.info("AI analysis completed with tracking",
                       query=request.query,
                       model=response.model,
                       analysis_time=analysis_time,
                       confidence=analysis_response.confidence_score,
                       trace_id=trace_id)
            
            return analysis_response
            
        except Exception as e:
            # Log error to Langfuse
            if langfuse_config.enabled:
                langfuse_context.update_current_trace(
                    level="ERROR",
                    status_message=str(e)
                )
            
            logger.error("AI analysis failed", 
                        query=request.query,
                        model=model,
                        error=str(e),
                        trace_id=trace_id)
            
            # Return fallback analysis
            return AIAnalysisResponse(
                query=request.query,
                summary=f"Analysis failed: {str(e)}",
                key_points=["Analysis service temporarily unavailable"],
                sources=[result.url for result in request.search_results[:3]],
                confidence_score=0.0,
                model_used=model,
                analysis_time=(datetime.now() - start_time).total_seconds()
            )
        finally:
            # Ensure trace is flushed
            if langfuse_config.enabled:
                langfuse_config.flush()
    
    def _get_system_prompt(self) -> str:
        """Get the system prompt for analysis"""
        return """You are an expert research analyst with access to web search results. 

Your task is to analyze search results and provide comprehensive, accurate summaries with the following requirements:

1. **Accuracy**: Base your analysis only on information present in the search results
2. **Comprehensiveness**: Cover all major points found in the results
3. **Objectivity**: Present information neutrally without bias
4. **Clarity**: Use clear, concise language
5. **Structure**: Follow the JSON format exactly
6. **Confidence**: Assign confidence scores based on source quality and consistency

If information conflicts between sources, mention the discrepancy and lower confidence.
If sources are low-quality or information is sparse, reflect this in the confidence score."""
    
    @observe(name="prompt_creation")
    def _create_analysis_prompt(self, request: AIAnalysisRequest) -> str:
        """Create analysis prompt for the LLM with tracking"""
        
        # Prepare search results context
        results_text = ""
        for i, result in enumerate(request.search_results[:10], 1):
            results_text += f"\n--- Result {i} ---\n"
            results_text += f"Title: {result.title}\n"
            results_text += f"URL: {result.url}\n"
            results_text += f"Content: {result.content[:500]}...\n"
            results_text += f"Engine: {result.engine}\n"
        
        context_addition = ""
        if request.context:
            context_addition = f"\nAdditional context: {request.context}\n"
        
        prompt = f"""
Please analyze the following search results for the query: "{request.query}"
{context_addition}
Search Results:
{results_text}

Provide a comprehensive analysis in JSON format:
{{
    "summary": "2-3 sentence summary of key findings",
    "key_points": ["Point 1", "Point 2", "Point 3", "Point 4", "Point 5"],
    "sources": ["URL1", "URL2", "URL3"],
    "confidence_score": 0.8
}}

Requirements:
- Summary: Factual overview of main findings
- Key points: 3-5 most important insights
- Sources: 3 most relevant URLs
- Confidence: 0.0-1.0 based on source quality and information consistency
"""
        
        # Track prompt characteristics
        if langfuse_config.enabled:
            langfuse_context.update_current_observation(
                metadata={
                    "prompt_length": len(prompt),
                    "results_count": len(request.search_results),
                    "has_context": bool(request.context)
                }
            )
        
        return prompt
    
    # ... existing methods remain the same
```

### 4. Enhanced Web Search Service

Update `services/ai-search-agent/main.py` to include Langfuse tracking:

```python
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
import structlog
import time
import uuid
from datetime import datetime
from contextlib import asynccontextmanager

from config import settings
from models import WebSearchRequest, WebSearchResponse
from searxng_service import SearXNGService
from ai_analysis_service import AIAnalysisService
from langfuse_config import langfuse_config, observe

logger = structlog.get_logger()

@observe(name="web_search_endpoint")
async def web_search(request: WebSearchRequest, user_id: str = None):
    """Perform web search with AI analysis and comprehensive tracking"""
    
    session_id = str(uuid.uuid4())
    
    try:
        start_time = datetime.now()
        
        # Update Langfuse context
        if langfuse_config.enabled:
            langfuse_context.update_current_trace(
                name="web_search",
                user_id=user_id,
                session_id=session_id,
                tags=["search", "web", request.model or "default"],
                metadata={
                    "query": request.query,
                    "analyze_with_ai": request.analyze_with_ai,
                    "ai_context": request.ai_context,
                    "model": request.model
                }
            )
        
        logger.info("Web search request received",
                   query=request.query,
                   analyze_with_ai=request.analyze_with_ai,
                   session_id=session_id)
        
        # Prepare search query
        search_params = request.search_params or SearchQuery(query=request.query)
        
        # Perform search with tracking
        search_span = None
        if langfuse_config.enabled:
            search_span = langfuse_context.update_current_observation(
                name="searxng_search",
                input={"query": request.query, "params": search_params.model_dump()},
                metadata={"search_engine": "searxng"}
            )
        
        search_results = await searxng_service.search(search_params)
        
        if search_span and langfuse_config.enabled:
            search_span.end(
                output={"results_count": len(search_results.results)},
                metadata={
                    "search_time": search_results.search_time,
                    "engines_used": search_results.engines_used
                }
            )
        
        # Initialize response
        response = WebSearchResponse(
            query=request.query,
            search_results=search_results,
            ai_analysis=None,
            cached=False,
            timestamp=start_time
        )
        
        # Perform AI analysis if requested
        if request.analyze_with_ai and search_results.results:
            ai_request = AIAnalysisRequest(
                query=request.query,
                search_results=search_results.results,
                context=request.ai_context,
                model=request.model
            )
            
            ai_analysis = await ai_service.analyze_search_results(
                ai_request, 
                user_id=user_id, 
                session_id=session_id
            )
            response.ai_analysis = ai_analysis
        
        # Track final metrics
        total_time = (datetime.now() - start_time).total_seconds()
        
        if langfuse_config.enabled:
            # Add performance scores
            langfuse_context.score_current_trace(
                name="total_response_time",
                value=1.0 / max(total_time, 0.1),
                comment=f"Total request time: {total_time:.2f}s"
            )
            
            if response.ai_analysis:
                langfuse_context.score_current_trace(
                    name="analysis_quality",
                    value=response.ai_analysis.confidence_score,
                    comment="AI analysis confidence score"
                )
        
        logger.info("Web search completed successfully",
                   query=request.query,
                   results_count=len(search_results.results),
                   has_ai_analysis=response.ai_analysis is not None,
                   total_time=total_time,
                   session_id=session_id)
        
        return response
        
    except Exception as e:
        # Track errors
        if langfuse_config.enabled:
            langfuse_context.update_current_trace(
                level="ERROR",
                status_message=str(e)
            )
        
        logger.error("Web search failed", 
                    query=request.query, 
                    error=str(e),
                    session_id=session_id)
        raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")
    
    finally:
        # Ensure all observations are flushed
        if langfuse_config.enabled:
            langfuse_config.flush()
```

### 5. Frontend Integration

Update `apps/web/components/WebSearchInterface.tsx` to include user tracking:

```tsx
import { useState, useEffect } from "react"
import { v4 as uuidv4 } from 'uuid'

export function WebSearchInterface() {
    const [sessionId] = useState(() => uuidv4())
    const [userId, setUserId] = useState<string | null>(null)
    
    // Get user ID from auth context
    useEffect(() => {
        // Assuming you have auth context
        const user = getCurrentUser()
        setUserId(user?.id || 'anonymous')
    }, [])
    
    const handleSearch = async () => {
        if (!query.trim()) return

        setIsSearching(true)
        setError(null)

        try {
            const response = await fetch("http://localhost:8001/search", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-User-ID": userId || 'anonymous',
                    "X-Session-ID": sessionId
                },
                body: JSON.stringify({
                    query: query.trim(),
                    analyze_with_ai: true,
                    ai_context: context.trim() || null,
                    model: "deepseek-r1:7b"
                }),
            })

            if (!response.ok) {
                throw new Error(`Search failed: ${response.status}`)
            }

            const data: WebSearchResponse = await response.json()
            setSearchResults(data)

            // Track search completion
            if (window.gtag) {
                window.gtag('event', 'search_completed', {
                    search_query: query,
                    results_count: data.search_results.total_results,
                    has_ai_analysis: !!data.ai_analysis,
                    session_id: sessionId
                })
            }

        } catch (err) {
            setError(err instanceof Error ? err.message : "Search failed")
            console.error("Search error:", err)
        } finally {
            setIsSearching(false)
        }
    }
    
    // ... rest of component
}
```

## Custom Dashboards

### 1. Langfuse Dashboard Configuration

Create custom dashboard views in Langfuse:

```json
{
  "dashboards": [
    {
      "name": "AI Search Performance",
      "charts": [
        {
          "type": "line_chart",
          "title": "Search Response Times",
          "metric": "trace.latency",
          "filters": {
            "trace.name": "web_search"
          },
          "groupBy": "hour"
        },
        {
          "type": "bar_chart", 
          "title": "AI Analysis Confidence Scores",
          "metric": "score.confidence_score",
          "filters": {
            "trace.tags": ["analysis"]
          }
        },
        {
          "type": "table",
          "title": "Most Popular Queries",
          "metrics": ["count"],
          "groupBy": "trace.metadata.query",
          "orderBy": "count desc",
          "limit": 20
        }
      ]
    }
  ]
}
```

### 2. Custom Metrics Collection

Create `services/ai-search-agent/metrics.py`:

```python
from langfuse_config import langfuse_config
from typing import Dict, Any
import time

class MetricsCollector:
    """Custom metrics collection for Local AI Stack"""
    
    @staticmethod
    def track_search_quality(query: str, results_count: int, 
                           ai_confidence: float, user_feedback: str = None):
        """Track search quality metrics"""
        if not langfuse_config.enabled:
            return
            
        langfuse_config.client.score(
            name="search_quality",
            value=ai_confidence,
            trace_id=langfuse_context.get_current_trace_id(),
            comment=f"Query: {query}, Results: {results_count}, Feedback: {user_feedback}"
        )
    
    @staticmethod
    def track_model_performance(model_name: str, response_time: float, 
                              token_count: int, success: bool):
        """Track model-specific performance"""
        if not langfuse_config.enabled:
            return
            
        langfuse_config.client.generation(
            name=f"model_performance_{model_name}",
            model=model_name,
            start_time=time.time() - response_time,
            end_time=time.time(),
            usage={
                "totalTokens": token_count,
                "promptTokens": int(token_count * 0.7),  # Estimate
                "completionTokens": int(token_count * 0.3)
            },
            level="INFO" if success else "ERROR"
        )
    
    @staticmethod
    def track_user_satisfaction(session_id: str, rating: int, 
                              feedback: str = None):
        """Track user satisfaction scores"""
        if not langfuse_config.enabled:
            return
            
        langfuse_config.client.score(
            name="user_satisfaction",
            value=rating / 5.0,  # Normalize to 0-1
            session_id=session_id,
            comment=feedback
        )
```

## Production Configuration

### 1. Environment Variables

Add to `.env.production`:

```bash
# Langfuse Configuration
LANGFUSE_PUBLIC_KEY=pk_lf_your_public_key
LANGFUSE_SECRET_KEY=sk_lf_your_secret_key
LANGFUSE_HOST=https://cloud.langfuse.com
LANGFUSE_DEBUG=false

# Performance Settings
LANGFUSE_SAMPLE_RATE=1.0
LANGFUSE_FLUSH_INTERVAL=5
LANGFUSE_MAX_RETRIES=3
```

### 2. Docker Compose Integration

Update `docker-compose.prod.yml`:

```yaml
services:
  ai-search-agent:
    environment:
      - LANGFUSE_PUBLIC_KEY=${LANGFUSE_PUBLIC_KEY}
      - LANGFUSE_SECRET_KEY=${LANGFUSE_SECRET_KEY}
      - LANGFUSE_HOST=${LANGFUSE_HOST}
      - LANGFUSE_DEBUG=false
    depends_on:
      - langfuse-db
      
  # Self-hosted Langfuse (optional)
  langfuse-db:
    image: postgres:15
    environment:
      POSTGRES_DB: langfuse
      POSTGRES_USER: langfuse
      POSTGRES_PASSWORD: ${LANGFUSE_DB_PASSWORD}
    volumes:
      - langfuse_db:/var/lib/postgresql/data

  langfuse:
    image: langfuse/langfuse:latest
    depends_on:
      - langfuse-db
    environment:
      DATABASE_URL: postgresql://langfuse:${LANGFUSE_DB_PASSWORD}@langfuse-db:5432/langfuse
      NEXTAUTH_SECRET: ${LANGFUSE_AUTH_SECRET}
      NEXTAUTH_URL: https://langfuse.your-domain.com
    ports:
      - "3001:3000"
```

This comprehensive Langfuse setup provides:

1. **Complete observability** for all AI interactions
2. **Performance monitoring** with custom metrics
3. **User tracking** and session management
4. **Custom dashboards** for insights
5. **Production-ready** configuration
6. **Self-hosted option** for data sovereignty

The integration gives you deep insights into your Local AI Stack's performance and user interactions.
