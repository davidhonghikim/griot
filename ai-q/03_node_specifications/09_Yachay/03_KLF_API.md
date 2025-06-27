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

### **3.3.1. Store a New Memory Fragment**

A node sends this message to have Yachay record a new piece of information. The payload contains the raw content to be encoded into a `MemoryFragment`.

-   **Request Message**: `YACHAY_STORE_REQUEST`
-   **Payload (`YachayStoreRequest`)**:
    ```typescript
    export interface YachayStoreRequest {
      // A unique ID provided by the client to correlate this request with a response.
      requestId: string;
      // The raw data payload of the memory. Can be any serializable format.
      content: any;
      // Optional list of preliminary keywords or tags.
      tags?: string[];
    }
    ```
-   **Response Message**: `YACHAY_STORE_RESPONSE`
-   **Payload (`YachayStoreResponse`)**:
    ```typescript
    export interface YachayStoreResponse {
      // The unique ID of the original request.
      requestId: string;
      // The unique ID of the newly created and stored MemoryFragment.
      fragmentId: string;
      // The status of the ingestion.
      status: 'RECEIVED';
    }
    ```

### **3.3.2. Retrieve a Memory by ID**

Retrieves a single `MemoryTapestry` or `MemoryFragment` by its unique identifier.

-   **Request Message**: `YACHAY_RETRIEVE_REQUEST`
-   **Payload (`YachayRetrieveRequest`)**:
    ```typescript
    export interface YachayRetrieveRequest {
      requestId: string;
      memoryId: string;
    }
    ```
-   **Response Message**: `YACHAY_RETRIEVE_RESPONSE`
-   **Payload (`YachayRetrieveResponse`)**:
    ```typescript
    export interface YachayRetrieveResponse {
      requestId: string;
      // The found memory object, or null if not found.
      memory: MemoryTapestry | MemoryFragment | null;
    }
    ```

### **3.3.3. Query Memories**

Executes a complex search against the Long-Term Storage based on a structured query.

-   **Request Message**: `YACHAY_QUERY_REQUEST`
-   **Payload (`YachayQueryRequest`)**: This interface uses the `MemoryQuery` data model.
    ```typescript
    export interface YachayQueryRequest {
      requestId: string;
      query: MemoryQuery;
    }
    ```
-   **Response Message**: `YACHAY_QUERY_RESPONSE`
-   **Payload (`YachayQueryResponse`)**: This interface uses the `QueryResult` data model.
    ```typescript
    export interface YachayQueryResponse {
      requestId: string;
      result: QueryResult;
    }
    ```

### **3.3.4. Delete a Memory**

A privileged node can request the deletion of a memory object. This is a sensitive, audited operation.

-   **Request Message**: `YACHAY_DELETE_REQUEST`
-   **Payload (`YachayDeleteRequest`)**:
  ```typescript
    export interface YachayDeleteRequest {
      requestId: string;
      memoryId: string;
    justification: string;
  }
  ```
-   **Response Message**: `YACHAY_DELETE_RESPONSE`
-   **Payload (`YachayDeleteResponse`)**:
  ```typescript
    export interface YachayDeleteResponse {
      requestId: string;
      memoryId: string;
      status: 'DELETED' | 'DELETE_FAILED';
      message?: string;
  }
  ```

---

## **4. API Usage Examples (JSON)**

### **Example 1: Storing a simple log message**

**Request:**
```json
{
  "header": {
    "messageType": "YACHAY_STORE_REQUEST",
    "from": "did:kos:hakim:123",
    "to": "did:kos:yachay:master"
  },
  "payload": {
    "requestId": "req-001",
    "content": {
      "level": "info",
      "message": "Node did:kos:griot:abc completed artifact generation job-456."
    },
    "tags": ["system_log", "griot", "artifact_generation"]
  }
}
```

**Response:**
```json
{
  "header": {
    "messageType": "YACHAY_STORE_RESPONSE",
    "from": "did:kos:yachay:master",
    "to": "did:kos:hakim:123"
  },
  "payload": {
    "requestId": "req-001",
    "fragmentId": "f-a1b2c3d4-e5f6-7890-1234-567890abcdef",
    "status": "RECEIVED"
  }
}
```

### **Example 2: Performing a complex query**

**Request:**
```json
{
  "header": {
    "messageType": "YACHAY_QUERY_REQUEST",
    "from": "did:kos:archon:789",
    "to": "did:kos:yachay:master"
  },
  "payload": {
    "requestId": "req-002",
    "query": {
      "operator": "AND",
      "filters": [
        { "field": "tags", "op": "contains", "value": "system_log" },
        { "field": "content.message", "op": "contains", "value": "griot" },
        { "field": "timestamp", "op": "gte", "value": "2025-01-01T00:00:00Z" }
      ],
      "limit": 10
    }
  }
}
```

**Response:**
```json
{
  "header": {
    "messageType": "YACHAY_QUERY_RESPONSE",
    "from": "did:kos:yachay:master",
    "to": "did:kos:archon:789"
  },
  "payload": {
    "requestId": "req-002",
    "result": {
      "tapestries": [
        // Array of MemoryTapestry objects...
      ],
      "metadata": {
        "queryId": "q-987xyz",
        "executionTimeMs": 42,
        "totalHits": 1,
        "limitApplied": false
      }
    }
  }
}
```
---

## **5. Error Handling Details**

When a request fails, Yachay returns a `YACHAY_API_ERROR` message.

- **Payload (`YachayApiError`)**:
    ```typescript
    export interface YachayApiError {
      // The unique ID of the original request that failed.
      requestId: string;
      // A specific error code from the architecture's error table.
      errorCode: 'ERR_INGEST_VALIDATION' | 'ERR_LTS_UNAVAILABLE' | 'ERR_QUERY_EXECUTION' | 'ERR_ACL_VIOLATION' | 'NOT_FOUND' | 'INTERNAL_ERROR';
      // A human-readable message describing the error.
      message: string;
    }
    ```
- **Example Error Response:**
  ```json
  {
    "header": {
      "messageType": "YACHAY_API_ERROR",
      "from": "did:kos:yachay:master",
      "to": "did:kos:archon:789"
    },
    "payload": {
      "requestId": "req-003",
      "errorCode": "ERR_ACL_VIOLATION",
      "message": "Access denied. Node did:kos:archon:789 does not have read permission for memory t-1a2b3c."
    }
    }
    ``` 