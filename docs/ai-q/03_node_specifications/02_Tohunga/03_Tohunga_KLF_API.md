---
title: "Tohunga Class: KLF Message API"
description: "KLF Message API specification for the Tohunga Node Class's services."
---

# Tohunga Class KLF Message API

Communication with the Tohunga node is handled via the asynchronous, job-based KLF protocol.

### 1. Manage DataSources

#### **Request: `register_data_source`**
-   **Message Type**: `TASK_REQUEST`
-   **Payload**:
    ```json
    {
      "task_name": "register_data_source",
      "params": {
        "source_name": "GitHub Public API",
        "source_type": "http_api",
        "connection_config": {
          "base_url": "https://api.github.com"
        }
      }
    }
    ```
-   **Response (Success)**: `TASK_RESPONSE` with `status: "completed"` and `result: { "source_id": "..." }`.

#### **Request: `get_data_source`**
-   **Message Type**: `DATA_QUERY`
-   **Payload**: `{ "query_name": "get_data_source", "params": { "source_id": "..." } }`
-   **Response (Success)**: `DATA_RESULT` with `result: { ...DataSource object... }`.

### 2. Manage AcquisitionJobs

This service runs a data acquisition and transformation pipeline.

#### **Request: `run_acquisition_job`**
-   **Message Type**: `TASK_REQUEST`
-   **Payload**:
    ```json
    {
      "task_name": "run_acquisition_job",
      "params": {
        "source_id": "string (uuid of the DataSource to use)",
        "request_params": {
          "path": "/events"
        },
        "pipeline_steps": [
          {
            "step_module": "json_schema",
            "definition": { "type": "object", ... }
          }
        ],
        "output_config": { ... }
      }
    }
    ```

#### **Progress Updates**
-   **Message Type**: `TASK_PROGRESS`
-   **Payload**:
    ```json
    {
      "task_name": "run_acquisition_job",
      "job_id": "string (uuid of the running job)",
      "status": "running",
      "progress": "number (0-100)",
      "message": "string (e.g., 'Fetching data from source...', 'Executing validation step...', 'Writing to output...')"
    }
    ```

#### **Response: Success**
-   **Message Type**: `TASK_RESPONSE`
-   **Payload**:
    ```json
    {
      "task_name": "run_acquisition_job",
      "job_id": "string (uuid of the job)",
      "status": "completed",
      "result": {
        "result_uri": "s3://my-data-assets/...",
        "records_processed": 1000
      }
    }
    ```

#### **Response: Error**
-   **Message Type**: `TASK_RESPONSE`
-   **Payload**:
    ```json
    {
      "task_name": "run_acquisition_job",
      "job_id": "string (uuid of the job)",
      "status": "failed",
      "error": {
        "code": "string (e.g., 'SOURCE_UNREACHABLE', 'VALIDATION_FAILED', 'OUTPUT_WRITE_ERROR')",
        "message": "string (Detailed error message from the failed pipeline step)"
      }
    }
    ``` 