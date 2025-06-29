/**
 * MongoDB Service Definition
 * 
 * Defines the complete MongoDB service for the service connectors framework.
 */

export interface ServiceDefinition {
  name: string;
  displayName: string;
  description: string;
  version: string;
  category: string;
  capabilities: string[];
  connectionConfig: {
    uri: string;
    database: string;
    options?: any;
  };
  healthCheck: () => Promise<boolean>;
}

export const mongodbServiceDefinition: ServiceDefinition = {
  name: 'mongodb',
  displayName: 'MongoDB',
  description: 'MongoDB database service with comprehensive document storage capabilities',
  version: '1.0.0',
  category: 'database',
  capabilities: [
    'document-storage',
    'database-operations', 
    'collection-operations',
    'document-operations',
    'aggregation-operations',
    'index-operations',
    'bulk-operations'
  ],
  connectionConfig: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017',
    database: process.env.MONGODB_DATABASE || 'griot',
    options: {
      useUnifiedTopology: true,
      useNewUrlParser: true
    }
  },
  async healthCheck() {
    // Implementation would test actual connection
    return true;
  }
}; 