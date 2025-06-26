---
title: "Hakim Class: Data Models"
description: "Data models for the Hakim Node Class, including HealthReport and MaintenanceJob."
---

# Hakim Class Data Models

### 1. HealthReport
A structured snapshot of a node's health at a specific point in time. This is the primary data asset produced by the Diagnostic Engine.

```json
{
  "report_id": "string (uuid)",
  "target_node_did": "string (did:kos:...)",
  "timestamp": "string (ISO 8601 timestamp)",
  "status": "Healthy | Warning | Error | Unknown",
  "metrics": {
    "cpu_usage_percent": "number",
    "memory_usage_mb": "number",
    "disk_usage_gb": "number",
    "network_io_kbps": "number"
  },
  "dependencies": [
    {
      "dependency_did": "string (did:kos:...)",
      "status": "Healthy | Unreachable"
    }
  ],
  "logs_summary": {
    "error_count": "number",
    "warning_count": "number"
  },
  "diagnosis": {
    "code": "string (e.g., 'HIGH_CPU_LOAD', 'DISK_NEARING_CAPACITY')",
    "recommendation": "string (e.g., 'Consider restarting service XYZ', 'Recommend archiving old data')"
  }
}
```

### 2. MaintenanceJob
Represents an asynchronous task for the Hakim's Repair & Maintenance Service.

```json
{
  "job_id": "string (uuid)",
  "target_node_did": "string (did:kos:...)",
  "requester_did": "string (did:kos:...)",
  "task_name": "string (e.g., 'restart_service', 'apply_software_update')",
  "params": {
    "service_name": "string (optional)",
    "update_url": "string (optional)"
  },
  "status": "PendingApproval | Approved | Running | Completed | Failed | Rejected",
  "status_history": [
    {
      "status": "PendingApproval",
      "timestamp": "string (ISO 8601 timestamp)",
      "message": "Awaiting approval from node owner."
    }
  ],
  "created_at": "string (ISO 8601 timestamp)",
  "completed_at": "string (ISO 8601 timestamp, optional)"
}
``` 