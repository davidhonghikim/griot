---

## title: "kOS Vector Store Alert Testing Guide" description: "Procedures for testing Prometheus Alertmanager alerts for the kOS Vector Store system, including simulated failures and verification steps." type: "testing-guide" status: "active" priority: "medium" created: "2025-06-28T00:00:00Z" version: "1.0.0" tags: ["kOS", "alerting", "prometheus", "alertmanager", "monitoring", "weaviate"]

# ✅ Overview

This guide explains how to manually trigger and verify **Prometheus Alertmanager alerts** for the **kOS Vector Store API** and **Weaviate backend**.

---

## ✅ Test 1: Vector API Downtime Simulation

### Procedure:

1. Stop the Vector API container:

```bash
docker stop vector_api
```

2. Wait 1–2 minutes for Prometheus scrape failures.

3. Expected Result:

- Prometheus triggers `VectorAPI_Down` alert
- Email sent by Alertmanager (check inbox or SMTP relay logs)
- Alert visible in Prometheus web UI under **Alerts** tab

---

## ✅ Test 2: Weaviate Unhealthy Simulation

### Procedure:

1. Stop the Weaviate container:

```bash
docker stop weaviate
```

2. Wait for Prometheus health check failures.

3. Expected Result:

- `Weaviate_Unhealthy` alert triggers
- Alert notification sent via Alertmanager

---

## ✅ Test 3: High Latency Simulation

### Procedure:

1. Introduce artificial delay in Vector API (add `time.sleep(5)` in any endpoint handler temporarily).

2. Restart the API container and make a few test queries.

3. Expected Result:

- `High_Query_Latency` alert triggers after 5+ minutes of sustained high latency

---

## ✅ Verification Steps (For All Tests)

- Check **Prometheus Web UI → Alerts**
- Confirm email or external notification (SMTP, Slack, etc)
- Review Grafana dashboard for visible metric spikes

---

## ✅ Cleanup

After testing:

- Restart all containers:

```bash
docker-compose up -d
```

- Revert any artificial delays in API code
- Clear Prometheus test state (optional)

---

**Plan ID:** kos\_2025\_06\_alert\_testing\_guide\
**Created by:** ChatGPT + User Collaboration\
**Last Updated:** 2025-06-28T00:00:00Z

