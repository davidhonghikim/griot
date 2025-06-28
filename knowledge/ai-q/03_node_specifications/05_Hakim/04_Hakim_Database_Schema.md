---
title: "Hakim Class: Database Schema"
description: "PostgreSQL database schema for the Hakim Node Class."
---

# Hakim Class Database Schema

The Hakim node requires a persistent storage layer to track historical health data and manage the state of maintenance jobs.

```sql
-- Enables UUID generation, if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table to store historical health reports for trend analysis.
CREATE TABLE health_reports (
    -- A unique identifier for each report.
    report_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- The DID of the node that was monitored. Indexed for fast lookups.
    target_node_did VARCHAR(255) NOT NULL,

    -- Timestamp when the report was generated. Indexed for time-series queries.
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,

    -- The overall status of the node at the time of the report.
    status VARCHAR(50) NOT NULL,

    -- A JSONB blob containing detailed performance metrics.
    metrics JSONB,

    -- A JSONB blob containing a summary of the diagnosis.
    diagnosis JSONB,

    -- The full, raw report data.
    raw_report JSONB NOT NULL
);

CREATE INDEX idx_health_reports_target_node_did ON health_reports (target_node_did);
CREATE INDEX idx_health_reports_timestamp ON health_reports (timestamp);


-- Table to manage the state of maintenance jobs.
CREATE TABLE maintenance_jobs (
    -- A unique identifier for each maintenance job.
    job_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- The DID of the node being maintained.
    target_node_did VARCHAR(255) NOT NULL,

    -- The DID of the entity that requested the job.
    requester_did VARCHAR(255) NOT NULL,
    
    -- The name of the task to be performed.
    task_name VARCHAR(100) NOT NULL,

    -- A JSONB blob containing the parameters for the task.
    params JSONB,

    -- The current status of the job (e.g., 'PendingApproval', 'Running'). Indexed for quick filtering.
    status VARCHAR(50) NOT NULL,

    -- A JSONB array to log the history of status changes.
    status_history JSONB,

    -- Timestamp of when the job was created.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Timestamp of when the job was completed or failed.
    completed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_maintenance_jobs_status ON maintenance_jobs (status);
CREATE INDEX idx_maintenance_jobs_target_node_did ON maintenance_jobs (target_node_did);
``` 