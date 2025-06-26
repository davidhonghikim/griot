---
title: "Skald Class: Code Examples"
description: "TypeScript code examples for interacting with the Skald Node Class via KLF."
---

# Skald Class Code Examples

This section provides conceptual TypeScript examples for a client interacting with a Skald node.

## 1. Subscribing to a Topic and Handling Events

This example shows a "listener" node that subscribes to a topic and logs any messages it receives.

```typescript
import { KLFClient, createMessage, MessageType } from './klf-sdk';

function setupListener(client: KLFClient, skaldDid: string, topic: string) {
    console.log(`Setting up listener for topic: ${topic}`);

    // First, send the command to subscribe
    const subscribeCommand = createMessage()
        .from(client.getDid()) // Assuming the client knows its own DID
        .to(skaldDid)
        .type(MessageType.SYSTEM_COMMAND)
        .payload({
            command_name: 'subscribe',
            params: { "topic_name": topic }
        })
        .build();
    
    client.sendMessage(subscribeCommand);
    console.log('Subscription command sent.');

    // Then, set up a handler to process incoming event deliveries
    client.onMessage((message) => {
        if (message.type === MessageType.EVENT_DELIVERY && message.payload.topic_name === topic) {
            console.log(`\n--- New Event Received on '${topic}' ---`);
            console.log(`From Publisher: ${message.payload.publisher_did}`);
            console.log(`Published At:   ${message.payload.published_at}`);
            console.log('Payload:', JSON.stringify(message.payload.payload, null, 2));
            console.log('--- End of Event ---');
        }
    });
}
```

## 2. Publishing an Event to a Topic

This example shows a "publisher" node that sends an event to a topic.

```typescript
import { KLFClient, createMessage, MessageType } from './klf-sdk';

async function publishHealthAlert(client: KLFClient, skaldDid: string, unhealthyNode: string) {
    const topic = 'kos:system:node_health_alerts';
    console.log(`Publishing health alert to topic: ${topic}`);

    const eventMessage = createMessage()
        .from(client.getDid()) // This message is from me (the publisher)
        .to(skaldDid) // Sent to the Skald node for distribution
        .type(MessageType.EVENT_PUBLISH)
        .payload({
            topic_name: topic,
            payload: {
                alert_type: 'HIGH_CPU_LOAD',
                node_did": unhealthyNode,
                cpu_usage_percent: 98.5,
                timestamp: new Date().toISOString()
            }
        })
        .build();

    // Fire-and-forget publish
    await client.sendMessage(eventMessage);
    console.log('Health alert published.');
}
``` 