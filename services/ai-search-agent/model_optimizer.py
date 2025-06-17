from typing import Dict, List
from dataclasses import dataclass
import psutil
import structlog

logger = structlog.get_logger()

@dataclass
class ModelConfig:
    """Configuration for optimized model deployment"""
    name: str
    size_gb: float
    min_ram_gb: float
    min_vram_gb: float
    max_context: int
    quantization: str
    recommended_batch_size: int
    
class ModelOptimizer:
    """Optimize model selection based on available resources"""
    
    MODELS = {
        "deepseek-r1:1.5b-q4": ModelConfig(
            name="deepseek-r1:1.5b-q4",
            size_gb=1.2,
            min_ram_gb=4,
            min_vram_gb=2,
            max_context=8192,
            quantization="q4_0",
            recommended_batch_size=8
        ),
        "deepseek-r1:7b-q4": ModelConfig(
            name="deepseek-r1:7b-q4", 
            size_gb=4.1,
            min_ram_gb=8,
            min_vram_gb=5,
            max_context=32768,
            quantization="q4_0",
            recommended_batch_size=4
        ),
        "deepseek-r1:7b-q8": ModelConfig(
            name="deepseek-r1:7b-q8",
            size_gb=7.2,
            min_ram_gb=12,
            min_vram_gb=8,
            max_context=32768,
            quantization="q8_0",
            recommended_batch_size=2
        ),
        "qwen2.5:7b-q4": ModelConfig(
            name="qwen2.5:7b-q4",
            size_gb=3.9,
            min_ram_gb=8,
            min_vram_gb=5,
            max_context=131072,
            quantization="q4_0",
            recommended_batch_size=4
        ),
        "qwen2.5:14b-q4": ModelConfig(
            name="qwen2.5:14b-q4",
            size_gb=7.8,
            min_ram_gb=16,
            min_vram_gb=10,
            max_context=131072,
            quantization="q4_0",
            recommended_batch_size=2
        )
    }
    
    @classmethod
    def get_system_specs(cls) -> Dict:
        """Get current system specifications"""
        # RAM
        ram_gb = psutil.virtual_memory().total / (1024**3)
        
        # GPU (fallback if GPUtil not available)
        gpu_info = []
        try:
            import GPUtil
            gpus = GPUtil.getGPUs()
            if gpus:
                for gpu in gpus:
                    gpu_info.append({
                        "name": gpu.name,
                        "memory_gb": gpu.memoryTotal / 1024,
                        "utilization": gpu.load * 100
                    })
        except ImportError:
            logger.warning("GPUtil not available, GPU detection disabled")
        
        # CPU
        cpu_count = psutil.cpu_count(logical=True)
        cpu_freq = psutil.cpu_freq()
        
        return {
            "ram_gb": ram_gb,
            "cpu_count": cpu_count,
            "cpu_freq_ghz": cpu_freq.max / 1000 if cpu_freq else 0,
            "gpus": gpu_info
        }
    
    @classmethod
    def recommend_models(cls, target_performance: str = "balanced") -> List[ModelConfig]:
        """Recommend optimal models based on system specs and performance target"""
        specs = cls.get_system_specs()
        recommendations = []
        
        # Performance targets
        performance_profiles = {
            "speed": {"max_size_gb": 2, "min_quantization": "q4_0"},
            "balanced": {"max_size_gb": 5, "min_quantization": "q4_0"}, 
            "quality": {"max_size_gb": 10, "min_quantization": "q8_0"}
        }
        
        profile = performance_profiles.get(target_performance, performance_profiles["balanced"])
        
        for model in cls.MODELS.values():
            # Check system requirements
            if (model.min_ram_gb <= specs["ram_gb"] and 
                model.size_gb <= profile["max_size_gb"]):
                
                # Check GPU requirements if available
                if specs["gpus"]:
                    gpu_suitable = any(
                        gpu["memory_gb"] >= model.min_vram_gb 
                        for gpu in specs["gpus"]
                    )
                    if gpu_suitable:
                        recommendations.append(model)
                else:
                    # CPU-only fallback
                    if model.size_gb <= 2:  # Smaller models for CPU
                        recommendations.append(model)
        
        # Sort by performance score
        def performance_score(model: ModelConfig) -> float:
            size_penalty = model.size_gb / 10  # Prefer smaller models
            context_bonus = min(model.max_context / 32768, 2)  # Bonus for larger context
            quantization_bonus = {"q4_0": 1.0, "q8_0": 1.2}.get(model.quantization, 1.0)
            return context_bonus * quantization_bonus - size_penalty
        
        recommendations.sort(key=performance_score, reverse=True)
        return recommendations[:3]  # Top 3 recommendations
    
    @classmethod
    def optimize_ollama_config(cls, model_config: ModelConfig) -> Dict:
        """Generate optimized Ollama configuration"""
        specs = cls.get_system_specs()
        
        config = {
            "num_ctx": min(model_config.max_context, 8192),  # Start conservative
            "num_thread": min(specs["cpu_count"], 8),
            "num_gpu": len(specs["gpus"]) if specs["gpus"] else 0,
            "low_vram": specs["gpus"][0]["memory_gb"] < 8 if specs["gpus"] else True,
            "f16_kv": True,  # Use FP16 for key-value cache
            "use_mlock": True,  # Lock model in memory
            "use_mmap": True,  # Memory map model files
        }
        
        # GPU-specific optimizations
        if specs["gpus"]:
            gpu = specs["gpus"][0]
            if gpu["memory_gb"] >= 16:
                config.update({
                    "num_batch": model_config.recommended_batch_size * 2,
                    "rope_frequency_base": 1000000.0,  # For long context
                })
            else:
                config.update({
                    "num_batch": model_config.recommended_batch_size,
                    "low_vram": True
                })
        
        return config
    
    @classmethod
    def get_optimization_recommendations(cls) -> Dict:
        """Get comprehensive optimization recommendations"""
        specs = cls.get_system_specs()
        recommended_models = cls.recommend_models()
        
        recommendations = {
            "system_specs": specs,
            "recommended_models": [
                {
                    "name": model.name,
                    "size_gb": model.size_gb,
                    "context_length": model.max_context,
                    "quantization": model.quantization,
                    "estimated_speed": "Fast" if model.size_gb < 3 else "Medium" if model.size_gb < 6 else "Slow",
                    "ollama_config": cls.optimize_ollama_config(model)
                }
                for model in recommended_models
            ],
            "system_optimizations": {
                "suggested_swap": max(4, specs["ram_gb"] * 0.1),  # 10% of RAM or 4GB minimum
                "cpu_affinity": list(range(min(specs["cpu_count"], 8))),  # Use up to 8 cores
                "memory_pressure": "high" if specs["ram_gb"] < 16 else "medium" if specs["ram_gb"] < 32 else "low"
            }
        }
        
        return recommendations

# Convenience function for easy access
def get_performance_recommendations(target: str = "balanced") -> Dict:
    """Get performance recommendations for current system"""
    return ModelOptimizer.get_optimization_recommendations()
