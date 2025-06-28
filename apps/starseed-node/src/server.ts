#!/usr/bin/env node

/**
 * Starseed Node Server
 * 
 * A complete AI orchestration platform with service management,
 * database integration, and KLF compatibility.
 */

import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { HttpApiNode, createLogger, getEnvironmentConfig } from '@griot/core';
import { ServiceManager, defaultServiceManagerConfig } from './service-manager.js';
import { DatabaseManager } from './database-manager.js';

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = resolve(__filename, '..');

// Load environment configuration
const env = getEnvironmentConfig(__dirname);

// Create logger
const logger = createLogger('starseed-node');

// Log loaded environment variables (without sensitive data)
logger.info('Environment loaded:', {
  NODE_ENV: env.NODE_ENV,
  DEPLOYMENT_TYPE: env.DEPLOYMENT_TYPE,
  BASE_IP: env.BASE_IP,
  PORT: env.PORT,
  HOST: env.HOST,
  MONGODB_URI: env.MONGODB_URI ? '***configured***' : 'not set',
  POSTGRES_HOST: env.POSTGRES_HOST,
  WEAVIATE_URL: env.WEAVIATE_URL,
  NEO4J_URI: env.NEO4J_URI ? '***configured***' : 'not set'
});

// Initialize managers
const serviceManager = new ServiceManager({
  ...defaultServiceManagerConfig,
  autoTestInterval: env.SERVICE_TEST_INTERVAL,
  connectionTimeout: env.CONNECTION_TIMEOUT
});

const databaseManager = new DatabaseManager({
  mongodb: {
    uri: env.MONGODB_URI || `mongodb://${env.MONGODB_HOST}:27017`,
    dbName: env.MONGODB_DB_NAME
  },
  postgresql: {
    host: env.POSTGRES_HOST,
    port: env.POSTGRES_PORT,
    database: env.POSTGRES_DB,
    username: env.POSTGRES_USER,
    password: env.POSTGRES_PASSWORD
  },
  weaviate: {
    url: env.WEAVIATE_URL || `http://${env.WEAVIATE_HOST}:${env.WEAVIATE_PORT}`,
    apiKey: env.WEAVIATE_API_KEY
  },
  neo4j: {
    uri: env.NEO4J_URI || `bolt://${env.NEO4J_HOST}:7687`,
    username: env.NEO4J_USERNAME,
    password: env.NEO4J_PASSWORD
  }
});

// Create HTTP API node
const httpNode = new HttpApiNode({
  port: env.PORT,
  host: env.HOST
});

// Health check endpoint
httpNode.get('/health', async (req: any, res: any) => {
  try {
    const dbStatus = databaseManager.getStatus();
    const serviceStats = serviceManager.getConnectionStats();
    
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '2.0.0',
      database: dbStatus,
      services: serviceStats
    });
  } catch (error) {
    logger.error('Health check failed:', error);
    res.status(500).json({
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Service management endpoints
httpNode.get('/api/services', async (req: any, res: any) => {
  try {
    const instances = serviceManager.getAllInstances();
    res.json({
      services: instances,
      stats: serviceManager.getConnectionStats()
    });
  } catch (error) {
    logger.error('Failed to list services:', error);
    res.status(500).json({ error: 'Failed to list services' });
  }
});

httpNode.post('/api/services', async (req: any, res: any) => {
  try {
    const { serviceType, host, port, instanceId } = req.body;
    const service = await serviceManager.registerService(serviceType, host, port, instanceId);
    res.json(service);
  } catch (error) {
    logger.error('Failed to register service:', error);
    res.status(500).json({ error: 'Failed to register service' });
  }
});

httpNode.get('/api/services/:id', async (req: any, res: any) => {
  try {
    const service = serviceManager.getInstance(req.params.id);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json(service);
  } catch (error) {
    logger.error('Failed to get service:', error);
    res.status(500).json({ error: 'Failed to get service' });
  }
});

httpNode.post('/api/services/:id/test', async (req: any, res: any) => {
  try {
    const service = serviceManager.getInstance(req.params.id);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    const result = await serviceManager.testServiceConnection(service);
    res.json(result);
  } catch (error) {
    logger.error('Failed to test service:', error);
    res.status(500).json({ error: 'Failed to test service' });
  }
});

httpNode.delete('/api/services/:id', async (req: any, res: any) => {
  try {
    const removed = serviceManager.removeInstance(req.params.id);
    if (!removed) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json({ message: 'Service removed successfully' });
  } catch (error) {
    logger.error('Failed to remove service:', error);
    res.status(500).json({ error: 'Failed to remove service' });
  }
});

httpNode.post('/api/services/test-all', async (req: any, res: any) => {
  try {
    const results = await serviceManager.testAllServices();
    const resultsArray = Array.from(results.entries()).map(([id, result]) => ({
      id,
      ...result
    }));
    
    res.json({
      results: resultsArray,
      stats: serviceManager.getConnectionStats()
    });
  } catch (error) {
    logger.error('Failed to test all services:', error);
    res.status(500).json({ error: 'Failed to test all services' });
  }
});

httpNode.get('/api/services/categories/:category', async (req: any, res: any) => {
  try {
    const services = serviceManager.getServicesByCategory(req.params.category);
    res.json({ category: req.params.category, services });
  } catch (error) {
    logger.error('Failed to get services by category:', error);
    res.status(500).json({ error: 'Failed to get services by category' });
  }
});

httpNode.get('/api/service-types', async (req: any, res: any) => {
  try {
    const types = serviceManager.getAvailableServiceTypes();
    res.json({ types });
  } catch (error) {
    logger.error('Failed to get service types:', error);
    res.status(500).json({ error: 'Failed to get service types' });
  }
});

// Database status endpoint
httpNode.get('/api/database/status', async (req: any, res: any) => {
  try {
    const status = databaseManager.getStatus();
    res.json(status);
  } catch (error) {
    logger.error('Failed to get database status:', error);
    res.status(500).json({ error: 'Failed to get database status' });
  }
});

// KLF-compatible nodes endpoint
httpNode.get('/api/nodes', async (req: any, res: any) => {
  try {
    const nodes = [
      {
        id: 'starseed-node',
        name: 'Starseed Node',
        type: 'orchestration',
        version: '2.0.0',
        status: 'active',
        capabilities: [
          'service-management',
          'database-integration',
          'persona-forge',
          'recipe-execution',
          'klf-compatibility'
        ]
      }
    ];
    res.json({ nodes });
  } catch (error) {
    logger.error('Failed to get nodes:', error);
    res.status(500).json({ error: 'Failed to get nodes' });
  }
});

// Root endpoint
httpNode.get('/', async (req: any, res: any) => {
  res.json({
    name: 'Starseed Node',
    version: '2.0.0',
    description: 'Complete AI orchestration platform',
    endpoints: {
      health: '/health',
      services: '/api/services',
      database: '/api/database/status',
      nodes: '/api/nodes'
    }
  });
});

// Start the server
async function start() {
  try {
    // Initialize database connections
    await databaseManager.initialize();
    logger.info('Database connections established');

    // Start service manager auto-testing
    serviceManager.startAutoTesting();
    logger.info('Service manager started');

    // Start HTTP server
    await httpNode.start();
    logger.info(`Starseed Node server running on http://${env.HOST}:${env.PORT}`);

    // Graceful shutdown
    process.on('SIGINT', async () => {
      logger.info('Shutting down...');
      serviceManager.stopAutoTesting();
      await databaseManager.close();
      await httpNode.stop();
      process.exit(0);
    });

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

start(); 