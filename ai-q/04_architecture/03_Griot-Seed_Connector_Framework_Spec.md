---
title: "03_Griot-Seed_Connector_Framework_Spec"
version: 1.0
---

# **Griot-Seed: Service Connector Framework Specification**

**Version**: 1.0
**Status**: DRAFT

## 1. Overview & Philosophy

This document specifies the architecture for the Griot-Seed Service Connector Framework. The framework is designed as a **universal adapter**, enabling the `griot-node` ecosystem to interact with any external or internal service through a standardized, self-describing interface.

The core philosophy is **abstraction and interoperability**. The framework decouples the core orchestration logic (`griot-kitchen`) from the specific implementation details of the services it consumes. An AI agent or a user should be able to interact with a powerful, graph-based image generator like ComfyUI using the same high-level constructs as a simple REST API for a language model.

This is achieved by creating a "connector definition" for each service. This definition acts as a translation layer, mapping a standardized set of capabilities and parameters to the unique API and data model of the target service.

## 2. Core Architectural Components

The framework is composed of several key TypeScript types and structures.

### 2.1. `ServiceDefinition`

This is the root object for any connector. It contains all the metadata required for the system to understand, display, and connect to a service.

```typescript
export interface ServiceDefinition {
  type: string; // Unique identifier, e.g., 'comfyui', 'openai'
  name: string; // Human-readable name, e.g., 'ComfyUI'
  category: ServiceCategory; // e.g., 'IMAGE_GENERATION', 'LLM', 'STORAGE'
  
  defaultPort?: number;
  hasExternalUi?: boolean;
  
  docs?: {
    api?: string;
    website?: string;
  };

  authentication: AuthenticationDefinition;
  capabilities: Capability[];
  
  configuration?: {
    arguments?: { [key: string]: string };
    help?: {
      instructions: string;
    };
  };
}
```

### 2.2. `Capability`

This is the most critical abstraction. Instead of defining a static client for a service's entire API, a service exposes one or more generic `capabilities`. This allows the orchestrator to query for services that can perform a certain *type* of task.

**Example Capabilities:**
-   `llm_chat`
-   `image_generation`
-   `graph_execution`
-   `model_management`
-   `vector_storage`
-   `health`
-   `vector_database`
-   `document_storage`

Each capability defines the API endpoints and the parameters it supports.

```typescript
// Base Capability
export interface Capability {
  capability: string; // e.g., 'llm_chat'
  endpoints: { [name: string]: EndpointDefinition };
}

// Example: LLM Chat Capability
export interface LlmChatCapability extends Capability {
  capability: 'llm_chat';
  parameters: {
    chat: ParameterDefinition[];
  };
}
```

### 2.3. `ParameterDefinition` & `ParameterMapping`

This is the heart of the "universal adapter" pattern.

-   **`ParameterDefinition`**: A generic description of a single input parameter, including its type (`string`, `number`, `select`), default value, range, and UI-facing labels.
-   **`ParameterMapping`**: For complex services (like ComfyUI), this object maps the simple, user-facing `ParameterDefinition` to the specific, often nested, location within the service's API request body.

```typescript
// Describes a simple, user-facing parameter
export interface ParameterDefinition {
  key: string;
  label: string;
  type: 'string' | 'number' | 'boolean' | 'select';
  defaultValue?: any;
  description?: string;
  options?: any[];
  optionsEndpoint?: string; // API endpoint to fetch dynamic options
}

// Maps the simple parameter to a complex API
export interface ParameterMapping {
  [userFacingKey: string]: {
    nodeId: string;      // The ID of the target node in a graph
    inputKey: string;    // The key of the input on that node
    parameterDefinition: ParameterDefinition;
  }
}
```
This allows the UI and orchestrator to work with a simple key-value map (e.g., `{ "prompt": "a cat", "seed": 123 }`), while the connector handles the complex task of injecting those values into the correct place in the API call (e.g., the `text` input of the `CLIPTextEncode` node in a ComfyUI graph).

### 2.4. Directory & Aggregation Structure

Inspired by the `kai-cd` project, the connector definitions will be organized as follows:

-   **`packages/service-connectors/src/definitions/`**: This directory will contain one file for each service connector (e.g., `openai.ts`, `comfyui.ts`).
-   **`packages/service-connectors/src/definitions/index.ts`**: A barrel file that exports all individual service definitions.
-   **`packages/service-connectors/src/definitions/all.ts`**: A file that imports all definitions and aggregates them into a single `allServiceDefinitions` array, providing a central registry for the entire system.

## 3. Next Steps & Implementation Plan

With this specification defined, the implementation will proceed as follows:

1.  **Decommission `rag-engine`**: The broken `packages/rag-engine` directory will be deleted.
2.  **Scaffold `service-connectors`**: A new package will be created at `packages/service-connectors`.
3.  **Implement Core Types**: The core TypeScript interfaces (`ServiceDefinition`, `Capability`, etc.) will be created in a `types.ts` file within the new package.
4.  **Implement Connectors**: Implement a comprehensive set of initial connectors, including `http`, `openai`, `comfyui`, `ollama`, `chroma`, and `mongodb` to validate the framework against a variety of service types.
5.  **Update Orchestrator**: The `griot-kitchen` will be updated to consume the `allServiceDefinitions` registry and dynamically use the new connectors.

## 4. Implemented Connectors

The following connectors have been implemented as part of the initial framework scaffolding:

- **http**: A generic connector for basic HTTP requests.
- **openai**: For interacting with OpenAI's API.
- **comfyui**: A complex connector for the graph-based ComfyUI image generation service.
- **ollama**: For interacting with local LLMs via the Ollama server.
- **chroma**: For vector storage and querying with Chroma DB.
- **mongodb**: A non-HTTP connector for the project's primary document store. 