// kOS Yachay Runtime DB Adapter Module
// Node Class: Yachay (Memory Starseed)

import { MongoClient } from 'mongodb';
import { Client as PgClient } from 'pg';
import neo4j from 'neo4j-driver';
import axios from 'axios';
import redis from 'redis';

const config = await import('./knowledge-backend-config.yaml', { assert: { type: 'yaml' } });

export class YachayDBAdapter {
  constructor() {
    this.mongo = null;
    this.postgres = null;
    this.neo4j = null;
    this.vectorClients = {};
    this.redis = null;
  }

  async connectMongo() {
    const uri = config.knowledge_backends.document_store.connection.uri;
    this.mongo = new MongoClient(uri);
    await this.mongo.connect();
    console.log('✅ Connected to MongoDB');
  }

  async connectPostgres() {
    const pgConfig = config.knowledge_backends.relational_store.connection;
    this.postgres = new PgClient(pgConfig);
    await this.postgres.connect();
    console.log('✅ Connected to PostgreSQL');
  }

  async connectNeo4j() {
    const neoConfig = config.knowledge_backends.graph_store.connection;
    this.neo4j = neo4j.driver(neoConfig.uri, neo4j.auth.basic(neoConfig.user, neoConfig.password));
    await this.neo4j.verifyConnectivity();
    console.log('✅ Connected to Neo4j');
  }

  async connectVectorStore() {
    for (const store of [config.knowledge_backends.vector_store.primary, ...config.knowledge_backends.vector_store.alternatives]) {
      this.vectorClients[store.type] = axios.create({ baseURL: store.endpoint });
    }
    console.log('✅ Vector clients ready');
  }

  async connectRedis() {
    const redisConfig = config.knowledge_backends.cache_store.connection;
    this.redis = redis.createClient({
      url: `redis://${redisConfig.host}:${redisConfig.port}`
    });
    await this.redis.connect();
    console.log('✅ Connected to Redis');
  }

  async initializeAll() {
    await Promise.all([
      this.connectMongo(),
      this.connectPostgres(),
      this.connectNeo4j(),
      this.connectVectorStore(),
      this.connectRedis()
    ]);
    console.log('✅✅✅ Yachay Runtime DB Adapter fully initialized ✅✅✅');
  }
}

// Usage Example:
// const adapter = new YachayDBAdapter();
// await adapter.initializeAll();

// ---
// ✅ Fully dynamic backend connector
// ✅ Loads from centralized YAML config
// ✅ Next optional step: Implement runtime query router per incoming API request
