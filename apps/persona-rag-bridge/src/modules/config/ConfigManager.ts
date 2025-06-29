/**
 * Configuration Manager for OWU+ Extension
 * 
 * Supports multiple configuration sources:
 * - Environment defaults (for testing)
 * - User config files 
 * - Network database/RAG retrieval
 * - Runtime updates via UI
 */

export interface OWUConnectionConfig {
  openwebuiUrl: string;
  openwebuiApiKey?: string;
  ragServiceUrl: string;
  useLocalRAG: boolean;
  timeout: number;
  retries: number;
}

export interface NetworkConfig {
  autoDiscovery: boolean;
  discoveryTimeout: number;
  preferredNetworks: string[];
  fallbackUrls: string[];
}

export interface ExtensionConfig {
  connection: OWUConnectionConfig;
  network: NetworkConfig;
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: boolean;
  version: string;
  lastUpdated: Date;
}

export type ConfigSource = 'default' | 'userFile' | 'networkRAG' | 'runtime';

export interface ConfigEntry<T> {
  value: T;
  source: ConfigSource;
  timestamp: Date;
  priority: number; // Higher number = higher priority
}

export class ConfigManager {
  private config: Map<string, ConfigEntry<any>> = new Map();
  private listeners: Map<string, ((value: any) => void)[]> = new Map();
  
  // Default testing configuration
  private readonly defaults: ExtensionConfig = {
    connection: {
      openwebuiUrl: 'http://192.168.1.180:3000',
      ragServiceUrl: 'http://localhost:3001', 
      useLocalRAG: true,
      timeout: 5000,
      retries: 3
    },
    network: {
      autoDiscovery: true,
      discoveryTimeout: 10000,
      preferredNetworks: ['192.168.1.*', 'localhost'],
      fallbackUrls: ['http://localhost:3000', 'http://127.0.0.1:3000']
    },
    theme: 'dark',
    language: 'en',
    notifications: true,
    version: '1.0.0',
    lastUpdated: new Date()
  };

  constructor() {
    this.initializeDefaults();
  }

  /**
   * Initialize with default testing configuration
   */
  private initializeDefaults(): void {
    this.setConfigValue('connection.openwebuiUrl', this.defaults.connection.openwebuiUrl, 'default');
    this.setConfigValue('connection.ragServiceUrl', this.defaults.connection.ragServiceUrl, 'default');
    this.setConfigValue('connection.useLocalRAG', this.defaults.connection.useLocalRAG, 'default');
    this.setConfigValue('connection.timeout', this.defaults.connection.timeout, 'default');
    this.setConfigValue('connection.retries', this.defaults.connection.retries, 'default');
    
    this.setConfigValue('network.autoDiscovery', this.defaults.network.autoDiscovery, 'default');
    this.setConfigValue('network.discoveryTimeout', this.defaults.network.discoveryTimeout, 'default');
    this.setConfigValue('network.preferredNetworks', this.defaults.network.preferredNetworks, 'default');
    this.setConfigValue('network.fallbackUrls', this.defaults.network.fallbackUrls, 'default');
    
    this.setConfigValue('theme', this.defaults.theme, 'default');
    this.setConfigValue('language', this.defaults.language, 'default');
    this.setConfigValue('notifications', this.defaults.notifications, 'default');
  }

  /**
   * Set a configuration value with source tracking
   */
  private setConfigValue<T>(key: string, value: T, source: ConfigSource): void {
    const priority = this.getSourcePriority(source);
    const existing = this.config.get(key);
    
    // Only update if new source has higher priority
    if (!existing || priority >= existing.priority) {
      this.config.set(key, {
        value,
        source,
        timestamp: new Date(),
        priority
      });
      
      // Notify listeners
      this.notifyListeners(key, value);
    }
  }

  /**
   * Get source priority (higher = more important)
   */
  private getSourcePriority(source: ConfigSource): number {
    switch (source) {
      case 'default': return 1;
      case 'userFile': return 2;
      case 'networkRAG': return 3;
      case 'runtime': return 4;
      default: return 0;
    }
  }

  /**
   * Get configuration value
   */
  get<T>(key: string): T | undefined {
    const entry = this.config.get(key);
    return entry?.value;
  }

  /**
   * Get configuration value with fallback
   */
  getWithFallback<T>(key: string, fallback: T): T {
    return this.get<T>(key) ?? fallback;
  }

  /**
   * Set configuration value from runtime (UI)
   */
  set<T>(key: string, value: T): void {
    this.setConfigValue(key, value, 'runtime');
  }

