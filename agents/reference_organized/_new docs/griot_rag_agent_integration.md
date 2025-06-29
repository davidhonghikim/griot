---
title: "Griot RAG Agent Integration Patterns"
description: |
  Standardized patterns for integrating kOS agents with the shared Griot RAG system for querying, contribution, and dynamic context usage.

integration_patterns:
  agent_query:
    trigger: "Agent calls /query_rag endpoint"
    pattern:
      - Agent crafts query_text with context relevance
      - Sends POST to /query_rag with agent_id
      - Parses ranked_chunks for next task step

  agent_contribution:
    trigger: "Agent completes task with context creation"
    pattern:
      - Agent formats context as text
      - Sends POST to /contribute_rag with document_text and tags

  agent_feedback_loop:
    trigger: "Agent unsatisfied with initial results"
    pattern:
      - Uses /rank_results or /filter_results to refine output
      - Optionally rewrites query with LLM help

  agent_authentication:
    trigger: "Before any API call"
    pattern:
      - Retrieve API token from Node config or secure store
      - Append token to Authorization header

  agent_failure_handling:
    cases:
      - API rate limit exceeded → Retry with exponential backoff
      - Query timeout → Fallback to local cache (if available)
      - Empty result set → Trigger Skald for fallback generation

future_agent_patterns:
  - Cross-agent collaborative query sessions
  - Context chaining across multiple queries
  - Auto-contribution post-query (for learning agents)

...

