/**
 * File Validator Module
 * 
 * Provides basic file path validation functionality.
 * Focused and minimal - validates paths for security.
 */

import { ValidationResult, ValidationRules, SecurityPatterns } from '../core/input_validator';

// ============================================================================
// TYPES AND INTERFACES
// ============================================================================

export interface PathValidationResult {
  isValid: boolean;
  errors: string[];
  sanitizedPath?: string;
}

// ============================================================================
// FILE VALIDATOR CLASS
// ============================================================================

export class FileValidator {
  private blockedExtensions: string[];
  private blockedDirectories: string[];

  constructor(config: { blockedExtensions?: string[]; blockedDirectories?: string[] } = {}) {
    this.blockedExtensions = config.blockedExtensions || ['.exe', '.bat', '.cmd', '.sh', '.php'];
    this.blockedDirectories = config.blockedDirectories || ['/etc', '/var', '/usr', '/bin', '/sbin'];
  }

  /**
   * Validate file path for security
   */
  validatePath(filePath: string): PathValidationResult {
    const errors: string[] = [];

    // Basic path validation
    const pathValidation = this.validateBasicPath(filePath);
    if (!pathValidation.isValid) {
      errors.push(...pathValidation.errors);
    }

    // Path traversal protection
    const traversalValidation = this.validatePathTraversal(filePath);
    if (!traversalValidation.isValid) {
      errors.push(...traversalValidation.errors);
    }

    // Extension validation
    const extensionValidation = this.validateExtension(filePath);
    if (!extensionValidation.isValid) {
      errors.push(...extensionValidation.errors);
    }

    // Directory validation
    const directoryValidation = this.validateDirectory(filePath);
    if (!directoryValidation.isValid) {
      errors.push(...directoryValidation.errors);
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedPath: errors.length === 0 ? this.sanitizePath(filePath) : undefined,
    };
  }

  /**
   * Validate basic path structure
   */
  private validateBasicPath(filePath: string): ValidationResult {
    const rules = [
      ValidationRules.requiredValidation(),
      ValidationRules.lengthValidation(1, 4096),
      ValidationRules.patternValidation(SecurityPatterns.PATH_TRAVERSAL, 'Path traversal detected'),
    ];

    return this.validateWithRules(filePath, rules);
  }

  /**
   * Validate path traversal protection
   */
  private validatePathTraversal(filePath: string): ValidationResult {
    const dangerousPatterns = ['../', '..\\', '..%2f', '..%5c'];
    
    for (const pattern of dangerousPatterns) {
      if (filePath.toLowerCase().includes(pattern)) {
        return {
          isValid: false,
          errors: [`Path traversal detected: ${pattern}`],
          sanitizedValue: undefined,
        };
      }
    }

    return { isValid: true, errors: [], sanitizedValue: filePath };
  }

  /**
   * Validate file extension
   */
  private validateExtension(filePath: string): ValidationResult {
    const extension = filePath.toLowerCase().split('.').pop();
    
    if (extension && this.blockedExtensions.includes(`.${extension}`)) {
      return {
        isValid: false,
        errors: [`Blocked file extension: .${extension}`],
        sanitizedValue: undefined,
      };
    }

    return { isValid: true, errors: [], sanitizedValue: filePath };
  }

  /**
   * Validate directory access
   */
  private validateDirectory(filePath: string): ValidationResult {
    for (const blockedDir of this.blockedDirectories) {
      if (filePath.includes(blockedDir)) {
        return {
          isValid: false,
          errors: [`Access to directory not allowed: ${blockedDir}`],
          sanitizedValue: undefined,
        };
      }
    }

    return { isValid: true, errors: [], sanitizedValue: filePath };
  }

  /**
   * Sanitize file path
   */
  private sanitizePath(filePath: string): string {
    return filePath.replace(/\\/g, '/').replace(/\/+/g, '/');
  }

  /**
   * Validate with rules
   */
  private validateWithRules(value: any, rules: any[]): ValidationResult {
    for (const rule of rules) {
      const result = rule(value);
      if (!result.isValid) {
        return result;
      }
    }
    return { isValid: true, errors: [], sanitizedValue: value };
  }
}

// Export singleton instance
export const fileValidator = new FileValidator(); 