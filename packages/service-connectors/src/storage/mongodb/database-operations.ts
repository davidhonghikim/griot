/**
 * MongoDB Database Operations
 * 
 * Defines database-level operations and parameters for MongoDB service.
 */

export const databaseOperations = {
  // Database operations
  listDatabases: { path: '/admin/listDatabases', method: 'GET' },
  createDatabase: { path: '/admin/createDatabase', method: 'POST' },
  dropDatabase: { path: '/admin/dropDatabase', method: 'POST' }
};

export const databaseParameters = {
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
  ]
}; 