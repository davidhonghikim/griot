---
title: "Archon Node 01: Architecture"
version: 1.0
---

# **1. Archon Node Architecture**

## 1.1. Introduction: The Executive Function

The Archon Node is the master orchestrator of the kOS agent swarm. It provides the system's executive function: goal-setting, planning, task decomposition, and process monitoring. It is the bridge between a high-level `Directive` and the concrete sequence of KLF messages sent to specialist nodes to fulfill that directive. It is a state machine manager, where the state is the progress of a complex, multi-agent workflow.

## 1.2. Core Principles

-   **Declarative Goal-Setting**: Archon operates on declarative `Directives` (e.g., "Summarize the last 24 hours of network activity and identify anomalies"). It is responsible for translating this "what" into the "how."
-   **Strategic Delegation**: The Archon node maintains a dynamic registry of other nodes and their capabilities. Its core competency is knowing which node is best suited for a given sub-task.
-   **Stateful Workflow Tracking**: For every active `Directive`, the Archon maintains a state machine or workflow graph. It tracks which tasks are pending, running, and complete, and what the dependencies are between them.
-   **Resilience and Recovery**: The Archon is responsible for detecting when a sub-task fails (e.g., a node does not respond) and initiating corrective actions, such as re-assigning the task or escalating the failure.

## 1.3. System Components Overview

1.  **Directive Parser**: The entry point for new goals. It receives a `DIRECTIVE_SUBMIT` message, validates its structure, and creates a new `WorkflowPlan`.
2.  **Planning Engine**: The core of the Archon's intelligence. It takes a `Directive` and decomposes it into a directed acyclic graph (DAG) of `Task` objects. Each `Task` represents a specific action to be delegated to another node.
3.  **Node Registry Service**: A client that communicates with a service discovery layer (or a static configuration) to get a list of all available nodes and their function signatures (e.g., "Node 'Hakim-01' can perform `ANALYZE_DATA`").
4.  **Task Dispatcher**: Iterates through the `WorkflowPlan`. When a `Task`'s dependencies are met, the dispatcher constructs the appropriate KLF message (e.g., `YACHAY_QUERY_REQUEST`) and sends it to the target node.
5.  **State Monitor**: Listens for KLF `CONFIRM` or `RESPONSE` messages from other nodes. It updates the status of the corresponding `Task` in the `WorkflowPlan` (e.g., from `RUNNING` to `COMPLETE`).
6.  **Failure Handler**: A specialized part of the State Monitor. If a task times out or returns an `ERROR` message, this component is triggered to enact recovery policies (e.g., retry, assign to a different node, or halt the workflow and report failure).
7.  **Reporting Engine**: Once all tasks in a `WorkflowPlan` are `COMPLETE`, this engine gathers the final results from the relevant tasks and synthesizes the final report, fulfilling the original `Directive`.

## 1.4. The Orchestration Lifecycle

1.  **Directive Submission**: A user or another system sends a `DIRECTIVE_SUBMIT` message to the Archon node.
2.  **Planning**: The Directive Parser and Planning Engine collaborate to create a `WorkflowPlan` (a DAG of `Tasks`). The plan is stored in the Archon's internal database, with the overall status `PENDING`.
3.  **Execution & Dispatch**: The Archon's main loop begins executing the plan. The Task Dispatcher identifies the initial `Task`(s) with no dependencies and sends the corresponding KLF messages to the target nodes. The task status is updated to `RUNNING`.
4.  **Monitoring**: The State Monitor listens for incoming KLF messages. When a node reports completion (e.g., `YACHAY_QUERY_RESPONSE`), the monitor finds the associated `Task` in the `WorkflowPlan`, marks it `COMPLETE`, and stores the result.
5.  **Iteration**: The Task Dispatcher re-evaluates the `WorkflowPlan`. With the previous task now complete, new tasks may have their dependencies satisfied. The dispatcher sends out the next wave of KLF messages. This loop continues until all tasks are complete.
6.  **Completion or Failure**:
    -   **On Success**: When the final task is marked `COMPLETE`, the Reporting Engine synthesizes the final answer and sends a `DIRECTIVE_COMPLETE` message back to the original requestor.
    -   **On Failure**: If the Failure Handler exhausts its retry/recovery options, it marks the entire `WorkflowPlan` as `FAILED` and sends a `DIRECTIVE_FAILED` message. 