title: "kOS GKM Synthetic Load Test Dataset"
version: "1.0"
status: "DRAFT"
date: "2025-06-29"

test_queries:
  - query_id: "load-test-001"
    query_text: "What are the core functions of the Griot node?"
    expected_response_keywords:
      - "RAG Orchestration"
      - "Federation"
      - "Knowledge Summarization"

  - query_id: "load-test-002"
    query_text: "Explain CRDT synchronization in kOS."
    expected_response_keywords:
      - "Last-Write-Wins"
      - "Vector Sync"
      - "Eventual Consistency"

  - query_id: "load-test-003"
    query_text: "List all agent classes and their roles."
    expected_response_keywords:
      - "Griot"
      - "Ronin"
      - "Musa"
      - "Skald"
      - "Tohunga"

  - query_id: "load-test-004"
    query_text: "Simulate a vector query with high latency response."
    test_parameters:
      inject_artificial_delay_ms: 1500
      simulate_remote_node: "node-griot-2"

  - query_id: "load-test-005"
    query_text: "Trigger node discovery and registry lookup."
    test_parameters:
      parallel_requests: 50
      expected_max_latency_ms: 1000

performance_targets:
  max_average_latency_ms: 500
  max_error_rate_percent: 5
  target_query_success_rate: 95

data_storage:
  location: "packages/test/data/load-tests/gkm_synthetic_queries.yaml"

conclusion:
  summary: "This synthetic load test dataset provides controlled query inputs for stress testing federated query routing, latency tolerance, and system reliability within the GKM."

