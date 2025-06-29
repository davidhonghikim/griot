title: "kOS GKM Module API Schemas" version: "1.0" status: "DRAFT" date: "2025-06-29"

overview: description: | This document contains YAML API schema definitions for all primary GKM modules to enable OpenAPI/Swagger generation, TypeScript typing, and inter-service communication consistency.

modules: ReticulumKLFTransportAdapter: endpoints: - path: "/transport/reticulum/send" method: "POST" description: "Send a KLF message over Reticulum" request: body: - klfMessage: "KLFMessageObject" response: - status: "202" description: "Message accepted for transmission"

FederatedVectorMeshQueryService: endpoints: - path: "/vector/federated-search" method: "POST" description: "Run a federated vector query across Griot nodes" request: body: - queryText: "string" - personaContext: "PersonaFilter (optional)" - maxResults: "integer" response: - status: "200" body: - results: "VectorResult[]" - sourceNodes: "string[]"

NodeDiscoveryRegistryService: endpoints: - path: "/node/announce" method: "POST" description: "Announce node presence and capabilities" request: body: - NodeDescriptor response: - status: "200" description: "Acknowledged"

```
  - path: "/node/registry"
    method: "GET"
    description: "Get current node registry"
    response:
      - status: "200"
        body:
          - nodes: "NodeDescriptor[]"
```

CRDTConsistencySyncService: endpoints: - path: "/sync/push" method: "POST" description: "Push local sync events to peers" request: body: - events: "SyncEvent[]" response: - status: "202"

```
  - path: "/sync/pull"
    method: "POST"
    description: "Request updates since a given timestamp"
    request:
      body:
        - lastSyncTime: "ISO8601 timestamp"
        - filters: "string[] (optional)"
    response:
      - status: "200"
        body:
          - updates: "SyncEvent[]"
```

MeshHealthTopologyMonitor: endpoints: - path: "/mesh/health" method: "GET" description: "Get full mesh health status" response: - status: "200" body: - healthReports: "NodeHealthReport[]"

```
  - path: "/mesh/topology"
    method: "GET"
    description: "Get current network topology graph"
    response:
      - status: "200"
        body:
          - topology: "MeshTopologyGraph"
```

conclusion: summary: "These API schemas form the OpenAPI-compatible definition layer for GKM microservices. All services should implement these endpoints with strict type and payload validation." status: "Ready for TypeScript interface generation"

