---
title: "01_Griot-Seed_Client_Implementation_Spec"
version: 1.0
status: "PROPOSED"
---

# **Griot-Seed Client: Implementation Specification**

## 1. Overview & Mission

This document provides the complete technical specification for a Frontend Agent to build the **Griot-Seed Client**. The client will be a sophisticated, web-based graphical user interface (GUI) for interacting with the `@griot-seed/griot-kitchen` orchestration engine.

The primary mission is to create a feature-rich, responsive, and intuitive interface that allows a user to:
- Manage and browse recipes and artifacts.
- Configure and monitor external services (like A1111, ComfyUI).
- Execute generative art workflows (recipes) through a powerful and dynamic "Studio" interface.
- View the outputs and history of generative jobs.

## 2. Core Architecture & Technology Stack

- **Framework:** React (using Vite for tooling).
- **Language:** TypeScript.
- **State Management:** Use a modern, atom-based state manager - Jotai. Do not use Redux.
- **Styling:** Use a modern component library like **Shadcn/UI** built on Tailwind CSS to ensure a clean, consistent, and highly customizable look and feel.
- **Communication Protocol:** All communication with the backend **must** be via RESTful API calls to the `griot-kitchen` server.

## 3. Backend API Contract (`griot-kitchen`)

The client will be built against the following API endpoints. The Frontend Agent is responsible for creating the necessary client-side functions to interact with this contract.

#### **Configuration & Status**
- **`GET /v1/config`**
  - **Description:** Fetches the current configuration of all connected services.
  - **Response Body:**
    ```json
    {
      "services": [
        {
          "name": "a1111",
          "url": "http://192.168.1.180:7860",
          "status": "connected"
        },
        {
          "name": "comfyui",
          "url": "http://127.0.0.1:8188",
          "status": "disconnected"
        }
      ]
    }
    ```
- **`PUT /v1/config`**
  - **Description:** Updates the configuration for one or more services.
  - **Request Body:**
    ```json
    {
      "services": [
        { "name": "a1111", "url": "http://192.168.1.180:7860" }
      ]
    }
    ```

#### **Recipes**
- **`GET /v1/recipes`**
  - **Description:** Fetches a list of all available recipes.
- **`GET /v1/recipes/{id}`**
  - **Description:** Fetches the detailed definition of a single recipe.
- **`POST /v1/recipes/{id}/run`**
  - **Description:** Executes a recipe.
  - **Request Body (Overrides):**
    ```json
    {
      "params": {
        "prompt": "a new prompt to override the recipe default",
        "steps": 30
      }
    }
    ```
  - **Response Body:**
    ```json
    { "job_id": "uuid-string-12345" }
    ```

#### **Jobs & Artifacts**
- **`GET /v1/jobs/{job_id}`**
  - **Description:** Fetches the status and results of a specific job.
  - **Response Body:**
    ```json
    {
      "job_id": "uuid-string-12345",
      "status": "completed", // pending, running, completed, failed
      "created_at": "iso_timestamp",
      "completed_at": "iso_timestamp",
      "artifacts": [
        {
          "artifact_id": "uuid-artifact-67890",
          "type": "image",
          "url": "/api/v1/artifacts/uuid-artifact-67890/content"
        }
      ]
    }
    ```
- **`GET /v1/artifacts/{artifact_id}/content`**
  - **Description:** Fetches the raw binary content of an artifact (e.g., the PNG image).

## 4. Component Implementation Breakdown

### **4.1. Main Application Layout**
A three-panel layout: a collapsible sidebar for navigation, a central content area, and a footer for global status.

### **4.2. `ServiceStatusManager` (Footer Component)**
- **Purpose:** Displays the real-time connection status of all external services.
- **Functionality:**
  - Fetches data from `GET /v1/config` on an interval (e.g., every 15 seconds).
  - Displays a list of services (A1111, ComfyUI, etc.) with a colored dot (green for connected, red for disconnected).
  - Clicking a service opens a modal to edit its URL and port.

### **4.3. `RecipeStudio` (Primary View)**
- **Purpose:** The main workspace for configuring and running a generative job. This is the most complex component.
- **Functionality:**
  - When a user selects a Recipe, this view renders a dynamic form based on the recipe's parameters.
  - **You must implement the following UI controls:**
    - **`TextField` (for `string`):** Use for `prompt`.
    - **`TextArea` (for long `string`):** Use for `negative_prompt`.
    - **`Slider` (for `integer` ranges):** Use for `steps`, `cfg_scale`. Must have min/max/step attributes.
    - **`Dropdown` (for `enum`):** Use for `sampler_name`, `model_checkpoint`, `loras`, `embeddings`. The list of options for these dropdowns will be fetched from a new API endpoint `GET /v1/services/{service_name}/options`.
    - **`BooleanField` (Switch/Checkbox):** For boolean flags like `restore_faces`.
  - The form should be pre-filled with the default values from the selected Recipe.
  - A "Run" button will trigger a `POST /v1/recipes/{id}/run` call, passing any user-modified parameters as overrides.
  - A "Job Status" panel within this view should poll the `GET /v1/jobs/{job_id}` endpoint after a run is initiated.

### **4.4. `ArtifactViewer`**
- **Purpose:** Displays the results of a completed job.
- **Functionality:**
  - Renders images directly in the browser using the artifact's content URL.
  - For non-image artifacts (like JSON metadata), it should display a formatted code block.
  - Provides a "Download" button.

### **4.5. `Settings` View**
- **Purpose:** A dedicated page for managing service configurations.
- **Functionality:**
  - Provides a table of all services from `GET /v1/config`.
  - Allows users to add, edit, and remove service configurations.
  - Editing must include fields for: `name`, `url` (e.g., `192.168.1.180`), `port` (e.g., `7860`), and an `enabled` toggle.
  - A "Save" button triggers `PUT /v1/config`.

## 5. Security & Data Handling
- All user input must be sanitized before being sent to the backend.
- The application should never store private keys or secrets. All configuration is handled server-side.
- Use secure, `httpOnly` cookies for any future session management.

This specification provides a clear and comprehensive plan. The Frontend Agent is expected to build these components to a high standard of quality, ensuring the user experience is as robust and well-designed as the backend architecture. 