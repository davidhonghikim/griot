---
title: "Ronin Class: KLF Message API"
description: "KLF Message API specification for the Ronin Node Class's services."
---

# Ronin Class KLF Message API

In alignment with the **"Framework, Not Application"** principle, the Ronin Class API is job-based. Clients submit a discovery job with parameters, and the Ronin node executes it asynchronously.

### **Request: `run_discovery_job`**
-   **Message Type**: `TASK_REQUEST`
-   **Payload**:
    ```json
    {
      "task_name": "run_discovery_job",
      "params": {
        "target": {
          "type": "network_cidr", // or "domain", "did"
          "value": "192.168.1.0/24"
        },
        "protocols": ["mdns", "http-api"],
        "depth": 1
      }
    }
    ```

### **Progress Updates**
-   **Message Type**: `TASK_PROGRESS`
-   **Payload**:
    ```json
    {
      "task_name": "run_discovery_job",
      "job_id": "string (uuid of the running job)",
      "status": "running",
      "progress": "number (0-100)",
      "message": "string (e.g., 'Scanning 192.168.1.50...', 'Probing http port 80...')"
    }
    ```

### **Response: Success**
-   **Message Type**: `TASK_RESPONSE`
-   **Payload**:
    ```json
    {
      "task_name": "run_discovery_job",
      "job_id": "string (uuid of the job)",
      "status": "completed",
      "result": {
        "services_found": [
            // Array of DiscoveredService objects
        ]
      }
    }
    ```

### **Response: Error**
-   **Message Type**: `TASK_RESPONSE`
-   **Payload**:
    ```json
    {
      "task_name": "run_discovery_job",
      "job_id": "string (uuid of the job)",
      "status": "failed",
      "error": {
        "code": "string (e.g., 'INVALID_TARGET', 'SCAN_FAILED')",
        "message": "string (Detailed error message)"
      }
    }
    ``` 