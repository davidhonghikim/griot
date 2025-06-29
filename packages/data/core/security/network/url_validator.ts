/**
 * URL Validator Module
 * 
 * Provides basic URL validation functionality.
 * Focused and minimal - validates URLs for security.
 */

// ============================================================================
// TYPES AND INTERFACES
// ============================================================================

export interface UrlValidationResult {
  isValid: boolean;
  errors: string[];
  sanitizedUrl?: string;
}

export interface UrlValidatorConfig {
  allowedProtocols: string[];
  blockedDomains: string[];
  maxUrlLength: number;
}

// ============================================================================
// URL VALIDATOR CLASS
// ============================================================================

export class UrlValidator {
  private config: UrlValidatorConfig;

  constructor(config: Partial<UrlValidatorConfig> = {}) {
    this.config = {
      allowedProtocols: ['http', 'https'],
      blockedDomains: ['malware.com', 'phishing.com', 'spam.com'],
      maxUrlLength: 2048,
      ...config,
    };
  }

  /**
   * Validate URL
   */
  validateUrl(url: string): UrlValidationResult {
    const errors: string[] = [];

    // Basic validation
    if (!url || typeof url !== 'string') {
      errors.push('URL must be a non-empty string');
      return { isValid: false, errors };
    }

    // Length validation
    if (url.length > this.config.maxUrlLength) {
      errors.push(`URL too long: ${url.length} characters (max: ${this.config.maxUrlLength})`);
    }

    // Protocol validation
    const protocol = this.extractProtocol(url);
    if (!protocol || !this.config.allowedProtocols.includes(protocol)) {
      errors.push(`Invalid protocol: ${protocol}. Allowed: ${this.config.allowedProtocols.join(', ')}`);
    }

    // Domain validation
    const domain = this.extractDomain(url);
    if (domain) {
      const domainCheck = this.validateDomain(domain);
      if (!domainCheck.isValid) {
        errors.push(...domainCheck.errors);
      }
    }

    // Path validation
    const pathCheck = this.validatePath(url);
    if (!pathCheck.isValid) {
      errors.push(...pathCheck.errors);
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedUrl: errors.length === 0 ? this.sanitizeUrl(url) : undefined,
    };
  }

  /**
   * Extract protocol from URL
   */
  private extractProtocol(url: string): string | null {
    const match = url.match(/^([a-z]+):/i);
    return match ? match[1].toLowerCase() : null;
  }

  /**
   * Extract domain from URL
   */
  private extractDomain(url: string): string | null {
    const match = url.match(/^[a-z]+:\/\/([^\/]+)/i);
    return match ? match[1].toLowerCase() : null;
  }

  /**
   * Validate domain
   */
  private validateDomain(domain: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check blocked domains
    for (const blockedDomain of this.config.blockedDomains) {
      if (domain.includes(blockedDomain)) {
        errors.push(`Blocked domain: ${blockedDomain}`);
      }
    }

    // Basic domain format validation
    if (!/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(domain)) {
      errors.push('Invalid domain format');
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Validate path
   */
  private validatePath(url: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check for path traversal
    if (url.includes('../') || url.includes('..\\')) {
      errors.push('Path traversal detected');
    }

    // Check for suspicious characters
    if (/[<>\"'&]/.test(url)) {
      errors.push('Suspicious characters detected in URL');
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Sanitize URL
   */
  private sanitizeUrl(url: string): string {
    // Remove any null bytes
    let sanitized = url.replace(/\0/g, '');
    
    // Normalize whitespace
    sanitized = sanitized.trim();
    
    // Ensure proper encoding
    try {
      sanitized = encodeURI(decodeURI(sanitized));
    } catch {
      // If encoding fails, return original
      sanitized = url;
    }

    return sanitized;
  }
}

// Export singleton instance
export const urlValidator = new UrlValidator(); 