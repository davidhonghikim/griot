---
title: "Yachay Node 03: KLF API"
version: 1.0
---

# **3. Yachay Node KLF API Specification**

## 3.1. Introduction

The Yachay Node exposes its functionality to the kOS network through a well-defined Kind Link Framework (KLF) API. This API allows other nodes to store, retrieve, and manage memories in a standardized way. All communication is asynchronous and follows the KLF message-passing protocol.

The API is designed around two primary functions: writing new memories and querying existing ones.

## 3.2. KLF Message Types

The Yachay Node listens for the following KLF message types:

| Message Type              | Description                                        | Payload Interface            |
| ------------------------- | -------------------------------------------------- | ---------------------------- |
| `YACHAY_STORE_REQUEST`    | Request to store a new `MemoryFragment`.           | `YachayStoreRequest`         |
| `YACHAY_QUERY_REQUEST`    | Request to query the Long-Term Storage.            | `YachayQueryRequest`         |
| `YACHAY_DELETE_REQUEST`   | Request to delete a `MemoryTapestry` or `Fragment`.| `YachayDeleteRequest`        |

The Yachay Node will dispatch the following message types in response:

| Message Type              | Description                                        | Payload Interface            |
| ------------------------- | -------------------------------------------------- | ---------------------------- |
| `YACHAY_STORE_CONFIRM`    | Confirms a fragment was successfully stored.       | `YachayStoreConfirm`         |
| `YACHAY_QUERY_RESPONSE`   | Contains the results of a query.                   | `YachayQueryResponse`        |
| `YACHAY_DELETE_CONFIRM`   | Confirms a memory object was deleted.              | `YachayDeleteConfirm`        |
| `YACHAY_API_ERROR`        | Indicates an error occurred processing a request.  | `YachayApiError`             |

## 3.3. API Endpoint Details & Payloads

### 3.3.1. Storing Memories

**Request Message:** `YACHAY_STORE_REQUEST`

-   **Description**: A node sends this message to have Yachay record a new piece of information. The payload contains the raw content to be encoded into a `MemoryFragment`.
-   **Payload (`YachayStoreRequest`)**:
    ```typescript
    interface YachayStoreRequest {
      sourceNodeId: string;
      content: any;
      tags?: string[];
      tapestryId_suggestion?: string; // Suggest linking to an existing tapestry
    }
    ```

**Response Message:** `YACHAY_STORE_CONFIRM`

-   **Description**: Sent by Yachay upon successful creation and storage of the `MemoryFragment` in the Working Memory Store.
-   **Payload (`YachayStoreConfirm`)**:
    ```typescript
    interface YachayStoreConfirm {
      fragmentId: string;
      status: 'RECEIVED' | 'PROCESSING';
    }
    ```

### 3.3.2. Querying Memories

**Request Message:** `YACHAY_QUERY_REQUEST`

-   **Description**: A node sends this message to retrieve `MemoryTapestry` documents from Long-Term Storage. The query can be complex, combining multiple criteria.
-   **Payload (`YachayQueryRequest`)**:
    ```typescript
    interface YachayQueryRequest {
      queryId: string; // For tracking the response
      query: {
        text_search?: string;
        semantic_search?: {
          vector: Record<string, number>;
          threshold: number;
        };
        date_range?: {
          start: Date;
          end: Date;
        };
        source_nodes?: string[];
        tags?: string[];
      };
      limit?: number; // Defaults to 10
    }
    ```

**Response Message:** `YACHAY_QUERY_RESPONSE`

-   **Description**: Contains the `MemoryTapestry` objects that match the query criteria.
-   **Payload (`YachayQueryResponse`)**:
    ```typescript
    interface YachayQueryResponse {
      queryId: string;
      results: MemoryTapestry[];
    }
    ```

### 3.3.3. Deleting Memories

**Request Message:** `YACHAY_DELETE_REQUEST`

- **Description**: A privileged node (like an Archon or Mzee) can request the deletion of a memory object. This is a sensitive operation.
- **Payload (`YachayDeleteRequest`)**:
  ```typescript
  interface YachayDeleteRequest {
    target: {
      type: 'FRAGMENT' | 'TAPESTRY';
      id: string;
    };
    justification: string;
  }
  ```

**Response Message:** `YACHAY_DELETE_CONFIRM`

- **Description**: Confirms that the specified memory object has been successfully deleted.
- **Payload (`YachayDeleteConfirm`)**:
  ```typescript
  interface YachayDeleteConfirm {
    targetId: string;
    status: 'DELETED';
  }
  ```

### 3.3.4. Error Handling

**Response Message:** `YACHAY_API_ERROR`

-   **Description**: Sent in response to any request that fails.
-   **Payload (`YachayApiError`)**:
    ```typescript
    interface YachayApiError {
      requestMessageId: string;
      errorCode: 'INVALID_PAYLOAD' | 'NOT_FOUND' | 'UNAUTHORIZED' | 'INTERNAL_ERROR';
      errorMessage: string;
    }
    ``` 