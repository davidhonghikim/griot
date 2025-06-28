import type { ServiceDefinition, HealthCapability, VectorDatabaseCapability } from '../types';

const healthCapability: HealthCapability = {
  capability: 'health',
  endpoints: {
    health: { path: '/v1/meta', method: 'GET' },
  },
};

const vectorDatabaseCapability: VectorDatabaseCapability = {
    capability: 'vector_database',
    endpoints: {
        query: { path: '/v1/graphql', method: 'POST' },
        upsert: { path: '/v1/objects', method: 'POST' },
        delete: { path: '/v1/objects/{id}', method: 'DELETE' },
        listCollections: { path: '/v1/schema', method: 'GET' },
        createCollection: { path: '/v1/schema', method: 'POST' },
    },
    parameters: {
        query: [
            {
                key: 'query',
                label: 'GraphQL Query',
                type: 'string',
                defaultValue: '{ Get { Things { Article { title } } } }',
                description: 'The GraphQL query to execute for vector search.',
            },
        ],
        // Parameters for other endpoints would be defined here
    }
};

export const weaviateDefinition: ServiceDefinition = {
  type: 'weaviate',
  name: 'Weaviate',
  category: 'storage',
  protocol: {
    primary: 'https',
    fallback: 'http',
    autoDetect: true
  },
  defaultPort: 8080,
  hasExternalUi: true,
  authentication: {
    type: 'api_key',
    keyName: 'X-OpenAI-Api-Key'
  },
  capabilities: [
    {
      capability: 'vector_database',
      endpoints: {
        health: { path: '/v1/.well-known/ready', method: 'GET' },
        listCollections: { path: '/v1/schema', method: 'GET' },
        query: { path: '/v1/graphql', method: 'POST' },
        upsert: { path: '/v1/objects', method: 'POST' },
        delete: { path: '/v1/objects/:id', method: 'DELETE' },
        createCollection: { path: '/v1/schema', method: 'POST' }
      },
      parameters: {
        query: [
          {
            key: 'query',
            label: 'GraphQL Query',
            type: 'string',
            defaultValue: '',
            description: 'GraphQL query to execute'
          }
        ]
      }
    }
  ]
}; 