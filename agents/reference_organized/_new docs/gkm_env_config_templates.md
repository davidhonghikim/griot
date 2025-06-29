title: "kOS GKM Node Environment and Configuration Templates"
version: "1.0"
status: "DRAFT"
date: "2025-06-29"

node_griot_env:
  NODE_ID: "node-griot-1"
  PORT: "3000"
  VECTOR_BACKEND: "weaviate"
  MONGO_URI: "mongodb://mongo:27017"
  NEO4J_URI: "bolt://neo4j:7687"
  RETICULUM_ENABLED: "true"
  KLF_PRIVATE_KEY: "replace_with_private_key"
  TRUST_LEVEL: "high"

node_ronin_env:
  NODE_ID: "node-ronin-1"
  PORT: "3003"
  VECTOR_BACKEND: "pgvector"
  MONGO_URI: "mongodb://mongo:27017"
  RETICULUM_ENABLED: "true"
  KLF_PRIVATE_KEY: "replace_with_private_key"
  TRUST_LEVEL: "medium"

node_musa_env:
  NODE_ID: "node-musa-1"
  PORT: "3004"
  VECTOR_BACKEND: "weaviate"
  RETICULUM_ENABLED: "false"
  TRUST_LEVEL: "medium"

global_config_yaml:
  security:
    message_signing: true
    encryption: true
  discovery:
    registry_endpoint: "http://localhost:3000/node/registry"
    trust_policy: "manual"
  federation:
    max_federated_hops: 2
    default_query_ttl_ms: 5000
  logging:
    level: "info"
    target: "console"

conclusion:
  summary: "These environment variable templates and global configuration YAML define operational parameters for GKM nodes, ensuring consistent deployment across environments."

