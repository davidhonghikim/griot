/**
 * Security Patterns Module
 * 
 * Provides basic security patterns for input validation.
 * Focused and minimal - just security patterns.
 */

// ============================================================================
// SECURITY PATTERNS
// ============================================================================

export class SecurityPatterns {
  static readonly SQL_INJECTION = /(\b(union|select|insert|update|delete|drop|create|alter|exec|execute)\b)/i;
  static readonly XSS_SCRIPT = /<script[^>]*>.*?<\/script>/gi;
  static readonly XSS_JAVASCRIPT = /javascript:/gi;
  static readonly XSS_EVENTS = /on\w+\s*=/gi;
  static readonly COMMAND_INJECTION = /[;&|`$(){}[\]]/g;
  static readonly PATH_TRAVERSAL = /\.\.\//g;
  static readonly HTML_ENTITIES = /&[a-z0-9]+;/gi;
  static readonly SUSPICIOUS_URLS = /https?:\/\/(?!localhost|127\.0\.0\.1)[^\s]+/gi;
  static readonly NULL_BYTES = /\0/g;
  static readonly SUSPICIOUS_CHARS = /[<>\"'&]/g;

  /**
   * Get all security patterns
   */
  static getAllPatterns(): RegExp[] {
    return [
      this.SQL_INJECTION,
      this.XSS_SCRIPT,
      this.XSS_JAVASCRIPT,
      this.XSS_EVENTS,
      this.COMMAND_INJECTION,
      this.PATH_TRAVERSAL,
      this.HTML_ENTITIES,
      this.SUSPICIOUS_URLS,
      this.NULL_BYTES,
      this.SUSPICIOUS_CHARS,
    ];
  }

  /**
   * Get patterns by category
   */
  static getPatternsByCategory(category: 'sql' | 'xss' | 'injection' | 'traversal' | 'all'): RegExp[] {
    switch (category) {
      case 'sql':
        return [this.SQL_INJECTION];
      case 'xss':
        return [this.XSS_SCRIPT, this.XSS_JAVASCRIPT, this.XSS_EVENTS];
      case 'injection':
        return [this.COMMAND_INJECTION];
      case 'traversal':
        return [this.PATH_TRAVERSAL];
      case 'all':
      default:
        return this.getAllPatterns();
    }
  }

  /**
   * Check if string matches any security pattern
   */
  static hasSecurityThreat(input: string): boolean {
    return this.getAllPatterns().some(pattern => pattern.test(input));
  }

  /**
   * Get matching patterns for input
   */
  static getMatchingPatterns(input: string): RegExp[] {
    return this.getAllPatterns().filter(pattern => pattern.test(input));
  }
} 