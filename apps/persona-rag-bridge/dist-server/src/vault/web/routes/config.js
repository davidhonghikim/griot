"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configRoutes = void 0;
const express_1 = require("express");
const config_1 = require("../controllers/config");
const router = (0, express_1.Router)();
exports.configRoutes = router;
const configController = new config_1.ConfigController();
// Get configuration
router.get('/', configController.getConfig);
// Save configuration
router.post('/', configController.saveConfig);
// Service management
router.post('/services', configController.addService);
router.delete('/services/:serviceId', configController.removeService);
// Test service connection
router.post('/test/:service', configController.testConnection);
// Health check endpoint
router.get('/health', (_req, res) => {
    res.json({ status: 'ok', service: 'vault-config' });
});
