---
title: "Yachay Node 04: Database Schema"
version: 1.0
---

# **4. Yachay Node Database Schema**

## 4.1. Introduction

This document defines the database schema for the Yachay Node. The persistence layer is comprised of two distinct stores to align with the architectural design: a high-speed **Working Memory Store (WMS)** for `MemoryFragment` objects and a durable **Long-Term Storage (LTS)** for `MemoryTapestry` objects.

-   **WMS Technology**: Redis (or a compatible in-memory key-value store).
-   **LTS Technology**: MongoDB (or a compatible document-oriented database).

## 4.2. Working Memory Store (WMS) Schema - Redis

The WMS holds `MemoryFragment` objects for rapid access and processing by the Consolidation Daemon.

### 4.2.1. `fragment:[fragmentId]`

-   **Type**: `HASH`
-   **Description**: Stores a single `MemoryFragment` object. The fields of the hash map directly to the keys of the `MemoryFragment` interface.
-   **Key**: `fragment:<UUID>`
-   **Fields**:
    -   `fragmentId`: The UUID of the fragment.
    -   `tapestryId`: (Optional) The suggested tapestry ID.
    -   `sourceNodeId`: The ID of the originating node.
    -   `timestamp`: The ISO 8601 timestamp string.
    -   `content`: A JSON string representation of the fragment's content.
    -   `tags`: A comma-separated string of tags.

### 4.2.2. `fragments_by_timestamp`

-   **Type**: `SORTED SET`
-   **Description**: An index that allows the Consolidation Daemon to efficiently retrieve fragments in chronological order.
-   **Key**: `fragments_by_timestamp`
-   **Score**: The Unix timestamp (as an integer).
-   **Value**: The `fragmentId`.

## 4.3. Long-Term Storage (LTS) Schema - MongoDB

The LTS archives the fully consolidated `MemoryTapestry` documents for long-term retention and complex querying.

### 4.3.1. `tapestries` Collection

This is the primary collection for storing `MemoryTapestry` objects.

-   **Document Structure**: The structure of the documents in this collection directly maps to the `MemoryTapestry` interface defined in `02_Data_Models.md`.

    ```json
    {
      "_id": "<ObjectId>",
      "tapestryId": "<UUID>",
      "title": "<String>",
      "narrative": "<String>",
      "fragmentIds": ["<UUID>", "<UUID>", ...],
      "creationTimestamp": "<ISODate>",
      "lastAccessedTimestamp": "<ISODate>",
      "metadata": {
        "confidenceScore": "<Number>",
        "accessFrequency": "<Number>"
      },
      "relatedTapestryIds": ["<UUID>", "<UUID>", ...]
    }
    ```

### 4.3.2. Indexes on `tapestries` Collection

To ensure efficient query performance, the following indexes **MUST** be created on the `tapestries` collection:

1.  **Primary ID Index**:
    -   **Field**: `tapestryId`
    -   **Type**: `UNIQUE`
    -   **Purpose**: Ensures uniqueness and provides fast lookup by the primary `tapestryId`.

2.  **Temporal Index**:
    -   **Field**: `creationTimestamp`
    -   **Type**: `DESCENDING`
    -   **Purpose**: Optimizes queries based on date ranges.

3.  **Narrative Full-Text Index**:
    -   **Field**: `narrative`
    -   **Type**: `TEXT`
    -   **Purpose**: Enables efficient natural language searches on the generated summary of the memory.

4.  **Metadata Index**:
    -   **Fields**: `metadata.confidenceScore`, `metadata.accessFrequency`
    -   **Type**: `COMPOUND`
    -   **Purpose**: Facilitates queries that filter or sort based on metadata attributes. 