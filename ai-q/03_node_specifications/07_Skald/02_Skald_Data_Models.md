---
title: "Skald Class: Data Models"
description: "Data models for the Skald Node Class, including Topic, Subscription, and EventMessage."
---

# Skald Class Data Models

### 1. Topic
Represents a channel for publication. Topics are created dynamically when a node first publishes to them.

```json
{
  "topic_name": "string (e.g., 'kos:system:node_health_alerts')",
  "is_persistent": "boolean",
  "owner_did": "string (did of the node that created the topic)",
  "acl": {
    "read_access": "public | restricted",
    "write_access": "public | restricted",
    "allowed_readers": ["did:kos:group:admins"],
    "allowed_writers": ["did:kos:hakim:*"]
  },
  "created_at": "string (ISO 8601 timestamp)",
  "last_published_at": "string (ISO 8601 timestamp)"
}
```

### 2. Subscription
Represents a node's interest in a topic.

```json
{
  "subscription_id": "string (uuid)",
  "topic_name": "string",
  "subscriber_did": "string (did:kos:...)",
  "subscription_type": "realtime | replay_from_start",
  "is_active": "boolean",
  "created_at": "string (ISO 8601 timestamp)"
}
```

### 3. EventMessage
Represents the actual data packet that is published to a topic and delivered to subscribers. This is the payload of the KLF message.

```json
{
  "event_id": "string (uuid)",
  "topic_name": "string",
  "publisher_did": "string (did:kos:...)",
  "published_at": "string (ISO 8601 timestamp)",
  "payload": {
    // Arbitrary JSON payload
  },
  "metadata": {
    "content_type": "application/json",
    "correlation_id": "string (optional)"
  }
}
``` 