import type { ServiceDefinition, DocumentStorageCapability, HealthCapability } from '../types';

const healthCapability: HealthCapability = {
  capability: 'health',
  endpoints: {
    health: { path: '/admin/ping', method: 'GET' }
  }
};

const documentStorageCapability: DocumentStorageCapability = {
  capability: 'document_storage',
  endpoints: {
    // Database operations
    listDatabases: { path: '/admin/listDatabases', method: 'GET' },
    createDatabase: { path: '/admin/createDatabase', method: 'POST' },
    dropDatabase: { path: '/admin/dropDatabase', method: 'POST' },
    
    // Collection operations
    listCollections: { path: '/{database}/listCollections', method: 'GET' },
    createCollection: { path: '/{database}/createCollection', method: 'POST' },
    dropCollection: { path: '/{database}/dropCollection', method: 'POST' },
    
    // Document operations
    insertOne: { path: '/{database}/{collection}/insertOne', method: 'POST' },
    insertMany: { path: '/{database}/{collection}/insertMany', method: 'POST' },
    findOne: { path: '/{database}/{collection}/findOne', method: 'POST' },
    find: { path: '/{database}/{collection}/find', method: 'POST' },
    updateOne: { path: '/{database}/{collection}/updateOne', method: 'POST' },
    updateMany: { path: '/{database}/{collection}/updateMany', method: 'POST' },
    replaceOne: { path: '/{database}/{collection}/replaceOne', method: 'POST' },
    deleteOne: { path: '/{database}/{collection}/deleteOne', method: 'POST' },
    deleteMany: { path: '/{database}/{collection}/deleteMany', method: 'POST' },
    
    // Aggregation
    aggregate: { path: '/{database}/{collection}/aggregate', method: 'POST' },
    count: { path: '/{database}/{collection}/count', method: 'POST' },
    distinct: { path: '/{database}/{collection}/distinct', method: 'POST' },
    
    // Index operations
    createIndex: { path: '/{database}/{collection}/createIndex', method: 'POST' },
    listIndexes: { path: '/{database}/{collection}/listIndexes', method: 'GET' },
    dropIndex: { path: '/{database}/{collection}/dropIndex', method: 'POST' },
    
    // Bulk operations
    bulkWrite: { path: '/{database}/{collection}/bulkWrite', method: 'POST' }
  },
  parameters: {
    // Database parameters
    createDatabase: [
      {
        key: 'database',
        label: 'Database Name',
        type: 'string',
        defaultValue: '',
        description: 'Name of the database to create'
      }
    ],
    dropDatabase: [
      {
        key: 'database',
        label: 'Database Name',
        type: 'string',
        defaultValue: '',
        description: 'Name of the database to drop'
      }
    ],
    
    // Collection parameters
    listCollections: [
      {
        key: 'database',
        label: 'Database Name',
        type: 'string',
        defaultValue: '',
        description: 'Name of the database'
      }
    ],
    createCollection: [
      {
        key: 'database',
        label: 'Database Name',
        type: 'string',
        defaultValue: '',
        description: 'Name of the database'
      },
      {
        key: 'collection',
        label: 'Collection Name',
        type: 'string',
        defaultValue: '',
        description: 'Name of the collection to create'
      },
      {
        key: 'options',
        label: 'Collection Options',
        type: 'string',
        defaultValue: '{}',
        description: 'JSON options for collection creation (e.g., capped, size, max)'
      }
    ],
    dropCollection: [
      {
        key: 'database',
        label: 'Database Name',
        type: 'string',
        defaultValue: '',
        description: 'Name of the database'
      },
      {
        key: 'collection',
        label: 'Collection Name',
        type: 'string',
        defaultValue: '',
        description: 'Name of the collection to drop'
      }
    ],
    
    // Document operation parameters
    insertOne: [
      {
        key: 'database',
        label: 'Database Name',
        type: 'string',
        defaultValue: '',
        description: 'Name of the database'
      },
      {
        key: 'collection',
        label: 'Collection Name',
        type: 'string',
        defaultValue: '',
        description: 'Name of the collection'
      },
      {
        key: 'document',
        label: 'Document',
        type: 'string',
        defaultValue: '{}',
        description: 'JSON document to insert'
      }
    ],
    insertMany: [
      {
        key: 'database',
        label: 'Database Name',
        type: 'string',
        defaultValue: '',
        description: 'Name of the database'
      },
      {
        key: 'collection',
        label: 'Collection Name',
        type: 'string',
        defaultValue: '',
        description: 'Name of the collection'
      },
      {
        key: 'documents',
        label: 'Documents',
        type: 'string',
        defaultValue: '[{}]',
        description: 'JSON array of documents to insert'
      }
    ],
    find: [
      {
        key: 'database',
        label: 'Database Name',
        type: 'string',
        defaultValue: '',
        description: 'Name of the database'
      },
      {
        key: 'collection',
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
        description: 'MongoDB query filter (JSON)'
      },
      {
        key: 'projection',
        label: 'Projection',
        type: 'string',
        defaultValue: '{}',
        description: 'Fields to include/exclude (JSON)'
      },
      {
        key: 'sort',
        label: 'Sort',
        type: 'string',
        defaultValue: '{}',
        description: 'Sort specification (JSON)'
      },
      {
        key: 'limit',
        label: 'Limit',
        type: 'number',
        defaultValue: 0,
        description: 'Maximum number of documents to return (0 = no limit)'
      },
      {
        key: 'skip',
        label: 'Skip',
        type: 'number',
        defaultValue: 0,
        description: 'Number of documents to skip'
      }
    ],
    findOne: [
      {
        key: 'database',
        label: 'Database Name',
        type: 'string',
        defaultValue: '',
        description: 'Name of the database'
      },
      {
        key: 'collection',
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
        description: 'MongoDB query filter (JSON)'
      },
      {
        key: 'projection',
        label: 'Projection',
        type: 'string',
        defaultValue: '{}',
        description: 'Fields to include/exclude (JSON)'
      }
    ],
    updateOne: [
      {
        key: 'database',
        label: 'Database Name',
        type: 'string',
        defaultValue: '',
        description: 'Name of the database'
      },
      {
        key: 'collection',
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
        description: 'MongoDB query filter (JSON)'
      },
      {
        key: 'update',
        label: 'Update',
        type: 'string',
        defaultValue: '{"$set": {}}',
        description: 'Update operations (JSON)'
      },
      {
        key: 'upsert',
        label: 'Upsert',
        type: 'boolean',
        defaultValue: false,
        description: 'Create document if it doesn\'t exist'
      }
    ],
    updateMany: [
      {
        key: 'database',
        label: 'Database Name',
        type: 'string',
        defaultValue: '',
        description: 'Name of the database'
      },
      {
        key: 'collection',
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
        description: 'MongoDB query filter (JSON)'
      },
      {
        key: 'update',
        label: 'Update',
        type: 'string',
        defaultValue: '{"$set": {}}',
        description: 'Update operations (JSON)'
      },
      {
        key: 'upsert',
        label: 'Upsert',
        type: 'boolean',
        defaultValue: false,
        description: 'Create documents if they don\'t exist'
      }
    ],
    deleteOne: [
      {
        key: 'database',
        label: 'Database Name',
        type: 'string',
        defaultValue: '',
        description: 'Name of the database'
      },
      {
        key: 'collection',
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
        description: 'MongoDB query filter (JSON)'
      }
    ],
    deleteMany: [
      {
        key: 'database',
        label: 'Database Name',
        type: 'string',
        defaultValue: '',
        description: 'Name of the database'
      },
      {
        key: 'collection',
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
        description: 'MongoDB query filter (JSON)'
      }
    ],
    
    // Aggregation parameters
    aggregate: [
      {
        key: 'database',
        label: 'Database Name',
        type: 'string',
        defaultValue: '',
        description: 'Name of the database'
      },
      {
        key: 'collection',
        label: 'Collection Name',
        type: 'string',
        defaultValue: '',
        description: 'Name of the collection'
      },
      {
        key: 'pipeline',
        label: 'Aggregation Pipeline',
        type: 'string',
        defaultValue: '[{"$match": {}}]',
        description: 'MongoDB aggregation pipeline (JSON array)'
      }
    ],
    count: [
      {
        key: 'database',
        label: 'Database Name',
        type: 'string',
        defaultValue: '',
        description: 'Name of the database'
      },
      {
        key: 'collection',
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
        description: 'MongoDB query filter (JSON)'
      }
    ],
    distinct: [
      {
        key: 'database',
        label: 'Database Name',
        type: 'string',
        defaultValue: '',
        description: 'Name of the database'
      },
      {
        key: 'collection',
        label: 'Collection Name',
        type: 'string',
        defaultValue: '',
        description: 'Name of the collection'
      },
      {
        key: 'field',
        label: 'Field Name',
        type: 'string',
        defaultValue: '',
        description: 'Field to get distinct values for'
      },
      {
        key: 'filter',
        label: 'Filter',
        type: 'string',
        defaultValue: '{}',
        description: 'MongoDB query filter (JSON)'
      }
    ],
    
    // Index parameters
    createIndex: [
      {
        key: 'database',
        label: 'Database Name',
        type: 'string',
        defaultValue: '',
        description: 'Name of the database'
      },
      {
        key: 'collection',
        label: 'Collection Name',
        type: 'string',
        defaultValue: '',
        description: 'Name of the collection'
      },
      {
        key: 'keys',
        label: 'Index Keys',
        type: 'string',
        defaultValue: '{"field": 1}',
        description: 'Index specification (JSON, 1 for ascending, -1 for descending)'
      },
      {
        key: 'options',
        label: 'Index Options',
        type: 'string',
        defaultValue: '{}',
        description: 'Index options (JSON, e.g., unique, sparse, background)'
      }
    ],
    listIndexes: [
      {
        key: 'database',
        label: 'Database Name',
        type: 'string',
        defaultValue: '',
        description: 'Name of the database'
      },
      {
        key: 'collection',
        label: 'Collection Name',
        type: 'string',
        defaultValue: '',
        description: 'Name of the collection'
      }
    ],
    dropIndex: [
      {
        key: 'database',
        label: 'Database Name',
        type: 'string',
        defaultValue: '',
        description: 'Name of the database'
      },
      {
        key: 'collection',
        label: 'Collection Name',
        type: 'string',
        defaultValue: '',
        description: 'Name of the collection'
      },
      {
        key: 'index',
        label: 'Index Name',
        type: 'string',
        defaultValue: '',
        description: 'Name of the index to drop'
      }
    ]
  }
};

