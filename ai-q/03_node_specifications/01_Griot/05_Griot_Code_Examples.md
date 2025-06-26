---
title: "Griot Class: Code Examples"
description: "TypeScript code examples for interacting with the Griot Node Class via KLF."
---

## 7. TypeScript Code Examples

This section provides conceptual TypeScript examples for interacting with the Griot node using the KLF.

### 7.1. Requesting a Node Package

```typescript
import { KLFClient, createMessage, MessageType } from './klf-sdk'; // Assuming an SDK exists

async function requestReplication(client: KLFClient, repoUrl: string, version: string) {
    console.log(`Requesting replication for ${repoUrl}@${version}...`);

    const requestMessage = createMessage()
        .from('did:kos:my-node:123')
        .to('did:kos:griot:abc') // Target Griot node
        .type(MessageType.TASK_REQUEST)
        .payload({
            task_name: 'replicate',
            params: {
                source_url: repoUrl,
                version: version,
            },
        })
        .build();

    // Listen for progress and final response
    client.onMessage((message) => {
        if (message.payload.task_name !== 'replicate') return;

        if (message.type === MessageType.TASK_PROGRESS) {
            console.log(`[PROGRESS] ${message.payload.progress}%: ${message.payload.message}`);
        } else if (message.type === MessageType.TASK_RESPONSE) {
            if (message.payload.status === 'completed') {
                console.log('Replication successful!');
                console.log('New Package ID:', message.payload.result.package_id);
            } else {
                console.error('Replication failed:');
                console.error(message.payload.error.message);
            }
        }
    });

    await client.sendMessage(requestMessage);
}
```

### 7.2. Installing a Node Package

```typescript
import { KLFClient, createMessage, MessageType } from './klf-sdk';

async function requestDifferentiation(client: KLFClient, packageId: string) {
    console.log(`Requesting differentiation for package ${packageId}...`);

    const requestMessage = createMessage()
        .from('did:kos:my-node:123')
        .to('did:kos:griot:abc') // Target Griot node
        .type(MessageType.TASK_REQUEST)
        .payload({
            task_name: 'differentiate',
            params: {
                package_id: packageId,
                config: {
                    env_vars: {
                        LOG_LEVEL: 'debug',
                    },
                },
            },
        })
        .build();

    // Listen for progress and final response
    client.onMessage((message) => {
        if (message.payload.task_name !== 'differentiate') return;

        if (message.type === MessageType.TASK_PROGRESS) {
            console.log(`[INSTALL] ${message.payload.progress}%: ${message.payload.message}`);
        } else if (message.type === MessageType.TASK_RESPONSE) {
            if (message.payload.status === 'completed') {
                console.log('Differentiation successful!');
                console.log('New Node ID:', message.payload.result.new_node_id);
            } else {
                console.error('Differentiation failed:');
                console.error(message.payload.error.message);
            }
        }
    });

    await client.sendMessage(requestMessage);
}
``` 