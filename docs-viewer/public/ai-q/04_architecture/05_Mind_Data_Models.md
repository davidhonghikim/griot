---
title: "AI-Q Mind Data Models"
description: "Concrete data models and database schemas for the AI Mind's cognitive architecture"
type: "architecture"
status: "proposal"
priority: "critical"
last_updated: "2025-06-25"
version: "1.0.0"
agent_notes: "Translates abstract memory concepts into implementable database schemas. This is the bridge from concept to code for the Mind's persistence layer."
---

# AI-Q Mind Data Models

## 1. Overview

This document provides the concrete data models and database schemas required to implement the AI-Q Mind's cognitive architecture, as defined in `The Cognitive Biology of a kOS Node`. It translates abstract concepts like "Epigenetic Record" into specific, implementable database schemas.

## 2. The Data Triad: A Triumvirate of Memory

To support the diverse needs of the Mind's memory systems, a **Data Triad** approach is recommended. This triumvirate of specialized databases, each with a distinct role, forms the complete memory architecture of the digital cell.

- **Relational Data (PostgreSQL):** The "Book of Life," for structured, transactional data like node identities and the unchangeable log of `Episodic Memory`.
- **Semantic Data (Vector Database):** The "Conceptual Nervous System," for storing and searching the high-dimensional vector embeddings that form the Mind's understanding and intuition.
- **In-Memory Cache (Redis):** The "Cellular Cytoplasm," for the volatile, high-speed `Working Memory` needed for immediate cognitive processes.

## 3. Consciousness Core Data Models

This model stores the core identity and state of a Mind instance.

### `nodes` Table (PostgreSQL)

Stores the fundamental identity of each kOS node instance.

```sql
CREATE TABLE nodes (
    node_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    did_kos VARCHAR(255) UNIQUE NOT NULL, -- e.g., did:kos:griot:a1b2c3d4e5f6
    node_class VARCHAR(50) NOT NULL, -- Griot, Tohunga, etc.
    version VARCHAR(20) NOT NULL,
    endpoint VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_seen_at TIMESTAMPTZ DEFAULT NOW()
);
```

### `personality` Table (PostgreSQL)

Stores the evolving personality traits and preferences of a Mind. Linked to a node.

```sql
CREATE TABLE personality (
    personality_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    node_id UUID REFERENCES nodes(node_id) ON DELETE CASCADE,
    traits JSONB, -- e.g., {"openness": 0.7, "conscientiousness": 0.8}
    preferences JSONB, -- e.g., {"preferred_communication_style": "formal"}
    last_updated TIMESTAMPTZ DEFAULT NOW()
);
```

## 4. Memory Systems Data Models

### Working Memory (Redis)

`Working Memory` is ephemeral and should be stored in a high-speed cache like Redis.

- **Key:** `working_memory:{node_id}`
- **Type:** Redis Hash
- **Structure:**
    ```json
    {
      "current_context": {
        "conversation_id": "conv_123",
        "active_user_id": "user_abc",
        "active_rules": ["enforce_pii_redaction"],
        "hieros_state": ["honor_all_beings_check_pending"]
      },
      "attention_span": {
        "focus_items": ["concept_A", "concept_B"],
        "context_depth": 3
      }
    }
    ```

### Episodic Memory (PostgreSQL)

A log of significant events or "memories." This provides the AI with a history of its interactions.

```sql
CREATE TABLE episodic_memory (
    event_id BIGSERIAL PRIMARY KEY,
    node_id UUID REFERENCES nodes(node_id) ON DELETE CASCADE,
    session_id VARCHAR(255),
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    event_type VARCHAR(50) NOT NULL, -- e.g., 'INTERACTION', 'LEARNING_MILESTONE', 'HIEROS_DECISION'
    actor VARCHAR(255), -- Who initiated (e.g., user_id, system, other_node_id)
    content TEXT, -- The core content of the event (e.g., user query)
    metadata JSONB, -- Rich context, e.g., {"response_generated": "...", "quality_assessment": 0.9}
    hieros_context JSONB -- Record of HIEROS validation for this event
);

CREATE INDEX idx_episodic_node_id ON episodic_memory(node_id);
CREATE INDEX idx_episodic_event_type ON episodic_memory(event_type);
```

### Semantic Memory (Vector Database)

Stores knowledge as vector embeddings for semantic search. This is the "knowledge web."

- **Collection Name:** `semantic_memory`
- **Vector Dimensions:** (Depends on model, e.g., 1536 for OpenAI `text-embedding-ada-002`)
- **Payload Schema (Metadata associated with each vector):**
    ```json
    {
      "chunk_id": "uuid",
      "source_id": "string", 
      "node_id": "uuid",
      "text_chunk": "string",
      "tags": ["string"],
      "created_at": "datetime",
      "access_count": "integer"
    }
    ```

### Procedural Memory (PostgreSQL)

Stores learned skills and effective "procedures" for tasks.

```sql
CREATE TABLE procedural_memory (
    procedure_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    node_id UUID REFERENCES nodes(node_id) ON DELETE CASCADE,
    skill_name VARCHAR(100) NOT NULL, -- e.g., 'HANDLE_GRIEVANCE', 'BUILD_PACKAGE'
    trigger_conditions TEXT, -- Description of when to use this skill
    steps JSONB, -- The sequence of actions, e.g., [{"step": 1, "action": "invoke_api", "params": {...}}]
    effectiveness_score FLOAT DEFAULT 0.5, -- 0.0 to 1.0
    usage_count INTEGER DEFAULT 0,
    last_used_at TIMESTAMPTZ,
    UNIQUE(node_id, skill_name)
);
``` 