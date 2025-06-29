import { Router } from 'express';
import { VaultController } from '../controllers/vault';

const router = Router();
const vaultController = new VaultController();

// Get all secrets
router.get('/secrets', vaultController.getSecrets);

// Add new secret
router.post('/secrets', vaultController.addSecret);

// Update secret by ID
router.put('/secrets/:id', vaultController.updateSecret);

// Delete secret by ID
router.delete('/secrets/:id', vaultController.deleteSecret);

// Bulk import secrets
router.post('/secrets/bulk', vaultController.bulkImport);

// Import from env
router.post('/import', vaultController.importEnv);

// Export to env
router.get('/export', vaultController.exportEnv);

// Get vault status
router.get('/status', vaultController.getStatus);

export { router as vaultRoutes };
