import type { ServiceDefinition, VectorDatabaseCapability, HealthCapability } from '../types';

const healthCapability: HealthCapability = {
  capability: 'health',
  endpoints: {
    health: { path: '/health', method: 'GET' }
  }
};

const vectorDatabaseCapability: VectorDatabaseCapability = {
  capability: 'vector_database',
  endpoints: {
    // Collection operations
    listCollections: { path: '/collections', method: 'GET' },
    createCollection: { path: '/collections/{collection_name}', method: 'PUT' },
    getCollection: { path: '/collections/{collection_name}', method: 'GET' },
    deleteCollection: { path: '/collections/{collection_name}', method: 'DELETE' },
    
    // Point operations
    upsertPoints: { path: '/collections/{collection_name}/points', method: 'PUT' },
    getPoints: { path: '/collections/{collection_name}/points', method: 'POST' },
    searchPoints: { path: '/collections/{collection_name}/points/search', method: 'POST' },
    deletePoints: { path: '/collections/{collection_name}/points/delete', method: 'POST' },
    countPoints: { path: '/collections/{collection_name}/points/count', method: 'POST' },
    
    // Required VectorDatabaseCapability endpoints
    query: { path: '/collections/{collection_name}/points', method: 'POST' },
    upsert: { path: '/collections/{collection_name}/points', method: 'PUT' },
    delete: { path: '/collections/{collection_name}/points/delete', method: 'POST' },
    
    // Index operations
    createIndex: { path: '/collections/{collection_name}/index', method: 'PUT' },
    deleteIndex: { path: '/collections/{collection_name}/index/{field_name}', method: 'DELETE' }
  },
  parameters: {
    createCollection: [
      {
        key: 'collection_name',
        label: 'Collection Name',
        type: 'string',
        defaultValue: '',
        description: 'Name of the collection'
      },
      {
        key: 'vector_size',
        label: 'Vector Size',
        type: 'number',
        defaultValue: 384,
        range: [1, 65536],
        description: 'Dimension of the vectors'
      },
      {
        key: 'distance',
        label: 'Distance Metric',
        type: 'select',
        defaultValue: 'Cosine',
        options: [
          { value: 'Cosine', label: 'Cosine' },
          { value: 'Euclid', label: 'Euclidean' },
          { value: 'Dot', label: 'Dot Product' }
        ],
        description: 'Distance metric for similarity search'
      }
    ],
    upsertPoints: [
      {
        key: 'collection_name',
        label: 'Collection Name',
        type: 'string',
        defaultValue: '',
        description: 'Name of the collection'
      },
      {
        key: 'points',
        label: 'Points',
        type: 'string',
        defaultValue: '[{"id": 1, "vector": [0.1, 0.2, 0.3], "payload": {}}]',
        description: 'Array of points to upsert (JSON)'
      }
    ],
    searchPoints: [
      {
        key: 'collection_name',
        label: 'Collection Name',
        type: 'string',
        defaultValue: '',
        description: 'Name of the collection'
      },
      {
        key: 'vector',
        label: 'Query Vector',
        type: 'string',
        defaultValue: '[0.1, 0.2, 0.3]',
        description: 'Query vector (JSON array)'
      },
      {
        key: 'limit',
        label: 'Limit',
        type: 'number',
        defaultValue: 10,
        range: [1, 1000],
        description: 'Number of results to return'
      },
      {
        key: 'filter',
        label: 'Filter',
        type: 'string',
        defaultValue: '{}',
        description: 'Payload filter (JSON)'
      },
      {
        key: 'with_payload',
        label: 'Include Payload',
        type: 'boolean',
        defaultValue: true,
        description: 'Include payload in results'
      },
      {
        key: 'with_vector',
        label: 'Include Vector',
        type: 'boolean',
        defaultValue: false,
        description: 'Include vector in results'
      }
    ],
    getPoints: [
      {
        key: 'collection_name',
        label: 'Collection Name',
        type: 'string',
        defaultValue: '',
        description: 'Name of the collection'
      },
      {
        key: 'ids',
        label: 'Point IDs',
        type: 'string',
        defaultValue: '[1, 2, 3]',
        description: 'Array of point IDs to retrieve (JSON)'
      },
      {
        key: 'with_payload',
        label: 'Include Payload',
        type: 'boolean',
        defaultValue: true,
        description: 'Include payload in results'
      },
      {
        key: 'with_vector',
        label: 'Include Vector',
        type: 'boolean',
        defaultValue: false,
        description: 'Include vector in results'
      }
    ],
    deletePoints: [
      {
        key: 'collection_name',
        label: 'Collection Name',
        type: 'string',
        defaultValue: '',
        description: 'Name of the collection'
      },
      {
        key: 'points',
        label: 'Point IDs',
        type: 'string',
        defaultValue: '[1, 2, 3]',
        description: 'Array of point IDs to delete (JSON)'
      }
    ],
    countPoints: [
      {
        key: 'collection_name',
        label: 'Collection Name',
        type: 'string',
        defaultValue: '',
        description: 'Name of the collection'
      },
      {
        key: 'filter',
        label: 'Filter',
        type: 'string',
        defaultValue: '{}',
        description: 'Payload filter for counting (JSON)'
      }
    ]
  }
};

export const qdrantDefinition: ServiceDefinition = {
  type: 'qdrant',
  name: 'Qdrant',
  category: 'storage',
  protocol: 'https',
  defaultPort: 6333,
  docs: {
    api: 'https://qdrant.tech/documentation/interfaces/rest/',
    main: 'https://qdrant.tech'
  },
  authentication: {
    type: 'api_key',
    keyName: 'api-key',
    help: 'Set API key in Qdrant configuration or use bearer token authentication'
  },
  configuration: {
    help: {
      title: 'Qdrant Setup',
      instructions: [
        'Install Qdrant: docker run -p 6333:6333 qdrant/qdrant',
        'Or download binary: https://github.com/qdrant/qdrant/releases',
        'Start Qdrant: ./qdrant --config-path config.yaml',
        'Access the API at http://localhost:6333'
      ].join('\n'),
      links: [
        { label: 'Qdrant Website', url: 'https://qdrant.tech' },
        { label: 'Documentation', url: 'https://qdrant.tech/documentation/' },
        { label: 'REST API', url: 'https://qdrant.tech/documentation/interfaces/rest/' },
        { label: 'GitHub Repository', url: 'https://github.com/qdrant/qdrant' }
      ]
    }
  },
  capabilities: [vectorDatabaseCapability, healthCapability]
}; 