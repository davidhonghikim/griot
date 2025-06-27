---
title: "Archon Node 04: Database Schema"
version: 1.0
---

# **4. Archon Node Database Schema**

## 4.1. Introduction

The Archon Node's primary persistence need is to store the state of its `WorkflowPlan` objects. This allows the Archon to be stateless and resilient; if the node restarts, it can reload all active plans from the database and resume orchestration. A document-oriented database like MongoDB is a natural fit for storing these complex, nested plan objects.

## 4.2. MongoDB Collections

### 4.2.1. `workflow_plans` Collection

This is the sole collection required by the Archon Node. It holds all `WorkflowPlan` documents, whether they are pending, running, or have reached a final state.

-   **Document Structure**: The structure of the documents in this collection directly maps to the `WorkflowPlan` interface defined in `02_Data_Models.md`. The entire plan, including the full array of nested `Task` objects, is stored as a single document.

    ```json
    {
      "_id": "<ObjectId>",
      "planId": "<UUID>",
      "status": "PENDING" | "RUNNING" | "COMPLETE" | "FAILED",
      "tasks": [
        {
          "taskId": "task-01",
          "dependencies": [],
          "status": "PENDING" | "READY" | "RUNNING" | "COMPLETE" | "FAILED",
          "targetNodeId": "Yachay-01",
          "klfMessage": "YACHAY_QUERY_REQUEST",
          "payload": { ... },
          "result": { ... }
        },
        {
          "taskId": "task-02",
          "dependencies": ["task-01"],
          "status": "PENDING",
          "targetNodeId": "Hakim-01",
          "klfMessage": "ANALYZE_DATA",
          "payload": { ... },
          "result": null
        }
      ]
    }
    ```

### 4.2.2. Indexes on `workflow_plans` Collection

To ensure efficient operation, the following indexes are required:

1.  **Plan ID Index**:
    -   **Field**: `planId`
    -   **Type**: `UNIQUE`
    -   **Purpose**: Ensures uniqueness and provides fast lookup of a specific workflow plan.

2.  **Status Index**:
    -   **Field**: `status`
    -   **Type**: `STANDARD`
    -   **Purpose**: Allows the Archon's main loop to quickly find all plans that are currently in the `RUNNING` state, so it can monitor their progress.

3.  **Task Status Index**:
    -   **Field**: `tasks.status`
    -   **Type**: `MULTICLASS`
    -   **Purpose**: This is a more advanced index that allows for efficiently finding all plans that contain tasks with a specific status (e.g., find all plans with `tasks.status` of `READY` to be dispatched). This is critical for the Task Dispatcher's performance. 