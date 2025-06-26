---
title: "Tohunga Class: Code Examples"
description: "TypeScript code examples for interacting with the Tohunga Node Class via KLF."
---

# Tohunga Class Code Examples

This section provides conceptual TypeScript examples for interacting with the Tohunga node using the KLF.

## 1. Registering a New Data Source

```typescript
import { KLFClient, createMessage, MessageType } from './klf-sdk'; // Assuming an SDK exists

async function registerDataSource(client: KLFClient) {
    console.log("Registering a new GitHub API data source...");

    const requestMessage = createMessage()
        .from('did:kos:my-node:456')
        .to('did:kos:tohunga:xyz') // Target Tohunga node
        .type(MessageType.TASK_REQUEST)
        .payload({
            task_name: 'register_data_source',
            params: {
                source_name: 'GitHub Public Events API',
                source_type: 'http_api',
                connection_config: {
                    base_url: 'https://api.github.com'
                }
            }
        })
        .build();
    
    const response = await client.sendMessage(requestMessage);

    if (response.type === MessageType.TASK_RESPONSE && response.payload.status === 'completed') {
        console.log('Data source registered successfully!');
        console.log('New Source ID:', response.payload.result.source_id);
        return response.payload.result.source_id;
    } else {
        console.error('Failed to register data source:', response.payload.error);
        return null;
    }
}
```

## 2. Running a Data Acquisition Job

```typescript
import { KLFClient, createMessage, MessageType } from './klf-sdk';

async function runAcquisitionJob(client: KLFClient, sourceId: string) {
    console.log(`Starting acquisition job for source ${sourceId}...`);

    const requestMessage = createMessage()
        .from('did:kos:my-node:456')
        .to('did:kos:tohunga:xyz')
        .type(MessageType.TASK_REQUEST)
        .payload({
            task_name: 'run_acquisition_job',
            params: {
                source_id: sourceId,
                request_params: {
                    path": "/events",
                    "query_params": { "per_page": 5 }
                },
                pipeline_steps: [
                    {
                        step_module: "json_schema",
                        definition: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    id: { type: "string" },
                                    type: { type: "string" }
                                },
                                required: ["id", "type"]
                            }
                        }
                    }
                ],
                output_config": {
                    format: "json_lines",
                    destination: {
                        type: "klf_stream",
                        target_did": "did:kos:my-node:456" // Stream results back to me
                    }
                }
            }
        })
        .build();

    // Listen for progress and final response
    client.onMessage((message) => {
        if (message.payload.task_name !== 'run_acquisition_job') return;

        if (message.type === MessageType.TASK_PROGRESS) {
            console.log(`[ACQUISITION] ${message.payload.progress}%: ${message.payload.message}`);
        } else if (message.type === MessageType.TASK_RESPONSE) {
            if (message.payload.status === 'completed') {
                console.log('Acquisition job successful!');
                console.log('Final Asset URI:', message.payload.result.result_uri);
            } else {
                console.error('Acquisition job failed:');
                console.error(message.payload.error.message);
            }
        }
    });

    await client.sendMessage(requestMessage);
}
``` 