# **NEXT AGENT HANDOFF: COMPREHENSIVE BRIEFING**

**UTC**: 2025-06-28T03:57:35Z
**From Agent**: Gemini 2.5 Pro
**Previous Handoff**: `agents/handoff/archive/2024-07-12_Gemini-2.5-Pro_RAG-Engine-Pivot.md`

---

## 1. Executive Summary & Mission

**Project State**: The project has successfully pivoted from a legacy Python application to a structured TypeScript monorepo. Foundational work is complete, including a comprehensive frontend UI specification and the initial scaffolding of backend packages for storage and a RAG engine.

**Critical Blocker**: The chosen RAG engine implementation, which relied on the `llamaindex` library, is non-functional due to significant breaking changes in the dependency. This has invalidated the initial technical approach for service and data interaction.

**Your Directive**: Your primary mission is to **design and implement a new, custom service connector framework** to replace the failed `llamaindex` implementation. This is a strategic pivot. You will draw inspiration from the proven patterns in the `kai-cd` reference project but build a solution tailored to the `griot-node` architecture.

---

## 2. Mandatory Agent Onboarding

To proceed, you **must** ground yourself in the project's core principles and current state. Review these documents in order:

1.  **Core Identity & Workflow**:
    *   `agents/02_SYSTEM_PROMPT.md`: Understand your persona and the project's ethical framework.
    *   `agents/00_AGENT_WORKFLOW.md`: Follow the mandatory workflow for logging and handoffs. It is the absolute source of truth for process.

2.  **Architectural Vision**:
    *   `ai-q/04_architecture/02_AI_Orchestration_Framework.md`: This is the constitutional document for the project. It outlines the vision of an AI-driven orchestration system where agents compose generic node capabilities.

3.  **This Handoff Document**: Read this document in its entirety.

4.  **Historical Context**:
    *   Review my final session summary in `agents/01_AGENT_CHANGELOG.md` under the entry for **2024-07-12** for a detailed log of the events leading to this pivot.

---

## 3. Project Artifacts & Low-Level Details

This section contains direct links to the key directories and files relevant to your mission.

### 3.1. Frontend Architecture (COMPLETE)

A detailed specification for the frontend UI was created to enable parallel development. This work is complete and provides critical context for the backend services you will be building.
-   **Directory**: `ai-q/04_architecture/frontend_specs/`
-   **Files**:
    -   `00_Client_Overview_and_Architecture.md`
    -   `02_Recipe_Studio_and_Generative_UI.md`
    -   `03_Service_Integration_and_Management.md`
    -   `04_Artifact_and_Job_Management.md`

### 3.2. Backend Packages (CURRENT STATE)

The backend is structured as a series of packages within the `packages/` directory.
-   **Directory**: `packages/`
-   **Modules**:
    -   `griot-kitchen/`: The main orchestrator service (currently a skeleton).
    -   `storage-mongodb/`: A functional package for connecting to MongoDB. The `StorageClient` class is implemented here.
    -   `rag-engine/`: **(BROKEN)** This package is non-functional and is the target for replacement.

### 3.3. Reference Project (`kai-cd`)

The `kai-cd` project contains proven concepts for service connectors that you must use as a reference. **Do not copy code directly**, but use its architecture as inspiration.
-   **Path**: `/Users/danger/CascadeProjects/kai-cd`
-   **Key Files of Interest**:
    -   `kai-cd/src/connectors/definitions/`
    -   `kai-cd/src/services/GriotSeedClient.ts`

---

## 4. DETAILED EXECUTION PLAN

Your mission is to replace the broken RAG engine with a robust, custom-built service connector framework. Follow these steps precisely.

### **Phase 1: Decommission and Design**

1.  **Analyze `kai-cd` Connectors**: Thoroughly review the connector definitions in the `kai-cd` project. Understand how it defines services, manages different protocols (HTTP, etc.), and standardizes interactions.
2.  **Create a New Specification**: Before writing any code, create a new specification document: `ai-q/04_architecture/03_Griot-Seed_Connector_Framework_Spec.md`. This document must detail the architecture for the new framework, including:
    *   The base `Connector` interface.
    *   How "Recipes" will define service interactions.
    *   How different service types (e.g., A1111, ComfyUI, Ollama) will be implemented as concrete classes.
    *   Data models for requests, responses, and service discovery.
3.  **Remove the Broken Package**: Once the specification is complete and approved, delete the `packages/rag-engine/` directory entirely.

### **Phase 2: Implementation**

1.  **Scaffold New Package**: Create a new directory: `packages/service-connectors/`.
2.  **Initialize Package**: Create the `package.json` and `tsconfig.json` for the new `@griot-seed/service-connectors` package.
3.  **Implement Core Framework**: Based on your specification, implement the base classes and interfaces for the connector framework.
4.  **Implement First Connector**: As a proof-of-concept, implement a simple connector (e.g., a basic HTTP connector for a local service you can easily test).
5.  **Test and Verify**: Ensure the new connector can be dynamically loaded and used by the `griot-kitchen` orchestrator. 