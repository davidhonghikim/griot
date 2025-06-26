---
title: "Sachem Node 02: Data Models"
version: 1.0
---

# **2. Sachem Node Data Models**

## 2.1. Introduction

The Sachem Node's functionality revolves around three core data models: the `Claim`, which represents a statement put forth for consensus; the `Vote`, which represents a node's stance on a Claim; and the `Accord`, the final, immutable record of a consensus outcome. A fourth model, the `ReputationRecord`, tracks the trustworthiness of each node.

## 2.2. Core Data Models

### 2.2.1. `Claim`

A `Claim` is a testable assertion made by a node, which is then submitted to the network for validation.

-   **Purpose**: To formalize a piece of information or a proposed truth for debate and consensus.
-   **Lifecycle**: Created by a node, submitted to Sachem, enters a "Debate" period, and is ultimately resolved to `ACCEPTED` or `REJECTED`.
-   **Format**: JSON

**TypeScript Interface Definition:**

```typescript
/**
 * @interface Claim
 * @description An assertion submitted for consensus.
 */
interface Claim {
  /**
   * @property {string} claimId - A unique UUID (v4) for the claim.
   */
  claimId: string;

  /**
   * @property {string} proposingNodeId - The ID of the node that made the claim.
   */
  proposingNodeId: string;

  /**
   * @property {Date} timestamp - The ISO 8601 timestamp of the claim's proposal.
   */
  timestamp: Date;

  /**
   * @property {string} statement - The core assertion being made.
   */
  statement: string;

  /**
   * @property {string[]} evidence_tapestryIds - An array of Yachay `tapestryId`s that support this claim.
   */
  evidence_tapestryIds: string[];

  /**
   * @property {'PENDING' | 'DEBATE' | 'ACCEPTED' | 'REJECTED'} status - The current state of the claim.
   */
  status: 'PENDING' | 'DEBATE' | 'ACCEPTED' | 'REJECTED';
}
```

### 2.2.2. `Vote`

A `Vote` is a simple data structure representing a single node's response to a `Claim`.

-   **Purpose**: To record the explicit support, opposition, or abstention of a node regarding a claim.
-   **Format**: JSON

**TypeScript Interface Definition:**

```typescript
/**
 * @interface Vote
 * @description A single vote cast by a node on a specific claim.
 */
interface Vote {
  /**
   * @property {string} claimId - The ID of the claim being voted on.
   */
  claimId: string;

  /**
   * @property {string} votingNodeId - The ID of the node casting the vote.
   */
  votingNodeId: string;

  /**
   * @property {'FOR' | 'AGAINST' | 'ABSTAIN'} choice - The node's decision.
   */
  choice: 'FOR' | 'AGAINST' | 'ABSTAIN';

  /**
   * @property {number} reputationWeight - The reputation score of the voting node at the time the vote was cast.
   */
  reputationWeight: number;
}
```

### 2.2.3. `Accord`

An `Accord` is the final, immutable document representing the outcome of a consensus process for a specific `Claim`.

-   **Purpose**: To serve as the provable, historical record of a collective decision.
-   **Lifecycle**: Created by the Accord Finalizer and immediately archived in the Yachay Long-Term Store.
-   **Format**: JSON

**TypeScript Interface Definition:**

```typescript
/**
 * @interface Accord
 * @description The final, immutable record of a consensus outcome.
 */
interface Accord {
  /**
   * @property {string} accordId - A unique UUID (v4). This is also its `tapestryId` in Yachay.
   */
  accordId: string;

  /**
   * @property {string} claimId - The claim that this accord resolves.
   */
  claimId: string;

  /**
   * @property {'ACCEPTED' | 'REJECTED'} outcome - The final result of the vote.
   */
  outcome: 'ACCEPTED' | 'REJECTED';

  /**
   * @property {Date} finalizationTimestamp - The ISO 8601 timestamp of when the accord was finalized.
   */
  finalizationTimestamp: Date;
  
  /**
   * @property {Record<string, Vote>} voteTally - A record of all votes cast.
   */
  voteTally: Record<string, Vote>;

  /**
   * @property {string} signature - A cryptographic signature of the accord's content to ensure immutability.
   */
  signature: string;
}
```
### 2.2.4. `ReputationRecord`

- **Purpose**: To maintain a persistent, evolving score of a node's reliability.
- **Format**: JSON

```typescript
interface ReputationRecord {
  /**
   * @property {string} nodeId - The node being scored.
   */
  nodeId: string;

  /**
   * @property {number} score - A numerical representation of reputation (e.g., 0 to 1).
   */
  score: number;

  /**
   * @property {Date} lastUpdated - The timestamp of the last reputation change.
   */
  lastUpdated: Date;
}
``` 