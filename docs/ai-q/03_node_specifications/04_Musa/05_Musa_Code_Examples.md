---
title: "Musa Class: Code Examples"
description: "TypeScript code examples for interacting with the Musa Node Class via KLF."
---

# Musa Class Code Examples

This section provides conceptual TypeScript examples for using the Musa node's security primitives.

## 1. Validating a Credential to Get a Principal

```typescript
import { KLFClient, createMessage, MessageType } from './klf-sdk';

async function authenticateAndGetPrincipal(client: KLFClient, credentialToken: string) {
    console.log("Attempting to validate credential...");

    const requestMessage = createMessage()
        .from('did:kos:my-app:123')
        .to('did:kos:musa:abc') // Target Musa node
        .type(MessageType.TASK_REQUEST)
        .payload({
            task_name: 'validate_credential',
            params: {
                credential": {
                    "type": "oidc_id_token",
                    "value": credentialToken
                }
            }
        })
        .build();
    
    const response = await client.sendMessage(requestMessage);

    if (response.type === MessageType.TASK_RESPONSE && response.payload.status === 'completed') {
        console.log('Authentication successful!');
        const principal = response.payload.result;
        console.log('Received Principal:', JSON.stringify(principal, null, 2));
        return principal;
    } else {
        console.error('Authentication failed:', response.payload.error.message);
        return null;
    }
}
```

## 2. Checking Permissions for an Action

```typescript
import { KLFClient, createMessage, MessageType } from './klf-sdk';

async function checkWritePermission(client: KLFClient, principal: any, documentId: string) {
    console.log(`Checking if principal ${principal.principal_id} can write to ${documentId}...`);

    const queryMessage = createMessage()
        .from('did:kos:my-app:123')
        .to('did:kos:musa:abc') // Target Musa node
        .type(MessageType.DATA_QUERY)
        .payload({
            query_name: 'check_permission',
            params: {
                principal: principal,
                action: 'write',
                resource: `did:kos:document:${documentId}`
            }
        })
        .build();
    
    const response = await client.sendMessage(queryMessage);

    if (response.type === MessageType.DATA_RESULT) {
        const { allowed } = response.payload.result;
        console.log('Permission check result:', allowed);
        return allowed;
    } else {
        console.error('Permission check failed to execute.');
        return false;
    }
}
``` 