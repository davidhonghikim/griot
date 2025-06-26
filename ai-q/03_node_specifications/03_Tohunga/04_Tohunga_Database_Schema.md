---
title: "Tohunga Class: Database Schema"
description: "PostgreSQL database schema for the Tohunga Node Class."
---

# Tohunga Class Database Schema

The Tohunga node requires a persistent storage layer to manage its state. The following schema is designed for a PostgreSQL database.

```sql
-- Enables UUID generation, if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table to store reusable configurations for external data sources.
CREATE TABLE data_sources (
    -- A unique identifier for each data source configuration.
    source_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- A human-readable name for the data source (e.g., "GitHub Public API").
    source_name TEXT NOT NULL,

    -- The type of the data source, which determines the structure of connection_config.
    -- (e.g., 'http_api', 'postgresql', 's3_bucket').
    source_type VARCHAR(100) NOT NULL,

    -- A JSONB blob containing the necessary connection details, such as base URLs,
    -- connection strings, or API keys (should reference a secret management system).
    connection_config JSONB NOT NULL,

    -- The DID of the node that registered and owns this data source configuration.
    -- Ensures that only the owner can modify or delete it.
    owner_did VARCHAR(255) NOT NULL,

    -- Timestamp of when the data source was registered.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index on owner_did for efficient lookup of sources by their owner.
CREATE INDEX idx_data_sources_owner_did ON data_sources (owner_did);


-- Table to track the status and results of data acquisition and processing jobs.
CREATE TABLE acquisition_jobs (
    -- A unique identifier for each acquisition job.
    job_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Foreign key referencing the data source being used for this job.
    source_id UUID NOT NULL REFERENCES data_sources(source_id),

    -- JSONB blob containing the request-specific parameters, such as API paths or SQL queries.
    request_params JSONB,

    -- JSONB blob containing the array of pipeline steps (validation, transformation) to be executed.
    pipeline_steps JSONB NOT NULL,

    -- JSONB blob containing the configuration for the output, such as format and destination.
    output_config JSONB NOT NULL,

    -- The current status of the job (e.g., pending, running, completed, failed).
    -- Indexed for quick filtering of jobs by their state.
    status VARCHAR(50) NOT NULL,

    -- URI pointing to the final data asset created by a successful job.
    result_uri TEXT,

    -- Timestamp of when the job was created.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Timestamp of when the job was completed or failed.
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Index on status for efficient querying of jobs by their state.
CREATE INDEX idx_acquisition_jobs_status ON acquisition_jobs (status);

-- Index on source_id to quickly find all jobs related to a specific data source.
CREATE INDEX idx_acquisition_jobs_source_id ON acquisition_jobs (source_id);
``` 