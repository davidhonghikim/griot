"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serviceRoutes = void 0;
const express_1 = require("express");
const services_1 = require("../controllers/services");
const router = (0, express_1.Router)();
exports.serviceRoutes = router;
const controller = new services_1.VaultServiceController();
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
