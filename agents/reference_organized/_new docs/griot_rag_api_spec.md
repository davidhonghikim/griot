---
title: "Griot RAG API Specification"
description: |
  Full API specification for agent access to the shared RAG system inside the Griot Node for kOS.

target_audience:
  - kOS Node Developers
  - Agent Developers
  - System Integrators

api_endpoints:
  - path: /query_rag
    method: POST
    description: "Submit a query and receive ranked context chunks"
    input:
      - query_text: string
      - agent_id: string
      - filters: optional, json object
    output:
      - ranked_chunks: list of json objects (chunk, score, source_doc, metadata)

  - path: /contribute_rag
    method: POST
    description: "Allow agents to contribute new documents or chunks to the RAG index"
    input:
      - document_text: string
      - agent_id: string
      - tags: optional, list of strings
    output:
      - status: success/fail
      - assigned_doc_id: string

  - path: /rank_results
    method: POST
    description: "Re-rank existing result set by new criteria"
    input:
      - result_set_id: string
      - new_criteria: json object
    output:
      - new_ranked_set: list

  - path: /filter_results
    method: POST
    description: "Filter results based on tags, agent class, recency, etc"
    input:
      - result_set_id: string
      - filter_conditions: json object
    output:
      - filtered_set: list

  - path: /get_embeddings
    method: POST
    description: "Get vector embeddings for supplied text for debugging or external analysis"
    input:
      - text: string
    output:
      - vector_embedding: list of floats

security:
  authentication:
    - Bearer Tokens
    - API Key
  rate_limiting:
    - Agent-level quotas
    - Throttling by IP or Agent ID

logging:
  - All queries stored with timestamp and agent ID
  - Contribution logs with agent source

versioning:
  - v1.0 initial release
  - v1.1 planned: streaming response option

...

