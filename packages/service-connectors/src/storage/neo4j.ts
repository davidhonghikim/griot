import type { ServiceDefinition, HealthCapability, GraphDBCapability } from '../types';

const healthCapability: HealthCapability = {
  capability: 'health',
  endpoints: {
    health: { path: '/', method: 'GET' },
  },
};

const graphDbCapability: GraphDBCapability = {
    capability: 'graph_db',
    endpoints: {
        cypher: { path: '/db/data/cypher', method: 'POST' },
    },
    parameters: {
        cypher: [
            {
                key: 'query',
                label: 'Cypher Query',
                type: 'string',
                defaultValue: 'MATCH (n) RETURN n LIMIT 1',
                description: 'The Cypher query to execute.',
            },
            {
                key: 'params',
                label: 'Query Parameters',
                type: 'string',
                defaultValue: '{}',
                description: 'JSON object of parameters for the query.',
            },
        ],
    }
};

export const neo4jDefinition: ServiceDefinition = {
  type: 'neo4j',
  name: 'Neo4j',
  category: 'storage',
  protocol: {
    primary: 'https',
    fallback: 'http',
    autoDetect: true
  },
  defaultPort: 7474,
  hasExternalUi: true,
  authentication: {
    type: 'basic'
  },
  capabilities: [
    healthCapability,
    graphDbCapability,
  ],
}; 