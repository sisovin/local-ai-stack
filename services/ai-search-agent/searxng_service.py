import httpx
import json
import asyncio
from typing import List, Dict, Optional
from datetime import datetime
import structlog
from bs4 import BeautifulSoup
import redis
import hashlib
from config import settings
from models import SearchQuery, SearchResult, SearchResponse

logger = structlog.get_logger()

class SearXNGService:
    """Service for interacting with SearXNG search engine"""
    
    def __init__(self):
        self.base_url = settings.searxng_base_url
        self.api_key = settings.searxng_api_key
        self.timeout = httpx.Timeout(settings.request_timeout)
        
        # Initialize Redis for caching
        try:
            self.redis_client = redis.from_url(settings.redis_url, decode_responses=True)
        except Exception as e:
            logger.warning("Redis connection failed, caching disabled", error=str(e))
            self.redis_client = None
    
    def _get_cache_key(self, query: str, params: Dict) -> str:
        """Generate cache key for search query"""
        cache_data = f"{query}:{json.dumps(params, sort_keys=True)}"
        return f"search:{hashlib.md5(cache_data.encode()).hexdigest()}"
    
    async def _get_cached_results(self, cache_key: str) -> Optional[SearchResponse]:
        """Get cached search results"""
        if not self.redis_client:
            return None
        
        try:
            cached_data = self.redis_client.get(cache_key)
            if cached_data:
                data = json.loads(cached_data)
                logger.info("Cache hit for search query", cache_key=cache_key)
                return SearchResponse(**data)
        except Exception as e:
            logger.warning("Cache retrieval failed", error=str(e))
        
        return None
    
    async def _cache_results(self, cache_key: str, results: SearchResponse):
        """Cache search results"""
        if not self.redis_client:
            return
        
        try:
            self.redis_client.setex(
                cache_key,
                settings.cache_timeout,
                results.model_dump_json()
            )
            logger.info("Cached search results", cache_key=cache_key)
        except Exception as e:
            logger.warning("Cache storage failed", error=str(e))
    
    async def search(self, search_query: SearchQuery) -> SearchResponse:
        """Perform search using SearXNG"""
        start_time = datetime.now()
        
        # Prepare search parameters
        params = {
            "q": search_query.query,
            "format": "json",
            "safesearch": search_query.safe_search or "moderate",
            "language": search_query.language or "en"
        }
        
        if search_query.categories:
            params["categories"] = ",".join(search_query.categories)
        
        if search_query.engines:
            params["engines"] = ",".join(search_query.engines)
        
        if search_query.time_range:
            params["time_range"] = search_query.time_range
        
        # Check cache first
        cache_key = self._get_cache_key(search_query.query, params)
        cached_results = await self._get_cached_results(cache_key)
        if cached_results:
            return cached_results
        
        # Perform the search
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                headers = {}
                if self.api_key:
                    headers["Authorization"] = f"Bearer {self.api_key}"
                
                response = await client.get(
                    f"{self.base_url}/search",
                    params=params,
                    headers=headers
                )
                response.raise_for_status()
                
                search_data = response.json()
                
                # Parse results
                results = []
                engines_used = set()
                
                for result in search_data.get("results", []):
                    search_result = SearchResult(
                        title=result.get("title", ""),
                        url=result.get("url", ""),
                        content=result.get("content", ""),
                        engine=result.get("engine", "unknown"),
                        score=result.get("score"),
                        published_date=self._parse_date(result.get("publishedDate"))
                    )
                    results.append(search_result)
                    engines_used.add(result.get("engine", "unknown"))
                
                # Limit results
                if len(results) > settings.max_search_results:
                    results = results[:settings.max_search_results]
                
                search_time = (datetime.now() - start_time).total_seconds()
                
                search_response = SearchResponse(
                    query=search_query.query,
                    results=results,
                    total_results=len(results),
                    search_time=search_time,
                    engines_used=list(engines_used)
                )
                
                # Cache the results
                await self._cache_results(cache_key, search_response)
                
                logger.info("Search completed successfully",
                           query=search_query.query,
                           results_count=len(results),
                           search_time=search_time)
                
                return search_response
                
        except httpx.HTTPStatusError as e:
            logger.error("SearXNG HTTP error",
                        status_code=e.response.status_code,
                        error=str(e))
            raise Exception(f"Search service error: {e.response.status_code}")
        
        except httpx.RequestError as e:
            logger.error("SearXNG request error", error=str(e))
            raise Exception(f"Search service unavailable: {str(e)}")
        
        except Exception as e:
            logger.error("Search failed", error=str(e))
            raise Exception(f"Search failed: {str(e)}")
    
    def _parse_date(self, date_str: Optional[str]) -> Optional[datetime]:
        """Parse published date from search result"""
        if not date_str:
            return None
        
        try:
            # Try common date formats
            formats = [
                "%Y-%m-%dT%H:%M:%S",
                "%Y-%m-%d %H:%M:%S",
                "%Y-%m-%d",
                "%d/%m/%Y",
                "%m/%d/%Y"
            ]
            
            for fmt in formats:
                try:
                    return datetime.strptime(date_str, fmt)
                except ValueError:
                    continue
                    
        except Exception as e:
            logger.warning("Date parsing failed", date_str=date_str, error=str(e))
        
        return None
    
    async def health_check(self) -> bool:
        """Check if SearXNG service is available"""
        try:
            async with httpx.AsyncClient(timeout=httpx.Timeout(10.0)) as client:
                response = await client.get(f"{self.base_url}/stats")
                return response.status_code == 200
        except Exception as e:
            logger.error("SearXNG health check failed", error=str(e))
            return False
