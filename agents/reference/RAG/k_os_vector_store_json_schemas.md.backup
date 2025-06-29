---

## title: "kOS Vector Store JSON Schemas" description: "JSON schema definitions for kOS Knowledge and Memory Storage System entities, designed for Weaviate-first storage and AI agent interoperability." type: "technical-specification" status: "active" priority: "critical" created: "2025-06-28T00:00:00Z" version: "1.0.0" tags: ["kOS", "json-schema", "vector-store", "weaviate", "AKU", "skills", "recipes", "logs", "metadata"]

# ✅ Overview

These JSON Schemas define the machine-parseable structure for all key kOS Knowledge and Memory entities to be stored in Weaviate and used by all AI agents.

---

## ✅ JSON Schemas

### AKU Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "AKU",
  "type": "object",
  "required": ["aku_id", "content", "tags", "vector", "timestamp", "agent_id"],
  "properties": {
    "aku_id": {"type": "string"},
    "content": {"type": "string"},
    "tags": {"type": "array", "items": {"type": "string"}},
    "vector": {"type": "array", "items": {"type": "number"}},
    "timestamp": {"type": "string", "format": "date-time"},
    "agent_id": {"type": "string"}
  }
}
```

### Skill Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Skill",
  "type": "object",
  "required": ["skill_id", "code_snippet", "language", "description", "vector", "created_by_agent"],
  "properties": {
    "skill_id": {"type": "string"},
    "code_snippet": {"type": "string"},
    "language": {"type": "string"},
    "description": {"type": "string"},
    "vector": {"type": "array", "items": {"type": "number"}},
    "created_by_agent": {"type": "string"}
  }
}
```

### Recipe Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Recipe",
  "type": "object",
  "required": ["recipe_id", "steps", "associated_skills", "tags", "vector"],
  "properties": {
    "recipe_id": {"type": "string"},
    "steps": {"type": "array", "items": {"type": "string"}},
    "associated_skills": {"type": "array", "items": {"type": "string"}},
    "tags": {"type": "array", "items": {"type": "string"}},
    "vector": {"type": "array", "items": {"type": "number"}}
  }
}
```

### Prompt Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Prompt",
  "type": "object",
  "required": ["prompt_id", "prompt_type", "content", "version", "vector"],
  "properties": {
    "prompt_id": {"type": "string"},
    "prompt_type": {"type": "string"},
    "content": {"type": "string"},
    "version": {"type": "string"},
    "vector": {"type": "array", "items": {"type": "number"}}
  }
}
```

### Artifact Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Artifact",
  "type": "object",
  "required": ["artifact_id", "source_agent", "generation_task_id", "file_path", "vector"],
  "properties": {
    "artifact_id": {"type": "string"},
    "source_agent": {"type": "string"},
    "generation_task_id": {"type": "string"},
    "file_path": {"type": "string"},
    "vector": {"type": "array", "items": {"type": "number"}}
  }
}
```

### Agent Log Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "AgentLog",
  "type": "object",
  "required": ["log_id", "agent_id", "timestamp", "event_type", "summary"],
  "properties": {
    "log_id": {"type": "string"},
    "agent_id": {"type": "string"},
    "timestamp": {"type": "string", "format": "date-time"},
    "event_type": {"type": "string"},
    "summary": {"type": "string"},
    "vector": {"type": "array", "items": {"type": "number"}}
  }
}
```

---

## ✅ Next Steps

1. Deploy these schemas as Weaviate Class definitions
2. Integrate validation steps into `VectorStoreAPI`
3. Generate CRUD wrappers for each entity type
4. Begin data ingestion for AKUs, Skills, Recipes, etc.

---

**Plan ID:** kos\_2025\_06\_vector\_json\_schemas\
**Created by:** ChatGPT + User Collaboration\
**Last Updated:** 2025-06-28T00:00:00Z

