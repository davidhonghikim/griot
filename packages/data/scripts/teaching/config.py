"""
Teaching Configuration Module

Provides configuration management for the teaching and mentorship system.
"""

import yaml
from pathlib import Path
from typing import Dict, List, Any, Optional

class TeachingConfig:
    """Configuration manager for teaching operations."""
    
    def __init__(self, config_path: Optional[str] = None):
        """Initialize configuration from file or use defaults."""
        self.config = self._load_config(config_path)
    
    def _load_config(self, config_path: Optional[str]) -> Dict[str, Any]:
        """Load configuration from file or use defaults."""
        if config_path and Path(config_path).exists():
            with open(config_path, 'r') as f:
                return yaml.safe_load(f)
        
        # Default configuration
        return {
            'cultural_contexts': ['HIEROS', 'Universal', 'Traditional'],
            'session_types': ['introduction', 'exploration', 'practice', 'reflection', 'assessment'],
            'assessment_methods': ['observation', 'discussion', 'practice', 'reflection', 'community'],
            'learning_levels': ['beginner', 'intermediate', 'advanced'],
            'default_duration': 60,  # minutes
            'max_context_size': 102400
        }
    
    def get_cultural_contexts(self) -> List[str]:
        """Get available cultural contexts."""
        return self.config.get('cultural_contexts', [])
    
    def get_session_types(self) -> List[str]:
        """Get available session types."""
        return self.config.get('session_types', [])
    
    def get_assessment_methods(self) -> List[str]:
        """Get available assessment methods."""
        return self.config.get('assessment_methods', [])
    
    def get_learning_levels(self) -> List[str]:
        """Get available learning levels."""
        return self.config.get('learning_levels', [])
    
    def get_default_duration(self) -> int:
        """Get default session duration in minutes."""
        return self.config.get('default_duration', 60)
    
    def get_max_context_size(self) -> int:
        """Get maximum context size in bytes."""
        return self.config.get('max_context_size', 102400) 