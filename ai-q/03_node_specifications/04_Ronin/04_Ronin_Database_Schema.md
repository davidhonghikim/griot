---
title: "Ronin Class: Database Schema"
description: "PostgreSQL database schema for the Ronin Node Class."
---

# Ronin Class Database Schema

The Ronin node requires a persistent storage layer to manage its state, primarily for tracking discovery jobs and the services they find.

```sql
-- Enables UUID generation, if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table to store the state of asynchronous discovery jobs.
CREATE TABLE discovery_jobs (
    -- A unique identifier for each discovery job.
    job_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- The current status of the job (e.g., pending, running, completed, failed).
    -- Indexed for quick filtering.
    status VARCHAR(50) NOT NULL,

    -- A JSONB blob containing the parameters the job was started with.
    params JSONB NOT NULL,

    -- Timestamp of when the job was created.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Timestamp of when the job was completed or failed.
    completed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_discovery_jobs_status ON discovery_jobs (status);


-- Table to store information about services discovered on the network.
-- This acts as the Ronin's "map" of the known kOS ecosystem.
CREATE TABLE discovered_services (
    -- A unique, node-specific identifier for the discovered service.
    service_id VARCHAR(255) PRIMARY KEY, -- e.g., did:kos:service:...

    -- The DID of the node hosting the service.
    node_id VARCHAR(255) NOT NULL,

    -- The class or archetype of the node (e.g., 'Griot', 'Tohunga').
    node_class VARCHAR(100) NOT NULL,

    -- The primary network endpoint for the service.
    endpoint TEXT NOT NULL,
    
    -- A JSONB array listing the capabilities offered by the service.
    -- Indexed for efficient querying of services by their capabilities.
    capabilities JSONB,

    -- A JSONB blob containing additional metadata from the discovery process.
    discovery_metadata JSONB,

    -- Timestamp of when the service was last seen or verified.
    last_seen TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Create a GIN index on the capabilities for fast lookups.
CREATE INDEX idx_discovered_services_capabilities ON discovered_services USING GIN (capabilities);

-- Index on node_class for quick filtering of services by their class.
CREATE INDEX idx_discovered_services_node_class ON discovered_services (node_class);
``` 