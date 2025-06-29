/**
 * Data Encryption Module
 * 
 * Provides basic data encryption functionality.
 * Focused and minimal - encrypts and decrypts data.
 */

import * as crypto from 'crypto';

// ============================================================================
// TYPES AND INTERFACES
// ============================================================================

export interface EncryptionResult {
  encrypted: string;
  iv: string;
  algorithm: string;
}

export interface DecryptionResult {
  decrypted: string;
  success: boolean;
  error?: string;
}

// ============================================================================
// DATA ENCRYPTION CLASS
// ============================================================================

export class DataEncryption {
  private algorithm: string;
  private keyLength: number;

  constructor(config: { algorithm?: string; keyLength?: number } = {}) {
    this.algorithm = config.algorithm || 'aes-256-gcm';
    this.keyLength = config.keyLength || 32;
  }

  /**
   * Encrypt data
   */
  encrypt(data: string, key: string): EncryptionResult {
    try {
      // Generate IV
      const iv = crypto.randomBytes(16);
      
      // Create cipher
      const cipher = crypto.createCipher(this.algorithm, key);
      cipher.setAutoPadding(true);
      
      // Encrypt data
      let encrypted = cipher.update(data, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      
      return {
        encrypted,
        iv: iv.toString('hex'),
        algorithm: this.algorithm,
      };
    } catch (error) {
      throw new Error(`Encryption failed: ${error}`);
    }
  }

  /**
   * Decrypt data
   */
  decrypt(encryptedData: string, key: string, iv: string): DecryptionResult {
    try {
      // Create decipher
      const decipher = crypto.createDecipher(this.algorithm, key);
      decipher.setAutoPadding(true);
      
      // Decrypt data
      let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      
      return {
        decrypted,
        success: true,
      };
    } catch (error) {
      return {
        decrypted: '',
        success: false,
        error: `Decryption failed: ${error}`,
      };
    }
  }

  /**
   * Generate random key
   */
  generateKey(): string {
    return crypto.randomBytes(this.keyLength).toString('hex');
  }

  /**
   * Hash data (one-way)
   */
  hash(data: string, algorithm: string = 'sha256'): string {
    return crypto.createHash(algorithm).update(data).digest('hex');
  }
}

// Export singleton instance
export const dataEncryption = new DataEncryption(); 