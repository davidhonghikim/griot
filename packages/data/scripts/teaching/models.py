"""
Teaching Models Module

Contains data models for teaching sessions, assessments, and learning paths.
"""

from dataclasses import dataclass
from datetime import datetime
from typing import Dict, List, Any

@dataclass
class TeachingSession:
    """Represents a teaching session with cultural context."""
    session_id: str
    session_type: str
    date: datetime
    duration: int  # minutes
    topics: List[str]
    cultural_context: str
    methods: List[str]
    outcomes: List[str]
    next_steps: List[str]

@dataclass
class LearningAssessment:
    """Represents a learning assessment with cultural evaluation."""
    learner_id: str
    assessment_id: str
    date: datetime
    cultural_context: str
    criteria: List[Dict[str, Any]]
    scores: Dict[str, float]
    cultural_evaluation: Dict[str, float]
    overall_score: float
    recommendations: List[str]
    next_steps: List[str]

@dataclass
class LearningPath:
    """Represents a personalized learning path."""
    path_id: str
    learner_id: str
    cultural_context: str
    current_level: str
    target_level: str
    focus_areas: List[str]
    milestones: List[Dict[str, Any]]
    timeline: Dict[str, Any]
    progress: Dict[str, Any]
    recommendations: List[str] 