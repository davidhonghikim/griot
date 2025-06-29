/**
 * CORS Validator Module
 * 
 * Provides basic CORS validation functionality.
 * Focused and minimal - validates CORS.
 */

// ============================================================================
// TYPES AND INTERFACES
// ============================================================================

export interface CORSConfig {
  allowedOrigins: string[];
  allowedMethods: string[];
  allowedHeaders: string[];
  allowCredentials: boolean;
  maxAge: number;
}

export interface CORSRequest {
  origin?: string;
  method: string;
  headers: Record<string, string>;
}

export interface CORSResult {
  isAllowed: boolean;
  errors: string[];
  warnings: string[];
  allowedOrigin?: string;
  allowedMethods?: string[];
  allowedHeaders?: string[];
}

// ============================================================================
// CORS VALIDATOR CLASS
// ============================================================================

export class CORSValidator {
  private config: CORSConfig;

  constructor(config: Partial<CORSConfig> = {}) {
    this.config = {
      allowedOrigins: ['*'],
      allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      allowCredentials: false,
      maxAge: 86400, // 24 hours
      ...config,
    };
  }

  /**
   * Validate CORS request
   */
  validateCORS(request: CORSRequest): CORSResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Origin validation
    if (request.origin) {
      const originValidation = this.validateOrigin(request.origin);
      if (!originValidation.isAllowed) {
        errors.push(...originValidation.errors);
      }
    }

    // Method validation
    const methodValidation = this.validateMethod(request.method);
    if (!methodValidation.isAllowed) {
      errors.push(...methodValidation.errors);
    }

    // Headers validation
    const headersValidation = this.validateHeaders(request.headers);
    if (!headersValidation.isAllowed) {
      errors.push(...headersValidation.errors);
    }

    return {
      isAllowed: errors.length === 0,
      errors,
      warnings,
      allowedOrigin: this.getAllowedOrigin(request.origin),
      allowedMethods: this.config.allowedMethods,
      allowedHeaders: this.config.allowedHeaders,
    };
  }

  /**
   * Validate origin
   */
  private validateOrigin(origin: string): { isAllowed: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check if wildcard is allowed
    if (this.config.allowedOrigins.includes('*')) {
      return { isAllowed: true, errors: [] };
    }

    // Check specific origins
    if (!this.config.allowedOrigins.includes(origin)) {
      errors.push(`Origin not allowed: ${origin}`);
    }

    return {
      isAllowed: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate method
   */
  private validateMethod(method: string): { isAllowed: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.config.allowedMethods.includes(method.toUpperCase())) {
      errors.push(`Method not allowed: ${method}`);
    }

    return {
      isAllowed: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate headers
   */
  private validateHeaders(headers: Record<string, string>): { isAllowed: boolean; errors: string[] } {
    const errors: string[] = [];

    for (const headerName of Object.keys(headers)) {
      if (!this.config.allowedHeaders.includes(headerName)) {
        errors.push(`Header not allowed: ${headerName}`);
      }
    }

    return {
      isAllowed: errors.length === 0,
      errors,
    };
  }

  /**
   * Get allowed origin for response
   */
  private getAllowedOrigin(origin?: string): string {
    if (this.config.allowedOrigins.includes('*')) {
      return '*';
    }
    if (origin && this.config.allowedOrigins.includes(origin)) {
      return origin;
    }
    return '';
  }

  /**
   * Get CORS headers for response
   */
  getCORSHeaders(origin?: string): Record<string, string> {
    const headers: Record<string, string> = {};

    const allowedOrigin = this.getAllowedOrigin(origin);
    if (allowedOrigin) {
      headers['Access-Control-Allow-Origin'] = allowedOrigin;
    }

    headers['Access-Control-Allow-Methods'] = this.config.allowedMethods.join(', ');
    headers['Access-Control-Allow-Headers'] = this.config.allowedHeaders.join(', ');
    headers['Access-Control-Max-Age'] = this.config.maxAge.toString();

    if (this.config.allowCredentials) {
      headers['Access-Control-Allow-Credentials'] = 'true';
    }

    return headers;
  }
}

// Export singleton instance
export const corsValidator = new CORSValidator(); 