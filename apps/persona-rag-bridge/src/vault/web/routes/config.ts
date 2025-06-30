import { Router } from 'express';
import { ConfigController } from '../controllers/config';

const router = Router();
const configController = new ConfigController();

// Get configuration
router.get('/', configController.getConfig);

// Save configuration
router.post('/', configController.saveConfig);

// Test service connection
router.post('/test/:service', configController.testConnection);

// Health check endpoint
router.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'vault-config' });
});

export { router as configRoutes };
