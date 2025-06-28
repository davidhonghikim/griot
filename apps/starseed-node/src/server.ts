/**
 * Griot Node Server
 * Main entry point for running the Griot Node application
 */

import { HttpApiNode } from '@griot/core';
import { createLogger } from '@griot/core';
import { ServiceManager, defaultServiceManagerConfig } from './service-manager.js';
import { DatabaseManager } from './database-manager.js';
import dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables in priority order
// 1. .env.local (personal overrides) - highest priority
// 2. .env (base configuration)
// 3. env.example (template) - lowest priority
const envPath = resolve(process.cwd());
dotenv.config({ path: resolve(envPath, '.env.local') }); // Personal overrides
dotenv.config({ path: resolve(envPath, '.env') }); // Base configuration
dotenv.config({ path: resolve(envPath, 'env.example') }); // Template fallback

const logger = createLogger('starseed-server');

// Log which environment files were loaded
const loadedFiles = [];
if (process.env.NODE_ENV !== 'production') {
    if (require('fs').existsSync(resolve(envPath, '.env.local'))) {
        loadedFiles.push('.env.local');
    }
    if (require('fs').existsSync(resolve(envPath, '.env'))) {
        loadedFiles.push('.env');
    }
    if (loadedFiles.length === 0) {
        loadedFiles.push('env.example (template)');
    }
    logger.info(`Environment files loaded: ${loadedFiles.join(' -> ')}`);
}

// Initialize managers with environment variables
const serviceManager = new ServiceManager({
  ...defaultServiceManagerConfig,
  autoTestInterval: parseInt(process.env.SERVICE_TEST_INTERVAL || '30000'),
  connectionTimeout: parseInt(process.env.CONNECTION_TIMEOUT || '5000')
});

const databaseManager = new DatabaseManager();

// Create HTTP API node with environment variables
const httpNode = new HttpApiNode({
  port: parseInt(process.env.PORT || '30437'),
  host: process.env.HOST || '0.0.0.0'
});

// Initialize the server
async function initializeServer() {
  try {
    logger.info('Initializing Starseed Node...');

    // Initialize database connections
    await databaseManager.initialize();
    logger.info('Database connections established');

    // Start service manager auto-testing
    serviceManager.startAutoTesting();
    logger.info('Service manager auto-testing started');

    // Set up API routes
    setupApiRoutes();

    // Start the HTTP server
    await httpNode.start();
    logger.info(`Starseed Node started on port ${httpNode.port}`);

  } catch (error) {
    logger.error('Failed to initialize server:', error);
    process.exit(1);
  }
}

// Set up API routes
function setupApiRoutes() {
  // Health check
  httpNode.get('/health', async (req, res) => {
    const dbStatus = databaseManager.getStatus();
    const serviceStats = serviceManager.getConnectionStats();
    
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      database: dbStatus,
      services: serviceStats
    });
  });

  // Service management endpoints
  httpNode.get('/api/services', async (req, res) => {
    try {
      const instances = serviceManager.getAllInstances();
      res.json({
        services: instances,
        stats: serviceManager.getConnectionStats()
      });
    } catch (error) {
      logger.error('Error getting services:', error);
      res.status(500).json({ error: 'Failed to get services' });
    }
  });

  httpNode.post('/api/services', async (req, res) => {
    try {
      const { serviceType, host, port, instanceId } = req.body;
      
      if (!serviceType) {
        return res.status(400).json({ error: 'serviceType is required' });
      }

      const instance = await serviceManager.registerService(serviceType, host, port, instanceId);
      res.status(201).json(instance);
    } catch (error) {
      logger.error('Error registering service:', error);
      res.status(500).json({ error: error instanceof Error ? error.message : 'Failed to register service' });
    }
  });

  httpNode.get('/api/services/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const instance = serviceManager.getInstance(id);
      
      if (!instance) {
        return res.status(404).json({ error: 'Service not found' });
      }

      res.json(instance);
    } catch (error) {
      logger.error('Error getting service:', error);
      res.status(500).json({ error: 'Failed to get service' });
    }
  });

  httpNode.post('/api/services/:id/test', async (req, res) => {
    try {
      const { id } = req.params;
      const instance = serviceManager.getInstance(id);
      
      if (!instance) {
        return res.status(404).json({ error: 'Service not found' });
      }

      const result = await serviceManager.testServiceConnection(instance);
      res.json(result);
    } catch (error) {
      logger.error('Error testing service:', error);
      res.status(500).json({ error: 'Failed to test service' });
    }
  });

  httpNode.delete('/api/services/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const removed = serviceManager.removeInstance(id);
      
      if (!removed) {
        return res.status(404).json({ error: 'Service not found' });
      }

      res.json({ message: 'Service removed successfully' });
    } catch (error) {
      logger.error('Error removing service:', error);
      res.status(500).json({ error: 'Failed to remove service' });
    }
  });

  httpNode.post('/api/services/test-all', async (req, res) => {
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
      logger.error('Error testing all services:', error);
      res.status(500).json({ error: 'Failed to test services' });
    }
  });

  httpNode.get('/api/services/categories/:category', async (req, res) => {
    try {
      const { category } = req.params;
      const services = serviceManager.getServicesByCategory(category);
      res.json({ category, services });
    } catch (error) {
      logger.error('Error getting services by category:', error);
      res.status(500).json({ error: 'Failed to get services by category' });
    }
  });

  // Service types and categories
  httpNode.get('/api/service-types', async (req, res) => {
    try {
      const types = serviceManager.getAvailableServiceTypes();
      res.json({ types });
    } catch (error) {
      logger.error('Error getting service types:', error);
      res.status(500).json({ error: 'Failed to get service types' });
    }
  });

  // Database endpoints
  httpNode.get('/api/database/status', async (req, res) => {
    try {
      const status = databaseManager.getStatus();
      res.json(status);
    } catch (error) {
      logger.error('Error getting database status:', error);
      res.status(500).json({ error: 'Failed to get database status' });
    }
  });

  // Node information (KLF compatibility)
  httpNode.get('/api/nodes', async (req, res) => {
    res.json({
      nodes: [
        {
          id: 'starseed-node',
          name: 'Starseed Node',
          type: 'orchestrator',
          version: '1.0.0',
          status: 'active',
          capabilities: [
            'service_orchestration',
            'database_management',
            'klf_protocol'
          ]
        }
      ]
    });
  });

  // Root endpoint with system information
  httpNode.get('/', async (req, res) => {
    const dbStatus = databaseManager.getStatus();
    const serviceStats = serviceManager.getConnectionStats();
    
    res.json({
      name: 'Starseed Node',
      version: '1.0.0',
      description: 'Primary orchestrator for the kOS ecosystem',
      status: 'active',
      timestamp: new Date().toISOString(),
      database: dbStatus,
      services: serviceStats,
      endpoints: {
        health: '/health',
        services: '/api/services',
        database: '/api/database/status',
        nodes: '/api/nodes'
      }
    });
  });
}

// Graceful shutdown
process.on('SIGINT', async () => {
  logger.info('Shutting down Starseed Node...');
  
  try {
    serviceManager.stopAutoTesting();
    await databaseManager.close();
    await httpNode.stop();
    logger.info('Starseed Node shutdown complete');
    process.exit(0);
  } catch (error) {
    logger.error('Error during shutdown:', error);
    process.exit(1);
  }
});

// Start the server
initializeServer().catch((error) => {
  logger.error('Failed to start server:', error);
  process.exit(1);
}); 