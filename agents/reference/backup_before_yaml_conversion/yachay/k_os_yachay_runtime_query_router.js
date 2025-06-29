// kOS Yachay Runtime Query Router
// Node Class: Yachay (Memory Starseed)

import { YachayDBAdapter } from './runtime-db-adapter.js';

export class YachayQueryRouter {
  constructor(adapter) {
    this.adapter = adapter;
  }

  async route(queryType, payload) {
    switch (queryType) {
      case 'document:create':
        return await this.adapter.mongo.db('yachay_db').collection('docs').insertOne(payload);
      case 'graph:link':
        const session = this.adapter.neo4j.session();
        const cypher = `MERGE (a:Node {id: $from}) MERGE (b:Node {id: $to}) MERGE (a)-[:LINK]->(b)`;
        await session.run(cypher, { from: payload.from, to: payload.to });
        await session.close();
        return { status: 'linked' };
      case 'vector:upsert':
        const vectorClient = this.adapter.vectorClients[Object.keys(this.adapter.vectorClients)[0]];
        await vectorClient.post('/vectors', payload);
        return { status: 'vector upserted' };
      case 'relational:insert':
        await this.adapter.postgres.query('INSERT INTO logs(data) VALUES($1)', [JSON.stringify(payload)]);
        return { status: 'pg inserted' };
      case 'cache:set':
        await this.adapter.redis.set(payload.key, JSON.stringify(payload.value));
        return { status: 'cached' };
      default:
        throw new Error(`Unsupported queryType: ${queryType}`);
    }
  }
}

// Usage Example:
// const adapter = new YachayDBAdapter();
// await adapter.initializeAll();
// const router = new YachayQueryRouter(adapter);
// await router.route('document:create', { title: 'New Doc' });

// ---
// ✅ This module routes runtime operations to the correct DB backend
// ✅ Can expand with more query types (delete, update, semantic search, etc)
// ✅ Next optional step: Add multi-cloud deployment configs (GKE, AWS, Azure)
