---
title: "Oracle Class: KLF Message API"
description: "KLF Message API specification for the Oracle Node Class's asynchronous query service."
---

# Oracle Class KLF Message API

The Oracle Class API is job-based. Clients submit a complex query and receive progress and final results asynchronously.

### **Request: `submit_query`**
-   **Description**: Submits a query to the Oracle for asynchronous execution.
-   **Message Type**: `TASK_REQUEST`
-   **Payload**:
    ```json
    {
      "task_name": "submit_query",
      "params": {
        "query_string": "SELECT LATEST 10 FROM 'griot:articles' WHERE 'topic' == 'AI' RETURN 'title', 'author'",
        "dsl_version": "1.0"
      }
    }
    ```
-   **Response (Immediate)**: `TASK_RESPONSE` with `status: "completed"` and `result: { "job_id": "...", "job_status": "pending" }`. This acknowledges the query has been accepted.

### **Progress Updates**
-   **Description**: The Oracle sends progress updates to the requester as it executes the query plan.
-   **Message Type**: `TASK_PROGRESS`
-   **Payload**:
    ```json
    {
      "task_name": "submit_query",
      "job_id": "string (uuid of the running job)",
      "status": "running",
      "progress": "number (0-100)",
      "message": "string (e.g., 'Executing sub-query against griot:123', 'Fusing results...')"
    }
    ```

### **Final Response: Success**
-   **Description**: The final, rich response containing the results and the explanation. This is sent as a separate message upon job completion.
-   **Message Type**: `TASK_RESPONSE`
-   **Payload**:
    ```json
    {
      "task_name": "submit_query",
      "job_id": "string (uuid of the job)",
      "status": "completed",
      "result": {
        // ... a full QueryResponse object ...
      }
    }
    ```

### **Final Response: Error**
-   **Description**: Sent if the query fails during execution.
-   **Message Type**: `TASK_RESPONSE`
-   **Payload**:
    ```json
    {
      "task_name": "submit_query",
      "job_id": "string (uuid of the job)",
      "status": "failed",
      "error": {
        "code": "string (e.g., 'QUERY_PARSE_ERROR', 'DATA_SOURCE_UNAVAILABLE')",
        "message": "string (Detailed error message)"
      }
    }
    ``` 