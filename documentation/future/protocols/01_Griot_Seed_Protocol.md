---
title: "Griot Seed Protocol V1"
description: "A client-facing REST API for a Griot node, providing a simple gateway for OS installation, updates, and repairs. Serves as a compatibility layer for non-KLP clients."
type: "protocol_definition"
status: "current"
priority: "high"
last_updated: "2025-06-24"
related_docs: [
  "documentation/06_future/protocols/28_Klp_Core_Protocol_Specification.md",
  "documentation/04_current/architecture/04_kOS_Node_Classes.md"
]
agent_notes: "This protocol is intentionally simple (REST/JWT) to support basic clients like UIs. It abstracts the more complex KLP which handles true inter-node communication."
---

# 01: Griot Seed Protocol - V1

**Version**: 1.0.0
**Status**: Active
**Contact**: System Architect

## 1. Overview

This document defines Version 1 of the Griot Seed Protocol. This is a **client-facing REST API** exposed by a `Griot` class node. Its primary purpose is to provide a simple, secure, and accessible gateway for non-agent clients (e.g., web UIs, command-line tools) to interact with a `Griot`'s core services: installing, updating, and repairing a `kOS` instance.

This protocol is a **compatibility and convenience layer**. The core inter-node and agent-to-agent communication within `kOS` is handled by the more sophisticated, decentralized **Kind Link Protocol (KLP)**.

### 1.1. Relationship to KLP

- **Purpose**: Where KLP is a general-purpose mesh networking protocol for a society of agents, this Seed Protocol is a specialized, hierarchical API for managing the OS lifecycle.
- **Authentication**: This protocol uses a traditional JWT-over-HTTPS model for simplicity. A client authenticating here is granted temporary, scoped credentials by the `Griot` node. It does not participate directly in the KLP identity mesh.
- **Abstraction**: The Griot Seed Protocol abstracts the complexity of KLP. A request to this API may trigger the `Griot` node to perform complex actions on the KLP network on the client's behalf.

---

## 2. Authentication

Authentication uses JWT Bearer Tokens for simplicity and broad client compatibility.

**Endpoint**: `POST /api/v1/auth/login`

**Request Body**:
```json
{
  "username": "user@example.com",
  "password": "strong-password-123"
}
```

**Success Response (200 OK)**:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## 3. API Specification

All endpoints are prefixed with `/api/v1/` and are exposed by a `Griot` node.

### 3.1. Standard Error Response

In case of an error (4xx or 5xx status codes), the response body will always follow this schema:
```json
{
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "The requested service with ID 'ollama-123' does not exist.",
    "requestId": "uuid-v4-request-identifier"
  }
}
```
*(See Appendix A for a list of error codes)*

### 3.2. Endpoints

#### **Node Identity**
- **`GET /api/v1/identity`**
  - **Description**: Returns the class and version of the responding node. This allows clients to confirm they are communicating with a `Griot`.
  - **Success Response (200 OK)**:
    ```json
    {
      "class": "Griot",
      "version": "1.0.0",
      "nodeId": "unique-node-identifier"
    }
    ```

#### **Auth**
- **`POST /api/v1/auth/login`**: See Section 2.

#### **Services (Client-View)**
Used for managing the service configurations a client can interact with via this `Griot`.

- **`GET /api/v1/services`**
  - **Description**: Retrieves a list of all configured services visible to the authenticated user via this `Griot`.
  - **Success Response (200 OK)**:
    ```json
    {
      "data": [
        {
          "id": "ollama-local",
          "name": "Local Ollama",
          "type": "ollama",
          "url": "http://localhost:11434",
          "capabilities": ["llm_chat", "llm_embedding"],
          "metadata": { "createdAt": "..." }
        }
      ]
    }
    ```

- **(Other CRUD endpoints: `POST`, `PUT`, `DELETE` on `/api/v1/services/{serviceId}`)**

#### **Proxy**
Routes client requests to backend AI services *through the Griot node*.

- **`POST /api/v1/proxy/{serviceId}/{...}`**
  - **Description**: Proxies a request to the specified path on a backend service. The `Griot` handles authentication and logging before forwarding.

#### **Jobs (Asynchronous Operations)**
For tasks that take more than a few seconds.

- **`GET /api/v1/jobs/{jobId}`**
  - **Description**: Polls the status of a long-running job (e.g., an OS update).

---

## Appendix A: Error Codes

| Code                    | Meaning                                       |
| ----------------------- | --------------------------------------------- |
| `INVALID_REQUEST`       | The request body is malformed or invalid.     |
| `UNAUTHENTICATED`       | The JWT is missing, invalid, or expired.      |
| `PERMISSION_DENIED`     | The user is not authorized for this action.   |
| `RESOURCE_NOT_FOUND`    | The specified resource (service, job) doesn't exist. |
| `SERVICE_UNAVAILABLE`   | The proxied backend service is down.          |
| `INTERNAL_SERVER_ERROR` | An unexpected error occurred on the server.   |
| `QUOTA_EXCEEDED`        | The user has exceeded their usage quota.      |

---

## Appendix B: Data Structures

### Service
```typescript
interface Service {
  id: string;
  name: string;
  type: 'ollama' | 'openai' | 'comfyui' | 'custom';
  url: string;
  capabilities: ('llm_chat' | 'llm_embedding' | 'image_generation')[];
  metadata: {
    createdAt: string;
    updatedAt: string;
  };
}
```

### Job
```typescript
interface Job {
  jobId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  result?: any;
  error?: {
    code: string;
    message: string;
  };
  metadata: {
    createdAt: string;
    completedAt?: string;
  };
}
```