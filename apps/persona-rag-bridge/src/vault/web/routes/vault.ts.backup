import { Router } from 'express';
import { VaultController } from '../controllers/vault';

const router = Router();
const vaultController = new VaultController();

// Get all secrets
router.get('/secrets', vaultController.getSecrets);

// Add/Update secret
router.post('/secrets', vaultController.setSecret);

// Delete secret
router.delete('/secrets/:key', vaultController.deleteSecret);

// Import from env
router.post('/import', vaultController.importEnv);

// Export to env
router.get('/export', vaultController.exportEnv);

// Get vault status
router.get('/status', vaultController.getStatus);

export { router as vaultRoutes }; 