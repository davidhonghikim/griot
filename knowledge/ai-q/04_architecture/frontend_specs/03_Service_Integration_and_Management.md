---
title: "03_Service_Integration_and_Management"
version: 1.0
status: "PROPOSED"
---

# **Spec: Service Integration & Management**

## 1. Overview

This document specifies the UI components and logic required for managing external services within the Griot-Seed client. The user must have full, transparent control over how the application connects to backend generative services like A1111, ComfyUI, and OpenWebUI.

## 2. `Settings` View: Service Configuration

This is the central hub for managing service connection details.

- **Component:** A full-page view, accessible from the main navigation sidebar.
- **Layout:** A table displaying all configured services, with columns for "Status", "Name", "URL", and "Actions".

### **2.1. Add/Edit Service Modal**
- **Trigger:** Clicking "Add New Service" or an "Edit" button in the services table.
- **Fields:**
  - **`Service Type`:** A non-editable dropdown showing the type of service (e.g., `A1111`, `ComfyUI`, `Ollama`).
  - **`Display Name`:** A text input for a user-friendly name (e.g., "My Local A1111").
  - **`IP Address / Hostname`:** A text input. **Crucially, this field must have a datalist or dropdown with the following default options:**
    - `localhost`
    - `0.0.0.0`
    - `192.168.1.180`
    The user must also be able to type in any other custom IP address or hostname.
  - **`Port`:** A number input (e.g., `7860`).
  - **`Enabled`:** A `StyledSwitch` to toggle the service on or off.
- **Action:** A "Save" button triggers a `PUT /v1/config` API call.

### **2.2. Import/Export Functionality**
- **Purpose:** To allow users to easily back up and share their server configurations.
- **`Export Servers` Button:**
  - **Action:** When clicked, it should call `GET /v1/config`, receive the list of services, and generate a `griot-seed-servers.json` file for the user to download.
- **`Import Servers` Button:**
  - **Action:** Opens a file dialog for the user to select a `.json` file.
  - The client reads the file, validates its structure, and presents a confirmation modal showing the servers to be imported.
  - Upon confirmation, it makes a `PUT /v1/config` call with the imported data.

## 3. Service UI Iframe Integration

- **Purpose:** To give users direct access to the native UIs of their services without leaving the Griot-Seed client, mimicking the functionality of `kai-cd`.
- **Implementation:**
  - In the main navigation sidebar, there will be a section titled "Service UIs".
  - This section will dynamically populate with entries for each **enabled** service from the configuration.
  - Clicking on a service name (e.g., "My Local A1111") will open a **new browser tab**.
  - The content of this new tab will be the Griot-Seed client's UI, but the main content area will be replaced entirely by an `<iframe>`.
  - The `src` of the `<iframe>` will be the URL of the selected service (e.g., `http://192.168.1.180:7860`).
- **Security Note:** The `<iframe>` should be sandboxed to prevent the external site from accessing the parent window's context, unless specific features require it (which they currently do not).

## 4. API Endpoints (Reference for Frontend Agent)

- **`GET /v1/config`**: Fetches all service configurations.
- **`PUT /v1/config`**: Updates one or more service configurations. Used for adding, editing, and importing.
- **`GET /v1/services/{service_name}/status`**: A new endpoint that the UI can ping to get a simple `{ "status": "connected" }` or `{ "status": "disconnected" }` for a single service to update the status dot. This is more efficient than fetching the entire config. 