---
title: "Griot Class: Data Models"
description: "Data models for the Griot Node Class, including NodePackage and InstallationJob."
---

## 4. Data Models

These are the core data structures used by the Griot node's services. They are defined with explicit types to guide implementation.

### 4.1. NodePackage
Represents a distributable, verifiable artifact containing a kOS node's code and metadata. This is the "digital gene sequence" for a node.

```json
{
  "package_id": "string (sha256 hash of the artifact)",
  "manifest": {
    "node_class": "string (e.g., 'Tohunga', 'Musa')",
    "version": "string (semver, e.g., '1.2.1')",
    "author_did": "string (did:kos:...) (The DID of the package creator)",
    "dependencies": {
      "system": ["string (e.g., 'docker>=20.10')"],
      "kos_nodes": ["string (e.g., 'hakim@^1.0.0')"]
    },
    "source_url": "string (URL to the source code repository)",
    "signature": "string (ed25519 signature of the manifest content by the author)"
  },
  "artifact_url": "string (URL to the .tar.gz artifact, e.g., 'ipfs://...')",
  "created_at": "string (ISO 8601 timestamp)"
}
```

### 4.2. InstallationJob
Represents a task for the Differentiation Service to install a `NodePackage` on the local or a remote system.

```json
{
  "job_id": "string (uuid)",
  "package_id": "string (sha256 hash, foreign key to NodePackage)",
  "target_node_id": "string (did:kos:... of the node performing the installation)",
  "status": "pending | running | streaming_logs | completed | failed",
  "status_message": "string (Human-readable status)",
  "logs": ["string (Log entries from the installation process)"],
  "created_at": "string (ISO 8601 timestamp)",
  "completed_at": "string (ISO 8601 timestamp, optional)"
}
``` 