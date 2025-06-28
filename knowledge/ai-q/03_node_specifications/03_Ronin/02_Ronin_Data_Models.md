---
title: "Ronin Class: Data Models"
description: "Data models for the Ronin Node Class, including DiscoveryJob and DiscoveredService."
---

# Ronin Class Data Models

### 1. DiscoveryJob
Represents an asynchronous task for the Ronin's Discovery Engine.

```json
{
  "job_id": "string (uuid)",
  "status": "pending | running | completed | failed",
  "params": {
    "target": {
      "type": "network_cidr | domain | did",
      "value": "192.168.1.0/24"
    },
    "protocols": ["mdns", "http-api"],
    "depth": "number (integer, e.g., 1 for initial scan)"
  },
  "results": [
    // Array of DiscoveredService objects
  ],
  "created_at": "string (iso_8601_timestamp)",
  "completed_at": "string (iso_8601_timestamp, optional)"
}
```

### 2. DiscoveredService
A structured representation of a service found on the network. This is the primary data asset produced by a Ronin node.

```json
{
  "service_id": "string (did:kos:service:...)",
  "endpoint": "string (URL, e.g., https://griot.example.com:30437)",
  "node_class": "string (e.g., 'Griot', 'Tohunga')",
  "node_id": "string (did of the node hosting the service)",
  "capabilities": ["string"],
  "protocols": ["klf/1.0", "http/1.1"],
  "discovery_metadata": {
    "discovery_method": "string (e.g., 'mdns_advertisement', 'http_probe')",
    "response_time_ms": "number",
    "last_seen": "string (iso_8601_timestamp)"
  },
  "hieros_compliance": {
    "verified": "boolean",
    "codex_hash": "string (sha256)"
  }
}
``` 