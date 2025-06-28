---
title: "Kind Link Framework (KLF) Specification: The kOS Nervous System"
description: "Technical specification for the kOS inter-node communication Framework, the 'nervous system' of the digital organism."
type: "Framework"
status: "proposal"
priority: "critical"
last_updated: "2025-06-25"
version: "2.1.0"
agent_notes: "Refactored to frame KLF as the 'nervous system' and its authentication as an 'immune response,' completing the biological metaphor."
---

# Kind Link Framework (KLF) Specification: The kOS Nervous System

## 1. Overview

The Kind Link Framework (KLF) is the **nervous system** of the kOS ecosystem. It is the mandatory communication Framework that allows individual **cells (nodes)** to form **tissues, organs, and complex organisms (federations)**. It ensures secure, interoperable communication, enabling coordinated action and shared sensation across the entire digital lifeform.

-   **Transport:** Secure HTTP (HTTPS) - The medium for nerve signals.
-   **Message Format:** JSON-RPC 2.0 - The structure of a nerve impulse.
-   **Authentication:** Cryptographic Signatures (Ed25519) - The cellular immune response.

## 2. Authentication: The Immune Response (Self/Non-Self Recognition)

Every KLF request must be authenticated. This functions as a cellular **immune response**, allowing a node to instantly recognize signals from "self" (other nodes sharing the same core DNA) versus "non-self" (foreign or potentially malicious actors).

### 2.1. Cellular Identity (Genetic Markers)

Each kOS cell (node) MUST have a unique Decentralized Identifier (DID) and an associated Ed25519 key pair, which acts as its unique genetic marker.
-   **Example DID:** `did:kos:griot:a1b2c3d4e5f6...`

### 2.2. Request Signing (Sending a Nerve Impulse)
All KLF requests must include two custom HTTP headers:
-   `X-KOS-Node-ID`: The DID of the sending cell.
-   `X-KOS-Signature`: A signature of the nerve impulse (request body).

The signing process ensures that the nerve impulse is authentic and has not been tampered with in transit.

### 2.3. Request Verification (Receiving a Nerve Impulse)
The receiving cell's "immune system" MUST perform the following steps:
1.  Identify the sending cell via `X-KOS-Node-ID`.
2.  Retrieve the cell's public key (its known genetic marker).
3.  Verify the signature of the impulse.
4.  If verification fails, the immune system rejects the impulse with a `401 Unauthorized` error, preventing a foreign signal from affecting the cell.

## 3. Core KLF Methods (Nerve Signals)

All kOS cells MUST be able to send and receive these fundamental nerve signals.

### `KLF_ping`
A simple "are you alive?" signal.
-   **Params:** `null`
-   **Result:** `{ "status": "pong", "timestamp": "..." }`

### `KLF_getIdentity`
Requests the full genetic identity of another cell.
-   **Params:** `null`
-   **Result:** The full Node Identity JSON object, including its `hierosCodex` hash. This is the core of the immune recognition system.

### `KLF_getCapabilities`
Asks another cell, "What is your specialized function?"
-   **Params:** `context` (Object, Optional): The reason for asking.
-   **Result:** An object listing the cell's functions (e.g., `replication`, `data_curation`).

### `KLF_proposeFederation`
The signal to initiate the formation of a new "tissue" or "organ."
-   **Params:** Details of the proposed federation.
-   **Result:** A status indicating if the proposal is being considered.

**Note on Tissue Formation:** The receiving cell will first call `KLF_getIdentity` on the proposing cell. If the `hierosCodex` hash does not match its own, the immune system may automatically reject the federation attempt, recognizing the other cell as genetically incompatible. 