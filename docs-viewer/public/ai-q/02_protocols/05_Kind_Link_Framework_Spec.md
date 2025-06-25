---
title: "Kind Link Framework (KLF) Specification: The kOS Nervous System"
description: "Detailed specification for KLF, the mandatory communication framework that functions as the nervous system of the kOS ecosystem."
type: "specification"
status: "canonical"
priority: "critical"
last_updated: "2025-06-25"
version: "1.0.0"
agent_notes: "Refactored to frame KLF as the 'nervous system' and its authentication as an 'immune response,' completing the biological metaphor."
---

# Kind Link Framework (KLF) Specification: The kOS Nervous System

## 1. Overview: The Nerves of the Organism

The Kind Link Framework (KLF) is the **nervous system** of the kOS ecosystem. It is the mandatory communication framework that allows individual **cells (nodes)** to form **tissues, organs, and complex organisms (federations)**.

It is not merely a protocol, but a complete framework for secure, authenticated, and ethically-aware communication.

## 2. Authentication: The Immune Response

Every KLF request must be authenticated. This functions as a cellular **immune response**, allowing a node to instantly recognize signals from "self" (other nodes sharing the same core DNA) versus "non-self" (untrusted or foreign entities).

### HTTP Header Requirements
All KLF requests must include two custom HTTP headers:

-   `X-KOS-Identity`: The DID of the requesting node (e.g., `did:kos:griot:a1b2c3d4`).
-   `X-KOS-Signature`: An Ed25519 signature of the request body, signed by the private key corresponding to the `X-KOS-Identity`.

The receiving node **must** perform a cryptographic lookup to verify the signature, ensuring the request is authentic.

## 3. Core KLF Methods (Nerve Signals)

These are the fundamental "nerve signals" that all nodes must support for basic interoperability.

### `klf_ping`
-   **Description**: A simple health check to confirm a node is alive and responding.
-   **Request**: Empty body.
-   **Response**: `{ "status": "alive", "timestamp": "...", "nodeId": "..." }`

### `klf_getIdentity`
-   **Description**: Fetches the complete identity document of the node.
-   **Request**: Empty body.
-   **Response**: The node's full JSON identity document, including its HIEROS codex signature.

### `klf_getCapabilities`
-   **Description**: Asks a node what services it provides.
-   **Request**: Empty body.
-   **Response**: A list of available services, their endpoints, and required permissions.

### `klf_proposeFederation`
-   **Description**: Initiates a request to form a federation with another node.
-   **Request**: `{ "proposal": "...", "expires": "..." }`
-   **Response**: `{ "status": "considering" }`
-   **Note on Tissue Formation:** The receiving cell will first call `klf_getIdentity` on the proposing cell. If the `hierosCodex` hash does not match its own, the immune system may automatically reject the federation attempt, recognizing the other cell as genetically incompatible. 