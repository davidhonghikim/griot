---
title: "Skald Class: KLF Message API"
description: "KLF Message API specification for the Skald Node Class's pub/sub services."
---

# Skald Class KLF Message API

The Skald Class API exposes its pub/sub capabilities via simple, command-oriented KLF messages.

### 1. Publishing

#### **Request: `publish_event`**
-   **Description**: Publishes an event to a specific topic.
-   **Message Type**: `EVENT`
-   **Payload**:
    ```json
    {
      "topic_name": "kos:system:node_health_alerts",
      "payload": {
        "node_did": "did:kos:griot:123",
        "status": "Warning",
        "metric": "cpu_usage_percent",
        "value": 95
      }
    }
    ```
-   **Response**: No direct response is expected for publishes (fire-and-forget). The Skald node handles delivery asynchronously. An error may be returned if the topic is restricted and the publisher lacks permission.

### 2. Subscribing & Unsubscribing

#### **Request: `subscribe`**
-   **Description**: Subscribes the sending node to a topic.
-   **Message Type**: `CONTROL_COMMAND`
-   **Payload**:
    ```json
    {
      "command_name": "subscribe",
      "params": {
        "topic_name": "kos:system:node_health_alerts"
      }
    }
    ```
-   **Response**: A `TASK_RESPONSE` indicating success or failure of the subscription command.

#### **Request: `unsubscribe`**
-   **Description**: Unsubscribes the sending node from a topic.
-   **Message Type**: `CONTROL_COMMAND`
-   **Payload**:
    ```json
    {
      "command_name": "unsubscribe",
      "params": {
        "topic_name": "kos:system:node_health_alerts"
      }
    }
    ```
-   **Response**: A `TASK_RESPONSE` indicating success or failure.

### 3. Receiving Events

#### **Inbound Message: `event_delivery`**
-   **Description**: A message sent *from* the Skald node *to* a subscriber.
-   **Message Type**: `EVENT`
-   **Payload**:
    ```json
    {
      "event_id": "...",
      "topic_name": "kos:system:node_health_alerts",
      "publisher_did": "did:kos:hakim:xyz",
      "published_at": "...",
      "payload": {
        "node_did": "did:kos:griot:123",
        "status": "Warning",
        "metric": "cpu_usage_percent",
        "value": 95
      }
    }
    ``` 