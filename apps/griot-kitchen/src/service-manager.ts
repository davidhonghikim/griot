import {
  ServiceConnectionManager,
  createServiceUrl,
  testServiceConnectivity,
  ALL_CONNECTORS,
  CONNECTORS_BY_CATEGORY,
  getConnectorByType,
  getConnectorsByCategory,
  ollamaDefinition,
  openaiDefinition,
  comfyuiDefinition,
  qdrantDefinition
} from '@griot/service-connectors';
import type { ServiceDefinition, ConnectionResult } from '@griot/service-connectors';

export interface ServiceInstance {
  id: string;
  service: ServiceDefinition;
  host: string;
  port: number;
  url: string;
  status: 'connected' | 'disconnected' | 'error';
  lastTested: Date;
  connectionResult?: ConnectionResult;
}

export interface ServiceManagerConfig {
  defaultHosts: { [serviceType: string]: string };
  defaultPorts: { [serviceType: string]: number };
  autoTestInterval: number; // milliseconds
  connectionTimeout: number; // milliseconds
}

export class ServiceManager {
  private instances: Map<string, ServiceInstance> = new Map();
  private connectionManager: ServiceConnectionManager;
  private config: ServiceManagerConfig;
  private testInterval?: NodeJS.Timeout;

  constructor(config: ServiceManagerConfig) {
    this.connectionManager = ServiceConnectionManager.getInstance();
    this.config = config;
  }

  /**
   * Register a service instance
   */
  async registerService(
    serviceType: string,
    host?: string,
    port?: number,
    instanceId?: string
  ): Promise<ServiceInstance> {
    const service = getConnectorByType(serviceType);
    if (!service) {
      throw new Error(`Service type '${serviceType}' not found`);
    }

    const id = instanceId || `${serviceType}-${Date.now()}`;
    const serviceHost = host || this.config.defaultHosts[serviceType] || 'localhost';
    const servicePort = port || this.config.defaultPorts[serviceType] || service.defaultPort;

    // Get optimal URL with protocol fallback
    const url = await createServiceUrl(service, serviceHost, servicePort);

    const instance: ServiceInstance = {
      id,
      service,
      host: serviceHost,
      port: servicePort,
      url,
      status: 'disconnected',
      lastTested: new Date()
    };

    // Test connection immediately
    await this.testServiceConnection(instance);

    this.instances.set(id, instance);
    return instance;
  }

  /**
   * Test connection for a specific service instance
   */
  async testServiceConnection(instance: ServiceInstance): Promise<ConnectionResult> {
    try {
      const result = await testServiceConnectivity(instance.service, instance.host, instance.port);
      
      instance.connectionResult = result;
      instance.lastTested = new Date();
      instance.status = result.success ? 'connected' : 'error';
      
      return result;
    } catch (error) {
      instance.status = 'error';
      instance.lastTested = new Date();
      throw error;
    }
  }

  /**
   * Test all registered services
   */
  async testAllServices(): Promise<Map<string, ConnectionResult>> {
    const results = new Map<string, ConnectionResult>();
    
    for (const [id, instance] of this.instances) {
      try {
        const result = await this.testServiceConnection(instance);
        results.set(id, result);
      } catch (error) {
        console.error(`Failed to test service ${id}:`, error);
      }
    }
    
    return results;
  }

  /**
   * Get all available service types
   */
  getAvailableServiceTypes(): string[] {
    return ALL_CONNECTORS.map(service => service.type);
  }

  /**
   * Get services by category
   */
  getServicesByCategory(category: string): ServiceDefinition[] {
    return getConnectorsByCategory(category as keyof typeof CONNECTORS_BY_CATEGORY);
  }

  /**
   * Get all registered instances
   */
  getAllInstances(): ServiceInstance[] {
    return Array.from(this.instances.values());
  }

  /**
   * Get instances by status
   */
  getInstancesByStatus(status: ServiceInstance['status']): ServiceInstance[] {
    return this.getAllInstances().filter(instance => instance.status === status);
  }

  /**
   * Get a specific instance
   */
  getInstance(id: string): ServiceInstance | undefined {
    return this.instances.get(id);
  }

  /**
   * Remove a service instance
   */
  removeInstance(id: string): boolean {
    return this.instances.delete(id);
  }

  /**
   * Start automatic connection testing
   */
  startAutoTesting(): void {
    if (this.testInterval) {
      clearInterval(this.testInterval);
    }
    
    this.testInterval = setInterval(async () => {
      console.log('Running automatic service connection tests...');
      await this.testAllServices();
    }, this.config.autoTestInterval);
  }

  /**
   * Stop automatic connection testing
   */
  stopAutoTesting(): void {
    if (this.testInterval) {
      clearInterval(this.testInterval);
      this.testInterval = undefined;
    }
  }

  /**
   * Get connection statistics
   */
  getConnectionStats(): {
    total: number;
    connected: number;
    disconnected: number;
    error: number;
    cacheStats: { size: number; entries: Array<{ key: string; protocol: 'http' | 'https' }> };
  } {
    const instances = this.getAllInstances();
    const stats = {
      total: instances.length,
      connected: instances.filter(i => i.status === 'connected').length,
      disconnected: instances.filter(i => i.status === 'disconnected').length,
      error: instances.filter(i => i.status === 'error').length,
      cacheStats: this.connectionManager.getCacheStats()
    };
    
    return stats;
  }

  /**
   * Clear connection cache
   */
  clearCache(): void {
    this.connectionManager.clearCache();
  }
}

// Default configuration
export const defaultServiceManagerConfig: ServiceManagerConfig = {
  defaultHosts: {
    'ollama': 'localhost',
    'comfyui': 'localhost',
    'openai': 'api.openai.com',
    'anthropic': 'api.anthropic.com',
    'qdrant': 'localhost',
    'milvus': 'localhost'
  },
  defaultPorts: {
    'ollama': 11434,
    'comfyui': 8188,
    'qdrant': 6333,
    'milvus': 19530
  },
  autoTestInterval: 30000, // 30 seconds
  connectionTimeout: 5000  // 5 seconds
}; 