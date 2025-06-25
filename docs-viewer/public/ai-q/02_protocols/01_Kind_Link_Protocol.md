---
title: "Kind Link Protocol (KLP) Specification"
description: "Core communication protocol enabling universal interoperability between all kOS nodes"
type: "protocol"
status: "canonical"
priority: "critical"
last_updated: "2025-01-28"
version: "1.0.0"
agent_notes: "All inter-node communication must implement this protocol - no exceptions"
---

# Kind Link Protocol (KLP) Specification

**Universal Communication Protocol for kOS Node Interoperability**

The Kind Link Protocol (KLP) is the foundational communication standard that enables all kOS nodes to discover, authenticate, and collaborate with each other regardless of their class, implementation language, or hosting environment.

## 🎯 Protocol Objectives

### **Universal Interoperability**
- Every kOS node speaks the same protocol language
- Cross-platform communication (Docker, native, cloud, edge)
- Language-agnostic implementation (Python, Rust, Go, JavaScript, etc.)

### **Decentralized Architecture**
- No central authority or single point of failure
- Peer-to-peer discovery and communication
- Optional federation with maintained autonomy

### **Ethical Intentions Compliance**
- All operations validated against Seven Ethical Intentions
- Cryptographic verification of ethical compliance
- Audit trail for all inter-node interactions

## 🏗️ Protocol Architecture

### **Layer Structure**
```
🏛️ KLP PROTOCOL STACK
├── 🤝 Application Layer (Node Class APIs)
├── 📡 Message Layer (Standardized Messages)
├── 🔐 Security Layer (Authentication & Encryption)
├── 🌐 Network Layer (Discovery & Routing)
└── 🔧 Transport Layer (HTTP/WebSocket/P2P)
```

### **Core Components**

#### **1. Node Identity System**
Every kOS node maintains a cryptographic identity:

```json
{
  "nodeId": "did:kos:griot:a1b2c3d4e5f6",
  "nodeClass": "Griot",
  "publicKey": "ed25519:base58_encoded_key",
  "endpoint": "https://griot.example.com:30437",
  "capabilities": ["package_management", "installation", "sync"],
  "ethicalIntentions": {
    "version": "1.0.0",
    "compliance": "verified",
    "lastAudit": "2025-01-28T00:00:00Z"
  },
  "signature": "detached_ed25519_signature"
}
```

#### **2. Capability Advertisement**
Nodes advertise their available services:

```json
{
  "messageType": "capability_advertisement",
  "nodeId": "did:kos:griot:a1b2c3d4e5f6",
  "capabilities": [
    {
      "name": "package_sync",
      "version": "1.0.0",
      "endpoint": "/api/v1/sync",
      "methods": ["GET", "POST"],
      "authentication": "required",
      "rateLimit": "100/hour",
      "ethicalIntentions": ["stewardship_not_extraction"]
    }
  ],
  "timestamp": "2025-01-28T00:00:00Z",
  "signature": "ed25519_signature"
}
```

#### **3. Service Discovery Protocol**
Nodes discover each other through multiple mechanisms:

**Local Network Discovery (mDNS)**
```
_kos-node._tcp.local. TXT "class=Griot" "port=30437" "id=a1b2c3d4"
```

**DHT-Based Discovery**
```json
{
  "messageType": "discovery_request",
  "seekingClass": "Tohunga",
  "seekingCapability": "dataset_curation",
  "requesterId": "did:kos:griot:a1b2c3d4e5f6",
  "maxResults": 10,
  "timestamp": "2025-01-28T00:00:00Z"
}
```

**Registry-Based Discovery** (Optional)
```http
GET https://registry.kos.network/nodes?class=Oracle&capability=forecasting
```

## 📡 Message Format Specification

### **Base Message Structure**
All KLP messages share a common structure:

```json
{
  "klp": {
    "version": "1.0.0",
    "messageId": "uuid-v4",
    "messageType": "service_request|service_response|capability_advertisement|discovery_request|etc",
    "timestamp": "ISO-8601-UTC",
    "senderId": "did:kos:nodeclass:identifier",
    "recipientId": "did:kos:nodeclass:identifier",
    "ethicalIntentions": {
      "applicable": ["honor_all_beings", "stewardship_not_extraction"],
      "validated": true,
      "validatorId": "did:kos:junzi:validator"
    }
  },
  "payload": {
    // Message-specific content
  },
  "signature": "ed25519_detached_signature"
}
```

### **Service Request Messages**
```json
{
  "klp": {
    "version": "1.0.0",
    "messageId": "req-123-abc",
    "messageType": "service_request",
    "timestamp": "2025-01-28T00:00:00Z",
    "senderId": "did:kos:griot:client",
    "recipientId": "did:kos:tohunga:server"
  },
  "payload": {
    "service": "dataset_search",
    "method": "POST",
    "endpoint": "/api/v1/search",
    "parameters": {
      "query": "machine learning datasets",
      "limit": 10,
      "filters": {
        "license": "MIT|Apache-2.0|CC0"
      }
    },
    "authentication": {
      "token": "jwt_token_here",
      "type": "bearer"
    }
  },
  "signature": "signature_here"
}
```

