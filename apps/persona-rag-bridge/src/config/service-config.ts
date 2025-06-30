/**
 * Flexible Service Configuration
 * 
 * Allows configuration of any LLM/service while maintaining local RAG/vector/db storage
 */

export interface ServiceConfig {
  type: 'ollama' | 'openai' | 'openwebui' | 'anthropic' | 'local' | 'custom';
  name: string;
  url: string;
  apiKey?: string;
  model?: string;
  enabled: boolean;
  priority: number; // Higher number = higher priority
}

export interface ServiceRegistry {
  services: ServiceConfig[];
  defaultService?: string;
}

export class ServiceManager {
  private services: Map<string, ServiceConfig> = new Map();
  private defaultService: string | null = null;

  constructor() {
    this.loadDefaultServices();
  }

  private loadDefaultServices() {
    // Default service configurations
    const defaultServices: ServiceConfig[] = [
      {
        type: 'openwebui',
        name: 'Local OpenWebUI',
        url: 'http://localhost:3000',
        enabled: true,
        priority: 1
      },
      {
        type: 'openwebui',
        name: 'Remote OpenWebUI',
        url: 'http://192.168.1.180:3000',
        enabled: true,
        priority: 2
      },
      {
        type: 'ollama',
        name: 'Local Ollama',
        url: 'http://localhost:11434',
        enabled: true,
        priority: 3
      },
      {
        type: 'openai',
        name: 'OpenAI API',
        url: 'https://api.openai.com',
        enabled: false,
        priority: 4
      }
    ];

    defaultServices.forEach(service => {
      this.addService(service);
    });

    // Set default service
    this.defaultService = 'Local OpenWebUI';
  }

  addService(service: ServiceConfig) {
    this.services.set(service.name, service);
  }

  removeService(name: string) {
    this.services.delete(name);
  }

  getService(name: string): ServiceConfig | undefined {
    return this.services.get(name);
  }

  getDefaultService(): ServiceConfig | undefined {
    if (this.defaultService) {
      return this.services.get(this.defaultService);
    }
    return undefined;
  }

  getEnabledServices(): ServiceConfig[] {
    return Array.from(this.services.values())
      .filter(service => service.enabled)
      .sort((a, b) => b.priority - a.priority);
  }

  getAllServices(): ServiceConfig[] {
    return Array.from(this.services.values())
      .sort((a, b) => b.priority - a.priority);
  }

  setDefaultService(name: string) {
    if (this.services.has(name)) {
      this.defaultService = name;
    }
  }

  // Get service by type
  getServicesByType(type: string): ServiceConfig[] {
    return Array.from(this.services.values())
      .filter(service => service.type === type && service.enabled)
      .sort((a, b) => b.priority - a.priority);
  }

  // Validate service configuration
  validateService(service: ServiceConfig): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!service.name) errors.push('Service name is required');
    if (!service.url) errors.push('Service URL is required');
    if (!service.type) errors.push('Service type is required');

    // Validate URL format
    try {
      new URL(service.url);
    } catch {
      errors.push('Invalid URL format');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  // Export configuration
  exportConfig(): ServiceRegistry {
    return {
      services: this.getAllServices(),
      defaultService: this.defaultService || undefined
    };
  }

  // Import configuration
  importConfig(config: ServiceRegistry) {
    this.services.clear();
    config.services.forEach(service => {
      this.addService(service);
    });
    if (config.defaultService) {
      this.setDefaultService(config.defaultService);
    }
  }
}

// Global service manager instance
export const serviceManager = new ServiceManager(); 