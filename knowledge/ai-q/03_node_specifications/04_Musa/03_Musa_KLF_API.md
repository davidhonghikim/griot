---
title: "Musa Class: KLF Message API"
description: "KLF Message API specification for the Musa Node Class's security primitives."
---

# Musa Class KLF Message API

The Musa Class API provides generic, primitive-based KLF messages for security operations. Other services compose these primitives into higher-level authentication and authorization flows.

### 1. Authentication

#### **Request: `validate_credential`**
-   **Description**: Validates a given credential and, if successful, returns a signed Principal object.
-   **Message Type**: `TASK_REQUEST`
-   **Payload**:
    ```json
    {
      "task_name": "validate_credential",
      "params": {
        "credential": {
          "type": "w3c_vc | api_key | oidc_id_token",
          "value": "..."
        }
      }
    }
    ```
-   **Response (Success)**: `TASK_RESPONSE` with `status: "completed"` and `result: { ...Principal object... }`.
-   **Response (Error)**: `TASK_RESPONSE` with `status: "failed"` and `error: { "code": "INVALID_CREDENTIAL", ... }`.


### 2. Authorization

#### **Request: `check_permission`**
-   **Description**: Checks if a principal is allowed to perform an action on a resource.
-   **Message Type**: `DATA_QUERY`
-   **Payload**:
    ```json
    {
      "query_name": "check_permission",
      "params": {
        "principal": { ...Principal object... },
        "action": "string (e.g., 'read', 'write')",
        "resource": "string (did of the resource)"
      }
    }
    ```
-   **Response (Success)**: `DATA_RESULT` with `result: { "allowed": true | false }`.

### 3. Cryptography

#### **Request: `encrypt_payload`**
-   **Description**: Encrypts a payload for a specific recipient DID.
-   **Message Type**: `TASK_REQUEST`
-   **Payload**:
    ```json
    {
        "task_name": "encrypt_payload",
        "params": {
            "recipient_did": "did:kos:...",
            "plaintext_payload": { ... }
        }
    }
    ```
-   **Response (Success)**: `TASK_RESPONSE` with `status: "completed"` and `result: { "ciphertext": "..." }`.

#### **Request: `decrypt_payload`**
-   **Description**: Decrypts a payload using the node's private key.
-   **Message Type**: `TASK_REQUEST`
-   **Payload**:
    ```json
    {
        "task_name": "decrypt_payload",
        "params": {
            "ciphertext": "..."
        }
    }
    ```
-   **Response (Success)**: `TASK_RESPONSE` with `status: "completed"` and `result: { "plaintext_payload": { ... } }`. 