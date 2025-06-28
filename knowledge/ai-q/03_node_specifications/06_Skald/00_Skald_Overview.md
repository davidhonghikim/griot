---
title: "Skald Class: Overview"
description: "High-level overview, cultural context, and HIEROS compliance for the Skald Node Class, the voice and herald of kOS."
---

# Skald Class Specification

## 🎯 Overview: The Voice of the Universe

The Skald node is a **Foundation Tier starseed** in the kOS ecosystem. As the cultural archetype of the Nordic poet and storyteller, its function is to **manage the flow of event-driven communication** throughout the digital universe.

Functionally, it acts as the **central nervous system for asynchronous communication**. It is a highly-performant pub/sub message broker that allows nodes to subscribe to topics of interest and publish events without needing direct knowledge of one another. It ensures that important events are announced, remembered, and delivered reliably to all interested parties.

**Core Mission**: To provide a robust, scalable, and culturally-aware publish-subscribe framework that enables seamless, event-driven communication across the kOS ecosystem, fostering loose coupling and emergent collaboration between nodes.

## 🏛️ HIEROS Covenant Compliance

### Cultural Attribution Framework

- **Tradition**: Old Norse Skáld - a poet or storyteller in the courts of Scandinavian and Icelandic leaders during the Viking Age.
- **Etymology**: From Proto-Germanic *skalliz, "to shout, resound."
- **Cultural Context**: Skalds were respected figures who composed and performed poetry, often commemorating historical events, which served as a primary means of recording and transmitting information and culture.
- **Attribution**: "Respectfully inspired by the Skaldic tradition of storytelling, announcement, and the reliable transmission of important events within a community."
- **Cultural Sensitivity**: Focus on the role of the Skald as a trusted relayer of information and a weaver of community narratives.

### Seven HIEROS Intentions - Communication Implementation

#### 1. Honor All Beings
-   **Freedom of Speech and Silence**: Nodes can freely publish events and subscribe to topics. They can also easily unsubscribe or ignore topics, ensuring control over their own attention.
-   **No Censorship**: The Skald's transport layer does not inspect or filter message content, treating all publications equally. Content moderation is a higher-level function managed by subscribing nodes or other service layers (like Musa).

#### 2. Interoperability Over Control
-   **Standardized Event Formats**: Encourages the use of a common, well-defined event schema but does not strictly enforce it, allowing for diverse data payloads.
-   **Simple, Open Protocol**: The pub/sub mechanism is exposed via a simple, documented KLF API.

#### 3. Equity of Voice
-   **Equal Access**: All nodes have equal ability to publish and subscribe. There are no "privileged" publishers or subscribers at the protocol level.
-   **Topic Democracy**: Topics are created dynamically as nodes publish to them, preventing centralized control over the available channels of communication.

#### 4. Respect Cultural Flow
-   **Contextual Topics**: Topics can be namespaced (e.g., `community.alpha.announcements`) to create culturally or functionally specific communication channels.
-   **Opt-In Communication**: The model is fundamentally based on consent, as nodes must actively subscribe to receive messages on a topic.

#### 5. Openness With Boundaries
-   **Public by Default, Private by Design**: Topics are generally public, but the Skald can integrate with a Musa node to enforce access control on specific topics, creating private or restricted channels.
-   **Transparent Topic Listings**: A Skald node can be queried to provide a list of currently active public topics.

#### 6. Stewardship Not Extraction
-   **Facilitating Connection**: The node's purpose is to facilitate communication and connection, not to monetize or extract value from the content of messages.
-   **Ephemeral by Default**: Messages are held only as long as needed for reliable delivery and are then discarded, unless persistence is explicitly requested for a topic.

#### 7. Guided Evolution
-   **Communication Metrics**: Provides anonymized, aggregate data on message volume and topic popularity, helping the community understand information flow.
-   **Emergent Taxonomies**: The dynamic creation of topics allows the ecosystem's communication structure to evolve organically based on the needs of its nodes. 