  /**
   * Load configuration from user config file
   */
  async loadFromUserFile(configData: Partial<ExtensionConfig>): Promise<void> {
    try {
      if (configData.connection) {
        Object.entries(configData.connection).forEach(([key, value]) => {
          this.setConfigValue(`connection.${key}`, value, 'userFile');
        });
      }
      
      if (configData.network) {
        Object.entries(configData.network).forEach(([key, value]) => {
          this.setConfigValue(`network.${key}`, value, 'userFile');
        });
      }
      
      ['theme', 'language', 'notifications'].forEach(key => {
        if (configData[key as keyof ExtensionConfig] !== undefined) {
          this.setConfigValue(key, configData[key as keyof ExtensionConfig], 'userFile');
        }
      });

      console.log('Configuration loaded from user file');
    } catch (error) {
      console.error('Failed to load user config file:', error);
    }
  }

  /**
   * Load configuration from network database/RAG
   */
  async loadFromNetworkRAG(): Promise<void> {
    try {
      // TODO: Implement network database/RAG configuration retrieval
      // This would connect to the RAG service and fetch configuration
      
      const networkConfig = await this.fetchNetworkConfiguration();
      
      if (networkConfig) {
        Object.entries(networkConfig).forEach(([key, value]) => {
          this.setConfigValue(key, value, 'networkRAG');
        });
        
        console.log('Configuration loaded from network RAG');
      }
    } catch (error) {
      console.error('Failed to load network RAG configuration:', error);
    }
  }

  /**
   * Fetch configuration from network RAG service
   */
  private async fetchNetworkConfiguration(): Promise<Record<string, any> | null> {
    try {
      const response = await fetch(`${this.get('connection.ragServiceUrl')}/api/config`);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.warn('Network RAG configuration not available:', error);
    }
    return null;
  }

  /**
   * Get current connection configuration
   */
  getConnectionConfig(): OWUConnectionConfig {
    return {
      openwebuiUrl: this.getWithFallback('connection.openwebuiUrl', this.defaults.connection.openwebuiUrl),
      openwebuiApiKey: this.get('connection.openwebuiApiKey'),
      ragServiceUrl: this.getWithFallback('connection.ragServiceUrl', this.defaults.connection.ragServiceUrl),
      useLocalRAG: this.getWithFallback('connection.useLocalRAG', this.defaults.connection.useLocalRAG),
      timeout: this.getWithFallback('connection.timeout', this.defaults.connection.timeout),
      retries: this.getWithFallback('connection.retries', this.defaults.connection.retries)
    };
  }

  /**
   * Get network configuration
   */
  getNetworkConfig(): NetworkConfig {
    return {
      autoDiscovery: this.getWithFallback('network.autoDiscovery', this.defaults.network.autoDiscovery),
      discoveryTimeout: this.getWithFallback('network.discoveryTimeout', this.defaults.network.discoveryTimeout),
      preferredNetworks: this.getWithFallback('network.preferredNetworks', this.defaults.network.preferredNetworks),
      fallbackUrls: this.getWithFallback('network.fallbackUrls', this.defaults.network.fallbackUrls)
    };
  }

  /**
   * Subscribe to configuration changes
   */
  subscribe(key: string, callback: (value: any) => void): () => void {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, []);
    }
    
    this.listeners.get(key)!.push(callback);
    
    // Return unsubscribe function
    return () => {
      const listeners = this.listeners.get(key);
      if (listeners) {
        const index = listeners.indexOf(callback);
        if (index > -1) {
          listeners.splice(index, 1);
        }
      }
    };
  }

  /**
   * Notify listeners of configuration changes
   */
  private notifyListeners(key: string, value: any): void {
    const listeners = this.listeners.get(key);
    if (listeners) {
      listeners.forEach(callback => callback(value));
    }
  }

  /**
   * Export current configuration
   */
  exportConfig(): ExtensionConfig {
    return {
      connection: this.getConnectionConfig(),
      network: this.getNetworkConfig(),
      theme: this.getWithFallback('theme', this.defaults.theme),
      language: this.getWithFallback('language', this.defaults.language),
      notifications: this.getWithFallback('notifications', this.defaults.notifications),
      version: this.defaults.version,
      lastUpdated: new Date()
    };
  }

  /**
   * Get configuration source information
   */
  getConfigSource(key: string): ConfigEntry<any> | undefined {
    return this.config.get(key);
  }
}

// Singleton instance
export const configManager = new ConfigManager(); 