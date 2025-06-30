import type { ServiceDefinition, HealthCapability, VectorSearchCapability, ParameterDefinition } from '../../types';

const searchParameters: ParameterDefinition[] = [
  {
    key: 'model',
    label: 'Embedding Model',
    type: 'select',
    defaultValue: 'sentence-transformers/all-MiniLM-L6-v2',
    description: 'The embedding model to use for vector search.',
    optionsEndpoint: 'getModels',
    optionsPath: 'models',
    optionsValueKey: 'name',
    optionsLabelKey: 'name'
  },
  {
    key: 'topK',
    label: 'Top K Results',
    type: 'number',
    defaultValue: 10,
    range: [1, 100],
    step: 1,
    description: 'Number of top results to return.'
  },
  {
    key: 'similarityThreshold',
    label: 'Similarity Threshold',
    type: 'number',
    defaultValue: 0.7,
    range: [0, 1],
    step: 0.05,
    description: 'Minimum similarity score for results.'
  }
];

const healthCapability: HealthCapability = {
  capability: 'health',
  endpoints: {
    health: { path: '/health', method: 'GET' }
  }
};

const vectorSearchCapability: VectorSearchCapability = {
  capability: 'vector_search',
  endpoints: {
    search: { path: '/api/search', method: 'POST' },
    getModels: { path: '/api/models', method: 'GET' },
    addDocument: { path: '/api/documents', method: 'POST' },
    deleteDocument: { path: '/api/documents/{id}', method: 'DELETE' }
  },
  parameters: {
    search: searchParameters
  }
};

export const vectorStoreDefinition: ServiceDefinition = {
  type: 'vector_store',
  name: 'Vector Store',
  category: 'storage',
  defaultPort: 6333,
  docs: {
    api: 'https://weaviate.io/developers/weaviate/api'
  },
  authentication: {
    type: 'api_key',
    headerName: 'X-API-Key',
    headerValue: '{api_key}'
  },
  configuration: {
    help: {
      instructions: 'Vector store service for semantic search and document storage. Configure the API key in the service settings.'
    }
  },
  capabilities: [vectorSearchCapability, healthCapability]
}; 