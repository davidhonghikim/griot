import { Request, Response } from 'express';
import { getVaultServiceManager } from '../../vault-service-manager';

export class VaultServiceController {
  async getAllServices(_req: Request, res: Response) {
    try {
      const manager = getVaultServiceManager();
      const services = await manager.getAllServices();
      res.json(services);
    } catch (error) {
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  }

  async getService(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const manager = getVaultServiceManager();
      const service = await manager.getService(id);
      
      if (!service) {
        return res.status(404).json({ error: 'Service not found' });
      }
      
      res.json(service);
    } catch (error) {
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  }

  async addService(req: Request, res: Response) {
    try {
      const serviceData = req.body;
      const manager = getVaultServiceManager();
      const service = await manager.addService(serviceData);
      
      res.status(201).json({
        success: true,
        message: 'Service added successfully',
        service
      });
    } catch (error) {
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  }

  async updateService(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updates = req.body;
      const manager = getVaultServiceManager();
      const service = await manager.updateService(id, updates);
      
      if (!service) {
        return res.status(404).json({ error: 'Service not found' });
      }
      
      res.json({
        success: true,
        message: 'Service updated successfully',
        service
      });
    } catch (error) {
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  }

  async deleteService(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const manager = getVaultServiceManager();
      const deleted = await manager.deleteService(id);
      
      if (!deleted) {
        return res.status(404).json({ error: 'Service not found' });
      }
      
      res.json({
        success: true,
        message: 'Service deleted successfully'
      });
    } catch (error) {
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  }

  async checkServiceStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const manager = getVaultServiceManager();
      const service = await manager.checkServiceStatus(id);
      
      res.json({
        success: true,
        service
      });
    } catch (error) {
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  }

  async checkAllServices(_req: Request, res: Response) {
    try {
      const manager = getVaultServiceManager();
      const services = await manager.checkAllServices();
      
      res.json({
        success: true,
        services
      });
    } catch (error) {
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  }

  async getConfig(_req: Request, res: Response) {
    try {
      const manager = getVaultServiceManager();
      const config = manager.getConfig();
      
      res.json(config);
    } catch (error) {
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  }

  async updateConfig(req: Request, res: Response) {
    try {
      const configUpdates = req.body;
      const manager = getVaultServiceManager();
      manager.updateConfig(configUpdates);
      
      res.json({
        success: true,
        message: 'Configuration updated successfully',
        config: manager.getConfig()
      });
    } catch (error) {
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  }

  async healthCheck(_req: Request, res: Response) {
    try {
      const manager = getVaultServiceManager();
      const services = await manager.getAllServices();
      
      res.json({
        status: 'ok',
        service: 'vault-service-manager',
        serviceCount: services.length,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  }
} 