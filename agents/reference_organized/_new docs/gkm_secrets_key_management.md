title: "kOS GKM Secrets and Key Management Configuration"
version: "1.0"
status: "DRAFT"
date: "2025-06-29"

secrets_management:
  storage_backend:
    type: "Vault"
    location: "apps/persona-rag-bridge/.vault/"

  encryption:
    algorithm: "AES-256-CBC"
    key_rotation_policy:
      rotation_interval_days: 30
      auto_rotate: true

  api_keys:
    openai:
      storage: "Vault"
      access_method: "Environment Variable Injection"
    huggingface:
      storage: "Vault"
      access_method: "Runtime Secret Loader"

  klf_node_keys:
    generation:
      algorithm: "Ed25519"
      key_size: "256 bits"
    distribution:
      method: "Manual export/import during node setup"
      security:
        - "Stored encrypted at rest"
        - "Never transmitted in plain text"

  secret_loading:
    startup_policy:
      fail_on_missing_secret: true
      load_on_demand: false
    runtime_reload:
      enabled: true
      trigger: "Signal-based reload (SIGHUP)"

  access_control:
    vault_access_roles:
      - "developer"
      - "admin"
      - "read-only"

  audit_logging:
    enabled: true
    storage: "MongoDB"
    retention_days: 90

conclusion:
  summary: "This YAML defines the key, token, and secret management practices for all GKM nodes and services, ensuring encryption, rotation, and controlled runtime access."

