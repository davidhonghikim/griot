---
title: "Griot RAG Storage Architecture"
description: |
  Defines the storage strategy for the Griot RAG system within kOS, supporting high-speed querying, distributed storage, and efficient document ingestion.

storage_layers:
  hot_storage:
    type: "In-Memory Vector DB"
    options:
      - ChromaDB
      - Faiss
    purpose: "Fast retrieval of most-recently-accessed vectors"

  warm_storage:
    type: "Persistent Disk-based Vector DB"
    options:
      - Qdrant
      - Weaviate
    purpose: "Durable storage of all indexed embeddings"

  cold_storage:
    type: "Object Storage or Filesystem"
    options:
      - MinIO
      - AWS S3
      - Local Filesystem
    purpose: "Raw document storage for re-indexing or audits"

replication:
  modes:
    - Synchronous (within node)
    - Asynchronous (across nodes)

backup_and_restore:
  frequency:
    - Daily vector snapshots
    - Weekly cold storage dumps
  restore_process:
    - Cold storage to Warm Vector DB
    - Vector DB to Hot Cache (on demand)

index_maintenance:
  - Periodic index compaction
  - Embedding drift detection
  - Automated stale vector pruning

scaling_strategy:
  - Scale hot storage vertically (RAM)
  - Scale warm storage horizontally (nodes)
  - Tiered query routing by data recency and access patterns

future_extensions:
  - Distributed sharded index
  - Time-based vector decay for relevance management

...

