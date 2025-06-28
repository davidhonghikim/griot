---
title: "Oracle Class: Code Examples"
description: "TypeScript code examples for interacting with the Oracle Node Class via KLF."
---

# Oracle Class Code Examples

This section provides a conceptual TypeScript example for submitting a query to an Oracle node and handling the asynchronous results.

## 1. Submitting a Query and Handling the Response

```typescript
import { KLFClient, createMessage, MessageType } from './klf-sdk';

async function queryMostCitedAuthors(client: KLFClient, oracleDid: string) {
    const query = `
        SELECT author, count(citations) as citation_count
        FROM 'griot:articles'
        WHERE 'published_year' >= 2023
        GROUP BY author
        ORDER BY citation_count DESC
        LIMIT 5
    `;

    console.log("Submitting query to Oracle...");

    // --- Step 1: Submit the initial query ---
    const requestMessage = createMessage()
        .from(client.getDid())
        .to(oracleDid)
        .type(MessageType.TASK_REQUEST)
        .payload({
            task_name: 'submit_query',
            params: { "query_string": query }
        })
        .build();

    const initialResponse = await client.sendMessage(requestMessage);
    
    if (initialResponse.payload.status !== 'completed') {
        console.error("Failed to submit query:", initialResponse.payload.error.message);
        return;
    }

    const { job_id } = initialResponse.payload.result;
    console.log(`Query submitted successfully. Job ID: ${job_id}`);

    // --- Step 2: Listen for progress and the final result ---
    console.log("Waiting for final response...");
    client.onMessage((message) => {
        // Filter for messages related to our job
        if (message.payload.job_id !== job_id) return;

        if (message.type === MessageType.TASK_PROGRESS) {
            console.log(`[PROGRESS ${message.payload.progress}%]: ${message.payload.message}`);
        } else if (message.type === MessageType.TASK_RESPONSE) {
            if (message.payload.status === 'completed') {
                console.log("\n--- Query Complete! ---");
                const fullResponse = message.payload.result;
                
                console.log("Results:", JSON.stringify(fullResponse.response.results, null, 2));
                console.log("\nExplanation:");
                console.log(`  Confidence: ${fullResponse.explanation.confidence_score}`);
                console.log("  Reasoning Trace:");
                fullResponse.explanation.reasoning_trace.forEach(step => console.log(`    - ${step}`));
                console.log("  Data Sources:");
                fullResponse.explanation.sources.forEach(src => console.log(`    - ${src.node_did} (${src.contribution})`));

            } else if (message.payload.status === 'failed') {
                console.error("\n--- Query Failed! ---");
                console.error("Error:", message.payload.error.message);
            }
        }
    });
}
``` 