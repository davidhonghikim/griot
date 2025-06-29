# JUNZI Public API Specification and Deployment Config

## Public API Specification (High-Level OpenAPI Format)

### Base Path:

`/junzi/api/v1/`

### Endpoints:

#### **GET /entities/{id}/profile**

- **Description:** Fetch complete profile of an entity including risk score, contradictions, and jurisdictional context.
- **Parameters:**
  - `id`: Unique Entity ID
- **Response:** JSON

#### **GET /entities/{id}/contradictions**

- **Description:** Retrieve all detected contradictions for a specific entity.
- **Parameters:**
  - `id`: Unique Entity ID
- **Response:** List of contradictions with timestamps, confidence scores, and source references.

#### **GET /risk\_scores/**

- **Description:** Retrieve a paginated list of current risk scores across all monitored entities.
- **Query Parameters:**
  - `jurisdiction`
  - `risk_level`
- **Response:** JSON array of risk score summaries.

#### **GET /promises/{entity\_id}**

- **Description:** List all tracked promises for an entity with fulfillment status.
- **Parameters:**
  - `entity_id`
- **Response:** JSON

#### **POST /user\_reports/**

- **Description:** Accept user-submitted flags, reports, or contradiction alerts.
- **Payload:**

```json
{
  "entity_id": "string",
  "report_type": "contradiction | risk_flag | data_correction | other",
  "content": "string",
  "user_contact": "string (optional)"
}
```

- **Response:**
  - Status: Success / Failure
  - Report ID

#### **GET /alerts/**

- **Description:** Stream of the most recent high-confidence ethical violation alerts.
- **Response:** JSON array

#### **GET /sources/{source\_id}**

- **Description:** Source provenance and reference data for a given data point.
- **Parameters:**
  - `source_id`
- **Response:** Source metadata

---

## Deployment Configuration Example (YAML)

```yaml
node:
  name: JUNZI
  class: JunziNode
  agents:
    - ContradictionScannerAgent
    - RiskProfilerAgent
    - JurisdictionContextAgent
    - BiasAuditAgent
    - PromiseTrackerAgent
    - SourceAttributionAgent
    - PublicExposureAgent
api:
  host: 0.0.0.0
  port: 8080
  base_path: /junzi/api/v1
logging:
  level: INFO
  file: /var/log/kos/junzi.log
dependencies:
  - GriotNode
  - OracleNode
  - YachayNode
  - MusaNode
security:
  enable_rate_limiting: true
  cors_allowed_origins:
    - "*"
  api_key_required: true
```

---

## CLI Deployment Example:

```bash
kOS deploy-node --class JunziNode --name JUNZI --config ./configs/junzi.yaml
```

---

**This document serves as the initial API and deployment configuration reference for JUNZI until the full OpenAPI 3.0 spec and CI/CD deployment pipelines are generated.**

