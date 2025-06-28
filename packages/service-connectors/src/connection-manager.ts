import type { ServiceDefinition } from './types';

export interface ConnectionConfig {
  host: string;
  port: number;
  protocol: 'http' | 'https';
  timeout?: number;
  retries?: number;
}

export interface ConnectionResult {
  success: boolean;
  protocol: 'http' | 'https';
  url: string;
  error?: string;
  responseTime?: number;
}

export class ServiceConnectionManager {
  private static instance: ServiceConnectionManager;
  private protocolCache: Map<string, 'http' | 'https'> = new Map();
  private connectionTimeouts: Map<string, number> = new Map();

  private constructor() {}

  static getInstance(): ServiceConnectionManager {
    if (!ServiceConnectionManager.instance) {
      ServiceConnectionManager.instance = new ServiceConnectionManager();
    }
    return ServiceConnectionManager.instance;
  }

  /**
   * Get the optimal protocol for a service, with fallback logic
   */
  async getOptimalProtocol(service: ServiceDefinition, host: string, port: number): Promise<'http' | 'https'> {
    const cacheKey = `${service.type}-${host}-${port}`;
    
    // Check cache first
    if (this.protocolCache.has(cacheKey)) {
      return this.protocolCache.get(cacheKey)!;
    }

    // Determine primary and fallback protocols
    let primaryProtocol: 'http' | 'https';
    let fallbackProtocol: 'http' | 'https' | undefined;

    if (typeof service.protocol === 'string') {
      primaryProtocol = service.protocol;
      // For local services, try HTTPS first (in case user has nginx/caddy setup)
      // then fallback to HTTP if HTTPS fails
      if (this.isLocalService(host)) {
        primaryProtocol = 'https';
        fallbackProtocol = 'http';
      }
    } else {
      primaryProtocol = service.protocol.primary;
      fallbackProtocol = service.protocol.fallback;
    }

    // For cloud services with HTTPS, don't use fallback (HTTPS should always work)
    if (!this.isLocalService(host) && primaryProtocol === 'https') {
      this.protocolCache.set(cacheKey, 'https');
      return 'https';
    }

    // Test primary protocol
    const primaryResult = await this.testConnection(host, port, primaryProtocol);
    if (primaryResult.success) {
      this.protocolCache.set(cacheKey, primaryProtocol);
      return primaryProtocol;
    }

    // Test fallback protocol if available and different from primary
    if (fallbackProtocol && fallbackProtocol !== primaryProtocol) {
      const fallbackResult = await this.testConnection(host, port, fallbackProtocol);
      if (fallbackResult.success) {
        this.protocolCache.set(cacheKey, fallbackProtocol);
        return fallbackProtocol;
      }
    }

    // If both fail, return primary protocol (will fail gracefully)
    return primaryProtocol;
  }

  /**
   * Test a connection to determine if a protocol works
   */
  private async testConnection(host: string, port: number, protocol: 'http' | 'https'): Promise<ConnectionResult> {
    const url = `${protocol}://${host}:${port}`;
    const timeout = 5000; // 5 second timeout

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const startTime = Date.now();
      const response = await fetch(`${url}/health`, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'User-Agent': 'griot-service-connector/1.0.0'
        }
      });

      clearTimeout(timeoutId);
      const responseTime = Date.now() - startTime;

      if (response.ok) {
        return {
          success: true,
          protocol,
          url,
          responseTime
        };
      } else {
        return {
          success: false,
          protocol,
          url,
          error: `HTTP ${response.status}: ${response.statusText}`
        };
      }
    } catch (error) {
      return {
        success: false,
        protocol,
        url,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Determine if a service is likely local based on host
   */
  private isLocalService(host: string): boolean {
    const localPatterns = [
      'localhost',
      '0.0.0.0',
      '127.0.0.1',
      '::1',
      '192.168.',
      '10.',
      '172.16.',
      '172.17.',
      '172.18.',
      '172.19.',
      '172.20.',
      '172.21.',
      '172.22.',
      '172.23.',
      '172.24.',
      '172.25.',
      '172.26.',
      '172.27.',
      '172.28.',
      '172.29.',
      '172.30.',
      '172.31.'
    ];

    return localPatterns.some(pattern => host.includes(pattern));
  }

  /**
   * Clear the protocol cache (useful for testing or when services change)
   */
  clearCache(): void {
    this.protocolCache.clear();
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; entries: Array<{ key: string; protocol: 'http' | 'https' }> } {
    return {
      size: this.protocolCache.size,
      entries: Array.from(this.protocolCache.entries()).map(([key, protocol]) => ({ key, protocol }))
    };
  }
}

/**
 * Utility function to create a service URL with optimal protocol
 */
export async function createServiceUrl(
  service: ServiceDefinition,
  host: string,
  port?: number
): Promise<string> {
  const connectionManager = ServiceConnectionManager.getInstance();
  const servicePort = port || service.defaultPort;
  const optimalProtocol = await connectionManager.getOptimalProtocol(service, host, servicePort);
  
  return `${optimalProtocol}://${host}:${servicePort}`;
}

/**
 * Utility function to test service connectivity
 */
export async function testServiceConnectivity(
  service: ServiceDefinition,
  host: string,
  port?: number
): Promise<ConnectionResult> {
  const connectionManager = ServiceConnectionManager.getInstance();
  const servicePort = port || service.defaultPort;
  const protocol = await connectionManager.getOptimalProtocol(service, host, servicePort);
  
  return connectionManager['testConnection'](host, servicePort, protocol);
} 