---
title: "Hakim Class: Code Examples"
description: "TypeScript code examples for interacting with the Hakim Node Class via KLF."
---

# Hakim Class Code Examples

This section provides conceptual TypeScript examples for interacting with the Hakim node's services.

## 1. Requesting a Health Report for a Node

```typescript
import { KLFClient, createMessage, MessageType } from './klf-sdk';

async function getNodeHealth(client: KLFClient, targetNodeDid: string) {
    console.log(`Requesting health report for node: ${targetNodeDid}`);

    const queryMessage = createMessage()
        .from('did:kos:my-admin-console:456')
        .to('did:kos:hakim:xyz') // Target Hakim node
        .type(MessageType.DATA_QUERY)
        .payload({
            query_name: 'get_health_report',
            params: {
                target_node_did: targetNodeDid
            }
        })
        .build();
    
    const response = await client.sendMessage(queryMessage);

    if (response.type === MessageType.DATA_RESULT && !response.payload.error) {
        console.log('Health report received successfully!');
        const report = response.payload.result;
        console.log(JSON.stringify(report, null, 2));
        return report;
    } else {
        console.error('Failed to retrieve health report:', response.payload.error.message);
        return null;
    }
}
```

## 2. Requesting a Service Restart and Approving It

```typescript
import { KLFClient, createMessage, MessageType } from './klf-sdk';

// --- Step 1: An admin requests the restart ---
async function requestServiceRestart(client: KLFClient, targetNodeDid: string, serviceName: string) {
    console.log(`Requesting restart of service '${serviceName}' on node ${targetNodeDid}`);

    const requestMessage = createMessage()
        .from('did:kos:my-admin-console:456')
        .to('did:kos:hakim:xyz') // Target Hakim node
        .type(MessageType.TASK_REQUEST)
        .payload({
            task_name: 'request_maintenance',
            params: {
                target_node_did: targetNodeDid,
                maintenance_task: 'restart_service',
                task_params": {
                    "service_name": serviceName
                }
            }
        })
        .build();
    
    const response = await client.sendMessage(requestMessage);

    if (response.type === MessageType.TASK_RESPONSE && response.payload.status === 'completed') {
        const { job_id, job_status } = response.payload.result;
        console.log(`Maintenance job created with ID: ${job_id}, Status: ${job_status}`);
        return job_id;
    } else {
        console.error('Failed to create maintenance request:', response.payload.error.message);
        return null;
    }
}

// --- Step 2: The node owner approves the request ---
async function approveRestart(ownerClient: KLFClient, hakimDid: string, jobId: string) {
    console.log(`Approving maintenance job: ${jobId}`);
    
    const approvalMessage = createMessage()
        .from('did:kos:griot:123') // From the owner of the target node
        .to(hakimDid)
        .type(MessageType.SYSTEM_COMMAND)
        .payload({
            command_name: 'approve_maintenance_job',
            params: {
                job_id: jobId
            }
        })
        .build();

    // Fire-and-forget command, no direct response needed
    await ownerClient.sendMessage(approvalMessage);
    console.log('Approval command sent.');
}
``` 