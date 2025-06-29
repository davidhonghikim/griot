---
title: "Tohunga Node Class Overview"
description: |
  Technical and functional specification for the Tohunga Node Class in kOS. Tohunga is the Master of Data, responsible for indexing, archiving, retrieval, and structured data governance across the Kind AI Operating System ecosystem.

node_identity:
  class_name: "Tohunga"
  archetype: "Master of Data"
  primary_role: "Data Archival, Indexing, Storage Governance, and Knowledge Retrieval"

functional_scope:
  - Long-term storage and archiving of system and agent data
  - Document indexing and retrieval
  - Metadata tagging and search
  - Structured and unstructured data storage
  - Backup and version control services
  - Inter-node data replication

core_modules:
  - Data Indexer
  - Storage Manager
  - Metadata Tagging Engine
  - Data Retrieval API
  - Backup and Restore Manager
  - Replication Coordinator

supported_storage_backends:
  - Local filesystem
  - Object storage (MinIO, S3, etc.)
  - Distributed storage systems (IPFS, Syncthing, etc.)

agent_interaction:
  api_endpoints:
    - /archive_document
    - /retrieve_document
    - /search_metadata
    - /get_document_versions
    - /trigger_backup

security:
  - Access Control by Agent Class and Node Role
  - Data encryption at rest and in transit
  - Versioning and deletion protections

scalability:
  - Supports petabyte-scale archives
  - Distributed storage sharding
  - Incremental index rebuilds

future_extensions:
  - AI-driven metadata auto-tagging
  - Cross-node distributed query engine
  - Tokenized storage quotas and incentives

version:
  current: "Tohunga v1.0 YAML Release"

...