### **Service Response Messages**
```json
{
  "klp": {
    "version": "1.0.0",
    "messageId": "resp-123-abc",
    "messageType": "service_response",
    "timestamp": "2025-01-28T00:00:00Z",
    "senderId": "did:kos:tohunga:server",
    "recipientId": "did:kos:griot:client",
    "inReplyTo": "req-123-abc"
  },
  "payload": {
    "status": "success|error|partial",
    "data": {
      "results": [
        {
          "id": "dataset-456",
          "name": "Clean ML Dataset Collection",
          "license": "MIT",
          "size": "2.3GB",
          "url": "https://tohunga.example.com/datasets/456"
        }
      ],
      "total": 1,
      "hasMore": false
    },
    "metadata": {
      "processingTime": "0.245s",
      "cacheHit": false
    }
  },
  "signature": "signature_here"
}
```

## 🔐 Security Framework

### **Cryptographic Requirements**
- **Identity Keys**: Ed25519 for node identity and message signing
- **Transport Encryption**: TLS 1.3 minimum for all HTTP communication
- **Message Signing**: All messages cryptographically signed
- **Key Rotation**: Automated key rotation every 90 days

### **Authentication Flow**
1. **Identity Verification**: Verify node's cryptographic identity
2. **Capability Check**: Confirm requested capability is advertised
3. **Ethical Intentions Validation**: Ensure request aligns with ethics
4. **Authorization**: Check if requester has permission
5. **Audit Logging**: Record all authentication events

### **Trust Model**
```
🛡️ KLP TRUST HIERARCHY
├── 👑 Self-Sovereign Identity (Node controls own keys)
├── 🤝 Peer Attestation (Nodes vouch for each other)
├── ⚖️ Ethical Intentions Validation (Ethics compliance)
└── 📜 Audit Trail (Immutable interaction history)
```

## 🌐 Network Topology

### **Connection Patterns**

#### **Direct Peer-to-Peer**
```
Griot ←→ Tohunga
  ↓       ↑
  ↓       ↑
Oracle ←→ Hakim
```

#### **Hub-and-Spoke (via Archon)**
```
        Archon
       /   |   \
    Griot  |  Oracle
           |
        Tohunga
```

#### **Mesh Network**
```
Griot ←→ Tohunga ←→ Oracle
  ↑  ×      ↑       ↓
  ↓    ×    ↓       ↑
Hakim ←→ Musa  ←→ Junzi
```

### **Discovery Mechanisms**

#### **Local Network (mDNS/Bonjour)**
```bash
# Advertise service
dns-sd -R "kOS-Griot" _kos-node._tcp . 30437 class=Griot id=abc123

# Discover services  
dns-sd -B _kos-node._tcp
```

#### **DHT-Based (Kademlia)**
```python
# Join DHT network
dht = KademliaNode()
await dht.bootstrap([("bootstrap.kos.network", 30437)])

# Advertise capability
await dht.set(f"capability:dataset_curation", node_id)

# Discover nodes
nodes = await dht.get("capability:forecasting")
```

## 🔧 Implementation Guidelines

### **Required Endpoints**
Every kOS node must implement:

```http
GET  /klp/v1/identity          # Node identity information
GET  /klp/v1/capabilities      # Available capabilities
POST /klp/v1/discover          # Discover other nodes
POST /klp/v1/request           # Service requests
GET  /klp/v1/health            # Health check with ethics validation
```

### **Client Library Interface**
```python
class KLPClient:
    def __init__(self, node_id: str, private_key: str):
        self.node_id = node_id
        self.private_key = private_key
    
    async def discover_nodes(self, 
                           node_class: str = None,
                           capability: str = None) -> List[NodeInfo]:
        """Discover nodes matching criteria"""
        
    async def send_request(self, 
                          recipient: str,
                          service: str,
                          payload: dict) -> KLPResponse:
        """Send service request to another node"""
        
    async def advertise_capabilities(self, capabilities: List[Capability]):
        """Advertise this node's capabilities"""
```

### **Message Validation**
```python
def validate_klp_message(message: dict) -> ValidationResult:
    """Validate KLP message format and signature"""
    
    # 1. Schema validation
    if not validate_schema(message, KLP_MESSAGE_SCHEMA):
        return ValidationResult(False, "Invalid schema")
    
    # 2. Signature verification
    if not verify_signature(message):
        return ValidationResult(False, "Invalid signature")
    
    # 3. Ethical Intentions compliance
    if not validate_ethical_intentions(message):
        return ValidationResult(False, "Ethics violation")
    
    return ValidationResult(True, "Valid")
```

## 📊 Quality of Service

### **Performance Requirements**
- **Discovery**: < 500ms for local network, < 2s for DHT
- **Authentication**: < 100ms for cached, < 500ms for new
- **Message Routing**: < 50ms additional latency
- **Throughput**: 1000+ messages/second per node

### **Reliability Requirements**
- **Message Delivery**: At-least-once semantics
- **Retry Logic**: Exponential backoff with jitter
- **Circuit Breaker**: Fail fast on repeated errors
- **Graceful Degradation**: Continue with reduced functionality

### **Monitoring and Metrics**
```prometheus
# Discovery metrics
klp_discovery_requests_total{method="mdns|dht|registry"}
klp_discovery_latency_seconds{method="mdns|dht|registry"}

# Message metrics  
klp_messages_sent_total{type="request|response|advertisement"}
klp_messages_received_total{type="request|response|advertisement"}
klp_message_processing_duration_seconds

# Authentication metrics
klp_auth_attempts_total{result="success|failure"}
klp_auth_duration_seconds

# Ethics metrics
klp_ethical_intentions_validations_total{result="pass|fail"}
klp_ethics_violations_total{intention="honor_all_beings|..."}
```

---

**Protocol Status**: 🏛️ **CANONICAL STANDARD**  
**Implementation**: All kOS nodes must implement KLP v1.0.0  
**Compliance**: Ethical Intentions validation required in all implementations 