from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class SearchQuery(BaseModel):
    query: str = Field(..., description="The search query")
    categories: Optional[List[str]] = Field(default=None, description="Search categories (web, news, images, etc.)")
    engines: Optional[List[str]] = Field(default=None, description="Specific search engines to use")
    safe_search: Optional[str] = Field(default="moderate", description="Safe search level")
    time_range: Optional[str] = Field(default=None, description="Time range filter")
    language: Optional[str] = Field(default="en", description="Search language")

class SearchResult(BaseModel):
    title: str
    url: str
    content: str
    engine: str
    score: Optional[float] = None
    published_date: Optional[datetime] = None

class SearchResponse(BaseModel):
    query: str
    results: List[SearchResult]
    total_results: int
    search_time: float
    engines_used: List[str]

class AIAnalysisRequest(BaseModel):
    query: str
    search_results: List[SearchResult]
    context: Optional[str] = None
    model: Optional[str] = None

class AIAnalysisResponse(BaseModel):
    query: str
    summary: str
    key_points: List[str]
    sources: List[str]
    confidence_score: float
    model_used: str
    analysis_time: float

class WebSearchRequest(BaseModel):
    query: str
    analyze_with_ai: bool = True
    search_params: Optional[SearchQuery] = None
    ai_context: Optional[str] = None
    model: Optional[str] = None

class WebSearchResponse(BaseModel):
    query: str
    search_results: SearchResponse
    ai_analysis: Optional[AIAnalysisResponse] = None
    cached: bool = False
    timestamp: datetime

class HealthResponse(BaseModel):
    status: str
    services: Dict[str, bool]
    version: str
    uptime: float

class ErrorResponse(BaseModel):
    error: str
    detail: Optional[str] = None
    timestamp: datetime
