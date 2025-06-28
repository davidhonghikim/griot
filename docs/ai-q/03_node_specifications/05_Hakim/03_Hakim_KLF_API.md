---
title: "Hakim Class: KLF Message API"
description: "KLF Message API specification for the Hakim Node Class's health and maintenance services."
---

# Hakim Class KLF Message API

The Hakim Class API exposes its diagnostic and repair capabilities via the Kind Link Framework.

### 1. Health Diagnostics

#### **Request: `get_health_report`**
-   **Description**: Requests a new, up-to-date health report for a specific node.
-   **Message Type**: `DATA_QUERY`
-   **Payload**:
    ```json
    {
      "query_name": "get_health_report",
      "params": {
        "target_node_did": "did:kos:griot:123"
      }
    }
    ```
-   **Response (Success)**: `DATA_RESULT` with `result: { ...HealthReport object... }`.
-   **Response (Error)**: `DATA_RESULT` with `error: { "code": "DIAGNOSTIC_FAILED", ... }`.

### 2. Maintenance Tasks

#### **Request: `request_maintenance`**
-   **Description**: Submits a request to perform a maintenance task on a node. This initiates a job that requires owner approval before running.
-   **Message Type**: `TASK_REQUEST`
-   **Payload**:
    ```json
    {
      "task_name": "request_maintenance",
      "params": {
        "target_node_did": "did:kos:griot:123",
        "maintenance_task": "restart_service",
        "task_params": {
            "service_name": "griot-api"
        }
      }
    }
    ```
-   **Response (Success)**: `TASK_RESPONSE` with `status: "completed"` and `result: { "job_id": "...", "job_status": "PendingApproval" }`.

#### **Request: `approve_maintenance_job`**
-   **Description**: Sent by a node owner to approve a pending maintenance job.
-   **Message Type**: `CONTROL_COMMAND`
-   **Payload**:
    ```json
    {
      "command_name": "approve_maintenance_job",
      "params": {
        "job_id": "..."
      }
    }
    ```
-   **Response**: No direct response is expected, but the `MaintenanceJob` status will be updated, and progress messages will be emitted.

---
*Note: Progress updates for the maintenance job (`TASK_PROGRESS`) and the final result (`TASK_RESPONSE`) will be sent asynchronously to the original requester after the job is approved and executed.* 