---
title: "Sachem Node 04: Database Schema"
version: 1.0
---

# **4. Sachem Node Database Schema**

## 4.1. Introduction

The Sachem Node requires a database to manage the state of active `Claim` debates and to persist the `ReputationRecord` for every node in the kOS ecosystem. Unlike Yachay, which archives final `Accord` records, Sachem is concerned with the *process* of consensus. A document-oriented database like MongoDB is well-suited for this role.

## 4.2. MongoDB Collections

### 4.2.1. `claims` Collection

This collection holds `Claim` documents, representing all assertions currently or previously under debate.

-   **Document Structure**: Maps to the `Claim` interface from `02_Data_Models.md`.

    ```json
    {
      "_id": "<ObjectId>",
      "claimId": "<UUID>",
      "proposingNodeId": "<String>",
      "timestamp": "<ISODate>",
      "statement": "<String>",
      "evidence_tapestryIds": ["<UUID>", ...],
      "status": "PENDING" | "DEBATE" | "ACCEPTED" | "REJECTED",
      "voting_deadline": "<ISODate>"
    }
    ```

-   **Indexes**:
    1.  **Claim ID Index**:
        -   **Field**: `claimId`
        -   **Type**: `UNIQUE`
        -   **Purpose**: Fast lookup of specific claims.
    2.  **Status & Deadline Index**:
        -   **Fields**: `{ "status": 1, "voting_deadline": 1 }`
        -   **Type**: `COMPOUND`
        -   **Purpose**: Allows the Debate Manager to efficiently find all claims currently in the `DEBATE` state that have passed their deadline.

### 4.2.2. `votes` Collection

This collection stores every individual `Vote` cast on every `Claim`.

-   **Document Structure**: Maps to the `Vote` interface from `02_Data_Models.md`.

    ```json
    {
      "_id": "<ObjectId>",
      "claimId": "<UUID>",
      "votingNodeId": "<String>",
      "choice": "FOR" | "AGAINST" | "ABSTAIN",
      "reputationWeight": "<Number>"
    }
    ```

-   **Indexes**:
    1.  **Claim & Voter Index**:
        -   **Fields**: `{ "claimId": 1, "votingNodeId": 1 }`
        -   **Type**: `UNIQUE (COMPOUND)`
        -   **Purpose**: Ensures a node can only vote once per claim and allows for fast retrieval of all votes for a given claim.

### 4.2.3. `reputation_ledger` Collection

This collection holds the authoritative `ReputationRecord` for each node.

-   **Document Structure**: Maps to the `ReputationRecord` interface from `02_Data_Models.md`.

    ```json
    {
      "_id": "<ObjectId>",
      "nodeId": "<String>",
      "score": "<Number>",
      "lastUpdated": "<ISODate>"
    }
    ```

-   **Indexes**:
    1.  **Node ID Index**:
        -   **Field**: `nodeId`
        -   **Type**: `UNIQUE`
        -   **Purpose**: Ensures there is only one reputation record per node and allows for fast lookup. 