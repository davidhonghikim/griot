/**
 * MongoDB Aggregation Operations
 * 
 * Defines aggregation operations and parameters for MongoDB service.
 */

export const aggregationOperations = {
  // Aggregation
  aggregate: { path: '/{database}/{collection}/aggregate', method: 'POST' },
  count: { path: '/{database}/{collection}/count', method: 'POST' },
  distinct: { path: '/{database}/{collection}/distinct', method: 'POST' }
};

export const aggregationParameters = {
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
      defaultValue: '[]',
      description: 'JSON array of aggregation stages'
    },
    {
      key: 'options',
      label: 'Options',
      type: 'string',
      defaultValue: '{}',
      description: 'Aggregation options (JSON)'
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
    },
    {
      key: 'options',
      label: 'Options',
      type: 'string',
      defaultValue: '{}',
      description: 'Count options (JSON)'
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
      label: 'Field',
      type: 'string',
      defaultValue: '',
      description: 'Field name to get distinct values for'
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
      description: 'Distinct options (JSON)'
    }
  ]
}; 