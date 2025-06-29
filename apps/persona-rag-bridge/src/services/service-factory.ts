#!/usr/bin/env tsx

/**
 * Service Factory - Creates and manages service instances
 */

import { PersonaRAGService } from './persona-rag.service';
import { OpenWebUIBridge } from './openwebui-bridge.service';
import { VectorStoreService } from './vector-store.service';

export interface ServiceFactoryConfig {
  enablePersonaRAG: boolean;
  enableOpenWebUI: boolean;
  enableVectorStore: boolean;
}

export class ServiceFactory {
  private services: Map<string, any> = new Map();

  constructor(_config: ServiceFactoryConfig) {
    // Config will be used in future implementation
  }

  /**
   * Create PersonaRAG service
   */
  createPersonaRAGService(): PersonaRAGService {
    if (this.services.has('personaRAG')) {
      return this.services.get('personaRAG');
    }

    const config = {
      enableVectorization: true,
      enableCaching: true,
      maxResults: 10,
      similarityThreshold: 0.7,
      cacheTTL: 300000 // 5 minutes
    };

    const service = new PersonaRAGService(config);
    this.services.set('personaRAG', service);
    return service;
  }

  /**
   * Create OpenWebUI bridge service
   */
  createOpenWebUIBridgeService(personaRAGService: PersonaRAGService): OpenWebUIBridge {
    if (this.services.has('openWebUI')) {
      return this.services.get('openWebUI');
    }

    const config = {
      url: 'http://192.168.1.180:3000',
      apiKey: 'sk-dae28e6035904cecb2737fbc54768d16'
    };

    const service = new OpenWebUIBridge(config, personaRAGService as any);
    this.services.set('openWebUI', service);
    return service;
  }

  /**
   * Create vector store service
   */
  createVectorStoreService(): VectorStoreService {
    if (this.services.has('vectorStore')) {
      return this.services.get('vectorStore');
    }

    const config = {
      type: 'weaviate' as const,
      host: 'localhost',
      port: 8080,
      apiKey: 'test-key'
    };

    const mockVault = {
      getSecret: async (_key: string) => 'mock-secret',
      setSecret: async (_key: string, _value: string) => {},
      listSecrets: async () => [],
      deleteSecret: async (_key: string) => {},
      healthCheck: async () => ({ status: 'healthy' })
    };

    const service = new VectorStoreService(mockVault as any, config);
    this.services.set('vectorStore', service);
    return service;
  }

  /**
   * Get all created services
   */
  getServices(): Map<string, any> {
    return new Map(this.services);
  }

  /**
   * Get service by name
   */
  getService(name: string): any {
    return this.services.get(name);
  }

  /**
   * Cleanup all services
   */
  async cleanup(): Promise<void> {
    for (const service of this.services.values()) {
      if (service.destroy) {
        await service.destroy();
      }
    }
    this.services.clear();
  }
}
