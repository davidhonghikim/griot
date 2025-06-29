/**
 * Password Validator Module
 * 
 * Provides basic password validation functionality.
 * Focused and minimal - validates password strength.
 */

import * as crypto from 'crypto';

// ============================================================================
// TYPES AND INTERFACES
// ============================================================================

export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
  strength: 'weak' | 'medium' | 'strong';
}

export interface PasswordHashResult {
  hash: string;
  salt: string;
}

// ============================================================================
// PASSWORD VALIDATOR CLASS
// ============================================================================

export class PasswordValidator {
  private minLength: number;
  private commonPasswords: string[];

  constructor(config: { minLength?: number; commonPasswords?: string[] } = {}) {
    this.minLength = config.minLength || 8;
    this.commonPasswords = config.commonPasswords || [
      'password', '123456', '123456789', 'qwerty', 'abc123',
      'password123', 'admin', 'letmein', 'welcome'
    ];
  }

  /**
   * Validate password
   */
  validatePassword(password: string): PasswordValidationResult {
    const errors: string[] = [];

    // Length validation
    if (password.length < this.minLength) {
      errors.push(`Password must be at least ${this.minLength} characters long`);
    }

    // Character requirements
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    // Check against common passwords
    if (this.commonPasswords.includes(password.toLowerCase())) {
      errors.push('Password is too common');
    }

    return {
      isValid: errors.length === 0,
      errors,
      strength: this.calculateStrength(password),
    };
  }

  /**
   * Hash password
   */
  hashPassword(password: string): PasswordHashResult {
    const salt = crypto.randomBytes(32).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');

    return { hash, salt };
  }

  /**
   * Verify password
   */
  verifyPassword(password: string, hash: string, salt: string): boolean {
    const testHash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
    return testHash === hash;
  }

  /**
   * Calculate password strength
   */
  private calculateStrength(password: string): 'weak' | 'medium' | 'strong' {
    let score = 0;

    // Length bonus
    score += Math.min(password.length * 4, 40);

    // Character variety bonus
    if (/[a-z]/.test(password)) score += 10;
    if (/[A-Z]/.test(password)) score += 10;
    if (/\d/.test(password)) score += 10;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score += 15;

    if (score >= 70) return 'strong';
    if (score >= 50) return 'medium';
    return 'weak';
  }
}

// Export singleton instance
export const passwordValidator = new PasswordValidator(); 