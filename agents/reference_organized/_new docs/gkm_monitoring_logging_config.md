title: "kOS GKM Monitoring and Logging Configuration"
version: "1.0"
status: "DRAFT"
date: "2025-06-29"

monitoring:
  metrics:
    enabled: true
    exporters:
      - type: "prometheus"
        port: 9090
      - type: "grafana"
        dashboard_url: "http://localhost:3001/d/gkm"
  health_checks:
    interval_seconds: 30
    node_latency_threshold_ms: 500
    vector_query_success_threshold: 0.9
  alerting:
    email:
      enabled: true
      recipients:
        - "admin@kos.local"
    slack:
      enabled: true
      channel: "#gkm-alerts"
    triggers:
      - "Node Unreachable > 2 minutes"
      - "Vector Query Failure Rate > 10%"
      - "CRDT Sync Lag > 60 seconds"

logging:
  level: "info"
  output:
    - "console"
    - "file"
  file_settings:
    path: "/var/log/kos/gkm.log"
    max_size_mb: 100
    retention_days: 7
    rotation: "daily"
  formats:
    - "json"
    - "text"
  error_tracking:
    enabled: true
    provider: "sentry"
    dsn: "https://examplePublicKey@o0.ingest.sentry.io/0"

auditing:
  enable_node_registry_auditing: true
  enable_vector_query_audit: true
  retention_days: 90
  storage_backend: "MongoDB"

conclusion:
  summary: "This YAML defines monitoring, alerting, and logging configurations for the GKM environment, supporting observability and operational resilience across the mesh."

