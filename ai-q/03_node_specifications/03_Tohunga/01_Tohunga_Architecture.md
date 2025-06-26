---
title: "Tohunga Class: Architecture"
description: "System architecture and component hierarchy for the Tohunga Node Class."
---

# Tohunga Class Architecture

## 🏗️ System Architecture

The Tohunga Class is designed as a modular, pipeline-driven system. A central orchestrator manages a series of pluggable modules that perform the actual work of data acquisition and transformation.

### Core Component Hierarchy

```
🔌 TOHUNGA NODE ARCHITECTURE
├── 📥 Job Intake & API Gateway
│   ├── KLF Message Handler
│   └── Job Validator & Parser
├── ⚙️ Pipeline Orchestrator
│   ├── Asynchronous Job Queue (e.g., Redis, RabbitMQ)
│   └── Worker Pool Manager
├── 🧩 Pluggable Modules
│   ├── Data Connectors
│   │   ├── HTTP/S
│   │   ├── SQL (PostgreSQL, SQLite)
│   │   ├── S3 / Object Storage
│   │   └── WebSocket Streams
│   ├── Validation Steps
│   │   ├── JSON Schema Validator
│   │   ├── Rego Policy Engine
│   │   └── Custom Script Executor (e.g., Deno/WASM)
│   ├── Transformation Steps
│   │   ├── Field Mapping & Renaming
│   │   ├── Data Filtering & Redaction
│   │   └── Format Conversion (e.g., XML to JSON)
│   └── Output Modules
│       ├── Local File System
│       ├── S3 / Object Storage
│       └── KLF Message Stream
├── 🗄️ State & Provenance Management
│   ├── Job Store (PostgreSQL)
│   ├── Data Asset Registry
│   └── Ephemeral Data Store (for active pipelines)
└── 🛡️ HIEROS Compliance Engine
    └── Provenance & Lineage Tracker
``` 