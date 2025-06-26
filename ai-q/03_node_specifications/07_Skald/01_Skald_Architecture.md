---
title: "Skald Class: Architecture"
description: "System architecture and component hierarchy for the Skald Node Class."
---

# Skald Class Architecture

## 🏗️ System Architecture

### Core Components

```
📣 SKALD NODE ARCHITECTURE
├── 📚 Topic Manager
│   ├── Topic Lifecycle Controller (Create, Delete, Prune)
│   ├── Topic Metadata Store
│   └── Access Control List (ACL) Manager (integrates with Musa)
├── 📨 Subscription Manager
│   ├── Subscriber Database
│   ├── Subscription Request Handler
│   └── Message Delivery Queue per Subscriber
├── 🚀 Message Broker
│   ├── High-Performance Message Ingress
│   ├── Fan-out & Routing Logic
│   └── Message Dispatcher
├── 💾 Persistence Engine (Optional)
│   ├── Message Log / Write-Ahead Log (WAL)
│   ├── Message Archiver
│   └── Topic Replay Service
└── 🌐 KLF Integration Layer
    ├── Publish Message Handler
    ├── Subscribe/Unsubscribe Command Handler
    └── Topic Query Handler
```

### Publish & Deliver Flow

```
✍️ PUBLISH-SUBSCRIBE FLOW
Publisher Node → KLF Publish Message (Topic, Payload)
    ↓
Skald: Message Ingress → Authenticate Publisher (via Musa)
    ↓
Skald: Persist Message (if topic is persistent)
    ↓
Skald: Identify Subscribers for Topic
    ↓
Skald: Enqueue Message for Each Subscriber
    ↓
Skald: Dispatch Message to Subscribers via KLF
    ↓
Subscriber Node ← KLF Event Message (Topic, Payload)
``` 