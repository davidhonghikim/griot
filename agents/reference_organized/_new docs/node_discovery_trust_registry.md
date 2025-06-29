title: "Node Discovery and Trust Registry Specification"
version: "1.0"
status: "DRAFT"
date: "2025-06-29"

overview:
  description: |
    This document defines the Node Discovery and Trust Registry module for the kOS Global Knowledge Mesh (GKM). It enables decentralized tracking, authentication, and capability mapping of all participating nodes.

objectives:
  - "Allow nodes to announce themselves to the mesh"
  - "Provide a queryable registry of node metadata"
  - "Support node capability discovery (e.g., vector search, graph storage, persona management)"
  - "Track trust scores and node status"

registry_schema:
  NodeDescriptor:
    fields:
      - node_id: "UUIDv4 string"
      - host_addresses:
          - "HTTP endpoint"
          - "Reticulum destination address"
          - "Tor hidden service address (optional)"
      - capabilities: "Array of supported capabilities (e.g., vector_search, persona_rag)"
      - current_status: "Enum: active, standby, unreachable, banned"
      - trust_level: "Enum: unknown, low, medium, high, verified"
      - last_seen: "Timestamp"
      - ttl: "Node-specified time-to-live (in seconds)"

api_endpoints:
  - name: "POST /node/announce"
    description: "Node broadcasts its presence and capabilities"
    request_body: "NodeDescriptor"
    response: "Acknowledgment with current trust_level"

  - name: "GET /node/registry"
    description: "Retrieve full node registry or filtered views"
    query_params:
      - filter_by_capability
      - status
      - trust_level
    response: "List of NodeDescriptors"

  - name: "GET /node/health/{node_id}"
    description: "Check health and reachability of a specific node"
    response: "Status report with last_seen, latency, error_rate"

trust_evaluation:
  phases:
    - "Phase 1: Static manual trust levels"
    - "Phase 2: Reputation scoring (based on uptime, response reliability)"
    - "Phase 3: HIEROS Codex validation layer"

storage_backend:
  - "MongoDB collection: nodes_registry"
  - "Optional: Replication to Neo4j for relationship mapping"

security_considerations:
  - "Rate limit announcement frequency to prevent spam"
  - "Require KLF message signing for announcements"
  - "Support blacklist / ban list for malicious nodes"

future_enhancements:
  - "Federated cross-registry sync"
  - "GraphQL interface for advanced queries"
  - "Support for node deprecation and retirement workflows"

conclusion:
  summary: |
    The Node Discovery and Trust Registry will enable secure, efficient, and federated management of the kOS GKM node topology, forming the backbone for multi-node query routing and trust enforcement.

