import type { ServiceDefinition, VectorDatabaseCapability, HealthCapability } from '../types';

const healthCapability: HealthCapability = {
  capability: 'health',
  endpoints: {
    health: { path: '/v1/health', method: 'GET' }
  }
};

const vectorDatabaseCapability: VectorDatabaseCapability = {
  capability: 'vector_database',
  endpoints: {
    // Collection operations
    listCollections: { path: '/v1/collections', method: 'GET' },
    createCollection: { path: '/v1/collections', method: 'POST' },
    getCollection: { path: '/v1/collections/{collection_name}', method: 'GET' },
    dropCollection: { path: '/v1/collections/{collection_name}', method: 'DELETE' },
    
    // Partition operations
    listPartitions: { path: '/v1/collections/{collection_name}/partitions', method: 'GET' },
    createPartition: { path: '/v1/collections/{collection_name}/partitions', method: 'POST' },
    dropPartition: { path: '/v1/collections/{collection_name}/partitions/{partition_name}', method: 'DELETE' },
    
    // Index operations
    createIndex: { path: '/v1/collections/{collection_name}/indexes', method: 'POST' },
    describeIndex: { path: '/v1/collections/{collection_name}/indexes', method: 'GET' },
    dropIndex: { path: '/v1/collections/{collection_name}/indexes', method: 'DELETE' },
    
    // Data operations
    insert: { path: '/v1/collections/{collection_name}/entities', method: 'POST' },
    search: { path: '/v1/collections/{collection_name}/entities/search', method: 'POST' },
    query: { path: '/v1/collections/{collection_name}/entities/query', method: 'POST' },
    upsert: { path: '/v1/collections/{collection_name}/entities', method: 'PUT' },
    delete: { path: '/v1/collections/{collection_name}/entities', method: 'DELETE' },
    
    // Collection management
    loadCollection: { path: '/v1/collections/{collection_name}/load', method: 'POST' },
    releaseCollection: { path: '/v1/collections/{collection_name}/release', method: 'POST' }
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
        key: 'dimension',
        label: 'Vector Dimension',
        type: 'number',
        defaultValue: 384,
        range: [1, 32768],
        description: 'Dimension of the vectors'
      },
      {
        key: 'metric_type',
        label: 'Metric Type',
        type: 'select',
        defaultValue: 'COSINE',
        options: [
          { value: 'L2', label: 'Euclidean (L2)' },
          { value: 'IP', label: 'Inner Product' },
          { value: 'COSINE', label: 'Cosine' },
          { value: 'HAMMING', label: 'Hamming' },
          { value: 'JACCARD', label: 'Jaccard' }
        ],
        description: 'Distance metric for similarity search'
      },
      {
        key: 'auto_id',
        label: 'Auto ID',
        type: 'boolean',
        defaultValue: true,
        description: 'Automatically generate IDs for entities'
      }
    ],
    createIndex: [
      {
        key: 'collection_name',
        label: 'Collection Name',
        type: 'string',
        defaultValue: '',
        description: 'Name of the collection'
      },
      {
        key: 'field_name',
        label: 'Field Name',
        type: 'string',
        defaultValue: 'vector',
        description: 'Name of the vector field to index'
      },
      {
        key: 'index_type',
        label: 'Index Type',
        type: 'select',
        defaultValue: 'IVF_FLAT',
        options: [
          { value: 'FLAT', label: 'FLAT' },
          { value: 'IVF_FLAT', label: 'IVF_FLAT' },
          { value: 'IVF_SQ8', label: 'IVF_SQ8' },
          { value: 'IVF_PQ', label: 'IVF_PQ' },
          { value: 'HNSW', label: 'HNSW' },
          { value: 'ANNOY', label: 'ANNOY' }
        ],
        description: 'Type of index to create'
      },
      {
        key: 'params',
        label: 'Index Parameters',
        type: 'string',
        defaultValue: '{"nlist": 1024}',
        description: 'Index-specific parameters (JSON)'
      }
    ],
    insert: [
      {
        key: 'collection_name',
        label: 'Collection Name',
        type: 'string',
        defaultValue: '',
        description: 'Name of the collection'
      },
      {
        key: 'data',
        label: 'Data',
        type: 'string',
        defaultValue: '[{"vector": [0.1, 0.2, 0.3], "id": 1}]',
        description: 'Array of entities to insert (JSON)'
      },
      {
        key: 'partition_name',
        label: 'Partition Name',
        type: 'string',
        defaultValue: '',
        description: 'Name of the partition (optional)'
      }
    ],
    search: [
      {
        key: 'collection_name',
        label: 'Collection Name',
        type: 'string',
        defaultValue: '',
        description: 'Name of the collection'
      },
      {
        key: 'data',
        label: 'Query Vectors',
        type: 'string',
        defaultValue: '[[0.1, 0.2, 0.3]]',
        description: 'Array of query vectors (JSON)'
      },
      {
        key: 'anns_field',
        label: 'Vector Field',
        type: 'string',
        defaultValue: 'vector',
        description: 'Name of the vector field to search'
      },
      {
        key: 'limit',
        label: 'Limit',
        type: 'number',
        defaultValue: 10,
        range: [1, 16384],
        description: 'Number of results to return'
      },
      {
        key: 'expr',
        label: 'Filter Expression',
        type: 'string',
        defaultValue: '',
        description: 'Boolean expression for filtering'
      },
      {
        key: 'output_fields',
        label: 'Output Fields',
        type: 'string',
        defaultValue: '["*"]',
        description: 'Fields to include in results (JSON array)'
      },
      {
        key: 'search_params',
        label: 'Search Parameters',
        type: 'string',
        defaultValue: '{"metric_type": "COSINE", "params": {"nprobe": 10}}',
        description: 'Search-specific parameters (JSON)'
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
        key: 'expr',
        label: 'Filter Expression',
        type: 'string',
        defaultValue: '',
        description: 'Boolean expression for filtering'
      },
      {
        key: 'output_fields',
        label: 'Output Fields',
        type: 'string',
        defaultValue: '["*"]',
        description: 'Fields to include in results (JSON array)'
      },
      {
        key: 'limit',
        label: 'Limit',
        type: 'number',
        defaultValue: 100,
        range: [1, 16384],
        description: 'Number of results to return'
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
        key: 'expr',
        label: 'Filter Expression',
        type: 'string',
        defaultValue: '',
        description: 'Boolean expression for selecting entities to delete'
      }
    ]
  }
};

