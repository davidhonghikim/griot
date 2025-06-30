"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vaultRoutes = void 0;
const express_1 = require("express");
const vault_1 = require("../controllers/vault");
const router = (0, express_1.Router)();
exports.vaultRoutes = router;
const vaultController = new vault_1.VaultController();
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
