---
title: "Tohunga Class: Data Models"
description: "Data models for the Tohunga Node Class, including DataSource, AcquisitionJob, and PipelineStep."
---

# Tohunga Class Data Models

These are the core data structures used by the Tohunga node's services.

### 1. DataSource
Defines a reusable connection to an external data source. This allows other nodes to define a source once and reference it in multiple acquisition jobs.

```json
{
  "source_id": "string (uuid)",
  "source_name": "string (human-readable name, e.g., 'GitHub Public API')",
  "source_type": "http_api | postgresql | s3_bucket",
  "connection_config": {
    // Varies based on source_type
    // For http_api:
    "base_url": "https://api.github.com",
    "headers": { "Authorization": "Bearer ..." },
    // For postgresql:
    "connection_uri": "postgresql://user:pass@host:port/db"
  },
  "owner_did": "string (did:kos:... of the node that registered this source)",
  "created_at": "string (ISO 8601 timestamp)"
}
```

### 2. AcquisitionJob
A request to the Tohunga node to execute a data pipeline. It references a `DataSource` and defines the specific steps to be taken.

```json
{
  "job_id": "string (uuid)",
  "source_id": "string (uuid, foreign key to DataSource)",
  "request_params": {
    // Varies based on source_type
    // For http_api:
    "path": "/events",
    "query_params": { "per_page": 100 }
  },
  "pipeline_steps": [
    // Array of PipelineStep objects, see below
  ],
  "output_config": {
    "format": "json_lines | csv",
    "destination": {
      "type": "s3",
      "bucket": "my-data-assets",
      "key": "processed/github-events/{job_id}.jsonl"
    }
  },
  "status": "pending | running | completed | failed",
  "result_uri": "string (e.g., s3://my-data-assets/processed/github-events/uuid.jsonl)",
  "created_at": "string (ISO 8601 timestamp)",
  "completed_at": "string (ISO 8601 timestamp, optional)"
}
```

### 3. PipelineStep
Defines a single, modular step within an `AcquisitionJob` pipeline.

```json
{
  "step_id": "string (uuid)",
  "step_type": "validation | transformation",
  "step_module": "json_schema | rego_policy | field_mapping | format_conversion",
  "definition": {
    // Varies based on step_module
    // For json_schema:
    "schema": { "type": "object", "properties": { "id": { "type": "string" } } },
    // For field_mapping:
    "map": { "id": "identifier", "actor.login": "user_login" }
  }
}
``` 