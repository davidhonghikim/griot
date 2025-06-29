/**
 * Simple Network Security Module
 * 
 * Provides basic network security coordination functionality.
 * Focused and minimal - coordinates network security modules.
 */

import { networkRequestValidator, NetworkRequest, NetworkValidationResult } from './network/network_request_validator';
import { corsValidator, CORSRequest, CORSResult } from './network/cors_validator';
import { urlValidator } from './network/url_validator';

// ============================================================================
// TYPES AND INTERFACES
// ============================================================================

export interface NetworkSecurityConfig {
  enableUrlValidation: boolean;
  enableRequestValidation: boolean;
  enableCORS: boolean;
  maxUrlLength: number;
  maxRequestSize: number;
}

// ============================================================================
// NETWORK SECURITY CLASS
// ============================================================================

export class NetworkSecurity {
  private config: NetworkSecurityConfig;

  constructor(config: Partial<NetworkSecurityConfig> = {}) {
    this.config = {
      enableUrlValidation: true,
      enableRequestValidation: true,
      enableCORS: true,
      maxUrlLength: 2048,
      maxRequestSize: 10 * 1024 * 1024, // 10MB
      ...config,
    };
  }

  /**
   * Validate network request
   */
  async validateRequest(request: NetworkRequest): Promise<NetworkValidationResult> {
    return networkRequestValidator.validateRequest(request);
  }

  /**
   * Validate CORS request
   */
  validateCORS(request: CORSRequest): CORSResult {
    return corsValidator.validateCORS(request);
  }

  /**
   * Validate URL
   */
  validateUrl(url: string): any {
    return urlValidator.validateUrl(url);
  }

  /**
   * Get CORS headers
   */
  getCORSHeaders(origin?: string): Record<string, string> {
    return corsValidator.getCORSHeaders(origin);
  }

  /**
   * Get configuration
   */
  getConfig(): NetworkSecurityConfig {
    return { ...this.config };
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<NetworkSecurityConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
}

// Export singleton instance
export const networkSecurity = new NetworkSecurity(); 