from fastapi import FastAPI, HTTPException, Depends, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import structlog
import time
import asyncio
from datetime import datetime
from contextlib import asynccontextmanager

from config import settings
from models import (
    WebSearchRequest, WebSearchResponse, SearchQuery, SearchResponse,
    AIAnalysisRequest, HealthResponse, ErrorResponse
)
from searxng_service import SearXNGService
from ai_analysis_service import AIAnalysisService
from model_optimizer import ModelOptimizer, get_performance_recommendations

# Configure structured logging
structlog.configure(
    processors=[
        structlog.stdlib.filter_by_level,
        structlog.stdlib.add_logger_name,
        structlog.stdlib.add_log_level,
        structlog.stdlib.PositionalArgumentsFormatter(),
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.JSONRenderer()
    ],
    context_class=dict,
    logger_factory=structlog.stdlib.LoggerFactory(),
    cache_logger_on_first_use=True,
)

logger = structlog.get_logger()

# Global service instances
searxng_service = None
ai_service = None
app_start_time = time.time()

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan management"""
    global searxng_service, ai_service
    
    # Startup
    logger.info("Starting AI Search Agent", version="1.0.0")
    
    # Initialize services
    searxng_service = SearXNGService()
    ai_service = AIAnalysisService()
    
    # Health checks
    searxng_healthy = await searxng_service.health_check()
    ai_healthy = await ai_service.health_check()
    
    logger.info("Service initialization complete",
               searxng_healthy=searxng_healthy,
               ai_healthy=ai_healthy)
    
    yield
    
    # Shutdown
    logger.info("Shutting down AI Search Agent")

# Initialize FastAPI app
app = FastAPI(
    title="AI Search Agent",
    description="Privacy-focused web search with AI-powered analysis using SearXNG and local LLMs",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Middleware for request logging
@app.middleware("http")
async def log_requests(request, call_next):
    """Log all requests"""
    start_time = time.time()
    
    logger.info("Request started",
               method=request.method,
               url=str(request.url),
               client_ip=request.client.host)
    
    response = await call_next(request)
    
    process_time = time.time() - start_time
    logger.info("Request completed",
               status_code=response.status_code,
               process_time=f"{process_time:.3f}s")
    
    return response

@app.get("/", response_model=dict)
async def root():
    """Root endpoint with service information"""
    return {
        "message": "AI Search Agent is running",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health"
    }

@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    try:
        # Check all services
        searxng_healthy = await searxng_service.health_check()
        ai_healthy = await ai_service.health_check()
        
        services = {
            "searxng": searxng_healthy,
            "ai_analysis": ai_healthy,
            "redis": searxng_service.redis_client is not None
        }
        
        overall_status = "healthy" if all(services.values()) else "degraded"
        
        return HealthResponse(
            status=overall_status,
            services=services,
            version="1.0.0",
            uptime=time.time() - app_start_time
        )
        
    except Exception as e:
        logger.error("Health check failed", error=str(e))
        raise HTTPException(status_code=500, detail="Health check failed")

@app.post("/search", response_model=WebSearchResponse)
async def web_search(request: WebSearchRequest, background_tasks: BackgroundTasks):
    """Perform web search with optional AI analysis"""
    try:
        start_time = datetime.now()
        
        logger.info("Web search request received",
                   query=request.query,
                   analyze_with_ai=request.analyze_with_ai)
        
        # Prepare search query
        search_params = request.search_params or SearchQuery(query=request.query)
        if search_params.query != request.query:
            search_params.query = request.query
        
        # Perform search
        search_results = await searxng_service.search(search_params)
        
        # Initialize response
        response = WebSearchResponse(
            query=request.query,
            search_results=search_results,
            ai_analysis=None,
            cached=False,  # TODO: Implement proper cache detection
            timestamp=start_time
        )
        
        # Perform AI analysis if requested
        if request.analyze_with_ai and search_results.results:
            try:
                ai_request = AIAnalysisRequest(
                    query=request.query,
                    search_results=search_results.results,
                    context=request.ai_context,
                    model=request.model
                )
                
                ai_analysis = await ai_service.analyze_search_results(ai_request)
                response.ai_analysis = ai_analysis
                
            except Exception as e:
                logger.warning("AI analysis failed, returning search results only",
                              error=str(e))
                # Continue without AI analysis
        
        logger.info("Web search completed successfully",
                   query=request.query,
                   results_count=len(search_results.results),
                   has_ai_analysis=response.ai_analysis is not None)
        
        return response
        
    except Exception as e:
        logger.error("Web search failed", query=request.query, error=str(e))
        raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")

@app.post("/search/simple")
async def simple_search(query: str, analyze: bool = True, model: str = None):
    """Simplified search endpoint"""
    try:
        request = WebSearchRequest(
            query=query,
            analyze_with_ai=analyze,
            model=model
        )
        
        result = await web_search(request, BackgroundTasks())
        
        # Return simplified response
        return {
            "query": result.query,
            "summary": result.ai_analysis.summary if result.ai_analysis else "Search completed",
            "key_points": result.ai_analysis.key_points if result.ai_analysis else [],
            "sources": result.ai_analysis.sources if result.ai_analysis else [r.url for r in result.search_results.results[:3]],
            "results_count": result.search_results.total_results,
            "confidence": result.ai_analysis.confidence_score if result.ai_analysis else None
        }
        
    except Exception as e:
        logger.error("Simple search failed", query=query, error=str(e))
        raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")

@app.get("/search/history")
async def search_history():
    """Get search history (placeholder for future implementation)"""
    return {
        "message": "Search history endpoint - to be implemented",
        "searches": []
    }

@app.post("/analyze")
async def analyze_results(request: AIAnalysisRequest):
    """Analyze provided search results with AI"""
    try:
        logger.info("Analysis request received", query=request.query)
        
        analysis = await ai_service.analyze_search_results(request)
        
        logger.info("Analysis completed", 
                   query=request.query,
                   confidence=analysis.confidence_score)
        
        return analysis
        
    except Exception as e:
        logger.error("Analysis failed", query=request.query, error=str(e))
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@app.get("/performance/recommendations")
async def get_model_recommendations(target: str = "balanced"):
    """Get AI model recommendations based on system specs"""
    try:
        recommendations = get_performance_recommendations(target)
        
        logger.info("Performance recommendations requested", 
                   target=target,
                   system_ram=recommendations["system_specs"]["ram_gb"])
        
        return {
            "target_performance": target,
            "system_specifications": recommendations["system_specs"],
            "recommended_models": recommendations["recommended_models"],
            "system_optimizations": recommendations["system_optimizations"],
            "timestamp": datetime.now()
        }
        
    except Exception as e:
        logger.error("Failed to get performance recommendations", error=str(e))
        raise HTTPException(status_code=500, detail=f"Performance analysis failed: {str(e)}")

@app.get("/performance/system")
async def get_system_specs():
    """Get current system specifications"""
    try:
        specs = ModelOptimizer.get_system_specs()
        
        return {
            "system_specifications": specs,
            "performance_analysis": {
                "ram_category": "high" if specs["ram_gb"] >= 32 else "medium" if specs["ram_gb"] >= 16 else "low",
                "gpu_available": len(specs["gpus"]) > 0,
                "gpu_memory_total": sum(gpu["memory_gb"] for gpu in specs["gpus"]) if specs["gpus"] else 0,
                "recommended_model_size": "large" if specs["ram_gb"] >= 32 else "medium" if specs["ram_gb"] >= 16 else "small"
            },
            "timestamp": datetime.now()
        }
        
    except Exception as e:
        logger.error("Failed to get system specs", error=str(e))
        raise HTTPException(status_code=500, detail=f"System analysis failed: {str(e)}")

@app.get("/performance/models")
async def list_available_models():
    """List all available models with specifications"""
    try:
        models = []
        for model_name, config in ModelOptimizer.MODELS.items():
            models.append({
                "name": config.name,
                "size_gb": config.size_gb,
                "min_ram_gb": config.min_ram_gb,
                "min_vram_gb": config.min_vram_gb,
                "max_context": config.max_context,
                "quantization": config.quantization,
                "recommended_batch_size": config.recommended_batch_size,
                "performance_tier": "fast" if config.size_gb < 3 else "balanced" if config.size_gb < 6 else "quality"
            })
        
        return {
            "available_models": models,
            "total_models": len(models),
            "timestamp": datetime.now()
        }
        
    except Exception as e:
        logger.error("Failed to list models", error=str(e))
        raise HTTPException(status_code=500, detail=f"Model listing failed: {str(e)}")

# Error handlers
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc: HTTPException):
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
            timestamp=datetime.now()
        ).model_dump()
    )

@app.exception_handler(Exception)
async def general_exception_handler(request, exc: Exception):
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
            timestamp=datetime.now()
        ).model_dump()
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.api_host,
        port=settings.api_port,
        reload=True,
        log_level=settings.log_level.lower()
    )
