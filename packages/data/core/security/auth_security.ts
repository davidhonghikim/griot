/**
 * Simple Auth Security Module
 * 
 * Provides basic authentication security coordination functionality.
 * Focused and minimal - coordinates auth security modules.
 */

import { authValidator, LoginRequest, RegisterRequest, AuthValidationResult } from './auth/auth_validator';
import { passwordManager, PasswordHash } from './auth/password_manager';
import { sessionManager } from './auth/session_manager';
import { rateLimiter } from './auth/rate_limiter';

// ============================================================================
// TYPES AND INTERFACES
// ============================================================================

export interface AuthSecurityConfig {
  enableSessionValidation: boolean;
  enableRateLimiting: boolean;
  maxLoginAttempts: number;
  sessionTimeout: number;
}

export interface AuthResult {
  isAuthenticated: boolean;
  errors: string[];
  warnings: string[];
  user?: any;
  session?: any;
  token?: string;
}

// ============================================================================
// AUTH SECURITY CLASS
// ============================================================================

export class AuthSecurity {
  private config: AuthSecurityConfig;

  constructor(config: Partial<AuthSecurityConfig> = {}) {
    this.config = {
      enableSessionValidation: true,
      enableRateLimiting: true,
      maxLoginAttempts: 5,
      sessionTimeout: 30 * 60 * 1000, // 30 minutes
      ...config,
    };
  }

  /**
   * Validate login request
   */
  async validateLogin(request: LoginRequest): Promise<AuthResult> {
    const validation = authValidator.validateLogin(request);
    
    if (!validation.isValid) {
      return { isAuthenticated: false, errors: validation.errors, warnings: validation.warnings };
    }

    // Rate limiting check
    if (this.config.enableRateLimiting) {
      const rateLimitKey = `login:${request.ipAddress}`;
      if (!rateLimiter.checkLimit(rateLimitKey, this.config.maxLoginAttempts, 60000)) {
        return { isAuthenticated: false, errors: ['Too many login attempts'], warnings: [] };
      }
    }

    // Note: Actual authentication would be implemented here
    return { isAuthenticated: false, errors: ['Authentication not implemented'], warnings: [] };
  }

  /**
   * Validate registration request
   */
  async validateRegistration(request: RegisterRequest): Promise<AuthResult> {
    const validation = authValidator.validateRegistration(request);
    
    if (!validation.isValid) {
      return { isAuthenticated: false, errors: validation.errors, warnings: validation.warnings };
    }

    // Note: Actual registration would be implemented here
    return { isAuthenticated: false, errors: ['Registration not implemented'], warnings: [] };
  }

  /**
   * Hash password
   */
  hashPassword(password: string): PasswordHash {
    return passwordManager.hashPassword(password);
  }

  /**
   * Verify password
   */
  verifyPassword(password: string, hash: string, salt: string): boolean {
    return passwordManager.verifyPassword(password, hash, salt);
  }

  /**
   * Create session
   */
  createSession(userId: string, ipAddress: string, userAgent: string): any {
    return sessionManager.createSession(userId, ipAddress, userAgent);
  }

  /**
   * Validate session
   */
  validateSession(token: string): any {
    return sessionManager.validateSession(token);
  }

  /**
   * Get configuration
   */
  getConfig(): AuthSecurityConfig {
    return { ...this.config };
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<AuthSecurityConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
}

// Export singleton instance
export const authSecurity = new AuthSecurity(); 