import { Router } from 'express';
import { VaultServiceController } from '../controllers/services';

const router = Router();
const controller = new VaultServiceController();

// Service management routes
router.get('/services', controller.getAllServices);
router.get('/services/:id', controller.getService);
router.post('/services', controller.addService);
router.put('/services/:id', controller.updateService);
router.delete('/services/:id', controller.deleteService);

// Service status routes
router.get('/services/:id/status', controller.checkServiceStatus);
router.post('/services/check-all', controller.checkAllServices);

// Configuration routes
router.get('/config', controller.getConfig);
router.put('/config', controller.updateConfig);

// Health check
router.get('/health', controller.healthCheck);

export { router as serviceRoutes }; 