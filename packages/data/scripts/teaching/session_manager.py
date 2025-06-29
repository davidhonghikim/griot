"""
Session Manager Module

Manages teaching session creation, execution, and tracking.
"""

import logging
from datetime import datetime
from typing import Dict, List, Any, Optional
from .models import TeachingSession
from .config import TeachingConfig

logger = logging.getLogger(__name__)

class SessionManager:
    """Manages teaching session operations."""
    
    def __init__(self, config: TeachingConfig):
        """Initialize session manager."""
        self.config = config
        self.sessions: Dict[str, TeachingSession] = {}
    
    def create_teaching_session(
        self,
        session_type: str,
        topics: List[str],
        cultural_context: str = 'HIEROS',
        duration: Optional[int] = None
    ) -> TeachingSession:
        """Create a new teaching session."""
        session_id = f"session_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        
        session = TeachingSession(
            session_id=session_id,
            session_type=session_type,
            date=datetime.now(),
            duration=duration or self.config.get_default_duration(),
            topics=topics,
            cultural_context=cultural_context,
            methods=self._get_methods_for_session_type(session_type),
            outcomes=[],
            next_steps=[]
        )
        
        self.sessions[session_id] = session
        logger.info(f"Created teaching session: {session_id}")
        
        return session
    
    def _get_methods_for_session_type(self, session_type: str) -> List[str]:
        """Get appropriate teaching methods for session type."""
        method_mapping = {
            'introduction': ['discussion', 'storytelling'],
            'exploration': ['discussion', 'observation', 'storytelling'],
            'practice': ['practice', 'hands_on', 'demonstration'],
            'reflection': ['reflection', 'discussion', 'journaling'],
            'assessment': ['assessment', 'evaluation', 'feedback']
        }
        
        return method_mapping.get(session_type, ['discussion'])
    
    def conduct_session(self, session_id: str) -> Dict[str, Any]:
        """Conduct a teaching session and return results."""
        session = self.sessions.get(session_id)
        if not session:
            raise ValueError(f"Session not found: {session_id}")
        
        # Simulate session conduct
        outcomes = self._generate_session_outcomes(session)
        next_steps = self._generate_next_steps(session)
        
        session.outcomes = outcomes
        session.next_steps = next_steps
        
        logger.info(f"Conducted session: {session_id}")
        
        return {
            'session_id': session_id,
            'outcomes': outcomes,
            'next_steps': next_steps,
            'duration': session.duration,
            'methods_used': session.methods
        }
    
    def _generate_session_outcomes(self, session: TeachingSession) -> List[str]:
        """Generate outcomes based on session type and cultural context."""
        outcomes = []
        
        if session.session_type == 'introduction':
            outcomes.extend([
                f"Introduced {', '.join(session.topics)}",
                "Established cultural context and principles",
                "Created foundation for learning journey"
            ])
        elif session.session_type == 'exploration':
            outcomes.extend([
                f"Explored {', '.join(session.topics)} in depth",
                "Applied cultural principles to learning",
                "Identified key learning areas"
            ])
        elif session.session_type == 'practice':
            outcomes.extend([
                f"Practiced {', '.join(session.topics)}",
                "Applied theoretical knowledge",
                "Developed practical skills"
            ])
        elif session.session_type == 'reflection':
            outcomes.extend([
                "Reflected on learning progress",
                "Integrated cultural insights",
                "Identified growth areas"
            ])
        elif session.session_type == 'assessment':
            outcomes.extend([
                "Assessed learning outcomes",
                "Evaluated cultural understanding",
                "Provided feedback and guidance"
            ])
        
        return outcomes
    
    def _generate_next_steps(self, session: TeachingSession) -> List[str]:
        """Generate next steps based on session type."""
        next_steps = []
        
        if session.session_type == 'introduction':
            next_steps.extend([
                "Continue exploration of topics",
                "Apply principles in daily practice",
                "Prepare for next session"
            ])
        elif session.session_type == 'exploration':
            next_steps.extend([
                "Practice learned concepts",
                "Reflect on cultural applications",
                "Prepare for assessment"
            ])
        elif session.session_type == 'practice':
            next_steps.extend([
                "Continue skill development",
                "Apply in real-world contexts",
                "Share experiences with community"
            ])
        elif session.session_type == 'reflection':
            next_steps.extend([
                "Implement insights gained",
                "Continue learning journey",
                "Support others in their growth"
            ])
        elif session.session_type == 'assessment':
            next_steps.extend([
                "Focus on identified areas for improvement",
                "Continue cultural learning",
                "Plan next learning phase"
            ])
        
        return next_steps
    
    def get_session(self, session_id: str) -> Optional[TeachingSession]:
        """Get session by ID."""
        return self.sessions.get(session_id)
    
    def get_all_sessions(self) -> Dict[str, TeachingSession]:
        """Get all sessions."""
        return self.sessions.copy() 