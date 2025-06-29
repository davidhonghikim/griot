"""
Assessment Manager Module

Manages learning assessment creation, execution, and evaluation.
"""

import logging
import random
from datetime import datetime
from typing import Dict, List, Any, Optional
from .models import LearningAssessment
from .config import TeachingConfig
from .cultural_frameworks import CulturalFrameworks

logger = logging.getLogger(__name__)

class AssessmentManager:
    """Manages learning assessment operations."""
    
    def __init__(self, config: TeachingConfig, cultural_frameworks: CulturalFrameworks):
        """Initialize assessment manager."""
        self.config = config
        self.cultural_frameworks = cultural_frameworks
        self.assessments: Dict[str, LearningAssessment] = {}
    
    def create_learning_assessment(
        self,
        learner_id: str,
        cultural_context: str = 'HIEROS',
        criteria: Optional[List[Dict[str, Any]]] = None
    ) -> LearningAssessment:
        """Create a new learning assessment."""
        assessment_id = f"assessment_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        
        assessment = LearningAssessment(
            learner_id=learner_id,
            assessment_id=assessment_id,
            date=datetime.now(),
            cultural_context=cultural_context,
            criteria=criteria or self._get_default_assessment_criteria(cultural_context),
            scores={},
            cultural_evaluation={},
            overall_score=0.0,
            recommendations=[],
            next_steps=[]
        )
        
        self.assessments[assessment_id] = assessment
        logger.info(f"Created learning assessment: {assessment_id}")
        
        return assessment
    
    def _get_default_assessment_criteria(self, cultural_context: str) -> List[Dict[str, Any]]:
        """Get default assessment criteria for cultural context."""
        base_criteria = [
            {
                'name': 'knowledge_understanding',
                'description': 'Understanding of core concepts',
                'weight': 0.3,
                'max_score': 10
            },
            {
                'name': 'practical_application',
                'description': 'Ability to apply knowledge',
                'weight': 0.3,
                'max_score': 10
            },
            {
                'name': 'cultural_integration',
                'description': 'Integration of cultural principles',
                'weight': 0.2,
                'max_score': 10
            },
            {
                'name': 'community_engagement',
                'description': 'Engagement with community learning',
                'weight': 0.2,
                'max_score': 10
            }
        ]
        
        # Add cultural-specific criteria
        cultural_elements = self.cultural_frameworks.get_cultural_elements(cultural_context)
        for element in cultural_elements:
            base_criteria.append({
                'name': f'{element}_understanding',
                'description': f'Understanding of {element}',
                'weight': 0.1,
                'max_score': 10
            })
        
        return base_criteria
    
    def conduct_assessment(self, assessment_id: str) -> Dict[str, Any]:
        """Conduct a learning assessment and return results."""
        assessment = self.assessments.get(assessment_id)
        if not assessment:
            raise ValueError(f"Assessment not found: {assessment_id}")
        
        # Simulate assessment conduct
        scores = {}
        for criterion in assessment.criteria:
            scores[criterion['name']] = self._simulate_criterion_score(criterion)
        
        cultural_evaluation = self._conduct_cultural_evaluation(assessment.cultural_context)
        
        # Calculate overall score
        overall_score = sum(
            scores[criterion['name']] * criterion['weight']
            for criterion in assessment.criteria
        )
        
        # Generate recommendations and next steps
        recommendations = self._generate_assessment_recommendations(
            scores, assessment.criteria, cultural_evaluation
        )
        next_steps = self._generate_assessment_next_steps(overall_score, cultural_evaluation)
        
        # Update assessment
        assessment.scores = scores
        assessment.cultural_evaluation = cultural_evaluation
        assessment.overall_score = overall_score
        assessment.recommendations = recommendations
        assessment.next_steps = next_steps
        
        logger.info(f"Conducted assessment: {assessment_id}")
        
        return {
            'assessment_id': assessment_id,
            'scores': scores,
            'cultural_evaluation': cultural_evaluation,
            'overall_score': overall_score,
            'recommendations': recommendations,
            'next_steps': next_steps
        }
    
    def _simulate_criterion_score(self, criterion: Dict[str, Any]) -> float:
        """Simulate a score for a criterion."""
        max_score = criterion['max_score']
        # Simulate realistic scores with some variation
        base_score = random.uniform(6.0, 9.5)
        return min(base_score, max_score)
    
    def _conduct_cultural_evaluation(self, cultural_context: str) -> Dict[str, float]:
        """Conduct cultural evaluation."""
        cultural_elements = self.cultural_frameworks.get_cultural_elements(cultural_context)
        evaluation = {}
        
        for element in cultural_elements:
            evaluation[element] = random.uniform(7.0, 9.5)
        
        return evaluation
    
    def _generate_assessment_recommendations(
        self,
        scores: Dict[str, float],
        criteria: List[Dict[str, Any]],
        cultural_evaluation: Dict[str, float]
    ) -> List[str]:
        """Generate recommendations based on assessment results."""
        recommendations = []
        
        # Identify areas for improvement
        low_scores = [name for name, score in scores.items() if score < 7.0]
        if low_scores:
            recommendations.append(f"Focus on improving: {', '.join(low_scores)}")
        
        # Cultural recommendations
        low_cultural_scores = [name for name, score in cultural_evaluation.items() if score < 7.5]
        if low_cultural_scores:
            recommendations.append(f"Strengthen cultural understanding in: {', '.join(low_cultural_scores)}")
        
        # General recommendations
        recommendations.extend([
            "Continue regular practice and reflection",
            "Engage with community learning opportunities",
            "Apply principles in daily life"
        ])
        
        return recommendations
    
    def _generate_assessment_next_steps(
        self,
        overall_score: float,
        cultural_evaluation: Dict[str, float]
    ) -> List[str]:
        """Generate next steps based on assessment results."""
        next_steps = []
        
        if overall_score >= 8.0:
            next_steps.extend([
                "Continue advanced learning",
                "Mentor others in their journey",
                "Deepen cultural understanding"
            ])
        elif overall_score >= 6.0:
            next_steps.extend([
                "Focus on identified improvement areas",
                "Practice regularly",
                "Seek additional guidance"
            ])
        else:
            next_steps.extend([
                "Review foundational concepts",
                "Seek one-on-one guidance",
                "Take additional time for practice"
            ])
        
        return next_steps
    
    def get_assessment(self, assessment_id: str) -> Optional[LearningAssessment]:
        """Get assessment by ID."""
        return self.assessments.get(assessment_id)
    
    def get_all_assessments(self) -> Dict[str, LearningAssessment]:
        """Get all assessments."""
        return self.assessments.copy() 