export const mongodbDefinition: ServiceDefinition = {
  type: 'mongodb',
  name: 'MongoDB',
  category: 'storage',
  protocol: 'https',
  defaultPort: 27017,
  docs: {
    api: 'https://docs.mongodb.com/manual/reference/method/',
    main: 'https://www.mongodb.com',
    drivers: 'https://docs.mongodb.com/drivers/'
  },
  authentication: {
    type: 'basic',
    help: 'Use MongoDB username and password. For MongoDB Atlas, use the connection string credentials.'
  },
  configuration: {
    help: {
      title: 'MongoDB Setup',
      instructions: [
        'Install MongoDB: https://docs.mongodb.com/manual/installation/',
        'Start MongoDB service: mongod --dbpath /data/db',
        'For production, use MongoDB Atlas: https://cloud.mongodb.com',
        'Configure authentication if needed',
        'This connector assumes a REST API wrapper around MongoDB (like mongo-express API or custom REST layer)'
      ].join('\n'),
      links: [
        { label: 'MongoDB Website', url: 'https://www.mongodb.com' },
        { label: 'MongoDB Manual', url: 'https://docs.mongodb.com/manual/' },
        { label: 'MongoDB Atlas', url: 'https://cloud.mongodb.com' },
        { label: 'MongoDB Drivers', url: 'https://docs.mongodb.com/drivers/' },
        { label: 'MongoDB Compass', url: 'https://www.mongodb.com/products/compass' }
      ]
    },
    warnings: [
      'This connector assumes a REST API wrapper around MongoDB.',
      'Direct MongoDB wire protocol is not supported via HTTP.',
      'Consider using MongoDB Atlas Data API or a custom REST layer.',
      'Ensure proper authentication and network security.'
    ]
  },
  capabilities: [documentStorageCapability, healthCapability]
}; 