/**
 * MongoDB Document Operations
 * 
 * Defines document-level operations and parameters for MongoDB service.
 */

export const documentOperations = {
  // Document operations
  insertOne: { path: '/{database}/{collection}/insertOne', method: 'POST' },
  insertMany: { path: '/{database}/{collection}/insertMany', method: 'POST' },
  findOne: { path: '/{database}/{collection}/findOne', method: 'POST' },
  find: { path: '/{database}/{collection}/find', method: 'POST' },
  updateOne: { path: '/{database}/{collection}/updateOne', method: 'POST' },
  updateMany: { path: '/{database}/{collection}/updateMany', method: 'POST' },
  replaceOne: { path: '/{database}/{collection}/replaceOne', method: 'POST' },
  deleteOne: { path: '/{database}/{collection}/deleteOne', method: 'POST' },
  deleteMany: { path: '/{database}/{collection}/deleteMany', method: 'POST' }
};

export const documentParameters = {
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
      description: 'Maximum number of documents to return'
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
    },
    {
      key: 'sort',
      label: 'Sort',
      type: 'string',
      defaultValue: '{}',
      description: 'Sort specification (JSON)'
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
      defaultValue: '{}',
      description: 'Update operations (JSON)'
    },
    {
      key: 'options',
      label: 'Options',
      type: 'string',
      defaultValue: '{}',
      description: 'Update options (JSON)'
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
      defaultValue: '{}',
      description: 'Update operations (JSON)'
    },
    {
      key: 'options',
      label: 'Options',
      type: 'string',
      defaultValue: '{}',
      description: 'Update options (JSON)'
    }
  ],
  replaceOne: [
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
      key: 'replacement',
      label: 'Replacement',
      type: 'string',
      defaultValue: '{}',
      description: 'Replacement document (JSON)'
    },
    {
      key: 'options',
      label: 'Options',
      type: 'string',
      defaultValue: '{}',
      description: 'Replace options (JSON)'
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
    },
    {
      key: 'options',
      label: 'Options',
      type: 'string',
      defaultValue: '{}',
      description: 'Delete options (JSON)'
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
    },
    {
      key: 'options',
      label: 'Options',
      type: 'string',
      defaultValue: '{}',
      description: 'Delete options (JSON)'
    }
  ]
}; 