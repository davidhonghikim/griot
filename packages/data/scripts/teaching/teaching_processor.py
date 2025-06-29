"""
Teaching Processor Module

Main coordinator for teaching and mentorship operations.
"""

import json
import logging
from datetime import datetime
from typing import Dict, List, Any, Optional
from .config import TeachingConfig
from .cultural_frameworks import CulturalFrameworks
from .session_manager import SessionManager
from .assessment_manager import AssessmentManager
from .learning_path_manager import LearningPathManager

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class TeachingProcessor:
    """Main processor for teaching and mentorship operations."""
    
    def __init__(self, config_path: Optional[str] = None):
        """Initialize the teaching processor."""
        self.config = TeachingConfig(config_path)
        self.cultural_frameworks = CulturalFrameworks()
        self.session_manager = SessionManager(self.config)
        self.assessment_manager = AssessmentManager(self.config, self.cultural_frameworks)
        self.learning_path_manager = LearningPathManager(self.config, self.cultural_frameworks)
        
    def create_teaching_session(
        self,
        session_type: str,
        topics: List[str],
        cultural_context: str = 'HIEROS',
        duration: Optional[int] = None
    ):
        """Create a new teaching session."""
        return self.session_manager.create_teaching_session(
            session_type, topics, cultural_context, duration
        )
    
    def conduct_session(self, session_id: str) -> Dict[str, Any]:
        """Conduct a teaching session and return results."""
        result = self.session_manager.conduct_session(session_id)
        
        # Add cultural guidance
        result['cultural_guidance'] = self.cultural_frameworks.get_cultural_guidance(
            result.get('cultural_context', 'HIEROS')
        )
        
        return result
    
    def create_learning_assessment(
        self,
        learner_id: str,
        cultural_context: str = 'HIEROS',
        criteria: Optional[List[Dict[str, Any]]] = None
    ):
        """Create a new learning assessment."""
        return self.assessment_manager.create_learning_assessment(
            learner_id, cultural_context, criteria
        )
    
    def conduct_assessment(self, assessment_id: str) -> Dict[str, Any]:
        """Conduct a learning assessment and return results."""
        return self.assessment_manager.conduct_assessment(assessment_id)
    
    def create_learning_path(
        self,
        learner_id: str,
        cultural_context: str = 'HIEROS',
        current_level: str = 'beginner',
        target_level: str = 'intermediate',
        focus_areas: Optional[List[str]] = None
    ):
        """Create a new learning path."""
        return self.learning_path_manager.create_learning_path(
            learner_id, cultural_context, current_level, target_level, focus_areas
        )
    
    def update_learning_progress(self, path_id: str, milestone_id: str) -> Dict[str, Any]:
        """Update progress for a learning path."""
        return self.learning_path_manager.update_progress(path_id, milestone_id)
    
    def get_statistics(self) -> Dict[str, Any]:
        """Get comprehensive statistics about teaching operations."""
        sessions = self.session_manager.get_all_sessions()
        assessments = self.assessment_manager.get_all_assessments()
        learning_paths = self.learning_path_manager.get_all_learning_paths()
        
        return {
            'total_sessions': len(sessions),
            'total_assessments': len(assessments),
            'total_learning_paths': len(learning_paths),
            'average_assessment_score': self._calculate_average_assessment_score(),
            'cultural_contexts_used': list(set(
                [s.cultural_context for s in sessions.values()] +
                [a.cultural_context for a in assessments.values()] +
                [lp.cultural_context for lp in learning_paths.values()]
            )),
            'session_types_used': list(set(s.session_type for s in sessions.values())),
            'learning_levels': list(set(
                [lp.current_level for lp in learning_paths.values()] +
                [lp.target_level for lp in learning_paths.values()]
            ))
        }
    
    def _calculate_average_assessment_score(self) -> float:
        """Calculate average assessment score."""
        assessments = self.assessment_manager.get_all_assessments()
        if not assessments:
            return 0.0
        
        total_score = sum(a.overall_score for a in assessments.values())
        return total_score / len(assessments)
    
    def export_data(self, output_path: str) -> None:
        """Export all teaching data to JSON file."""
        data = {
            'sessions': {
                session_id: {
                    'session_id': session.session_id,
                    'session_type': session.session_type,
                    'date': session.date.isoformat(),
                    'duration': session.duration,
                    'topics': session.topics,
                    'cultural_context': session.cultural_context,
                    'methods': session.methods,
                    'outcomes': session.outcomes,
                    'next_steps': session.next_steps
                }
                for session_id, session in self.session_manager.get_all_sessions().items()
            },
            'assessments': {
                assessment_id: {
                    'learner_id': assessment.learner_id,
                    'assessment_id': assessment.assessment_id,
                    'date': assessment.date.isoformat(),
                    'cultural_context': assessment.cultural_context,
                    'criteria': assessment.criteria,
                    'scores': assessment.scores,
                    'cultural_evaluation': assessment.cultural_evaluation,
                    'overall_score': assessment.overall_score,
                    'recommendations': assessment.recommendations,
                    'next_steps': assessment.next_steps
                }
                for assessment_id, assessment in self.assessment_manager.get_all_assessments().items()
            },
            'learning_paths': {
                path_id: {
                    'path_id': path.path_id,
                    'learner_id': path.learner_id,
                    'cultural_context': path.cultural_context,
                    'current_level': path.current_level,
                    'target_level': path.target_level,
                    'focus_areas': path.focus_areas,
                    'milestones': path.milestones,
                    'timeline': path.timeline,
                    'progress': path.progress,
                    'recommendations': path.recommendations
                }
                for path_id, path in self.learning_path_manager.get_all_learning_paths().items()
            },
            'statistics': self.get_statistics(),
            'export_date': datetime.now().isoformat()
        }
        
        with open(output_path, 'w') as f:
            json.dump(data, f, indent=2)
        
        logger.info(f"Exported teaching data to: {output_path}")

def main():
    """Main function for testing the teaching processor."""
    processor = TeachingProcessor()
    
    # Create a teaching session
    session = processor.create_teaching_session(
        session_type='introduction',
        topics=['HIEROS principles', 'Cultural stewardship'],
        cultural_context='HIEROS'
    )
    
    # Conduct the session
    result = processor.conduct_session(session.session_id)
    print(f"Session conducted: {result}")
    
    # Create an assessment
    assessment = processor.create_learning_assessment(
        learner_id='learner_001',
        cultural_context='HIEROS'
    )
    
    # Conduct the assessment
    assessment_result = processor.conduct_assessment(assessment.assessment_id)
    print(f"Assessment conducted: {assessment_result}")
    
    # Create a learning path
    learning_path = processor.create_learning_path(
        learner_id='learner_001',
        cultural_context='HIEROS',
        current_level='beginner',
        target_level='intermediate'
    )
    
    # Get statistics
    stats = processor.get_statistics()
    print(f"Statistics: {stats}")
    
    # Export data
    processor.export_data('teaching_data_export.json')

if __name__ == '__main__':
    main() 