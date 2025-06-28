import {
  ServiceConnectionManager,
  createServiceUrl,
  testServiceConnectivity,
  ALL_CONNECTORS,
  CONNECTORS_BY_CATEGORY,
  getConnectorByType,
  getConnectorsByCategory,
} from '@griot/service-connectors';
import type { ServiceDefinition, ConnectionResult } from '@griot/service-connectors';
import { createLogger } from '@griot/core';

const logger = createLogger('service-manager');

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

export const defaultServiceManagerConfig: ServiceManagerConfig = {
  defaultHosts: {
    ollama: process.env.OLLAMA_HOST || 'localhost',
    comfyui: process.env.COMFYUI_HOST || 'localhost',
    qdrant: process.env.QDRANT_HOST || 'localhost',
    openai: process.env.OPENAI_HOST || 'api.openai.com',
    anthropic: process.env.ANTHROPIC_HOST || 'api.anthropic.com',
    weaviate: process.env.WEAVIATE_HOST || 'localhost',
    neo4j: process.env.NEO4J_HOST || 'localhost',
    postgresql: process.env.POSTGRES_HOST || 'localhost',
  },
  defaultPorts: {
    ollama: parseInt(process.env.OLLAMA_PORT || '11434'),
    comfyui: parseInt(process.env.COMFYUI_PORT || '8188'),
    qdrant: parseInt(process.env.QDRANT_PORT || '6333'),
    openai: parseInt(process.env.OPENAI_PORT || '443'),
    anthropic: parseInt(process.env.ANTHROPIC_PORT || '443'),
    weaviate: parseInt(process.env.WEAVIATE_PORT || '8080'),
    neo4j: parseInt(process.env.NEO4J_PORT || '7474'),
    postgresql: parseInt(process.env.POSTGRES_PORT || '5432'),
  },
  autoTestInterval: parseInt(process.env.SERVICE_TEST_INTERVAL || '30000'), // 30 seconds
  connectionTimeout: parseInt(process.env.CONNECTION_TIMEOUT || '5000'), // 5 seconds
};

export class ServiceManager {
  private instances: Map<string, ServiceInstance> = new Map();
  private connectionManager: ServiceConnectionManager;
  private config: ServiceManagerConfig;
  private testInterval?: NodeJS.Timeout;

  constructor(config: ServiceManagerConfig = defaultServiceManagerConfig) {
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
    logger.info(`Registered service: ${serviceType} (${id}) at ${url}`);
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
      
      logger.debug(`Service ${instance.id} test result: ${result.success ? 'connected' : 'error'}`);
      return result;
    } catch (error) {
      instance.status = 'error';
      instance.lastTested = new Date();
      logger.error(`Service ${instance.id} test failed:`, error);
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
        logger.error(`Failed to test service ${id}:`, error);
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
    const removed = this.instances.delete(id);
    if (removed) {
      logger.info(`Removed service instance: ${id}`);
    }
    return removed;
  }

  /**
   * Start automatic connection testing
   */
  startAutoTesting(): void {
    if (this.testInterval) {
      clearInterval(this.testInterval);
    }
    
    this.testInterval = setInterval(async () => {
      logger.debug('Running automatic service connection tests...');
      await this.testAllServices();
    }, this.config.autoTestInterval);
    
    logger.info(`Started automatic service testing (interval: ${this.config.autoTestInterval}ms)`);
  }

  /**
   * Stop automatic connection testing
   */
  stopAutoTesting(): void {
    if (this.testInterval) {
      clearInterval(this.testInterval);
      this.testInterval = undefined;
      logger.info('Stopped automatic service testing');
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
    logger.info('Cleared service connection cache');
  }
} 