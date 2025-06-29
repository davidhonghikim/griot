title: "Federated Vector Mesh Query API Specification"
version: "1.0"
status: "DRAFT"
date: "2025-06-29"

overview:
  description: |
    This API defines the protocol and endpoints for federated vector search operations across distributed Griot nodes within the kOS Global Knowledge Mesh (GKM). It enables agents and nodes to execute RAG queries that span local and remote vector stores.

objectives:
  - "Enable multi-node semantic vector search"
  - "Allow local-first, federated-fallback, and multi-hop query patterns"
  - "Support query relevance aggregation and ranking"
  - "Minimize latency and bandwidth via partial and streaming results"

api_endpoints:
  - name: "POST /vector/federated-search"
    description: "Submit a federated vector search query"
    request_body:
      fields:
        - query_text: "string"
        - persona_context: "object (optional)"
        - max_results: "integer (default: 10)"
        - similarity_threshold: "float (default: 0.7)"
        - federated_hops: "integer (default: 1)"
        - prefer_local: "boolean (default: true)"
        - ttl: "integer (default: 5000 ms)"
    response_body:
      fields:
        - results: "array of VectorResult"
        - node_sources: "list of node IDs that contributed results"
        - total_results: "integer"
        - federated_hops_taken: "integer"
        - latency_ms: "integer"
        - success: "boolean"
        - error_message: "string (optional)"

  - name: "GET /vector/node-capabilities"
    description: "Retrieve vector search capabilities for this node"
    response_body:
      fields:
        - node_id: "string"
        - supported_vector_dimensions: "integer"
        - vector_backend: "string (e.g., Weaviate, Chroma, pgvector)"
        - supported_similarity_metrics: "array of strings"
        - max_concurrent_queries: "integer"

data_models:
  VectorResult:
    fields:
      - content_snippet: "string"
      - source_doc_id: "string"
      - similarity_score: "float"
      - persona_match_score: "float (if persona filtering applied)"
      - originating_node: "string"

federation_routing_logic:
  description: |
    The query router will:
    1. Search local vector store first.
    2. If insufficient results, forward to directly connected Griot nodes.
    3. Each node repeats this logic up to TTL or hop limits.
    4. Aggregates all results with latency and relevance weighting.

performance_targets:
  - "Local query: <200ms"
  - "Single-hop federated query: <500ms"
  - "Multi-hop query: <1500ms"

security_and_privacy:
  - "KLF message signing for all federated requests"
  - "Rate limiting per source node"
  - "Payload encryption for cross-node transport"
  - "Future HIEROS Codex policy enforcement"

deployment_plan:
  phases:
    - "Phase 1: Local-only federated query simulation"
    - "Phase 2: Intra-LAN multi-node federation"
    - "Phase 3: Cross-site, multi-hop federation"
    - "Phase 4: Full GKM production rollout"

conclusion:
  summary: "This API standardizes federated vector queries across the kOS GKM, ensuring low-latency, persona-aware, and trustable knowledge retrieval from distributed nodes."

