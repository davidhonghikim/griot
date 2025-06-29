---

## title: "kOS Vector Store Monitoring Deployment Guide" description: "Step-by-step instructions for deploying Prometheus and Grafana monitoring for the kOS Vector Store API and Weaviate backend." type: "deployment-guide" status: "active" priority: "high" created: "2025-06-28T00:00:00Z" version: "1.0.0" tags: ["kOS", "monitoring", "prometheus", "grafana", "weaviate", "fastapi"]

# ✅ Overview

This guide provides a full walkthrough for deploying **Prometheus** and **Grafana** to monitor the **kOS Vector Store API** and **Weaviate backend**, using the provided scrape config and Grafana dashboard.

---

## ✅ Prerequisites

- Docker and Docker Compose installed
- Vector Store API and Weaviate containers running
- Prometheus config file (`prometheus.yml`) with correct scrape targets
- Grafana dashboard JSON (from `kOS_Vector_Store_Grafana_Dashboard_Export`)

---

## ✅ Deploy Prometheus

1. Create directory structure:

```bash
mkdir -p monitoring/prometheus
cp prometheus.yml monitoring/prometheus/
```

2. Example Prometheus Docker run:

```bash
docker run -d \
  --name prometheus \
  -p 9090:9090 \
  -v $(pwd)/monitoring/prometheus:/etc/prometheus \
  prom/prometheus
```

Access Prometheus: [http://localhost:9090](http://localhost:9090)

---

## ✅ Deploy Grafana

1. Example Grafana Docker run:

```bash
docker run -d \
  --name grafana \
  -p 3000:3000 \
  grafana/grafana-enterprise
```

Access Grafana: [http://localhost:3000](http://localhost:3000)\
Login: `admin` / `admin`

2. Add Prometheus as a data source:

- Navigate to **Configuration → Data Sources → Add New**
- Type: Prometheus
- URL: `http://host.docker.internal:9090` (for Mac/Windows) or `http://localhost:9090`

3. Import Dashboard:

- Navigate to **Dashboards → Import**
- Upload the JSON export from `kOS_Vector_Store_Grafana_Dashboard_Export`

---

## ✅ Optional: Docker Compose Stack

```yaml
version: '3.8'
services:
  weaviate:
    image: semitechnologies/weaviate:latest
    ports:
      - "8080:8080"
    environment:
      - QUERY_DEFAULTS_LIMIT=25
      - AUTHENTICATION_ANONYMOUS_ACCESS_ENABLED=true

  vector_api:
    build: .
    ports:
      - "8000:8000"
    depends_on:
      - weaviate

  prometheus:
    image: prom/prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./monitoring/prometheus:/etc/prometheus

  grafana:
    image: grafana/grafana-enterprise
    ports:
      - "3000:3000"
```

---

## ✅ Next Steps

- Configure Prometheus Alertmanager for automated notifications
- Extend Grafana dashboard with per-agent and per-class metrics
- Enable Prometheus scraping on additional kOS microservices

---

**Plan ID:** kos\_2025\_06\_monitoring\_deployment\_guide\
**Created by:** ChatGPT + User Collaboration\
**Last Updated:** 2025-06-28T00:00:00Z

