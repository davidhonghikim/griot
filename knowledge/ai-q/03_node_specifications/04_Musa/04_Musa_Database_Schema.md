---
title: "Musa Class: Database Schema"
description: "PostgreSQL database schema for the Musa Node Class."
---

# Musa Class Database Schema

The Musa node requires a persistent storage layer to manage authorization policies and to create an immutable audit trail of security events.

```sql
-- Enables UUID generation, if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table to store authorization policies.
CREATE TABLE policies (
    -- A unique identifier for each policy.
    policy_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- A human-readable name for the policy.
    policy_name TEXT NOT NULL,

    -- The effect of the policy, either 'Allow' or 'Deny'.
    effect VARCHAR(10) NOT NULL CHECK (effect IN ('Allow', 'Deny')),

    -- A JSONB array of actions this policy applies to (e.g., ["read", "write"]).
    actions JSONB NOT NULL,

    -- A JSONB array of resources this policy applies to, supporting wildcards
    -- (e.g., ["did:kos:document:123", "did:kos:document:456:*"]).
    resources JSONB NOT NULL,

    -- A JSONB object containing the detailed policy logic, e.g., a Rego policy definition.
    conditions JSONB,

    -- The DID of the node or user that owns and can manage this policy.
    owner_did VARCHAR(255) NOT NULL,

    -- Timestamp of when the policy was created.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index on owner_did for efficient lookup of policies.
CREATE INDEX idx_policies_owner_did ON policies (owner_did);

-- Table to store an immutable log of security-sensitive events.
CREATE TABLE security_audit_logs (
    -- A unique identifier for each log entry.
    log_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Timestamp of the event, with timezone.
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,

    -- Type of the event being logged (e.g., 'AUTHENTICATION', 'AUTHORIZATION').
    event_type VARCHAR(50) NOT NULL,

    -- The DID of the principal that initiated the event.
    principal_id VARCHAR(255) NOT NULL,

    -- The IP address from which the request originated.
    source_ip INET,

    -- The action that was attempted (e.g., 'validate_credential', 'read').
    action VARCHAR(100) NOT NULL,

    -- The resource that was targeted.
    resource TEXT,

    -- The outcome of the event (e.g., 'Success', 'Failure').
    outcome VARCHAR(50) NOT NULL,

    -- A JSONB blob for storing detailed, event-specific context,
    -- such as the policy that was evaluated or the error code on failure.
    details JSONB
);

-- Index on timestamp for time-series analysis and efficient querying by date range.
CREATE INDEX idx_security_audit_logs_timestamp ON security_audit_logs (timestamp);

-- Index on principal_id to quickly retrieve all events for a specific user or node.
CREATE INDEX idx_security_audit_logs_principal_id ON security_audit_logs (principal_id);

-- Index on event_type to filter by event category.
CREATE INDEX idx_security_audit_logs_event_type ON security_audit_logs (event_type);
``` 