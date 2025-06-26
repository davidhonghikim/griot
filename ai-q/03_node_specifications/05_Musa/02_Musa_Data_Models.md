---
title: "Musa Class: Data Models"
description: "Data models for the Musa Node Class, including Principal, Policy, and SecurityLog."
---

# Musa Class Data Models

### 1. Principal
Represents the authenticated entity (a user or another node) attempting an action. This object is the output of a successful authentication.

```json
{
  "principal_id": "string (did:kos:...)",
  "claims": {
    "iss": "string (Issuer, did:kos:musa:...)",
    "sub": "string (Subject, same as principal_id)",
    "aud": "string (Audience, did of the service this principal is accessing)",
    "iat": "number (Issued At, unix timestamp)",
    "exp": "number (Expiration, unix timestamp)",
    "roles": ["string"],
    "groups": ["string"]
  },
  "signature": "string (JWT-style signature of the claims)"
}
```

### 2. Policy
Represents a declarative authorization policy. These policies are managed by the Musa node and evaluated by its Policy Decision Point.

```json
{
    "policy_id": "string (uuid)",
    "policy_name": "string (human-readable name, e.g., 'Allow Editors to Write Documents')",
    "effect": "Allow | Deny",
    "actions": ["read", "write", "delete"],
    "resources": ["did:kos:document:*"],
    "conditions": {
      "rego_policy": "package authz; default allow = false; allow { input.principal.claims.roles[_] == 'editor' }"
    },
    "owner_did": "string (did:kos:...)",
    "created_at": "string (ISO 8601 timestamp)"
}
```

### 3. SecurityAuditLog
Represents an entry in the secure audit trail. These logs are immutable records of security-sensitive events.

```json
{
  "log_id": "string (uuid)",
  "timestamp": "string (ISO 8601 timestamp)",
  "event_type": "AUTHENTICATION | AUTHORIZATION | CRYPTOGRAPHIC_OP",
  "principal_id": "string (did:kos:...)",
  "source_ip": "string",
  "action": "string",
  "resource": "string",
  "outcome": "Success | Failure",
  "details": {
    "policy_id_evaluated": "string (uuid)",
    "error_code": "string (if outcome was Failure)"
  }
}
``` 