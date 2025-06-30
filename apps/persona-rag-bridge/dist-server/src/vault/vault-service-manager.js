"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VaultServiceManager = void 0;
exports.getVaultServiceManager = getVaultServiceManager;
const secure_vault_1 = require("./secure-vault");
class VaultServiceManager {
    constructor(vault, config) {
        Object.defineProperty(this, "vault", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "config", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "services", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        this.vault = vault || new secure_vault_1.SecureVault();
        this.config = {
            localIp: '192.168.1.180', // Default dev IP
            remoteIp: 'localhost',
            defaultPorts: {
                weaviate: 8080,
                postgresql: 5432,
                mongodb: 27017,
                redis: 6379,
                neo4j: 7687,
                openwebui: 3000,
                chromadb: 8000,
                qdrant: 6333
            },
            ...config
        };
    }
    async initialize() {
        await this.vault.initialize();
        await this.loadServices();
    }
    async loadServices() {
        try {
            const servicesData = await this.vault.getSecret('VAULT_SERVICES');
            if (servicesData) {
                const services = JSON.parse(servicesData);
                this.services = new Map(Object.entries(services));
            }
        }
        catch (error) {
            console.warn('No existing services found, starting fresh');
        }
    }
    async saveServices() {
        const servicesObj = Object.fromEntries(this.services);
        await this.vault.setSecret('VAULT_SERVICES', JSON.stringify(servicesObj), false);
    }
    async addService(service) {
        const id = this.generateId();
        const newService = {
            ...service,
            id,
            status: 'offline',
            lastChecked: new Date()
        };
        // Store credentials in vault if provided
        if (service.credentials?.key && service.credentials?.value) {
            await this.vault.setSecret(`SERVICE_${id}_${service.credentials.key}`, service.credentials.value, true);
        }
        this.services.set(id, newService);
        await this.saveServices();
        return newService;
    }
    async updateService(id, updates) {
        const service = this.services.get(id);
        if (!service)
            return null;
        const updatedService = { ...service, ...updates, lastChecked: new Date() };
        // Update credentials if provided
        if (updates.credentials?.key && updates.credentials?.value) {
            await this.vault.setSecret(`SERVICE_${id}_${updates.credentials.key}`, updates.credentials.value, true);
        }
        this.services.set(id, updatedService);
        await this.saveServices();
        return updatedService;
    }
    async deleteService(id) {
        const service = this.services.get(id);
        if (!service)
            return false;
        // Clean up credentials
        if (service.credentials?.key) {
            await this.vault.removeSecret(`SERVICE_${id}_${service.credentials.key}`);
        }
        this.services.delete(id);
        await this.saveServices();
        return true;
    }
    async getService(id) {
        return this.services.get(id) || null;
    }
    async getAllServices() {
        return Array.from(this.services.values());
    }
    async checkServiceStatus(id) {
        const service = this.services.get(id);
        if (!service) {
            throw new Error(`Service ${id} not found`);
        }
        // Update status to checking
        service.status = 'checking';
        service.lastChecked = new Date();
        this.services.set(id, service);
        await this.saveServices();
        try {
            // Simple HTTP check for now - can be enhanced with specific service checks
            const response = await fetch(`${service.url}/health`, {
                method: 'GET',
                // timeout: 5000
            });
            service.status = response.ok ? 'online' : 'error';
        }
        catch (error) {
            service.status = 'offline';
        }
        service.lastChecked = new Date();
        this.services.set(id, service);
        await this.saveServices();
        return service;
    }
    async checkAllServices() {
        const services = Array.from(this.services.values());
        const results = await Promise.allSettled(services.map(service => this.checkServiceStatus(service.id)));
        return results
            .filter((result) => result.status === 'fulfilled')
            .map(result => result.value);
    }
    getServiceCredentials(id) {
        const service = this.services.get(id);
        if (!service?.credentials?.key)
            return Promise.resolve(null);
        return this.vault.getSecret(`SERVICE_${id}_${service.credentials.key}`)
            .then(value => value ? { [service.credentials.key]: value } : null);
    }
    generateId() {
        return `service_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    getConfig() {
        return { ...this.config };
    }
    updateConfig(config) {
        this.config = { ...this.config, ...config };
    }
}
exports.VaultServiceManager = VaultServiceManager;
// Singleton instance
let vaultServiceManager = null;
function getVaultServiceManager() {
    if (!vaultServiceManager) {
        vaultServiceManager = new VaultServiceManager();
    }
    return vaultServiceManager;
}
