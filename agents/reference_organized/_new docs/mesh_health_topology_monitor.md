title: "Mesh Health and Topology Monitor Specification"
version: "1.0"
status: "DRAFT"
date: "2025-06-29"

overview:
  description: |
    This module defines the Mesh Health and Topology Monitor for the kOS Global Knowledge Mesh (GKM). It tracks the operational status, latency, performance, and connectivity of all nodes, building a real-time map of the network topology.

objectives:
  - "Monitor node uptime, reachability, and error rates"
  - "Track query latency and success rates per node"
  - "Visualize network topology for human and agent analysis"
  - "Detect partitioned or isolated nodes"

health_metrics:
  - "Node uptime percentage"
  - "Ping round-trip latency"
  - "Vector query success/failure rate"
  - "Node CPU and memory usage (optional phase 2)"
  - "Network bandwidth utilization (optional phase 3)"

api_endpoints:
  - name: "GET /mesh/health"
    description: "Get health status of all known nodes"
    response: "Array of NodeHealthReport"

  - name: "GET /mesh/topology"
    description: "Return current network graph topology"
    response: "Graph data model with nodes, links, and health metrics"

  - name: "POST /mesh/heartbeat"
    description: "Allow nodes to report their current health state"
    body: "NodeHealthReport"

node_health_report_schema:
  fields:
    - node_id: "UUIDv4 string"
    - status: "Enum: active, standby, unreachable, error"
    - last_seen: "Timestamp"
    - average_latency_ms: "float"
    - error_rate_percent: "float"
    - recent_query_success_rate: "float"
    - current_load_factor: "float (optional phase 2)"

topology_graph_schema:
  nodes:
    - node_id
    - status
    - trust_level
  links:
    - source_node_id
    - target_node_id
    - average_latency_ms
    - last_activity_timestamp

monitoring_modes:
  - "Passive: Aggregate heartbeat reports"
  - "Active: Periodic ping and synthetic queries"

visualization_options:
  - "CLI summary reports"
  - "Web-based graph visualization (Phase 2)"
  - "Agent-readable data streams for Musa and Ronin nodes"

security_and_access:
  - "Only trusted nodes can submit heartbeat reports"
  - "Rate limiting for health check endpoints"
  - "Signature verification for all health reports"

deployment_plan:
  - "Phase 1: CLI-only metrics collector"
  - "Phase 2: Web-based dashboard"
  - "Phase 3: Multi-region topology aggregation"

conclusion:
  summary: |
    The Mesh Health and Topology Monitor will provide real-time visibility into the state and performance of the kOS GKM, enabling both agents and human operators to maintain optimal network health and rapid issue detection.

