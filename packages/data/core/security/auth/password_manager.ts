/**
 * Password Manager Module
 * 
 * Provides basic password management functionality.
 * Focused and minimal - manages passwords.
 */

import * as crypto from 'crypto';

// ============================================================================
// TYPES AND INTERFACES
// ============================================================================

export interface PasswordHash {
  hash: string;
  salt: string;
}

export interface PasswordConfig {
  saltRounds: number;
  hashAlgorithm: string;
  keyLength: number;
}

// ============================================================================
// PASSWORD MANAGER CLASS
// ============================================================================

export class PasswordManager {
  private config: PasswordConfig;

  constructor(config: Partial<PasswordConfig> = {}) {
    this.config = {
      saltRounds: 10,
      hashAlgorithm: 'sha256',
      keyLength: 64,
      ...config,
    };
  }

  /**
   * Hash a password
   */
  hashPassword(password: string): PasswordHash {
    const salt = this.generateSalt();
    const hash = this.hashWithSalt(password, salt);
    
    return {
      hash,
      salt,
    };
  }

  /**
   * Verify a password against a hash
   */
  verifyPassword(password: string, hash: string, salt: string): boolean {
    const computedHash = this.hashWithSalt(password, salt);
    return computedHash === hash;
  }

  /**
   * Generate a random salt
   */
  private generateSalt(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Hash password with salt
   */
  private hashWithSalt(password: string, salt: string): string {
    const hash = crypto.pbkdf2Sync(
      password,
      salt,
      this.config.saltRounds,
      this.config.keyLength,
      this.config.hashAlgorithm
    );
    return hash.toString('hex');
  }

  /**
   * Generate a secure random password
   */
  generateSecurePassword(length: number = 16): string {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    
    for (let i = 0; i < length; i++) {
      const randomIndex = crypto.randomInt(0, charset.length);
      password += charset[randomIndex];
    }
    
    return password;
  }

  /**
   * Check password strength
   */
  checkPasswordStrength(password: string): {
    score: number;
    feedback: string[];
  } {
    const feedback: string[] = [];
    let score = 0;

    // Length check
    if (password.length >= 8) {
      score += 1;
    } else {
      feedback.push('Password should be at least 8 characters long');
    }

    // Character variety checks
    if (/[a-z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Password should contain lowercase letters');
    }

    if (/[A-Z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Password should contain uppercase letters');
    }

    if (/\d/.test(password)) {
      score += 1;
    } else {
      feedback.push('Password should contain numbers');
    }

    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Password should contain special characters');
    }

    return {
      score,
      feedback,
    };
  }
}

// Export singleton instance
export const passwordManager = new PasswordManager(); 