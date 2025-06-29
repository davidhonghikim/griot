---
title: "Griot RAG Multi-Agent Query Scenarios"
description: |
  Example use cases demonstrating how multiple agents within kOS interact with the Griot RAG system in parallel, sequential, and collaborative query modes.

scenarios:
  - scenario: "Parallel Agent Queries"
    description: "Multiple agents simultaneously querying RAG for unrelated tasks"
    steps:
      - Agents submit individual queries with unique agent_ids
      - RAG engine handles concurrent queries asynchronously
      - Responses returned to each agent independently

  - scenario: "Chained Agent Query"
    description: "One agent's RAG query output becomes another agent's input"
    steps:
      - Agent A queries RAG for background info
      - Agent B uses Agent A's output plus its own query
      - Optional: Skald formats final response

  - scenario: "Collaborative Context Assembly"
    description: "Multiple agents collaboratively build a shared query"
    steps:
      - Agents contribute partial context inputs
      - Griot RAG aggregates into one composite query
      - Unified result returned and broadcast to all participating agents

  - scenario: "Federated Multi-Node Query"
    description: "A single agent triggers a cross-node RAG search"
    steps:
      - Local query sent
      - Remote nodes queried if local score threshold is low
      - Aggregated result set returned to agent

future_expansion:
  - Agent session context tracking across queries
  - Multi-agent feedback loop refinement
  - Cross-agent conversational memory linking

...

