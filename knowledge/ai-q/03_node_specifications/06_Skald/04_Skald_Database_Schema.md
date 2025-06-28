---
title: "Skald Class: Database Schema"
description: "PostgreSQL database schema for the Skald Node Class."
---

# Skald Class Database Schema

The Skald node's database manages topics and subscriptions. For persistent topics, it also stores the message log.

```sql
-- Enables UUID generation, if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table to store topic metadata.
CREATE TABLE topics (
    -- The unique name of the topic. Primary key.
    topic_name VARCHAR(255) PRIMARY KEY,

    -- Whether messages on this topic should be persisted.
    is_persistent BOOLEAN NOT NULL DEFAULT FALSE,

    -- The DID of the node that created the topic.
    owner_did VARCHAR(255) NOT NULL,

    -- A JSONB blob for Access Control Lists (ACLs).
    acl JSONB,

    -- Timestamp of when the topic was created.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Timestamp of the last message published to this topic.
    last_published_at TIMESTAMP WITH TIME ZONE
);

-- Table to manage subscriptions.
CREATE TABLE subscriptions (
    -- A unique identifier for each subscription.
    subscription_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- The topic being subscribed to. Foreign key to the topics table.
    topic_name VARCHAR(255) NOT NULL REFERENCES topics(topic_name) ON DELETE CASCADE,

    -- The DID of the subscribing node.
    subscriber_did VARCHAR(255) NOT NULL,

    -- Whether the subscription is currently active.
    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    -- Timestamp of when the subscription was created.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Ensure a node can only subscribe to a topic once.
    UNIQUE (topic_name, subscriber_did)
);

CREATE INDEX idx_subscriptions_topic_name ON subscriptions (topic_name);
CREATE INDEX idx_subscriptions_subscriber_did ON subscriptions (subscriber_did);

-- Table to store messages for persistent topics. This is the message log.
CREATE TABLE event_messages (
    -- A unique, sequential identifier for messages.
    message_id BIGSERIAL PRIMARY KEY,

    -- The topic the message was published to. Foreign key to the topics table.
    topic_name VARCHAR(255) NOT NULL REFERENCES topics(topic_name) ON DELETE CASCADE,

    -- The full event message payload.
    event_data JSONB NOT NULL,

    -- Timestamp when the message was received by the Skald node. Indexed for replay.
    published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_event_messages_topic_name_published_at ON event_messages (topic_name, published_at);
``` 