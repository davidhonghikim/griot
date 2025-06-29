---
title: "Skald-Griot RAG Response Personalizer"
description: |
  Specification for the Response Personalizer module inside the Skald-Griot RAG Output Bridge. This module tailors RAG-derived narratives based on agent profiles, end-user preferences, and situational context.

module_identity:
  name: "Skald-Griot RAG Response Personalizer"
  belongs_to: "Skald Node"

functions:
  - Apply agent-class-based narrative templates
  - Adjust tone, length, complexity, and sentiment of outputs
  - Localize content for geography, language, or cultural norms
  - Personalize examples, metaphors, or references
  - Support user-specific content profiles for human-facing outputs

api_endpoints:
  - /personalize_rag_response
  - /get_agent_narrative_profile
  - /update_user_personalization_profile
  - /preview_personalized_output

future_extensions:
  - AI-driven personalization style learning
  - Dynamic sentiment-matching for mood-adaptive responses
  - Real-time feedback loops for user personalization adjustments

security:
  - Privacy-safe user profile storage
  - Opt-in/Opt-out for deep personalization
  - Logging of all personalization transformations

...

