---
title: "Tohunga Node Specification: The Sensory Starseed"
description: "Technical specification for the Tohunga node, the 'sensory organ' of the kOS ecosystem."
type: "implementation"
status: "proposal"
priority: "critical"
last_updated: "2024-07-23"
version: "2.0.0"
agent_notes: "Major refactor to align with canonical architecture principles. Pivoted from a specific knowledge management app to a generic data acquisition and validation framework. API is now job-based."
---

# Tohunga Node Specification: The Sensory Starseed

## 🎯 Overview: The Data Acquisition Framework

The Tohunga node is a **Foundation Tier starseed** in the kOS ecosystem. Inspired by the Māori *tohunga* as a master of a specific domain, its function is to act as a generic and extensible **data acquisition and validation framework**.

Functionally, it is the primary **sensory organ** for a kOS federation. It provides a standardized pipeline for ingesting data from any external source (e.g., a public API, a database, a data stream), applying a series of validation, cleaning, and transformation steps, and outputting a trusted, structured data asset. It is how the kOS safely "senses" the outside world.

Its core purpose is to be a universal adapter, not a knowledge curator. Any other node can use the Tohunga framework to define and execute its own data ingestion pipelines.

## 🏛️ HIEROS Covenant Compliance

### Cultural Attribution Framework

-   **Tradition**: Māori *tohunga* - expert practitioners and masters of a specific craft.
-   **Cultural Context**: A tohunga is a master of a specific set of processes and tools to achieve a result (e.g., a master carver knows the tools and processes for turning wood into art). They are masters of the *how*, not the *what*.
-   **Attribution**: "Respectfully inspired by the Māori tohunga tradition of **mastering a process to transform raw material into a valued product.**" This philosophy guides the node's function as a generic data transformation pipeline.

### Seven HIEROS Intentions - Detailed Implementation

1.  **Honor All Beings**: The framework provides robust tools for provenance tracking, allowing the source of all data to be honored and attributed correctly.
2.  **Interoperability Over Control**: The node uses a plugin-based architecture for data sources, validation steps, and output formats, allowing for maximum interoperability.
3.  **Equity of Voice**: The validation and transformation rules are defined in transparent, auditable formats (like JSON Schema or Rego policies), ensuring they are applied consistently.
4.  **Respect Data Flow**: Provides tools for handling data with specific access requirements or licenses, ensuring those constraints are passed along with the processed data.
5.  **Openness With Boundaries**: The process is transparent, but it can operate on encrypted data and pass it through without decrypting it, respecting data privacy.
6.  **Stewardship Not Extraction**: The node acts as a service provider, transforming data on behalf of other nodes without claiming ownership of the data or its insights.
7.  **Guided Evolution**: By analyzing which data sources and validation steps are most common, the framework can be optimized to better serve the ecosystem's needs.

## 🏗️ System Architecture

### Core Component Hierarchy

```
🔌 TOHUNGA NODE ARCHITECTURE
├── 📥 Job Intake
│   └── API Gateway & Job Validator
├── ⚙️ Pipeline Orchestrator
│   ├── Job Queue
│   └── Worker Pool
├── 🧩 Pluggable Modules
│   ├── Data Connectors (HTTP, SQL, S3, etc.)
│   ├── Validation Steps (Schema, Rego, Custom Script)
│   └── Transformation Steps (Mapping, Filtering)
├── 🗄️ State Management
│   ├── Job Store (status, metadata)
│   └── Ephemeral Data Store (for active pipelines)
├── 🛡️ HIEROS Compliance Engine
│   └── Provenance Tracker
└── 🌐 Network & Integration
    ├── KLF Framework Implementation
    └── REST API Gateway
```

## 4. Data Models

### 4.1. AcquisitionJob
A request to the Tohunga node to execute a data pipeline.

```json
{
  "job_id": "string (uuid)",
  "source": {
    "type": "http_api",
    "url": "https://api.example.com/data"
  },
  "pipeline": [
    {
      "step": "validation",
      "type": "json_schema",
      "definition": { "type": "object", "properties": { "id": { "type": "string" } } }
    },
    {
      "step": "transformation",
      "type": "field_mapping",
      "map": { "id": "identifier", "value": "measurement" }
    }
  ],
  "output": {
    "format": "json"
  },
  "status": "pending | running | completed | failed",
  "result_uri": "did:kos:asset:xyz...",
  "created_at": "string (iso_8601_timestamp)"
}
```

## 5. API Specification

### Asynchronous Job-Based API

#### `POST /jobs/acquisition`
-   **Summary**: Creates and starts a new asynchronous data acquisition and processing job.
-   **Request Body**: The `AcquisitionJob` object (without `job_id`, `status`, `result_uri`, etc.).
-   **Response**: `202 Accepted` with the full `AcquisitionJob` object, including its `job_id`.

#### `GET /jobs/acquisition/{job_id}`
-   **Summary**: Retrieves the status and results of an acquisition job.
-   **Response**: `200 OK` with the `AcquisitionJob` object. A `completed` job will contain the `result_uri` pointing to the processed data asset.

---

**Implementation Status**: 🏛️ **PROPOSAL**  
**HIEROS Compliance**: ✅ **FULLY INTEGRATED**  
**Cultural Attribution**: ✅ **PROPERLY ACKNOWLEDGED**  
**Ready For**: Development