/**
 * Base Service Connector
 * 
 * Provides a unified interface for connecting to various AI services
 * with health monitoring, configuration management, and error handling.
 */

import { getSection } from '../../config/environment';
import type { AIServiceConfig } from '../../config/environment';

export interface ServiceHealth {
  status: 'healthy' | 'unhealthy' | 'degraded';
  responseTime: number;
  lastCheck: Date;
  errorMessage?: string;
  metrics: ServiceMetrics;
}

export interface ServiceMetrics {
  uptime: number;
  requests: number;
  errors: number;
  latency: number;
  throughput: number;
}

export interface ServiceConnection {
  id: string;
  serviceId: string;
  status: 'connected' | 'disconnected' | 'error';
  establishedAt: Date;
  lastActivity: Date;
  config: Record<string, any>;
}

export abstract class ServiceConnector {
  protected config: AIServiceConfig;
  protected health: ServiceHealth;
  protected connection: ServiceConnection;
  protected reconnectAttempts: number = 0;
  protected maxReconnectAttempts: number = 3;
  protected reconnectDelay: number = 5000;

  constructor(
    protected serviceId: string,
    protected serviceType: string,
    protected baseUrl: string
  ) {
    this.config = getSection('aiServices');
    this.health = this.initializeHealth();
    this.connection = this.initializeConnection();
  }

  private initializeHealth(): ServiceHealth {
    return {
      status: 'unhealthy',
      responseTime: 0,
      lastCheck: new Date(),
      metrics: {
        uptime: 0,
        requests: 0,
        errors: 0,
        latency: 0,
        throughput: 0,
      },
    };
  }

  private initializeConnection(): ServiceConnection {
    return {
      id: crypto.randomUUID(),
      serviceId: this.serviceId,
      status: 'disconnected',
      establishedAt: new Date(),
      lastActivity: new Date(),
      config: {},
    };
  }

  /**
   * Connect to the service
   */
  async connect(): Promise<boolean> {
    try {
      this.connection.status = 'connected';
      this.connection.establishedAt = new Date();
      this.connection.lastActivity = new Date();
      
      // Perform health check
      await this.performHealthCheck();
      
      this.reconnectAttempts = 0;
      return true;
    } catch (error) {
      this.connection.status = 'error';
      this.health.status = 'unhealthy';
      this.health.errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.health.metrics.errors++;
      
      console.error(`Failed to connect to ${this.serviceType}:`, error);
      return false;
    }
  }

  /**
   * Disconnect from the service
   */
  async disconnect(): Promise<void> {
    this.connection.status = 'disconnected';
    this.health.status = 'unhealthy';
    
    // Cleanup any resources
    await this.cleanup();
  }

  /**
   * Perform health check
   */
  async performHealthCheck(): Promise<ServiceHealth> {
    const startTime = Date.now();
    
    try {
      await this.checkHealth();
      
      const responseTime = Date.now() - startTime;
      this.health.responseTime = responseTime;
      this.health.lastCheck = new Date();
      this.health.status = 'healthy';
      this.health.metrics.requests++;
      this.health.metrics.latency = responseTime;
      
      this.connection.lastActivity = new Date();
      
    } catch (error) {
      this.health.status = 'unhealthy';
      this.health.errorMessage = error instanceof Error ? error.message : 'Health check failed';
      this.health.metrics.errors++;
      
      // Attempt reconnection if disconnected
      if (this.connection.status === 'disconnected' && this.reconnectAttempts < this.maxReconnectAttempts) {
        await this.attemptReconnect();
      }
    }
    
    return this.health;
  }

  /**
   * Attempt to reconnect
   */
  private async attemptReconnect(): Promise<void> {
    this.reconnectAttempts++;
    
    setTimeout(async () => {
      console.log(`Attempting to reconnect to ${this.serviceType} (attempt ${this.reconnectAttempts})`);
      
      const success = await this.connect();
      if (!success && this.reconnectAttempts < this.maxReconnectAttempts) {
        await this.attemptReconnect();
      }
    }, this.reconnectDelay * this.reconnectAttempts);
  }

  /**
   * Get service health
   */
  getHealth(): ServiceHealth {
    return { ...this.health };
  }

  /**
   * Get connection status
   */
  getConnection(): ServiceConnection {
    return { ...this.connection };
  }

  /**
   * Check if service is healthy
   */
  isHealthy(): boolean {
    return this.health.status === 'healthy' && this.connection.status === 'connected';
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<AIServiceConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Abstract methods to be implemented by subclasses
   */
  protected abstract checkHealth(): Promise<void>;
  protected abstract cleanup(): Promise<void>;

  /**
   * Make a request to the service
   */
  protected async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const startTime = Date.now();
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      const responseTime = Date.now() - startTime;
      
      // Update metrics
      this.health.metrics.requests++;
      this.health.metrics.latency = responseTime;
      this.connection.lastActivity = new Date();
      
      return data;
    } catch (error) {
      this.health.metrics.errors++;
      this.health.status = 'unhealthy';
      this.health.errorMessage = error instanceof Error ? error.message : 'Request failed';
      
      throw error;
    }
  }

  /**
   * Get service information
   */
  getServiceInfo() {
    return {
      id: this.serviceId,
      type: this.serviceType,
      baseUrl: this.baseUrl,
      health: this.getHealth(),
      connection: this.getConnection(),
      config: this.config,
    };
  }
} 