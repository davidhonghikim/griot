# JUNZI Database ERD - Text Specification

**Node Class:** JunziNode  
**System:** kOS Ecosystem  
**Document Type:** Database Entity Relationship Design (Textual ERD)

---

## 🎯 Purpose:
Define the core data models and entity relationships that power JUNZI’s public accountability, contradiction tracking, risk scoring, and promise monitoring functions.

---

## ✅ Core Entities:

### 1. **Entity**
- **Fields:**
  - `entity_id (PK)`
  - `name`
  - `jurisdiction`
  - `role`
  - `affiliations`
  - `created_at`
  - `updated_at`

---

### 2. **ActionEvent**
- **Purpose:** Records discrete actions taken by entities (e.g., votes, financial transactions, statements).
- **Fields:**
  - `action_id (PK)`
  - `entity_id (FK → Entity)`
  - `action_type`
  - `description`
  - `event_date`
  - `source_id (FK → Source)`

---

### 3. **ContradictionRecord**
- **Purpose:** Captures contradictions detected between past statements and subsequent actions.
- **Fields:**
  - `contradiction_id (PK)`
  - `entity_id (FK → Entity)`
  - `description`
  - `confidence_score`
  - `contradiction_date`
  - `source_1_id (FK → Source)`
  - `source_2_id (FK → Source)`

---

### 4. **RiskScore**
- **Purpose:** Maintains time-based ethical risk scores for each entity.
- **Fields:**
  - `risk_id (PK)`
  - `entity_id (FK → Entity)`
  - `risk_value`
  - `risk_factors_json`
  - `bias_audit_id (FK → BiasAuditLog)`
  - `calculated_at`

---

### 5. **PromiseRecord**
- **Purpose:** Tracks promises made by public entities and fulfillment status.
- **Fields:**
  - `promise_id (PK)`
  - `entity_id (FK → Entity)`
  - `promise_text`
  - `date_made`
  - `status (Pending / Fulfilled / Broken / Stale)`
  - `source_id (FK → Source)`

---

### 6. **UserReport**
- **Purpose:** Stores citizen-submitted reports or dispute flags against JUNZI data.
- **Fields:**
  - `report_id (PK)`
  - `entity_id (FK → Entity)`
  - `report_type (Contradiction / Bias / Error / Other)`
  - `content`
  - `user_contact`
  - `submitted_at`

---

### 7. **Source**
- **Purpose:** Full provenance of every external data point ingested by JUNZI.
- **Fields:**
  - `source_id (PK)`
  - `origin`
  - `url`
  - `capture_timestamp`
  - `content_hash`
  - `document_type`

---

### 8. **BiasAuditLog**
- **Purpose:** Bias audit results for each calculated risk score.
- **Fields:**
  - `bias_audit_id (PK)`
  - `risk_id (FK → RiskScore)`
  - `audit_summary_json`
  - `audit_timestamp`

---

## ✅ Key Relationships:

- One **Entity** → Many **ActionEvents**, **ContradictionRecords**, **RiskScores**, **Promises**, **UserReports**
- One **RiskScore** → One **BiasAuditLog**
- Many-to-One **ContradictionRecords**, **ActionEvents**, **Promises** → **Source**
- One **UserReport** → One **Entity**

---

## ✅ Future Tables (Phase 2+):
| Table | Purpose |
|---|---|
| **DisputeLog** | Tracks the full lifecycle of disputes and appeals |
| **JurisdictionMetadata** | Standardized jurisdiction hierarchy management |
| **EventAuditTrail** | Logs all API and system-level changes for transparency audits |

---

**This document now serves as the canonical JUNZI Database ERD Text Specification for backend and data teams within the kOS ecosystem until formally revised.**

