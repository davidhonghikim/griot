---
title: "Griot Class: Database Schema"
description: "PostgreSQL database schema for the Griot Node Class."
---

## 6. Database Schema

The Griot node requires a persistent storage layer to manage its state. The following schema is designed for a PostgreSQL database, utilizing `JSONB` for flexible metadata storage.

```sql
-- Enables UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table to store metadata about each distributable node package.
-- This acts as the central registry of all "genetic code" available to the ecosystem.
CREATE TABLE packages (
    -- The primary key is the SHA-256 hash of the node artifact (.tar.gz).
    -- This ensures content-addressable, immutable storage.
    package_id VARCHAR(64) PRIMARY KEY,

    -- A JSONB blob containing all package metadata, including version, author,
    -- dependencies, and the cryptographic signature of the manifest.
    -- Indexed for efficient querying of manifest properties.
    manifest JSONB NOT NULL,

    -- The URL where the actual .tar.gz artifact can be retrieved from.
    -- This could be an IPFS, HTTP, or other URI.
    artifact_url TEXT NOT NULL,

    -- The Decentralized Identifier (DID) of the entity that created and signed the package.
    author_did VARCHAR(255) NOT NULL,

    -- The cryptographic signature of the manifest, used to verify authenticity and integrity.
    signature TEXT NOT NULL,

    -- Timestamp of when the package was first registered.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create a GIN index on the manifest for fast lookups within the JSONB data.
-- This allows for efficient queries like finding all packages by a certain author
-- or all packages for a specific node class.
CREATE INDEX idx_packages_manifest ON packages USING GIN (manifest);


-- Table to track the status of node installation jobs.
-- This provides an auditable log of all "differentiation" processes initiated by this Griot.
CREATE TABLE installations (
    -- A unique identifier for each installation job.
    job_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Foreign key referencing the package being installed.
    -- Ensures that an installation job is always linked to a valid package.
    package_id VARCHAR(64) NOT NULL REFERENCES packages(package_id),

    -- The DID of the node that initiated this installation job.
    target_node_id VARCHAR(255) NOT NULL,

    -- The current status of the job (e.g., pending, running, completed, failed).
    -- Indexed for quick filtering of jobs by their state.
    status VARCHAR(50) NOT NULL,

    -- A human-readable message providing more context on the current status.
    status_message TEXT,

    -- An array of log messages captured during the installation process.
    -- Useful for debugging failed installations.
    logs TEXT[],

    -- Timestamp of when the job was created.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Timestamp of when the job was completed or failed.
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Create an index on the status column for efficient querying of jobs by their state.
CREATE INDEX idx_installations_status ON installations (status);
``` 