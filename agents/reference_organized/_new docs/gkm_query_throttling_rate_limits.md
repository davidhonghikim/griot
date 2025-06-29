title: "kOS GKM Query Throttling and Rate Limiting Configuration"
version: "1.0"
status: "DRAFT"
date: "2025-06-29"

query_throttling:
  global_limits:
    max_queries_per_second: 100
    burst_limit: 200
    sliding_window_seconds: 60

  per_node_limits:
    default:
      max_queries_per_second: 10
      burst_limit: 20
    high_trust_nodes:
      max_queries_per_second: 30
      burst_limit: 60

  per_agent_limits:
    skald:
      max_queries_per_second: 5
    ronin:
      max_queries_per_second: 10
    musa:
      max_queries_per_second: 3

  enforcement:
    policy: "Token Bucket Algorithm"
    throttle_backend: "Redis"

  failure_handling:
    on_throttle_violation:
      response_code: 429
      error_message: "Rate limit exceeded"

  monitoring:
    expose_throttle_metrics_api: true
    track_per_agent_query_rate: true

conclusion:
  summary: "This YAML defines global, per-node, and per-agent query rate limits for GKM nodes and services, preventing overload and ensuring fair resource allocation across the mesh."

