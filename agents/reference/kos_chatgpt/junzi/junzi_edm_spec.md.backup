# JUNZI Phase 3 - Detailed Technical Specification: Ethical Drift Monitor (EDM)

## Module Name:

Ethical Drift Monitor (EDM)

## Module Purpose:

The EDM continuously monitors deployed JUNZI instances across all external pilot sites for signs of ethical drift—unintended divergence from the approved ethical rule baseline. It detects rule inconsistencies, decision deviations, stakeholder bias shifts, and drift trends across time and geography.

---

## System Architecture

### Drift Monitoring Pipeline:

1. **Rule Set Snapshot Collector:**

   - Pulls active rule set versions from each site’s DERE instance.
   - Timestamped snapshots stored for historical drift comparison.

2. **Decision Outcome Sampler:**

   - Periodically samples JEDE decision outcomes across pilot sites.
   - Focuses on high-risk decision categories and conflict-prone scenarios.

3. **Drift Detection Engine:**

   - Runs differential analysis on rule sets and decision outcomes between sites.
   - Metrics calculated:
     - Rule Divergence Score (RDS)
     - Decision Outcome Variance (DOV)
     - Stakeholder Bias Shift Index (SBSI)

4. **Ethical Drift Scoring Model:**

   - Calculates overall Ethical Drift Risk Score (EDRS) for each site and system-wide.
   - Formula (example weighted model):

```python
EDRS = (RDS * 0.5) + (DOV * 0.3) + (SBSI * 0.2)
```

5. **Alert and Escalation Layer:**

   - Triggers alerts when EDRS exceeds predefined thresholds.
   - Flags modules or rule sets contributing most to the drift.
   - Optional auto-lockout or rollback triggers for critical drift levels.

6. **Drift Visualization Dashboard:**

   - Graphical drift heatmaps
   - Time-series drift trend lines
   - Site comparison tables

---

## Data Models

### Drift Snapshot Record:

```json
{
  "snapshot_id": "uuid",
  "site_id": "uuid",
  "timestamp": "ISO8601",
  "rule_set_version": "string",
  "decision_outcomes_sample": [
    {
      "decision_id": "uuid",
      "outcome": "string",
      "rule_applied": "string"
    }
  ],
  "metrics": {
    "rds": "float",
    "dov": "float",
    "sbsi": "float",
    "edrs": "float"
  }
}
```

---

## API Endpoints

| Endpoint                         | Method | Description                                           |
| -------------------------------- | ------ | ----------------------------------------------------- |
| /edm/collect-snapshot/{site\_id} | POST   | Triggers rule and decision data collection for a site |
| /edm/get-drift-score/{site\_id}  | GET    | Returns current EDRS for a site                       |
| /edm/get-drift-trend/{site\_id}  | GET    | Returns historical drift trend for a site             |
| /edm/trigger-drift-alerts        | POST   | Manually triggers drift alert evaluation              |
| /edm/get-driftsystem-summary     | GET    | Returns system-wide drift metrics                     |

---

## Algorithms and Logic

1. **Rule Set Diff Algorithm:**

   - Line-by-line JSON diff
   - Version history diff tracking

2. **Decision Outcome Variance Calculator:**

   - Uses decision outcome frequency histograms
   - Calculates variance against system baseline

3. **Stakeholder Bias Shift Detection:**

   - Compares stakeholder outcome distributions over time
   - Flags significant bias deltas

---

## Performance Targets

- **Snapshot Processing Time:** Under 5 minutes per site
- **Drift Detection Latency:** Under 1 minute after snapshot
- **Alert Dispatch Time:** Under 30 seconds post-threshold breach

---

## Monitoring and Metrics

- **Average Drift Score Across Sites**
- **High Drift Event Frequency**
- **Rule Divergence Rates**
- **Bias Shift Volatility Index**

Monitoring Tools: ELK + Prometheus, with Drift-specific Grafana dashboards.

---

## Security Considerations

- Secure API calls with OAuth 2.0
- Site-level access controls
- Drift analysis logs stored in EAT
- Audit trails for all threshold changes and manual overrides

---

## Testing Requirements

- **Unit Tests:**

  - Diff calculation logic
  - Drift score calculation accuracy

- **Integration Tests:**

  - EDM ↔ DERE rule sync tests
  - EDM ↔ JEDE decision outcome sampling tests

- **Load Tests:**

  - Simulate multiple concurrent site snapshots

- **False Positive Rate Tests:**

  - Validate drift alerts against synthetic test cases

---

## Deployment Profile

- **Language:** Python 3.11 or Node.js 18+
- **Containerization:** Docker + Kubernetes
- **Storage:** PostgreSQL for drift snapshots and metrics

---

## Dependencies

- DERE API (for rule snapshots)
- JEDE API (for decision sampling)
- EAT API (for logging)
- SFL API (optional, for bias analysis)

---

## Next Document:

External Ethics Monitoring Dashboard - Full Technical Specification

---

*End of JUNZI Ethical Drift Monitor (EDM) Technical Specification Document.*

