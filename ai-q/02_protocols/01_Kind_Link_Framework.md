---
title: "Kind Link Framework (KLF) Specification"
description: "The foundational communication framework for the kOS ecosystem"
type: "protocol"
status: "canonical"
priority: "critical"
last_updated: "2025-01-28"
version: "1.0.0"
---

# Kind Link Framework (KLF) Specification

## 🎯 Overview

The Kind Link Framework (KLF) is the foundational communication standard that enables all kOS nodes to discover, authenticate, and collaborate with each other regardless of their class, implementation language, or hosting environment.

It is a **protocol-agnostic framework**, meaning it defines the *structure* and *rules* of communication, but can be implemented over various transport layers like HTTP/2, WebSockets, or QUIC. This ensures maximum flexibility and future-proofing.

### Core Principles
1. **Service-Oriented**: All interactions are modeled as service requests and responses.
2. **Secure by Default**: All messages are cryptographically signed and verified.
3. **Covenant Aware**: Every message is implicitly validated against the HIEROS Codex.
4. **Interoperable**: Standardized message formats ensure seamless communication.
5. **Discoverable**: Built-in mechanisms for node discovery and capability negotiation.

## 🏗️ System Architecture

```
🏛️ KLF FRAMEWORK STACK
├── 🤝 Application Layer (Service Calls)
├── 🛡️ Security Layer (Authentication & HIEROS)
├── 📦 Message Layer (Standardized Formats)
├── 📡 Transport Layer (HTTP/2, WebSockets)
└── 🌐 Network Layer (IP, mDNS, DHT)
```

## 🔐 Security & Authentication

### 1. Cryptographic Identity
Every kOS node **must** have a public/private key pair (e.g., Ed25519) that serves as its permanent, verifiable identity. The public key is used to derive the node's unique Decentralized Identifier (DID).

### 2. Signed Messages
Every message sent over the KLF **must** be signed by the sender's private key. The recipient **must** verify the signature against the sender's public key. This ensures both message integrity (it wasn't tampered with) and authenticity (it came from who it says it came from).

### 3. HIEROS Codex Validation
Before processing any request, a node **must** validate the sender's identity against the HIEROS Codex. This involves checking that the sender's identity document includes a valid, unrevoked signature of the canonical HIEROS Codex hash. This is the "genetic handshake" that establishes mutual trust.

### 4. Transport Layer Security (TLS)
All communication over public networks **must** be encrypted using TLS 1.3 or higher to ensure confidentiality.

## 📦 Message Format

All KLF messages share a common structure:

```json
{
  "klf": {
    "version": "1.0.0",
    "timestamp": "2025-01-28T10:00:00Z"
  },
  "sender": {
    "did": "did:kos:griot:a1b2c3d4",
    "signature": "..."
  },
  "recipient": {
    "did": "did:kos:tohunga:e5f6g7h8"
  },
  "payload": {
    "type": "service_request",
    "service": "knowledge.curate",
    "body": {
      "source_url": "https://example.com/data",
      "curation_level": "deep"
    }
  }
}
```

### Key Fields
- **`klf`**: Contains metadata about the KLF version.
- **`sender`**: The DID of the sending node and the signature of the `payload`.
- **`recipient`**: The DID of the target node.
- **`payload`**: The actual content of the message.
  - **`type`**: The type of message (e.g., `service_request`, `service_response`, `discovery_query`).
  - **`service`**: For service requests, the name of the service being called.
  - **`body`**: The specific parameters for the message.

## 🛡️ KLF TRUST HIERARCHY

1.  **Level 1: Self-Signed Identity** - A node can always trust itself.
2.  **Level 2: HIEROS Codex Alignment** - A node can trust another node that has verifiably signed the same version of the HIEROS Codex.
3.  **Level 3: Federated Trust** - A node can extend trust to other nodes within an established federation, governed by specific rules.
4.  **Level 4: Community Vouching** - A node can trust another node if it has been vouched for by a trusted third party or a decentralized web-of-trust.

## 📡 Core API Endpoints

While KLF is transport-agnostic, for HTTP-based implementations, the following endpoints provide a standardized interface.

```http
# Node Identity & Discovery
GET  /klf/v1/identity          # Node identity information
GET  /klf/v1/capabilities      # Available capabilities
POST /klf/v1/discover          # Discover other nodes

# Service Interaction
POST /klf/v1/request           # Service requests

# Health & Status
GET  /klf/v1/health            # Health check with ethics validation
```

## 🐍 Python Example

```python
import httpx
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.asymmetric import ed25519

class KLFClient:
    def __init__(self, private_key: ed25519.Ed25519PrivateKey, base_url: str):
        self.private_key = private_key
        self.public_key = private_key.public_key()
        self.did = f"did:kos:node:{self.public_key.public_bytes(...)}"
        self.client = httpx.Client(base_url=base_url)

    def send_request(self, recipient_did: str, service: str, body: dict) -> dict:
        payload = {
            "type": "service_request",
            "service": service,
            "body": body
        }
        # In a real implementation, the payload would be canonicalized JSON
        signature = self.private_key.sign(str(payload).encode('utf-8'))

        klf_message = {
            "klf": {"version": "1.0.0", "timestamp": ...},
            "sender": {"did": self.did, "signature": signature.hex()},
            "recipient": {"did": recipient_did},
            "payload": payload
        }

        response = self.client.post("/klf/v1/request", json=klf_message)
        response.raise_for_status()
        # Real implementation would verify the response signature
        return response.json()

def validate_klf_message(message: dict) -> bool:
    """Validate KLF message format and signature"""
    # 1. Check schema
    # 2. Get sender's public key from their DID
    # 3. Verify signature
    return True
```

## 📊 Metrics & Observability

To ensure the health and performance of the framework, nodes should expose the following metrics:

```
# Discovery Metrics
klf_discovery_requests_total{method="mdns|dht|registry"}
klf_discovery_latency_seconds{method="mdns|dht|registry"}

# Message Metrics
klf_messages_sent_total{type="request|response|advertisement"}
klf_messages_received_total{type="request|response|advertisement"}
klf_message_processing_duration_seconds

# Security Metrics
klf_auth_attempts_total{result="success|failure"}
klf_auth_duration_seconds

# HIEROS Metrics
klf_ethical_intentions_validations_total{result="pass|fail"}
klf_ethics_violations_total{intention="honor_all_beings|..."}
```

## ✅ Implementation Requirements

-   **Specification**: `Kind Link Framework v1.0.0`
-   **Implementation**: All kOS nodes must implement KLF v1.0.0 for interoperability.
-   **Next Review**: 2025-07-28 