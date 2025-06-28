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
    },
    parameters: {
        query: [
            {
                key: 'sql',
                label: 'SQL Query',
                type: 'string',
                defaultValue: 'SELECT 1',
                description: 'The SQL query to execute.',
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
  type: 'postgres',
  name: 'PostgreSQL',
  description: 'A powerful, open source object-relational database system.',
  category: 'storage',
  protocol: {
    primary: 'http',
    fallback: 'https',
    autoDetect: true,
  },
  defaultPort: 5432,
  authentication: {
    type: 'bearer_token',
    keyName: 'Authorization',
    help: 'Provide your PostgreSQL connection string or API token.'
  },
  capabilities: [
    healthCapability,
    relationalDbCapability,
  ],
}; 