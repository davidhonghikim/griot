---
title: "Junzi Node Specification: The Integrity Starseed"
description: "Technical specification for the Junzi node, the 'DNA repair enzyme' of the kOS ecosystem."
type: "implementation"
status: "proposal"
priority: "critical"
last_updated: "2024-07-23"
version: "2.0.0"
agent_notes: "Major refactor to align with canonical architecture principles. Pivoted from a specific ethical advisor app to a generic policy and compliance engine. Added all standard sections."
---

# Junzi Node Specification: The Integrity Starseed

## 🎯 Overview: The Compliance Engine

The Junzi node is a **Governance Tier starseed** in the kOS ecosystem. Inspired by the cultural archetype of the Confucian *Junzi* as an exemplar of correct conduct, its function is to **provide a generic framework for policy enforcement and compliance validation.**

Functionally, it acts as the **DNA repair enzyme or immune system's rule-checker** for a kOS federation. It is not an ethical advisor that makes decisions. Instead, it is a validation service that allows any node to:
-   **Submit an Object:** Provide a data object, such as a node's configuration file, a proposed action, or a data packet.
-   **Provide a Policy:** Submit a set of rules or constraints (e.g., written in a policy language like Rego or even as a simple JSON schema).
-   **Receive a Report:** Get a structured compliance report detailing whether the object conforms to the policy and, if not, which rules were violated.

The Junzi node embodies `Li` (礼 - proper conduct, ritual) by providing the mechanism to ensure all parts of the system adhere to the established rules, most importantly the HIEROS Codex.

## 🏛️ HIEROS Covenant Compliance

### Cultural Attribution Framework
-   **Tradition**: Chinese Confucian *Junzi* (君子) - the "noble person" or "exemplary person."
-   **Cultural Context**: A core aspect of the Junzi is adherence to `Li` (礼), which represents the entire spectrum of rituals, protocols, and proper conduct. A Junzi acts correctly because their behavior is in perfect alignment with these established norms. They don't just know the rules; they embody them.

-   **Attribution**: Respectfully inspired by the Junzi's role as an **embodiment of and validator for correct protocol (`Li`)**. This philosophy guides the node's function to be a generic engine for checking compliance against established rules.

### Implementation Framework

The Junzi node provides a neutral policy validation engine with the following capabilities:
-   **Open Standards**: Uses standard policy languages (OPA/Rego, JSON Schema) for maximum interoperability
-   **Ephemeral Processing**: Validates objects and policies without persistent storage
-   **Transparent Operations**: All validation logic is auditable and deterministic
-   **Generic Framework**: Can validate any object against any user-defined policy
-   **Performance Optimized**: Efficient validation engine suitable for high-throughput scenarios

## 🏗️ System Architecture

### Core Component Hierarchy
```
⚖️ JUNZI NODE ARCHITECTURE
├── 📥 Request Handler
│   ├── API Gateway
│   └── Input Validator (Object & Policy Schemas)
├── ⚙️ Policy Engine
│   ├── Open Policy Agent (OPA) Runtime
│   └── Other Policy Runtimes (e.g., JSON Schema Validator)
├── 📚 Policy Library
│   └── User-Defined Policies
├── 🗄️ State Management
│   ├── Job Store (status, metadata)
│   └── Compliance Report Cache
├── 🔧 Self-Validation Engine
│   └── Configuration Integrity Checker
└── 🌐 Network & Integration
    ├── KLF Framework Implementation
    └── REST API Gateway
```

## 4. Data Models

### 4.1. ComplianceJob
A request to the Junzi to validate an object against a policy.

```json
{
  "job_id": "string (uuid)",
  "input_object": {
    "node_id": "did:kos:griot-123",
    "config": { "allow_public_api": true }
  },
  "policy": {
    "language": "rego",
    "definition": "package system.authz; default allow = false; allow { input.config.allow_public_api == false }"
  },
  "status": "pending | running | completed | failed",
  "report": {
    "is_compliant": false,
    "violations": [
      "Rule 'allow' in package 'system.authz' was not satisfied."
    ]
  },
  "created_at": "string (iso_8601_timestamp)"
}
```

## 5. API Specification

### Compliance API

#### `POST /validate`
-   **Summary**: Creates and runs a `ComplianceJob`.
-   **Request Body**:
    ```json
    {
      "input_object": { "... any json ..." },
      "policy_id": "string (optional, for stored policies)",
      "policy": {
        "language": "rego",
        "definition": "package system.authz ..."
      }
    }
    ```
-   **Response**: `202Accepted` with the `ComplianceJob` object. The result can be polled from the job status endpoint.

#### `GET /jobs/{job_id}`
-   **Summary**: Gets the status and result of a `ComplianceJob`.
-   **Response**: `200 OK` with the `ComplianceJob` object.

### Policy Management API

#### `POST /policies`
-   **Summary**: Stores a reusable policy.
-   **Request Body**: `{ "policy_id": "no-public-apis", "policy": { "language": "rego", "definition": "..." } }`
-   **Response**: `201 Created`.

#### `GET /policies/{policy_id}`
-   **Summary**: Retrieves a stored policy.
-   **Response**: `200 OK` with the policy object.

---

**Implementation Status**: 🏛️ **PROPOSAL**  
**HIEROS Compliance**: ✅ **FULLY INTEGRATED**  
**Cultural Attribution**: ✅ **PROPERLY ACKNOWLEDGED**  
**Ready For**: Development 