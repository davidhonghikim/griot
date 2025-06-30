import { config } from '../config/env';
import type { ServiceInfo } from '../modules/state/atoms';

/**
 * Browser-Safe Service Initializer
 * 
 * Provides mock service status for browser context without creating actual services
 * that might use OpenAI API or other server-side dependencies.
 */
export class ServiceInitializer {
  constructor() {
    console.log('Browser-safe ServiceInitializer created');
  }

  /**
   * Build service URL based on IP type and configuration
   */
  private buildServiceUrl(serviceType: string, ipType: 'local' | 'remote' | 'cloud' | 'custom', customUrl?: string): string {
    if (ipType === 'custom' || ipType === 'cloud') {
      return customUrl || '';
    }

    const ip = ipType === 'local' ? config.networking.localIp : config.networking.remoteIp;
    if (!ip) return '';

    // Mock port mapping
    const portMap: Record<string, number> = {
      'persona_rag': 5000,
      'openwebui': 3000,
      'vector_store': 8080
    };

    return `http://${ip}:${portMap[serviceType] || 3000}`;
  }

  /**
   * Check if a service is actually online (browser-safe)
   */
  private async checkServiceStatus(url: string, healthEndpoint: string): Promise<'online' | 'offline' | 'error'> {
    try {
      const response = await fetch(`${url}${healthEndpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(config.networking.defaultTimeoutMs),
      });

      if (response.ok) {
        return 'online';
      } else {
        return 'error';
      }
    } catch (error) {
      console.warn(`Service health check failed for ${url}:`, error);
      return 'offline';
    }
  }

  /**
   * Initialize services with browser-safe mock data
   */
  async initializeServices(setServicesState: (services: ServiceInfo[]) => void) {
    console.log('Browser-safe service initialization - using mock services');
    
    try {
      // Create services with real status checks but no service creation
      const services: ServiceInfo[] = [];

      // PersonaRAG Service
      const personaRAGUrl = this.buildServiceUrl('persona_rag', 'local');
      const personaRAGStatus = await this.checkServiceStatus(personaRAGUrl, '/health');
      services.push({
        id: 'persona-rag',
        name: 'Persona RAG',
        type: 'ollama',
        url: personaRAGUrl,
        status: personaRAGStatus,
        lastCheck: new Date(),
        config: {
          model: config.services.defaultPersonaRAGModel,
          temperature: 0.7,
          maxTokens: 2048,
        },
      });

      // OpenWebUI Service
      const openWebUIUrl = this.buildServiceUrl('openwebui', 'remote');
      const openWebUIStatus = await this.checkServiceStatus(openWebUIUrl, '/api/v1/health');
      services.push({
        id: 'openwebui',
        name: 'OpenWebUI',
        type: 'ollama',
        url: openWebUIUrl,
        status: openWebUIStatus,
        lastCheck: new Date(),
        config: {
          model: config.services.defaultOpenWebUIModel,
          temperature: 0.7,
          maxTokens: 2048,
        },
      });

      // Vector Store Service
      const vectorStoreUrl = this.buildServiceUrl('vector_store', 'local');
      const vectorStoreStatus = await this.checkServiceStatus(vectorStoreUrl, '/health');
      services.push({
        id: 'vector-store',
        name: 'Vector Store',
        type: 'huggingface',
        url: vectorStoreUrl,
        status: vectorStoreStatus,
        lastCheck: new Date(),
        config: {
          model: config.services.defaultVectorStoreModel,
          dimension: 384,
        },
      });

      // Update the services state
      setServicesState(services);

      console.log('Browser-safe services initialized successfully');
    } catch (error) {
      console.error('Failed to initialize browser-safe services:', error);
      
      // Set services as offline if initialization fails
      const offlineServices: ServiceInfo[] = [
        {
          id: 'persona-rag',
          name: 'Persona RAG',
          type: 'ollama',
          url: this.buildServiceUrl('persona_rag', 'local'),
          status: 'offline',
          lastCheck: new Date(),
          config: {},
        },
        {
          id: 'openwebui',
          name: 'OpenWebUI',
          type: 'ollama',
          url: this.buildServiceUrl('openwebui', 'remote'),
          status: 'offline',
          lastCheck: new Date(),
          config: {},
        },
        {
          id: 'vector-store',
          name: 'Vector Store',
          type: 'huggingface',
          url: this.buildServiceUrl('vector_store', 'local'),
          status: 'offline',
          lastCheck: new Date(),
          config: {},
        },
      ];

      setServicesState(offlineServices);
    }
  }

  /**
   * Cleanup services (no-op for browser)
   */
  async cleanup() {
    console.log('Browser-safe cleanup - no services to cleanup');
  }
}
