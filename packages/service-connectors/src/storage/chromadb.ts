import type { ServiceDefinition, VectorDatabaseCapability, HealthCapability } from '../types';

const healthCapability: HealthCapability = {
  capability: 'health',
  endpoints: {
    health: { path: '/api/v1/heartbeat', method: 'GET' }
  }
};

const vectorDatabaseCapability: VectorDatabaseCapability = {
  capability: 'vector_database',
  endpoints: {
    // Collection operations
    listCollections: { path: '/api/v1/collections', method: 'GET' },
    createCollection: { path: '/api/v1/collections', method: 'POST' },
    getCollection: { path: '/api/v1/collections/{collection_name}', method: 'GET' },
    deleteCollection: { path: '/api/v1/collections/{collection_name}', method: 'DELETE' },
    
    // Document operations
    add: { path: '/api/v1/collections/{collection_name}/add', method: 'POST' },
    upsert: { path: '/api/v1/collections/{collection_name}/upsert', method: 'POST' },
    get: { path: '/api/v1/collections/{collection_name}/get', method: 'POST' },
    query: { path: '/api/v1/collections/{collection_name}/query', method: 'POST' },
    update: { path: '/api/v1/collections/{collection_name}/update', method: 'POST' },
    delete: { path: '/api/v1/collections/{collection_name}/delete', method: 'POST' },
    count: { path: '/api/v1/collections/{collection_name}/count', method: 'GET' }
  },
  parameters: {
    createCollection: [
      {
        key: 'name',
        label: 'Collection Name',
        type: 'string',
        defaultValue: '',
        description: 'Name of the collection to create'
      },
      {
        key: 'metadata',
        label: 'Metadata',
        type: 'string',
        defaultValue: '{}',
        description: 'Collection metadata (JSON)'
      }
    ],
    add: [
      {
        key: 'collection_name',
        label: 'Collection Name',
        type: 'string',
        defaultValue: '',
        description: 'Name of the collection'
      },
      {
        key: 'documents',
        label: 'Documents',
        type: 'string',
        defaultValue: '["document text"]',
        description: 'Array of document texts (JSON)'
      },
      {
        key: 'metadatas',
        label: 'Metadata',
        type: 'string',
        defaultValue: '[{}]',
        description: 'Array of metadata objects (JSON)'
      },
      {
        key: 'ids',
        label: 'IDs',
        type: 'string',
        defaultValue: '["id1"]',
        description: 'Array of document IDs (JSON)'
      }
    ],
    query: [
      {
        key: 'collection_name',
        label: 'Collection Name',
        type: 'string',
        defaultValue: '',
        description: 'Name of the collection'
      },
      {
        key: 'query_texts',
        label: 'Query Texts',
        type: 'string',
        defaultValue: '["search query"]',
        description: 'Array of query texts (JSON)'
      },
      {
        key: 'n_results',
        label: 'Number of Results',
        type: 'number',
        defaultValue: 10,
        range: [1, 100],
        description: 'Number of results to return'
      },
      {
        key: 'where',
        label: 'Where Filter',
        type: 'string',
        defaultValue: '{}',
        description: 'Metadata filter (JSON)'
      },
      {
        key: 'include',
        label: 'Include Fields',
        type: 'string',
        defaultValue: '["metadatas", "documents", "distances"]',
        description: 'Fields to include in results (JSON array)'
      }
    ],
    get: [
      {
        key: 'collection_name',
        label: 'Collection Name',
        type: 'string',
        defaultValue: '',
        description: 'Name of the collection'
      },
      {
        key: 'ids',
        label: 'IDs',
        type: 'string',
        defaultValue: '[]',
        description: 'Array of document IDs to retrieve (JSON)'
      },
      {
        key: 'where',
        label: 'Where Filter',
        type: 'string',
        defaultValue: '{}',
        description: 'Metadata filter (JSON)'
      },
      {
        key: 'limit',
        label: 'Limit',
        type: 'number',
        defaultValue: null,
        description: 'Maximum number of documents to return'
      },
      {
        key: 'offset',
        label: 'Offset',
        type: 'number',
        defaultValue: null,
        description: 'Number of documents to skip'
      }
    ],
    update: [
      {
        key: 'collection_name',
        label: 'Collection Name',
        type: 'string',
        defaultValue: '',
        description: 'Name of the collection'
      },
      {
        key: 'ids',
        label: 'IDs',
        type: 'string',
        defaultValue: '["id1"]',
        description: 'Array of document IDs to update (JSON)'
      },
      {
        key: 'documents',
        label: 'Documents',
        type: 'string',
        defaultValue: '["updated text"]',
        description: 'Array of updated document texts (JSON)'
      },
      {
        key: 'metadatas',
        label: 'Metadata',
        type: 'string',
        defaultValue: '[{}]',
        description: 'Array of updated metadata objects (JSON)'
      }
    ],
    delete: [
      {
        key: 'collection_name',
        label: 'Collection Name',
        type: 'string',
        defaultValue: '',
        description: 'Name of the collection'
      },
      {
        key: 'ids',
        label: 'IDs',
        type: 'string',
        defaultValue: '[]',
        description: 'Array of document IDs to delete (JSON)'
      },
      {
        key: 'where',
        label: 'Where Filter',
        type: 'string',
        defaultValue: '{}',
        description: 'Metadata filter for documents to delete (JSON)'
      }
    ]
  }
};

export const chromaDefinition: ServiceDefinition = {
  type: 'chroma',
  name: 'ChromaDB',
  category: 'storage',
  protocol: 'https',
  defaultPort: 8000,
  docs: {
    api: 'https://docs.trychroma.com/reference/py-client',
    main: 'https://www.trychroma.com'
  },
  authentication: {
    type: 'none'
  },
  configuration: {
    help: {
      title: 'ChromaDB Setup',
      instructions: [
        'Install ChromaDB: pip install chromadb',
        'Start the server: chroma run --host 0.0.0.0 --port 8000',
        'Or use Docker: docker run -p 8000:8000 chromadb/chroma',
        'Access the API at http://localhost:8000'
      ].join('\n'),
      links: [
        { label: 'ChromaDB Website', url: 'https://www.trychroma.com' },
        { label: 'Documentation', url: 'https://docs.trychroma.com' },
        { label: 'GitHub Repository', url: 'https://github.com/chroma-core/chroma' },
        { label: 'Python Client', url: 'https://docs.trychroma.com/reference/py-client' }
      ]
    }
  },
  capabilities: [vectorDatabaseCapability, healthCapability]
}; 