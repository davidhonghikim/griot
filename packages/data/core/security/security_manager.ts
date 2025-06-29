/**
 * Simple Security Manager Module
 * 
 * Provides basic security coordination functionality.
 * Focused and minimal - coordinates security modules.
 */

import { securityOrchestrator, SecurityResult, SecurityContext } from './security_orchestrator';
import { inputValidator } from './core/input_validator_simple';
import { fileValidator } from './file/file_validator';
import { authValidator } from './auth/auth_validator';
import { networkRequestValidator } from './network/network_request_validator';

// ============================================================================
// TYPES AND INTERFACES
// ============================================================================

export interface SecurityManagerConfig {
  enableComprehensiveValidation: boolean;
  enableLogging: boolean;
  enableMetrics: boolean;
  securityLevel: 'low' | 'medium' | 'high' | 'critical';
  autoBlockThreshold: number;
}

// ============================================================================
// SECURITY MANAGER CLASS
// ============================================================================

export class SecurityManager {
  private config: SecurityManagerConfig;

  constructor(config: Partial<SecurityManagerConfig> = {}) {
    this.config = {
      enableComprehensiveValidation: true,
      enableLogging: true,
      enableMetrics: true,
      securityLevel: 'high',
      autoBlockThreshold: 15,
      ...config,
    };
  }

  /**
   * Comprehensive security validation
   */
  async validateSecurity(data: any, context: SecurityContext): Promise<SecurityResult> {
    return securityOrchestrator.validateSecurity(data, context);
  }

  /**
   * Validate input
   */
  validateInput(value: any, rules: any[]): any {
    return inputValidator.validate(value, rules);
  }

  /**
   * Validate file path
   */
  validateFilePath(path: string): any {
    return fileValidator.validatePath(path);
  }

  /**
   * Validate auth request
   */
  validateAuthRequest(request: any): any {
    return authValidator.validateLogin(request);
  }

  /**
   * Validate network request
   */
  validateNetworkRequest(request: any): any {
    return networkRequestValidator.validateRequest(request);
  }

  /**
   * Get configuration
   */
  getConfig(): SecurityManagerConfig {
    return { ...this.config };
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<SecurityManagerConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
}

// Export singleton instance
export const securityManager = new SecurityManager(); 