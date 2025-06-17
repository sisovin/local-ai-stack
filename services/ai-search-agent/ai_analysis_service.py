from openai import OpenAI
import httpx
import json
import asyncio
from typing import List, Dict, Optional
from datetime import datetime
import structlog
from config import settings
from models import SearchResult, AIAnalysisRequest, AIAnalysisResponse

logger = structlog.get_logger()

class AIAnalysisService:
    """Service for AI-powered analysis of search results"""
    
    def __init__(self):
        self.base_url = settings.ollama_base_url
        self.default_model = settings.default_model
        
        # Initialize OpenAI client for Ollama
        self.client = OpenAI(
            base_url=f"{self.base_url}/v1",
            api_key="ollama",  # Ollama doesn't require a real API key
            timeout=httpx.Timeout(60.0)
        )
    
    async def analyze_search_results(self, request: AIAnalysisRequest) -> AIAnalysisResponse:
        """Analyze search results using local LLM"""
        start_time = datetime.now()
        
        try:
            # Prepare the analysis prompt
            prompt = self._create_analysis_prompt(request)
            
            # Get AI analysis
            model = request.model or self.default_model
            
            response = self.client.chat.completions.create(
                model=model,
                messages=[
                    {
                        "role": "system",
                        "content": """You are an expert research analyst. Your task is to analyze web search results and provide comprehensive, accurate summaries. 

Key requirements:
1. Provide a clear, concise summary of the main findings
2. Extract 3-5 key points from the search results
3. List the most relevant sources
4. Assign a confidence score (0.0-1.0) based on source quality and consistency
5. Be objective and factual
6. If information is conflicting, mention the discrepancies
7. Format your response as valid JSON with the required fields"""
                    },
                    {
                        "role": "user", 
                        "content": prompt
                    }
                ],
                temperature=0.3,  # Lower temperature for more consistent analysis
                max_tokens=2000
            )
            
            # Parse the AI response
            ai_content = response.choices[0].message.content
            
            # Try to extract structured data from the response
            analysis_data = self._parse_ai_response(ai_content, request)
            
            analysis_time = (datetime.now() - start_time).total_seconds()
            
            analysis_response = AIAnalysisResponse(
                query=request.query,
                summary=analysis_data.get("summary", "Analysis completed"),
                key_points=analysis_data.get("key_points", []),
                sources=analysis_data.get("sources", []),
                confidence_score=analysis_data.get("confidence_score", 0.7),
                model_used=response.model,
                analysis_time=analysis_time
            )
            
            logger.info("AI analysis completed",
                       query=request.query,
                       model=response.model,
                       analysis_time=analysis_time,
                       confidence=analysis_data.get("confidence_score"))
            
            return analysis_response
            
        except Exception as e:
            logger.error("AI analysis failed", 
                        query=request.query,
                        model=model,
                        error=str(e))
            
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
    
    def _create_analysis_prompt(self, request: AIAnalysisRequest) -> str:
        """Create analysis prompt for the LLM"""
        
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

Please provide a comprehensive analysis in the following JSON format:
{{
    "summary": "A 2-3 sentence summary of the main findings",
    "key_points": ["Point 1", "Point 2", "Point 3", "Point 4", "Point 5"],
    "sources": ["URL1", "URL2", "URL3"],
    "confidence_score": 0.8
}}

Requirements:
- Summary should be factual and comprehensive
- Key points should be the most important insights from the search results
- Sources should be the 3 most relevant URLs
- Confidence score should reflect the quality and consistency of information (0.0-1.0)
- If information is conflicting or unclear, lower the confidence score
- Only include information that is actually present in the search results
"""
        
        return prompt
    
    def _parse_ai_response(self, ai_content: str, request: AIAnalysisRequest) -> Dict:
        """Parse AI response and extract structured data"""
        try:
            # Try to extract JSON from the response
            if "{" in ai_content and "}" in ai_content:
                start = ai_content.find("{")
                end = ai_content.rfind("}") + 1
                json_str = ai_content[start:end]
                parsed_data = json.loads(json_str)
                
                # Validate required fields
                if all(key in parsed_data for key in ["summary", "key_points", "sources", "confidence_score"]):
                    return parsed_data
        
        except json.JSONDecodeError:
            logger.warning("Failed to parse AI response as JSON", response=ai_content[:200])
        
        # Fallback parsing
        return self._fallback_parse(ai_content, request)
    
    def _fallback_parse(self, ai_content: str, request: AIAnalysisRequest) -> Dict:
        """Fallback parsing when JSON extraction fails"""
        lines = ai_content.split('\n')
        
        # Extract summary (usually first few lines)
        summary_lines = []
        for line in lines[:5]:
            if line.strip() and not line.startswith('{') and not line.startswith('['):
                summary_lines.append(line.strip())
        
        summary = ' '.join(summary_lines) if summary_lines else "Analysis completed successfully."
        
        # Extract key points (look for bullet points or numbered lists)
        key_points = []
        for line in lines:
            line = line.strip()
            if (line.startswith('•') or line.startswith('-') or 
                line.startswith('*') or any(line.startswith(f"{i}.") for i in range(1, 10))):
                cleaned = line.lstrip('•-*0123456789. ')
                if cleaned:
                    key_points.append(cleaned)
        
        # Get sources from search results
        sources = [result.url for result in request.search_results[:3]]
        
        # Default confidence score
        confidence_score = 0.7
        
        return {
            "summary": summary[:500],  # Limit summary length
            "key_points": key_points[:5],  # Limit to 5 key points
            "sources": sources,
            "confidence_score": confidence_score
        }
    
    async def health_check(self) -> bool:
        """Check if the AI service is available"""
        try:
            response = self.client.chat.completions.create(
                model=self.default_model,
                messages=[{"role": "user", "content": "Hello"}],
                max_tokens=10,
                temperature=0.1
            )
            return bool(response.choices[0].message.content)
        except Exception as e:
            logger.error("AI service health check failed", error=str(e))
            return False
