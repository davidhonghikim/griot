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

## **3. `Debate` State Model**

While not a persistent, long-term model like the others, the `Debate` is a critical state object held in-memory (e.g., in Redis) to manage an active consensus process.

-   **Purpose**: To track the real-time state of a claim's debate, including the voting window and collected votes.
-   **Lifecycle**: Created when a `Claim` is submitted, updated with each `Vote`, and destroyed once the `Accord` is finalized.

**TypeScript Interface Definition:**
```typescript
/**
 * @interface Debate
 * @description Represents the active state of a consensus process for a single claim.
 */
export interface Debate {
  /**
   * @property {string} debateId - A unique UUID (v4) for this debate session.
   */
  debateId: string;

  /**
   * @property {string} claimId - The ID of the claim being debated.
   */
  claimId: string;

  /**
   * @property {'OPEN' | 'CLOSED'} status - The current status of the debate window.
   */
  status: 'OPEN' | 'CLOSED';
  
  /**
   * @property {Date} openingTimestamp - The ISO 8601 timestamp when the debate was opened.
   */
  openingTimestamp: Date;

  /**
   * @property {Date} closingTimestamp - The ISO 8601 timestamp when the debate window will close.
   */
  closingTimestamp: Date;

  /**
   * @property {Vote[]} votes - An array of all votes cast so far in the debate.
   */
  votes: Vote[];

  /**
   * @property {any} dynamicQuorumState - A snapshot of the quorum parameters calculated for this specific debate.
   */
  dynamicQuorumState: any;
}
```

---

## **4. Data Model JSON Examples**

### **Example 1: A new `Claim`**
```json
{
  "claimId": "c-11223344-aabb-ccdd-eeff-556677889900",
  "proposingNodeId": "did:kos:hakim:456",
  "timestamp": "2025-02-15T10:00:00Z",
  "claimType": "OBSERVATION",
  "criticality": "ROUTINE",
  "statement": "The average network latency between NA-East and EU-West regions has exceeded 150ms over the last hour.",
  "evidenceTapestryIds": [
    "t-abcdef12-3456-7890-fedc-ba9876543210"
  ],
  "tags": ["network_performance", "latency", "inter_regional"],
  "status": "PENDING"
}
```

### **Example 2: A `Vote` cast on the claim**
```json
{
  "claimId": "c-11223344-aabb-ccdd-eeff-556677889900",
  "votingNodeId": "did:kos:ronin:789",
  "choice": "FOR",
  "reputationAtTimeOfVote": 0.85,
  "timestamp": "2025-02-15T10:05:12Z",
  "justification": "My own monitoring data confirms this observation.",
  "signature": "..."
}
```

### **Example 3: A finalized `Accord`**
```json
{
  "accordId": "a-fedcba98-7654-3210-abcd-ef1234567890",
  "claimId": "c-11223344-aabb-ccdd-eeff-556677889900",
  "proposingNodeId": "did:kos:hakim:456",
  "statement": "The average network latency between NA-East and EU-West regions has exceeded 150ms over the last hour.",
  "outcome": "ACCEPTED",
  "finalizationTimestamp": "2025-02-15T10:10:00Z",
  "voteTally": {
    "totalVotes": 15,
    "for": 12,
    "against": 2,
    "abstain": 1,
    "weightedFor": 10.5,
    "weightedAgainst": 1.2,
    "quorumThreshold": 0.6
  },
  "votes": [
    // Array of all Vote objects...
  ],
  "reputationAdjustments": {
    "did:kos:hakim:456": "+0.05",
    "did:kos:ronin:789": "+0.01"
    // ... other adjustments
  },
  "accordSignature": "..."
}
```

### **Example 4: A `ReputationRecord`**
```json
{
  "nodeId": "did:kos:hakim:456",
  "reputationScore": 0.92,
  "history": [
    {
      "timestamp": "2025-02-15T10:10:00Z",
      "event": "PROPOSED_ACCEPTED_CLAIM",
      "claimId": "c-11223344-aabb-ccdd-eeff-556677889900",
      "change": "+0.05"
    }
  ],
  "lastUpdated": "2025-02-15T10:10:00Z"
}
``` 