export const milvusDefinition: ServiceDefinition = {
  type: 'milvus',
  name: 'Milvus',
  category: 'storage',
  protocol: 'https',
  defaultPort: 19530,
  docs: {
    api: 'https://milvus.io/api-reference/restful/v2.3.x/About.md',
    main: 'https://milvus.io'
  },
  authentication: {
    type: 'basic',
    help: 'Use Milvus username and password if authentication is enabled'
  },
  configuration: {
    help: {
      title: 'Milvus Setup',
      instructions: [
        'Install Milvus: docker-compose up -d (using official docker-compose.yml)',
        'Or use Milvus Lite: pip install milvus-lite',
        'Start Milvus server',
        'Access the REST API at http://localhost:19530 (requires REST proxy)',
        'Note: This connector assumes Milvus REST API proxy is available'
      ].join('\n'),
      links: [
        { label: 'Milvus Website', url: 'https://milvus.io' },
        { label: 'Documentation', url: 'https://milvus.io/docs' },
        { label: 'REST API', url: 'https://milvus.io/api-reference/restful/v2.3.x/About.md' },
        { label: 'Installation Guide', url: 'https://milvus.io/docs/install_standalone-docker.md' }
      ]
    },
    warnings: [
      'Milvus primarily uses gRPC protocol. This connector assumes a REST API proxy.',
      'Consider using the official Milvus SDKs for production use.',
      'REST API support may vary by Milvus version.'
    ]
  },
  capabilities: [vectorDatabaseCapability, healthCapability]
}; 