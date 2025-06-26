---
title: "Sachem Node 03: KLF API"
version: 1.0
---

# **3. Sachem Node KLF API Specification**

## 3.1. Introduction

The Sachem Node's KLF API is the public interface for the kOS consensus and reputation system. It allows nodes to propose claims for consensus, cast votes on active debates, and query the reputation of other nodes.

## 3.2. KLF Message Types

The Sachem Node listens for the following message types:

| Message Type                | Description                                | Payload Interface              |
| --------------------------- | ------------------------------------------ | ------------------------------ |
| `SACHEM_PROPOSE_CLAIM`      | A node proposes a new `Claim` for debate.  | `SachemProposeClaimRequest`    |
| `SACHEM_CAST_VOTE`          | A node casts a `Vote` on an active `Claim`.| `SachemCastVoteRequest`        |
| `SACHEM_QUERY_REPUTATION`   | A node requests the reputation of another. | `SachemQueryReputationRequest` |

The Sachem Node dispatches the following message types:

| Message Type                | Description                                | Payload Interface              |
| --------------------------- | ------------------------------------------ | ------------------------------ |
| `SACHEM_DEBATE_OPENED`      | Announces a new `Claim` is open for voting.| `SachemDebateOpened`           |
| `SACHEM_ACCORD_REACHED`     | Announces the final `Accord` on a `Claim`. | `Accord`                       |
| `SACHEM_REPUTATION_RESPONSE`| Returns the result of a reputation query.  | `SachemReputationResponse`     |
| `SACHEM_API_ERROR`          | Indicates a processing error.              | `SachemApiError`               |

## 3.3. API Endpoint Details & Payloads

### 3.3.1. Proposing a Claim

**Request Message:** `SACHEM_PROPOSE_CLAIM`
-   **Payload (`SachemProposeClaimRequest`)**:
    ```typescript
    interface SachemProposeClaimRequest {
      statement: string;
      evidence_tapestryIds: string[];
    }
    ```

**Response Message:** `SACHEM_DEBATE_OPENED` (Broadcast to relevant nodes)
-   **Payload (`SachemDebateOpened`)**:
    ```typescript
    interface SachemDebateOpened {
      claimId: string;
      proposingNodeId: string;
      statement: string;
      voting_deadline: Date;
    }
    ```

### 3.3.2. Casting a Vote

**Request Message:** `SACHEM_CAST_VOTE`
-   **Payload (`SachemCastVoteRequest`)**:
    ```typescript
    interface SachemCastVoteRequest {
      claimId: string;
      choice: 'FOR' | 'AGAINST' | 'ABSTAIN';
    }
    ```
- **Response**: None, this is a fire-and-forget message. The result is announced in the final `Accord`.

### 3.3.3. Announcing an Accord

**Dispatch Message:** `SACHEM_ACCORD_REACHED` (Broadcast)
- **Description**: This message is broadcast to all subscribed nodes upon the finalization of a debate. The payload is the full `Accord` data model.
- **Payload (`Accord`)**: See `02_Data_Models.md`.

### 3.3.4. Querying Reputation

**Request Message:** `SACHEM_QUERY_REPUTATION`
-   **Payload (`SachemQueryReputationRequest`)**:
    ```typescript
    interface SachemQueryReputationRequest {
      queryId: string;
      targetNodeId: string;
    }
    ```

**Response Message:** `SACHEM_REPUTATION_RESPONSE`
-   **Payload (`SachemReputationResponse`)**:
    ```typescript
    interface SachemReputationResponse {
      queryId: string;
      reputationRecord: ReputationRecord;
    }
    ```

### 3.3.5. Error Handling

**Response Message:** `SACHEM_API_ERROR`
-   **Payload (`SachemApiError`)**:
    ```typescript
    interface SachemApiError {
      requestMessageId: string;
      errorCode: 'INVALID_PAYLOAD' | 'CLAIM_NOT_FOUND' | 'DEBATE_CLOSED' | 'INTERNAL_ERROR';
      errorMessage: string;
    }
    ``` 