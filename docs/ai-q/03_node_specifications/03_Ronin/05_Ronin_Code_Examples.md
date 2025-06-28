---
title: "Ronin Class: Code Examples"
description: "TypeScript code examples for interacting with the Ronin Node Class via KLF."
---

# Ronin Class Code Examples

This section provides conceptual TypeScript examples for interacting with the Ronin node using the KLF.

## 1. Running a Network Discovery Job

```typescript
import { KLFClient, createMessage, MessageType } from './klf-sdk'; // Assuming an SDK exists

async function runDiscovery(client: KLFClient, cidr: string) {
    console.log(`Requesting network discovery for CIDR: ${cidr}...`);

    const requestMessage = createMessage()
        .from('did:kos:my-node:789')
        .to('did:kos:ronin:pqr') // Target Ronin node
        .type(MessageType.TASK_REQUEST)
        .payload({
            task_name: 'run_discovery_job',
            params: {
                target: {
                    type: 'network_cidr',
                    value: cidr
                },
                protocols: ['mdns', 'http-api'],
                depth": 1
            }
        })
        .build();

    // Listen for progress and final response
    client.onMessage((message) => {
        if (message.payload.task_name !== 'run_discovery_job') return;

        if (message.type === MessageType.TASK_PROGRESS) {
            console.log(`[DISCOVERY] ${message.payload.progress}%: ${message.payload.message}`);
        } else if (message.type === MessageType.TASK_RESPONSE) {
            if (message.payload.status === 'completed') {
                console.log('Discovery job successful!');
                console.log('Services Found:', message.payload.result.services_found.length);
                console.log(JSON.stringify(message.payload.result.services_found, null, 2));
            } else {
                console.error('Discovery job failed:');
                console.error(message.payload.error.message);
            }
        }
    });

    await client.sendMessage(requestMessage);
}
``` 