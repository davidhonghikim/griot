title: "kOS GKM Data Retention and Purge Policy"
version: "1.0"
status: "DRAFT"
date: "2025-06-29"

data_retention:
  vector_store:
    retention_days: 365
    purge_schedule: "monthly"
    purge_method: "Vector ID-based batch deletion"

  node_registry:
    retention_days: 180
    archive_before_delete: true
    archive_location: "MongoDB.archive.nodes_registry"

  persona_memory:
    retention_days: 90
    purge_schedule: "weekly"

  query_logs:
    retention_days: 30
    purge_schedule: "daily"

  event_logs:
    retention_days: 60
    compression: "gzip"
    storage_tier: "cold-storage"

  sync_logs:
    retention_days: 14
    real_time_cleanup: false

  crdt_state_snapshots:
    retention_versions: 5
    rotation_policy: "FIFO"

compliance:
  gdpr_support: true
  right_to_be_forgotten:
    enabled: true
    erase_targets:
      - "VectorStore"
      - "MongoDB"
      - "Neo4j"

monitoring:
  retention_metrics:
    track_purge_durations: true
    alert_on_purge_failures: true

conclusion:
  summary: "This YAML defines data lifecycle management, retention durations, purge schedules, and compliance mechanisms for GKM storage systems."

