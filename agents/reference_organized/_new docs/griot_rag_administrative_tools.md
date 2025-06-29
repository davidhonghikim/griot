---
title: "Griot RAG Administrative Tools"
description: |
  Toolset for Node Admins and System Admins to manage, monitor, and troubleshoot the Griot RAG system within kOS.

toolset:
  - tool: "RAG Query Dashboard"
    purpose: "Monitor live query traffic, agent activity, and latency metrics"
    technology:
      - Grafana
      - Prometheus

  - tool: "Index Health Checker"
    purpose: "Run diagnostics on vector index integrity and performance"
    frequency: "Daily or on-demand"

  - tool: "Document Contribution Tracker"
    purpose: "Audit which agents contributed which documents and when"
    features:
      - Agent filter
      - Time range filter
      - Export to CSV

  - tool: "API Usage Monitor"
    purpose: "Track API endpoint usage rates and error responses"
    integration:
      - FastAPI middleware
      - Prometheus Exporter

  - tool: "Access Control Manager"
    purpose: "Manage API keys, agent roles, and rate limits"
    backend:
      - Local Admin Dashboard UI
      - CLI utility

future_admin_tools:
  - Anomaly Detection Alerts
  - Agent Contribution Quality Scoring
  - Auto-scaling Policy Tuner

...

