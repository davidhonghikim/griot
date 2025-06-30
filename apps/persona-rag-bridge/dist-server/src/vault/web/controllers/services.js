"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VaultServiceController = void 0;
const vault_service_manager_1 = require("../../vault-service-manager");
class VaultServiceController {
    async getAllServices(_req, res) {
        try {
            const manager = (0, vault_service_manager_1.getVaultServiceManager)();
            const services = await manager.getAllServices();
            res.json(services);
        }
        catch (error) {
            res.status(500).json({
                error: error instanceof Error ? error.message : "Unknown error"
            });
        }
    }
    async getService(req, res) {
        try {
            const { id } = req.params;
            const manager = (0, vault_service_manager_1.getVaultServiceManager)();
            const service = await manager.getService(id);
            if (!service) {
                return res.status(404).json({ error: 'Service not found' });
            }
            res.json(service);
        }
        catch (error) {
            res.status(500).json({
                error: error instanceof Error ? error.message : "Unknown error"
            });
        }
    }
    async addService(req, res) {
        try {
            const serviceData = req.body;
            const manager = (0, vault_service_manager_1.getVaultServiceManager)();
            const service = await manager.addService(serviceData);
            res.status(201).json({
                success: true,
                message: 'Service added successfully',
                service
            });
        }
        catch (error) {
            res.status(500).json({
                error: error instanceof Error ? error.message : "Unknown error"
            });
        }
    }
    async updateService(req, res) {
        try {
            const { id } = req.params;
            const updates = req.body;
            const manager = (0, vault_service_manager_1.getVaultServiceManager)();
            const service = await manager.updateService(id, updates);
            if (!service) {
                return res.status(404).json({ error: 'Service not found' });
            }
            res.json({
                success: true,
                message: 'Service updated successfully',
                service
            });
        }
        catch (error) {
            res.status(500).json({
                error: error instanceof Error ? error.message : "Unknown error"
            });
        }
    }
    async deleteService(req, res) {
        try {
            const { id } = req.params;
            const manager = (0, vault_service_manager_1.getVaultServiceManager)();
            const deleted = await manager.deleteService(id);
            if (!deleted) {
                return res.status(404).json({ error: 'Service not found' });
            }
            res.json({
                success: true,
                message: 'Service deleted successfully'
            });
        }
        catch (error) {
            res.status(500).json({
                error: error instanceof Error ? error.message : "Unknown error"
            });
        }
    }
    async checkServiceStatus(req, res) {
        try {
            const { id } = req.params;
            const manager = (0, vault_service_manager_1.getVaultServiceManager)();
            const service = await manager.checkServiceStatus(id);
            res.json({
                success: true,
                service
            });
        }
        catch (error) {
            res.status(500).json({
                error: error instanceof Error ? error.message : "Unknown error"
            });
        }
    }
    async checkAllServices(_req, res) {
        try {
            const manager = (0, vault_service_manager_1.getVaultServiceManager)();
            const services = await manager.checkAllServices();
            res.json({
                success: true,
                services
            });
        }
        catch (error) {
            res.status(500).json({
                error: error instanceof Error ? error.message : "Unknown error"
            });
        }
    }
    async getConfig(_req, res) {
        try {
            const manager = (0, vault_service_manager_1.getVaultServiceManager)();
            const config = manager.getConfig();
            res.json(config);
        }
        catch (error) {
            res.status(500).json({
                error: error instanceof Error ? error.message : "Unknown error"
            });
        }
    }
    async updateConfig(req, res) {
        try {
            const configUpdates = req.body;
            const manager = (0, vault_service_manager_1.getVaultServiceManager)();
            manager.updateConfig(configUpdates);
            res.json({
                success: true,
                message: 'Configuration updated successfully',
                config: manager.getConfig()
            });
        }
        catch (error) {
            res.status(500).json({
                error: error instanceof Error ? error.message : "Unknown error"
            });
        }
    }
    async healthCheck(_req, res) {
        try {
            const manager = (0, vault_service_manager_1.getVaultServiceManager)();
            const services = await manager.getAllServices();
            res.json({
                status: 'ok',
                service: 'vault-service-manager',
                serviceCount: services.length,
                timestamp: new Date().toISOString()
            });
        }
        catch (error) {
            res.status(500).json({
                error: error instanceof Error ? error.message : "Unknown error"
            });
        }
    }
}
exports.VaultServiceController = VaultServiceController;
