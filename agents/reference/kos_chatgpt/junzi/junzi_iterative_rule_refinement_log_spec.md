# JUNZI Phase 3 - Detailed Technical Specification: Iterative Rule Refinement Log (IRRL)

## Module Name:
Iterative Rule Refinement Log (IRRL)

## Module Purpose:
The IRRL provides a secure, immutable, and version-controlled logging system for tracking all rule changes, stakeholder-driven adjustments, ethical drift corrections, and iterative calibrations made during Phase 3 pilot operations. It creates a full historical trail of rule evolution for auditing, ethical oversight, and machine learning model refinement.

---

## System Architecture

### Rule Change Logging Pipeline:

1. **Change Detection Layer:**
   - Listens for all rule creation, modification, and deletion events from DERE.
   - Captures changes made through:
     - Stakeholder Feedback Loop (SFL)
     - EDM-triggered drift corrections
     - RAME mitigation recommendations
     - Manual interventions by ethics operators

2. **Version Control Engine:**
   - Assigns incremental version numbers to each rule update.
   - Supports semantic versioning (e.g., v2.1.0 for minor updates, v3.0.0 for major overhauls).

3. **Change Metadata Enrichment:**
   - Captures contextual metadata:
     - Initiator (user or system module)
     - Reason for change (drift correction, feedback response, risk mitigation, etc.)
     - Impact Scope (global, site-specific, stakeholder-specific)

4. **Diff Snapshot Generator:**
   - Stores pre-change and post-change rule states for comparison.
   - Runs automated semantic diff highlighting key logic differences.

5. **Audit Trail Submission Layer:**
   - Logs all changes into EAT.
   - Links rule changes to triggering feedback, drift alerts, or risk assessments.

6. **Reporting and Export Module:**
   - Generates daily, weekly, or custom-range rule refinement reports.
   - Supports export in JSON, CSV, and PDF formats.

---

## Data Models

### Rule Change Log Entry:
```json
{
  "log_id": "uuid",
  "rule_id": "uuid",
  "previous_version": "string",
  "new_version": "string",
  "change_type": "Create | Update | Delete",
  "initiator": "user_id | system_module",
  "change_reason": "Stakeholder Feedback | Ethical Drift Correction | Risk Mitigation | Manual Adjustment",
  "impact_scope": "Global | SiteSpecific | StakeholderGroupSpecific",
  "pre_change_snapshot": "JSON",
  "post_change_snapshot": "JSON",
  "diff_summary": "string",
  "timestamp": "ISO8601"
}
```

---

## API Endpoints

| Endpoint | Method | Description |
|----|----|----|
| /irrl/log-change | POST | Records a new rule change event |
| /irrl/get-log/{log_id} | GET | Retrieves details for a specific rule change |
| /irrl/get-history/{rule_id} | GET | Returns version history for a specific rule |
| /irrl/export-changes | POST | Exports rule change logs over a selected time window |

---

## Versioning Policy
- **Semantic Versioning Format:** MAJOR.MINOR.PATCH
- **Auto-Increment Rules:**
   - PATCH: Minor logic tweaks or metadata updates
   - MINOR: Rule logic adjustments affecting decision flow
   - MAJOR: Structural or ethical priority redefinitions

---

## Performance Targets
- **Logging Latency:** Under 100ms per change event
- **History Query Latency:** Under 500ms for single-rule version history
- **Export Latency:** Under 2 minutes for 10,000+ entries

---

## Monitoring and Metrics
- **Change Frequency per Rule**
- **Most Frequently Modified Rules**
- **Top Change Initiators (by volume)**
- **Impact Scope Distribution**

---

## Security Considerations
- Only authorized ethics operators and system modules can trigger rule changes
- All API calls require OAuth 2.0 authentication
- All change logs write-once and append-only
- Full encryption at rest and in transit

---

## Testing Requirements
- **Unit Tests:**
  - Change event parsing
  - Diff snapshot accuracy

- **Integration Tests:**
  - IRRL ↔ DERE rule change event flow
  - IRRL ↔ EAT audit logging

- **Load Tests:**
  - High-frequency rule update stress testing

- **Data Consistency Tests:**
  - Version history validation

---

## Deployment Profile
- **Language:** Python 3.11 or Node.js 18+
- **Containerization:** Docker + Kubernetes
- **Storage:** PostgreSQL for log storage

---

## Dependencies
- DERE API
- EAT API
- SFL API (for feedback-driven changes)
- EDM API (for drift-related changes)
- RAME API (for risk-driven changes)

---

## End of Phase 3 Core Module Specifications

---

_End of JUNZI Iterative Rule Refinement Log (IRRL) Technical Specification Document._

