import type { ServiceDefinition, HealthCapability, RelationalDBCapability } from '../types';

const healthCapability: HealthCapability = {
  capability: 'health',
  endpoints: {
    health: { path: '/health', method: 'GET' },
  },
};

const relationalDbCapability: RelationalDBCapability = {
    capability: 'relational_db',
    endpoints: {
        query: { path: '/query', method: 'POST' },
        listTables: { path: '/tables', method: 'GET' },
        describeTable: { path: '/tables/:table', method: 'GET' }
    },
    parameters: {
        query: [
            {
                key: 'sql',
                label: 'SQL Query',
                type: 'string',
                defaultValue: '',
                description: 'SQL query to execute'
            },
            {
                key: 'params',
                label: 'Query Parameters',
                type: 'string',
                defaultValue: '[]',
                description: 'JSON array of parameters for the prepared statement.',
            },
        ],
        listTables: [],
    }
};

export const postgresDefinition: ServiceDefinition = {
  type: 'postgresql',
  name: 'PostgreSQL',
  category: 'storage',
  protocol: {
    primary: 'https',
    fallback: 'http',
    autoDetect: true
  },
  defaultPort: 5432,
  authentication: {
    type: 'basic'
  },
  capabilities: [
    healthCapability,
    relationalDbCapability,
  ],
}; 