/**
 * MongoDB Collection Operations
 * 
 * Defines collection-level operations and parameters for MongoDB service.
 */

export const collectionOperations = {
  // Collection operations
  listCollections: { path: '/{database}/listCollections', method: 'GET' },
  createCollection: { path: '/{database}/createCollection', method: 'POST' },
  dropCollection: { path: '/{database}/dropCollection', method: 'POST' }
};

export const collectionParameters = {
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
  ]
}; 