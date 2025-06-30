import { SecureVault } from './secure-vault';

export interface VaultService {
  id: string;
  name: string;
  type: 'database' | 'ai_model' | 'storage' | 'network' | 'custom';
  url: string;
  port: number;
  enabled: boolean;
  credentials?: {
    type: 'none' | 'api_key' | 'jwt' | 'login';
    key?: string;
    value?: string;
  };
  status: 'online' | 'offline' | 'error' | 'checking';
  lastChecked?: Date;
  metadata?: Record<string, any>;
}

export interface VaultServiceConfig {
  localIp: string;
  remoteIp: string;
  defaultPorts: Record<string, number>;
}

export class VaultServiceManager {
  private vault: SecureVault;
  private config: VaultServiceConfig;
  private services: Map<string, VaultService> = new Map();

  constructor(vault?: SecureVault, config?: Partial<VaultServiceConfig>) {
    this.vault = vault || new SecureVault();
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

  async initialize(): Promise<void> {
    await this.vault.initialize();
    await this.loadServices();
  }

  private async loadServices(): Promise<void> {
    try {
      const servicesData = await this.vault.getSecret('VAULT_SERVICES');
      if (servicesData) {
        const services = JSON.parse(servicesData);
        this.services = new Map(Object.entries(services));
      }
    } catch (error) {
      console.warn('No existing services found, starting fresh');
    }
  }

  private async saveServices(): Promise<void> {
    const servicesObj = Object.fromEntries(this.services);
    await this.vault.setSecret('VAULT_SERVICES', JSON.stringify(servicesObj), false);
  }

  async addService(service: Omit<VaultService, 'id' | 'status' | 'lastChecked'>): Promise<VaultService> {
    const id = this.generateId();
    const newService: VaultService = {
      ...service,
      id,
      status: 'offline',
      lastChecked: new Date()
    };

    // Store credentials in vault if provided
    if (service.credentials?.key && service.credentials?.value) {
      await this.vault.setSecret(
        `SERVICE_${id}_${service.credentials.key}`,
        service.credentials.value,
        true
      );
    }

    this.services.set(id, newService);
    await this.saveServices();
    return newService;
  }

  async updateService(id: string, updates: Partial<VaultService>): Promise<VaultService | null> {
    const service = this.services.get(id);
    if (!service) return null;

    const updatedService = { ...service, ...updates, lastChecked: new Date() };

    // Update credentials if provided
    if (updates.credentials?.key && updates.credentials?.value) {
      await this.vault.setSecret(
        `SERVICE_${id}_${updates.credentials.key}`,
        updates.credentials.value,
        true
      );
    }

    this.services.set(id, updatedService);
    await this.saveServices();
    return updatedService;
  }

  async deleteService(id: string): Promise<boolean> {
    const service = this.services.get(id);
    if (!service) return false;

    // Clean up credentials
    if (service.credentials?.key) {
      await this.vault.removeSecret(`SERVICE_${id}_${service.credentials.key}`);
    }

    this.services.delete(id);
    await this.saveServices();
    return true;
  }

  async getService(id: string): Promise<VaultService | null> {
    return this.services.get(id) || null;
  }

  async getAllServices(): Promise<VaultService[]> {
    return Array.from(this.services.values());
  }

  async checkServiceStatus(id: string): Promise<VaultService> {
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
    } catch (error) {
      service.status = 'offline';
    }

    service.lastChecked = new Date();
    this.services.set(id, service);
    await this.saveServices();

    return service;
  }

  async checkAllServices(): Promise<VaultService[]> {
    const services = Array.from(this.services.values());
    const results = await Promise.allSettled(
      services.map(service => this.checkServiceStatus(service.id))
    );

    return results
      .filter((result): result is PromiseFulfilledResult<VaultService> => result.status === 'fulfilled')
      .map(result => result.value);
  }

  getServiceCredentials(id: string): Promise<Record<string, string> | null> {
    const service = this.services.get(id);
    if (!service?.credentials?.key) return Promise.resolve(null);

    return this.vault.getSecret(`SERVICE_${id}_${service.credentials.key}`)
      .then(value => value ? { [service.credentials!.key!]: value } : null);
  }

  private generateId(): string {
    return `service_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  getConfig(): VaultServiceConfig {
    return { ...this.config };
  }

  updateConfig(config: Partial<VaultServiceConfig>): void {
    this.config = { ...this.config, ...config };
  }
}

// Singleton instance
let vaultServiceManager: VaultServiceManager | null = null;

export function getVaultServiceManager(): VaultServiceManager {
  if (!vaultServiceManager) {
    vaultServiceManager = new VaultServiceManager();
  }
  return vaultServiceManager;
} 