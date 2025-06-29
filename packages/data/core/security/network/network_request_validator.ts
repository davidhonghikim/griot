/**
 * Network Request Validator Module
 * 
 * Provides basic network request validation functionality.
 * Focused and minimal - validates network requests.
 */

import { ValidationResult, ValidationRules } from '../core/validation_rules';
import { SecurityPatterns } from '../core/security_patterns';

// ============================================================================
// TYPES AND INTERFACES
// ============================================================================

export interface NetworkRequest {
  url: string;
  method: string;
  headers: Record<string, string>;
  body?: any;
  ipAddress?: string;
  userAgent?: string;
  origin?: string;
  referer?: string;
}

export interface NetworkValidationResult {
  isAllowed: boolean;
  errors: string[];
  warnings: string[];
  sanitizedUrl?: string;
  sanitizedHeaders?: Record<string, string>;
  sanitizedBody?: any;
}

export interface NetworkConfig {
  allowedProtocols: string[];
  allowedDomains: string[];
  blockedDomains: string[];
  maxUrlLength: number;
  maxRequestSize: number;
}

// ============================================================================
// NETWORK REQUEST VALIDATOR CLASS
// ============================================================================

export class NetworkRequestValidator {
  private config: NetworkConfig;

  constructor(config: Partial<NetworkConfig> = {}) {
    this.config = {
      allowedProtocols: ['http', 'https'],
      allowedDomains: [],
      blockedDomains: ['malware.com', 'phishing.com', 'spam.com'],
      maxUrlLength: 2048,
      maxRequestSize: 10 * 1024 * 1024, // 10MB
      ...config,
    };
  }

  /**
   * Validate network request
   */
  validateRequest(request: NetworkRequest): NetworkValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    let sanitizedUrl = request.url;
    let sanitizedHeaders = { ...request.headers };
    let sanitizedBody = request.body;

    // URL validation
    const urlValidation = this.validateUrl(request.url);
    if (!urlValidation.isValid) {
      errors.push(...urlValidation.errors);
    } else {
      sanitizedUrl = urlValidation.sanitizedValue || request.url;
    }

    // Method validation
    const methodValidation = this.validateMethod(request.method);
    if (!methodValidation.isValid) {
      errors.push(...methodValidation.errors);
    }

    // Headers validation
    const headersValidation = this.validateHeaders(request.headers);
    if (!headersValidation.isValid) {
      errors.push(...headersValidation.errors);
    } else {
      sanitizedHeaders = headersValidation.sanitizedValue || request.headers;
    }

    // Body validation
    if (request.body) {
      const bodyValidation = this.validateBody(request.body);
      if (!bodyValidation.isValid) {
        errors.push(...bodyValidation.errors);
      } else {
        sanitizedBody = bodyValidation.sanitizedValue || request.body;
      }
    }

    return {
      isAllowed: errors.length === 0,
      errors,
      warnings,
      sanitizedUrl,
      sanitizedHeaders,
      sanitizedBody,
    };
  }

  /**
   * Validate URL
   */
  private validateUrl(url: string): ValidationResult {
    const errors: string[] = [];
    let sanitizedUrl = url;

    // Basic URL validation
    const urlValidation = ValidationRules.patternValidation(
      /^https?:\/\/[^\s]+$/,
      'Invalid URL format'
    );
    const result = urlValidation.validate(url);
    if (!result.isValid) {
      errors.push(...result.errors);
    }

    // Length validation
    if (url.length > this.config.maxUrlLength) {
      errors.push(`URL too long: ${url.length} characters (max: ${this.config.maxUrlLength})`);
    }

    // Protocol validation
    const protocol = url.split('://')[0];
    if (!this.config.allowedProtocols.includes(protocol)) {
      errors.push(`Protocol not allowed: ${protocol}`);
    }

    // Domain validation
    const domain = this.extractDomain(url);
    if (domain && this.config.blockedDomains.includes(domain)) {
      errors.push(`Domain blocked: ${domain}`);
    }

    // Security pattern checking
    if (SecurityPatterns.hasSecurityThreat(url)) {
      warnings.push('Security patterns detected in URL');
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedValue: sanitizedUrl,
    };
  }

  /**
   * Validate HTTP method
   */
  private validateMethod(method: string): ValidationResult {
    const allowedMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'];
    return ValidationRules.enumValidation(allowedMethods).validate(method);
  }

  /**
   * Validate headers
   */
  private validateHeaders(headers: Record<string, string>): ValidationResult {
    const errors: string[] = [];
    const sanitizedHeaders: Record<string, string> = {};

    for (const [name, value] of Object.entries(headers)) {
      // Validate header name
      const nameValidation = this.validateHeaderName(name);
      if (!nameValidation.isValid) {
        errors.push(...nameValidation.errors);
        continue;
      }

      // Validate header value
      const valueValidation = this.validateHeaderValue(value);
      if (!valueValidation.isValid) {
        errors.push(...valueValidation.errors);
        continue;
      }

      sanitizedHeaders[name] = value;
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedValue: sanitizedHeaders,
    };
  }

  /**
   * Validate header name
   */
  private validateHeaderName(name: string): ValidationResult {
    const errors: string[] = [];

    if (!/^[a-zA-Z0-9\-_]+$/.test(name)) {
      errors.push(`Invalid header name: ${name}`);
    }

    if (name.length > 100) {
      errors.push(`Header name too long: ${name.length} characters`);
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Validate header value
   */
  private validateHeaderValue(value: string): ValidationResult {
    const errors: string[] = [];

    if (value.length > 1000) {
      errors.push(`Header value too long: ${value.length} characters`);
    }

    if (SecurityPatterns.hasSecurityThreat(value)) {
      errors.push('Security patterns detected in header value');
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Validate request body
   */
  private validateBody(body: any): ValidationResult {
    const errors: string[] = [];
    let sanitizedBody = body;

    // Size validation
    const bodySize = JSON.stringify(body).length;
    if (bodySize > this.config.maxRequestSize) {
      errors.push(`Request body too large: ${bodySize} bytes (max: ${this.config.maxRequestSize})`);
    }

    // Content validation
    if (typeof body === 'string') {
      if (SecurityPatterns.hasSecurityThreat(body)) {
        errors.push('Security patterns detected in request body');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedValue: sanitizedBody,
    };
  }

  /**
   * Extract domain from URL
   */
  private extractDomain(url: string): string | null {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname;
    } catch {
      return null;
    }
  }
}

// Export singleton instance
export const networkRequestValidator = new NetworkRequestValidator(); 