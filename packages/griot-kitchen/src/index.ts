import express, { Express, Request, Response } from 'express';
import config from './config';
// import { StorageClient } from '@griot-seed/storage-mongodb';
// import { RAGEngine } from '@griot-seed/rag-engine';
import { ServiceManager, defaultServiceManagerConfig } from './service-manager';

const app: Express = express();

// Initialize core services
// const storage = new StorageClient(config.mongoUri, config.mongoDbName);
// const rag = new RAGEngine();
const serviceManager = new ServiceManager(defaultServiceManagerConfig);

async function startServer() {
  try {
    // Connect to the database
    // await storage.connect();

    // Initialize service manager with common services
    console.log('Initializing service manager...');
    try {
      await serviceManager.registerService('ollama');
      console.log('✓ Ollama service registered');
    } catch (error) {
      console.log('⚠ Ollama service not available:', error instanceof Error ? error.message : 'Unknown error');
    }

    try {
      await serviceManager.registerService('comfyui');
      console.log('✓ ComfyUI service registered');
    } catch (error) {
      console.log('⚠ ComfyUI service not available:', error instanceof Error ? error.message : 'Unknown error');
    }

    try {
      await serviceManager.registerService('qdrant');
      console.log('✓ Qdrant service registered');
    } catch (error) {
      console.log('⚠ Qdrant service not available:', error instanceof Error ? error.message : 'Unknown error');
    }

    // Start automatic service testing
    serviceManager.startAutoTesting();

    // --- API Endpoints ---
    app.use(express.json()); // Middleware to parse JSON bodies

    app.get('/', (req: Request, res: Response) => {
      res.send({ 
        status: 'Griot Kitchen Orchestrator is running',
        services: serviceManager.getConnectionStats()
      });
    });

    // Service management endpoints
    app.get('/services', (req: Request, res: Response) => {
      const instances = serviceManager.getAllInstances();
      const stats = serviceManager.getConnectionStats();
      res.json({
        instances,
        stats,
        availableTypes: serviceManager.getAvailableServiceTypes()
      });
    });

    app.get('/services/:id', (req: Request, res: Response) => {
      const instance = serviceManager.getInstance(req.params.id);
      if (!instance) {
        return res.status(404).json({ error: 'Service instance not found' });
      }
      res.json(instance);
    });

    app.post('/services', async (req: Request, res: Response) => {
      try {
        const { serviceType, host, port, instanceId } = req.body;
        const instance = await serviceManager.registerService(serviceType, host, port, instanceId);
        res.status(201).json(instance);
      } catch (error) {
        res.status(400).json({ 
          error: 'Failed to register service',
          details: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });

    app.delete('/services/:id', (req: Request, res: Response) => {
      const removed = serviceManager.removeInstance(req.params.id);
      if (!removed) {
        return res.status(404).json({ error: 'Service instance not found' });
      }
      res.json({ message: 'Service instance removed' });
    });

    app.post('/services/:id/test', async (req: Request, res: Response) => {
      const instance = serviceManager.getInstance(req.params.id);
      if (!instance) {
        return res.status(404).json({ error: 'Service instance not found' });
      }
      
      try {
        const result = await serviceManager.testServiceConnection(instance);
        res.json({ instance, result });
      } catch (error) {
        res.status(500).json({ 
          error: 'Failed to test service connection',
          details: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });

    app.post('/services/test-all', async (req: Request, res: Response) => {
      try {
        const results = await serviceManager.testAllServices();
        const instances = serviceManager.getAllInstances();
        res.json({ instances, results: Object.fromEntries(results) });
      } catch (error) {
        res.status(500).json({ 
          error: 'Failed to test all services',
          details: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });

    app.get('/services/categories/:category', (req: Request, res: Response) => {
      const services = serviceManager.getServicesByCategory(req.params.category);
      res.json(services);
    });

    // TODO: Implement the rest of the API endpoints as per the spec
    // (GET /recipes, POST /recipes, GET /search, etc.)

    app.listen(config.port, config.host, () => {
      console.log(`[server]: Server is running at http://${config.host}:${config.port}`);
      console.log(`[services]: Service manager initialized with ${serviceManager.getAllInstances().length} instances`);
    });

  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down...');
  serviceManager.stopAutoTesting();
  // await storage.disconnect();
  console.log('Server and database connection closed.');
  process.exit(0);
}); 