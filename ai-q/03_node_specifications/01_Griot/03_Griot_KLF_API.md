---
title: "Griot Class: KLF Message API"
description: "KLF Message API specification for the Griot Node Class's lifecycle services."
---

# Griot Class KLF Message API

The Griot Class API is job-based. Clients submit a request to package a node's configuration and code into a distributable artifact.

### **Request: `replicate_node`**
-   **Description**: Requests that the Griot node package a specified source node into a distributable artifact.
-   **Message Type**: `TASK_REQUEST`
-   **Payload**:
    ```json
    {
      "task_name": "replicate_node",
      "params": {
        "source_node_did": "did:kos:my-node-to-replicate:123",
        "target_version": "1.1.0",
        "distribution_options": {
            "protocol": "ipfs"
        }
      }
    }
    ```

### **Progress Updates**
-   **Message Type**: `TASK_PROGRESS`
-   **Payload**:
    ```json
    {
      "task_name": "replicate_node",
      "job_id": "string (uuid of the running job)",
      "status": "running",
      "progress": "number (0-100)",
      "message": "string (e.g., 'Cloning source repository...', 'Packaging artifact...')"
    }
    ```

### **Response: Success**
-   **Message Type**: `TASK_RESPONSE`
-   **Payload**:
    ```json
    {
      "task_name": "replicate_node",
      "job_id": "string (uuid of the job)",
      "status": "completed",
      "result": {
        "artifact_uri": "string (e.g., 'ipfs://Qm...', 'https://.../artifact.tar.gz')",
        "artifact_hash": "string (sha256)",
        "manifest": {
            // ... copy of the artifact's manifest.json ...
        }
      }
    }
    ```

### **Response: Error**
-   **Message Type**: `TASK_RESPONSE`
-   **Payload**:
    ```json
    {
      "task_name": "replicate_node",
      "job_id": "string (uuid of the job)",
      "status": "failed",
      "error": {
        "code": "string (e.g., 'SOURCE_NOT_FOUND', 'PACKAGING_FAILED')",
        "message": "string (Detailed error message)"
      }
    }
    ```