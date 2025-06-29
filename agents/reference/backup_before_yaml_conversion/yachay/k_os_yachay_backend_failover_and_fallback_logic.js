// kOS Yachay Backend Failover and Query Fallback Logic
// Node Class: Yachay (Memory Starseed)

export class YachayFailoverRouter {
  constructor(adapter, config) {
    this.adapter = adapter;
    this.config = config;
  }

  async routeWithFailover(queryType, payload) {
    const primary = this.getPrimaryBackend(queryType);
    const fallbacks = this.getFallbackBackends(queryType);
    const targets = [primary, ...fallbacks];

    for (const target of targets) {
      try {
        console.log(`🔍 Attempting ${queryType} on ${target} backend...`);
        return await this.executeOnBackend(target, queryType, payload);
      } catch (err) {
        console.warn(`❌ Failed on ${target}: ${err.message}`);
        continue;
      }
    }
    throw new Error(`❌ All backends failed for queryType: ${queryType}`);
  }

  getPrimaryBackend(queryType) {
    switch (queryType) {
      case 'vector:search':
        return this.config.runtime_selection.vector_store.primary.type;
      case 'document:create':
        return this.config.knowledge_backends.document_store.type;
      case 'graph:link':
        return this.config.knowledge_backends.graph_store.type;
      default:
        return 'mongo';
    }
  }

  getFallbackBackends(queryType) {
    if (queryType.startsWith('vector:')) {
      return this.config.runtime_selection.failover_order.vector_store.filter(v => v !== this.getPrimaryBackend(queryType));
    }
    return [];
  }

  async executeOnBackend(backend, queryType, payload) {
    switch (backend) {
      case 'weaviate':
      case 'chroma':
      case 'milvus':
        const client = this.adapter.vectorClients[backend];
        await client.post('/vectors/query', payload);
        return { status: 'vector query success', backend };
      case 'mongo':
        return await this.adapter.mongo.db('yachay_db').collection('docs').insertOne(payload);
      case 'neo4j':
        const session = this.adapter.neo4j.session();
        const cypher = `MERGE (a:Node {id: $from}) MERGE (b:Node {id: $to}) MERGE (a)-[:LINK]->(b)`;
        await session.run(cypher, payload);
        await session.close();
        return { status: 'graph link success', backend };
      default:
        throw new Error(`Unknown backend: ${backend}`);
    }
  }
}

// Usage Example:
// const failoverRouter = new YachayFailoverRouter(adapter, config);
// await failoverRouter.routeWithFailover('vector:search', { vector: [0.1, 0.2, 0.3] });

// ---
// ✅ Provides per-query-type failover logic
// ✅ Reads from centralized YAML config for backend priorities
// ✅ Next optional step: Cross-cluster federated query execution module
