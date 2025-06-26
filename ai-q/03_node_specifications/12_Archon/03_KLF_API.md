---
title: "Archon Node 03: KLF API"
version: 1.0
---

# **3. Archon Node KLF API Specification**

## 3.1. Introduction

The Archon Node's KLF API is primarily concerned with receiving high-level `Directives` and reporting on their final status. Unlike other nodes, its main function is not to respond to queries, but to *initiate* messages to other nodes as part of executing a `WorkflowPlan`.

## 3.2. Inbound KLF Messages

The Archon Node listens for one primary message type:

| Message Type          | Description                               | Payload Interface       |
| --------------------- | ----------------------------------------- | ----------------------- |
| `ARCHON_SUBMIT_DIRECTIVE` | Submits a new high-level `Directive` for execution. | `Directive`             |

## 3.3. Outbound KLF Messages

The Archon Node is a major *producer* of KLF messages. It can, in principle, send any message defined by another node's API. For example, it will send `YACHAY_QUERY_REQUEST` to Yachay, `SACHEM_PROPOSE_CLAIM` to Sachem, and so on, as defined by the `Tasks` in its `WorkflowPlan`.

It also dispatches messages to report the final outcome of a `Directive`.

| Message Type          | Description                                        | Payload Interface           |
| --------------------- | -------------------------------------------------- | --------------------------- |
| `ARCHON_DIRECTIVE_COMPLETE` | Announces the successful completion of a directive.    | `ArchonDirectiveComplete`   |
| `ARCHON_DIRECTIVE_FAILED`   | Announces the failure of a directive.              | `ArchonDirectiveFailed`     |
| `ARCHON_API_ERROR`        | Indicates an error processing a directive submission. | `ArchonApiError`            |


## 3.4. API Endpoint Details & Payloads

### 3.4.1. Submitting a Directive

**Request Message:** `ARCHON_SUBMIT_DIRECTIVE`

-   **Description**: A user or another high-level node sends this message to command the kOS swarm to achieve a goal.
-   **Payload (`Directive`)**: The full `Directive` data model as defined in `02_Data_Models.md`.

### 3.4.2. Reporting Directive Completion

**Dispatch Message:** `ARCHON_DIRECTIVE_COMPLETE`

-   **Description**: Sent by the Archon's Reporting Engine back to the original requesting entity upon the successful completion of a `WorkflowPlan`.
-   **Payload (`ArchonDirectiveComplete`)**:
    ```typescript
    interface ArchonDirectiveComplete {
      /**
       * @property {string} directiveId - The ID of the original directive.
       */
      directiveId: string;

      /**
       * @property {'SUCCESS'} status - The final status.
       */
      status: 'SUCCESS';

      /**
       * @property {any} finalResult - The synthesized final result that fulfills the directive.
       */
      finalResult: any;

      /**
       * @property {Date} completionTimestamp - The ISO 8601 timestamp of completion.
       */
      completionTimestamp: Date;
    }
    ```

### 3.4.3. Reporting Directive Failure

**Dispatch Message:** `ARCHON_DIRECTIVE_FAILED`

-   **Description**: Sent if the `WorkflowPlan` fails and cannot be recovered by the Failure Handler.
-   **Payload (`ArchonDirectiveFailed`)**:
    ```typescript
    interface ArchonDirectiveFailed {
      /**
       * @property {string} directiveId - The ID of the original directive.
       */
      directiveId: string;

      /**
       * @property {'FAILED'} status - The final status.
       */
      status: 'FAILED';

      /**
       * @property {string} reason - A human-readable explanation of why the directive failed.
       */
      reason: string;

      /**
       * @property {string} failedTaskId - The ID of the specific task that caused the failure.
       */
      failedTaskId: string;
    }
    ```
### 3.4.4. Error Handling

**Response Message:** `ARCHON_API_ERROR`

-   **Description**: Sent in response to an invalid `ARCHON_SUBMIT_DIRECTIVE` message.
-   **Payload (`ArchonApiError`)**:
    ```typescript
    interface ArchonApiError {
      requestMessageId: string;
      errorCode: 'INVALID_DIRECTIVE' | 'PLANNING_FAILED';
      errorMessage: string;
    }
    ``` 