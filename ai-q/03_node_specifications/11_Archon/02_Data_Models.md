---
title: "Archon Node 02: Data Models"
version: 1.0
---

# **2. Archon Node Data Models**

## 2.1. Introduction

The Archon Node's orchestration capabilities are built upon a hierarchy of data models that represent a high-level goal and the concrete steps required to achieve it. The primary models are the `Directive`, the `WorkflowPlan`, and the `Task`.

## 2.2. Core Data Models

### 2.2.1. `Directive`

A `Directive` is the highest-level object, representing the initial goal or command given to the Archon node. It is purely declarative.

-   **Purpose**: To capture the user's or system's intent without specifying the implementation.
-   **Format**: JSON

**TypeScript Interface Definition:**

```typescript
/**
 * @interface Directive
 * @description A high-level goal submitted to the Archon for execution.
 */
interface Directive {
  /**
   * @property {string} directiveId - A unique UUID (v4) for the directive.
   */
  directiveId: string;

  /**
   * @property {string} description - A human-readable description of the goal.
   * @example "Find all network intrusion events from the last 48 hours and generate a summary report."
   */
  description: string;

  /**
   * @property {string} requestingEntity - The ID of the user or node that submitted the directive.
   */
  requestingEntity: string;

  /**
   * @property {Date} submissionTimestamp - The ISO 8601 timestamp of when the directive was submitted.
   */
  submissionTimestamp: Date;

  /**
   * @property {Record<string, any>} parameters - A key-value map of initial parameters needed to fulfill the directive.
   */
  parameters: Record<string, any>;
}
```

### 2.2.2. `WorkflowPlan`

The `WorkflowPlan` is the Archon's internal representation of a `Directive`. It contains the full, stateful graph of tasks required to complete the goal.

-   **Purpose**: To serve as the master plan and state tracker for an active directive.
-   **Format**: JSON

**TypeScript Interface Definition:**

```typescript
/**
 * @interface WorkflowPlan
 * @description A stateful, ordered graph of tasks to fulfill a directive.
 */
interface WorkflowPlan {
  /**
   * @property {string} planId - A unique UUID (v4), linking back to the directiveId.
   */
  planId: string;

  /**
   * @property {'PENDING' | 'RUNNING' | 'COMPLETE' | 'FAILED'} status - The overall status of the plan.
   */
  status: 'PENDING' | 'RUNNING' | 'COMPLETE' | 'FAILED';

  /**
   * @property {Task[]} tasks - An array of all task objects associated with this plan.
   */
  tasks: Task[];
}
```

### 2.2.3. `Task`

A `Task` is the smallest unit of work in a `WorkflowPlan`. It represents a single KLF message to be dispatched to a specific node.

-   **Purpose**: To define a single, concrete, delegable action.
-   **Format**: JSON

**TypeScript Interface Definition:**

```typescript
/**
 * @interface Task
 * @description A single, atomic step in a WorkflowPlan.
 */
interface Task {
  /**
   * @property {string} taskId - A unique identifier for the task within the plan (e.g., "task-01").
   */
  taskId: string;

  /**
   * @property {string[]} dependencies - An array of `taskId`s that must be complete before this task can start.
   */
  dependencies: string[];

  /**
   * @property {'PENDING' | 'READY' | 'RUNNING' | 'COMPLETE' | 'FAILED'} status - The current state of the task.
   */
  status: 'PENDING' | 'READY' | 'RUNNING' | 'COMPLETE' | 'FAILED';

  /**
   * @property {string} targetNodeId - The ID of the node this task is assigned to.
   */
  targetNodeId: string;

  /**
   * @property {string} klfMessage - The KLF message type to be sent (e.g., "YACHAY_QUERY_REQUEST").
   */
  klfMessage: string;

  /**
   * @property {Record<string, any>} payload - The actual payload object to be sent with the KLF message.
   */
  payload: Record<string, any>;

  /**
   * @property {any} result - The result data returned by the target node upon completion.
   */
  result?: any;
}
``` 