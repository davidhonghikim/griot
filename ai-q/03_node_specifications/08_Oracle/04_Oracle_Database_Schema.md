---
title: "Oracle Class: Database Schema"
description: "PostgreSQL database schema for the Oracle Node Class."
---

# Oracle Class Database Schema

The Oracle node's database manages the state of complex query jobs and caches results and knowledge to optimize performance.

```sql
-- Enables UUID generation, if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table to manage the state of asynchronous query jobs.
CREATE TABLE query_jobs (
    -- A unique identifier for each query job.
    job_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- The current status of the job (e.g., 'pending', 'executing', 'completed'). Indexed.
    status VARCHAR(50) NOT NULL,

    -- The full query string submitted by the user.
    query_string TEXT NOT NULL,

    -- The DID of the entity that requested the query.
    requester_did VARCHAR(255) NOT NULL,

    -- Timestamp of when the job was created.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Timestamp of when the job was completed or failed.
    completed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_query_jobs_status ON query_jobs (status);
CREATE INDEX idx_query_jobs_requester_did ON query_jobs (requester_did);


-- Table to cache the results of expensive queries.
CREATE TABLE query_result_cache (
    -- A hash of the canonical query string, used as a key.
    query_hash CHAR(64) PRIMARY KEY, -- SHA-256

    -- The full, rich response object, including results and explanation.
    response_payload JSONB NOT NULL,

    -- Timestamp of when this cache entry was created.
    cached_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- How long this cache entry is considered valid, in seconds.
    ttl_seconds INTEGER NOT NULL,

    -- The number of times this cache entry has been accessed.
    hit_count INTEGER DEFAULT 0
);

-- Table to store nodes of the fused knowledge graph.
CREATE TABLE knowledge_graph_nodes (
    node_uri VARCHAR(255) PRIMARY KEY, -- e.g., 'did:kos:griot:123' or 'kos:entry/article/abc-123'
    node_type VARCHAR(100) NOT NULL, -- e.g., 'GriotNode', 'Article'
    properties JSONB,
    last_updated TIMESTAMP WITH TIME ZONE
);

-- Table to store relationships (edges) between nodes in the knowledge graph.
CREATE TABLE knowledge_graph_edges (
    edge_id BIGSERIAL PRIMARY KEY,
    source_node_uri VARCHAR(255) NOT NULL REFERENCES knowledge_graph_nodes(node_uri) ON DELETE CASCADE,
    target_node_uri VARCHAR(255) NOT NULL REFERENCES knowledge_graph_nodes(node_uri) ON DELETE CASCADE,
    relationship_type VARCHAR(100) NOT NULL, -- e.g., 'authored', 'cites'
    properties JSONB,
    last_updated TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_knowledge_graph_edges_source ON knowledge_graph_edges (source_node_uri);
CREATE INDEX idx_knowledge_graph_edges_target ON knowledge_graph_edges (target_node_uri);
``` 