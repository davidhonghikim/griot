# AI-Q Protocol - V1

**Version**: 1.0.0
**Status**: Active
**Contact**: System Architect

## 1. Overview

This document defines Version 1 of the AI-Q Protocol, the core communication standard for `kOS`. `kOS` is a service-oriented operating system powered by the `ai-q` knowledge library and served by a `griot` node. The protocol enables secure, high-performance interaction between clients (UIs, agents) and a `griot` node.

The protocol is built on the following core principles:

- **Explicit Versioning**: All endpoints are versioned to ensure backward compatibility and graceful evolution.
- **Secure by Default**: All endpoints (except login) require authentication. The design anticipates future cryptographic identity.
- **Asynchronous First**: Long-running operations do not block. They return immediately with a job identifier for status tracking.
- **Standardized Schemas**: All data structures, including errors, follow a predictable and strictly defined JSON schema.
- **Proxy-First Architecture**: All interactions with external AI services are proxied through the gateway, creating a single point of control for security, logging, and abstraction.

---

## 2. Authentication

Authentication is the gateway to the system. The V1 implementation uses JWT for session management, with a clear upgrade path to cryptographic signing for agent-based interaction.

### 2.1. V1 Authentication: JWT Bearer Tokens

The client authenticates to receive a short-lived JSON Web Token (JWT), which must be included in the `Authorization` header for all subsequent requests.

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

**JWT Claims**:
The JWT payload will contain the following claims:
- `sub` (Subject): The unique ID of the user or agent.
- `roles`: An array of strings defining the user's roles (e.g., `["user", "service:read"]`).
- `iat` (Issued At): Timestamp of when the token was issued.
- `exp` (Expiration Time): Timestamp for when the token expires (e.g., 15 minutes).

### 2.2. Future-Proofing: Cryptographic Agent Identity

For agents, password-based authentication is insufficient. The protocol anticipates a future V2 authentication method based on public/private key cryptography.

**Anticipated Flow (`/api/v2/auth/challenge`):**
1. An agent makes a request with its public key (or `agentId`).
2. The server responds with a unique, single-use `challenge` string.
3. The agent signs the `challenge` with its private key and sends it back to a `/api/v2/auth/verify` endpoint.
4. The server verifies the signature with the agent's public key and issues a JWT, potentially embedding the public key hash in the claims for stateless request verification.
5. For critical operations, subsequent API requests would require a signature in a custom header (e.g., `X-Request-Signature`), creating a non-repudiable audit trail.

---

## 3. API Specification

All endpoints must be prefixed with `/api/v1/`.

### 3.1. Standard Headers

- **`Authorization`**: `Bearer <accessToken>` (Required for all endpoints except `/login`)
- **`Content-Type`**: `application/json`

### 3.2. Standard Error Response

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

### 3.3. Endpoints

#### **Auth**
- **`POST /api/v1/auth/login`**: See Section 2.1.

#### **Services**
Used for managing service configurations (e.g., connections to OpenAI, Ollama).

- **`GET /api/v1/services`**
  - **Description**: Retrieves a list of all configured services for the authenticated user.
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

- **`POST /api/v1/services`**
  - **Description**: Adds a new service configuration.
  - **Request Body**: The service object without the `id` or `metadata`.
  - **Success Response (201 Created)**: The full service object, including the new `id`.

- **`PUT /api/v1/services/{serviceId}`**
  - **Description**: Updates an existing service configuration.
  - **Success Response (200 OK)**: The updated service object.

- **`DELETE /api/v1/services/{serviceId}`**
  - **Description**: Deletes a service configuration.
  - **Success Response (204 No Content)**.

#### **Proxy**
Routes requests to backend AI services. This is the primary endpoint for AI interactions.

- **`POST /api/v1/proxy/{serviceId}/{...}`**
  - **Description**: Proxies a request to the specified path on the backend service. Handles both standard request/response and streaming.
  - **Behavior**:
    1. The gateway verifies the user has permission to access `{serviceId}`.
    2. It forwards the request body and headers to the service's base URL.
    3. For LLM chat, if the client requests streaming, the gateway will stream the response back chunk-by-chunk using Server-Sent Events (SSE) or a similar mechanism.
    4. It logs the request and response for auditing.

#### **Jobs (Asynchronous Operations)**
For tasks that take more than a few seconds.

- **Initiating a Job**: A long-running request (e.g., `POST /api/v1/proxy/sd-forge/generate-image`) will immediately return:
  - **Status**: `202 Accepted`
  - **Body**:
    ```json
    {
      "jobId": "job-uuid-12345",
      "status": "pending",
      "pollUrl": "/api/v1/jobs/job-uuid-12345"
    }
    ```

- **`GET /api/v1/jobs/{jobId}`**
  - **Description**: Polls the status of a long-running job.
  - **Success Response (200 OK)**:
    ```json
    {
      "jobId": "job-uuid-12345",
      "status": "completed", // or 'running', 'failed'
      "result": {
        //... job output ...
      },
      "error": null // or error details if failed
    }
    ```

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
  apiKey?: string; // Stored securely on the backend, not returned to client
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