"""
Learning Path Manager Module

Manages personalized learning path creation and tracking.
"""

import logging
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
from .models import LearningPath
from .config import TeachingConfig
from .cultural_frameworks import CulturalFrameworks

logger = logging.getLogger(__name__)

class LearningPathManager:
    """Manages learning path operations."""
    
    def __init__(self, config: TeachingConfig, cultural_frameworks: CulturalFrameworks):
        """Initialize learning path manager."""
        self.config = config
        self.cultural_frameworks = cultural_frameworks
        self.learning_paths: Dict[str, LearningPath] = {}
    
    def create_learning_path(
        self,
        learner_id: str,
        cultural_context: str = 'HIEROS',
        current_level: str = 'beginner',
        target_level: str = 'intermediate',
        focus_areas: Optional[List[str]] = None
    ) -> LearningPath:
        """Create a new learning path."""
        path_id = f"path_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        
        # Calculate timeline
        duration_weeks = self._calculate_duration_weeks(current_level, target_level)
        timeline = self._create_timeline(duration_weeks)
        
        # Generate milestones
        milestones = self._generate_milestones(
            focus_areas or self._get_default_focus_areas(cultural_context),
            current_level,
            duration_weeks
        )
        
        # Initialize progress
        progress = {
            'completed_milestones': 0,
            'total_milestones': len(milestones),
            'current_week': 1,
            'completion_percentage': 0.0
        }
        
        learning_path = LearningPath(
            path_id=path_id,
            learner_id=learner_id,
            cultural_context=cultural_context,
            current_level=current_level,
            target_level=target_level,
            focus_areas=focus_areas or self._get_default_focus_areas(cultural_context),
            milestones=milestones,
            timeline=timeline,
            progress=progress,
            recommendations=self._generate_path_recommendations(cultural_context, current_level)
        )
        
        self.learning_paths[path_id] = learning_path
        logger.info(f"Created learning path: {path_id}")
        
        return learning_path
    
    def _calculate_duration_weeks(self, current_level: str, target_level: str) -> int:
        """Calculate duration in weeks based on levels."""
        level_durations = {
            'beginner': {'intermediate': 12, 'advanced': 24},
            'intermediate': {'advanced': 16, 'expert': 20},
            'advanced': {'expert': 12}
        }
        
        return level_durations.get(current_level, {}).get(target_level, 12)
    
    def _create_timeline(self, duration_weeks: int) -> Dict[str, Any]:
        """Create timeline for learning path."""
        start_date = datetime.now()
        end_date = start_date + timedelta(weeks=duration_weeks)
        
        return {
            'start_date': start_date.isoformat(),
            'end_date': end_date.isoformat(),
            'duration_weeks': duration_weeks,
            'milestone_interval': max(1, duration_weeks // 8)  # 8 milestones max
        }
    
    def _get_default_focus_areas(self, cultural_context: str) -> List[str]:
        """Get default focus areas for cultural context."""
        cultural_elements = self.cultural_frameworks.get_cultural_elements(cultural_context)
        return cultural_elements + ['core_principles', 'practical_application']
    
    def _generate_milestones(
        self,
        focus_areas: List[str],
        current_level: str,
        duration_weeks: int
    ) -> List[Dict[str, Any]]:
        """Generate milestones for learning path."""
        milestones = []
        milestone_interval = max(1, duration_weeks // 8)
        
        for i, area in enumerate(focus_areas):
            week = (i + 1) * milestone_interval
            if week > duration_weeks:
                break
                
            milestone = {
                'id': f"milestone_{i+1}",
                'week': week,
                'focus_area': area,
                'title': f"Master {area}",
                'description': f"Develop proficiency in {area}",
                'difficulty': self._determine_difficulty(current_level, i),
                'cultural_elements': self._get_cultural_elements(area),
                'completed': False,
                'completion_date': None
            }
            milestones.append(milestone)
        
        return milestones
    
    def _determine_difficulty(self, current_level: str, milestone_index: int) -> str:
        """Determine difficulty based on current level and milestone position."""
        if current_level == 'beginner':
            if milestone_index < 3:
                return 'easy'
            elif milestone_index < 6:
                return 'moderate'
            else:
                return 'challenging'
        elif current_level == 'intermediate':
            if milestone_index < 2:
                return 'moderate'
            else:
                return 'challenging'
        else:
            return 'advanced'
    
    def _get_cultural_elements(self, area: str) -> List[str]:
        """Get cultural elements for a focus area."""
        # This would be expanded based on specific cultural mappings
        return ['cultural_awareness', 'traditional_knowledge']
    
    def _generate_path_recommendations(self, cultural_context: str, current_level: str) -> List[str]:
        """Generate recommendations for learning path."""
        recommendations = []
        
        if current_level == 'beginner':
            recommendations.extend([
                "Start with foundational concepts",
                "Practice regularly with community support",
                "Focus on cultural understanding"
            ])
        elif current_level == 'intermediate':
            recommendations.extend([
                "Deepen practical application",
                "Engage in community teaching",
                "Explore advanced cultural concepts"
            ])
        else:
            recommendations.extend([
                "Mentor others in their journey",
                "Contribute to cultural preservation",
                "Develop advanced teaching methods"
            ])
        
        # Add cultural-specific recommendations
        principles = self.cultural_frameworks.get_principles(cultural_context)
        recommendations.append(f"Apply {', '.join(principles[:2])} principles throughout")
        
        return recommendations
    
    def update_progress(self, path_id: str, milestone_id: str) -> Dict[str, Any]:
        """Update progress for a learning path."""
        learning_path = self.learning_paths.get(path_id)
        if not learning_path:
            raise ValueError(f"Learning path not found: {path_id}")
        
        # Find and mark milestone as completed
        for milestone in learning_path.milestones:
            if milestone['id'] == milestone_id:
                milestone['completed'] = True
                milestone['completion_date'] = datetime.now().isoformat()
                break
        
        # Update progress
        completed = sum(1 for m in learning_path.milestones if m['completed'])
        total = len(learning_path.milestones)
        completion_percentage = (completed / total) * 100 if total > 0 else 0
        
        learning_path.progress.update({
            'completed_milestones': completed,
            'completion_percentage': completion_percentage
        })
        
        logger.info(f"Updated progress for path {path_id}: {completion_percentage:.1f}% complete")
        
        return {
            'path_id': path_id,
            'completed_milestones': completed,
            'total_milestones': total,
            'completion_percentage': completion_percentage
        }
    
    def get_learning_path(self, path_id: str) -> Optional[LearningPath]:
        """Get learning path by ID."""
        return self.learning_paths.get(path_id)
    
    def get_all_learning_paths(self) -> Dict[str, LearningPath]:
        """Get all learning paths."""
        return self.learning_paths.copy() 