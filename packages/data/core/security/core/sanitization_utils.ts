/**
 * Sanitization Utils Module
 * 
 * Provides basic sanitization utilities for input validation.
 * Focused and minimal - just sanitization functions.
 */

import { SecurityPatterns } from './security_patterns';

// ============================================================================
// SANITIZATION UTILITIES
// ============================================================================

export class SanitizationUtils {
  /**
   * Sanitize a string input
   */
  static sanitizeString(input: string): string {
    if (typeof input !== 'string') {
      return input;
    }

    let sanitized = input;

    // Remove null bytes
    sanitized = sanitized.replace(/\0/g, '');

    // Remove script tags
    sanitized = sanitized.replace(/<script[^>]*>.*?<\/script>/gi, '');

    // Remove javascript: protocol
    sanitized = sanitized.replace(/javascript:/gi, '');

    // Remove event handlers
    sanitized = sanitized.replace(/on\w+\s*=/gi, '');

    // Escape HTML entities
    sanitized = sanitized
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');

    return sanitized;
  }

  /**
   * Sanitize an object recursively
   */
  static sanitizeObject(obj: any): any {
    if (obj === null || obj === undefined) {
      return obj;
    }

    if (typeof obj === 'string') {
      return this.sanitizeString(obj);
    }

    if (Array.isArray(obj)) {
      return obj.map(item => this.sanitizeObject(item));
    }

    if (typeof obj === 'object') {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(obj)) {
        sanitized[key] = this.sanitizeObject(value);
      }
      return sanitized;
    }

    return obj;
  }

  /**
   * Check if input needs sanitization
   */
  static needsSanitization(input: any): boolean {
    if (typeof input === 'string') {
      return SecurityPatterns.hasSecurityThreat(input);
    }
    return false;
  }
} 