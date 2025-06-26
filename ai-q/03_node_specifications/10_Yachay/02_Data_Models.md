---
title: "Yachay Node 02: Data Models"
version: 1.0
---

# **2. Yachay Node Data Models**

## 2.1. Introduction

The Yachay Node's effectiveness is built upon a set of well-defined, robust data models that represent information at different stages of its lifecycle. These models provide the structure necessary for encoding, consolidating, storing, and retrieving memories across the kOS ecosystem. The two primary models are the `MemoryFragment` and the `MemoryTapestry`.

## 2.2. Core Data Models

### 2.2.1. `MemoryFragment`

The `MemoryFragment` is the atomic unit of memory in kOS. It represents a single, raw piece of information received by the Yachay node. It is lightweight and designed for rapid ingestion and short-term storage in the Working Memory Store (WMS).

-   **Purpose**: To capture an individual data point or observation before it is contextualized.
-   **Lifecycle**: Created by the Ingestion Engine, held in the WMS, and consumed by the Consolidation Daemon. It is ephemeral.
-   **Format**: JSON

**TypeScript Interface Definition:**

```typescript
/**
 * @interface MemoryFragment
 * @description Represents a single, unconsolidated piece of information.
 * This is the raw input for the memory system.
 */
interface MemoryFragment {
  /**
   * @property {string} fragmentId - A unique UUID (v4) for the fragment.
   */
  fragmentId: string;

  /**
   * @property {string} tapestryId - An optional identifier linking this fragment to an existing MemoryTapestry.
   */
  tapestryId?: string;

  /**
   * @property {string} sourceNodeId - The ID of the kOS node that generated this memory.
   */
  sourceNodeId: string;

  /**
   * @property {Date} timestamp - The ISO 8601 timestamp of when the event occurred or the data was generated.
   */
  timestamp: Date;

  /**
   * @property {any} content - The actual data payload of the memory. Can be any serializable format (text, JSON object, etc.).
   */
  content: any;

  /**
   * @property {Record<string, number>} semanticVector - An optional vector representation of the content for semantic searching.
   */
  semanticVector?: Record<string, number>;

  /**
   * @property {string[]} tags - A list of preliminary keywords or tags for rapid indexing.
   */
  tags: string[];
}
```

### 2.2.2. `MemoryTapestry`

The `MemoryTapestry` is the consolidated, long-term representation of knowledge. It is created by weaving together multiple related `MemoryFragment` objects into a coherent narrative or a complex data structure. It is the primary object stored in the Long-Term Storage (LTS).

-   **Purpose**: To create a durable, contextualized, and richly linked record of knowledge.
-   **Lifecycle**: Created by the Consolidation Daemon, archived in the LTS, and retrieved by the Query Engine. It is designed for persistence.
-   **Format**: JSON / BSON (in MongoDB)

**TypeScript Interface Definition:**

```typescript
/**
 * @interface MemoryTapestry
 * @description Represents a consolidated, interconnected set of memories,
 * forming a coherent knowledge structure.
 */
interface MemoryTapestry {
  /**
   * @property {string} tapestryId - A unique UUID (v4) for the tapestry.
   */
  tapestryId: string;

  /**
   * @property {string} title - A human-readable title for the memory collection.
   */
  title: string;

  /**
   * @property {string} narrative - A generated summary or narrative that contextualizes the linked fragments.
   */
  narrative: string;
  
  /**
   * @property {string[]} fragmentIds - A sorted list of `MemoryFragment` IDs that constitute this tapestry.
   */
  fragmentIds: string[];

  /**
   * @property {Date} creationTimestamp - The ISO 8601 timestamp of when the tapestry was created.
   */
  creationTimestamp: Date;

  /**
   * @property {Date} lastAccessedTimestamp - The ISO 8601 timestamp of the last time this tapestry was retrieved.
   */
  lastAccessedTimestamp: Date;

  /**
   * @property {Record<string, any>} metadata - A flexible key-value store for additional metadata (e.g., confidence score, access frequency).
   */
  metadata: Record<string, any>;

  /**
   * @property {string[]} relatedTapestryIds - A list of IDs for other `MemoryTapestry` objects that are contextually related.
   */
  relatedTapestryIds: string[];
}
``` 