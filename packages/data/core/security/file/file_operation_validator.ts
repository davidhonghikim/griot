/**
 * File Operation Validator Module
 * 
 * Provides basic file operation validation functionality.
 * Focused and minimal - validates file operations.
 */

import { ValidationResult, ValidationRules } from '../core/validation_rules';
import { SecurityPatterns } from '../core/security_patterns';

// ============================================================================
// TYPES AND INTERFACES
// ============================================================================

export interface FileOperation {
  operation: 'read' | 'write' | 'delete' | 'list' | 'create';
  path: string;
  user?: any;
  context?: any;
}

export interface FileOperationResult {
  isAllowed: boolean;
  errors: string[];
  warnings: string[];
  sanitizedPath?: string;
}

export interface FileOperationConfig {
  allowedOperations: string[];
  maxFileSize: number;
  allowedExtensions: string[];
  blockedExtensions: string[];
  allowHiddenFiles: boolean;
  allowSymlinks: boolean;
}

// ============================================================================
// FILE OPERATION VALIDATOR CLASS
// ============================================================================

export class FileOperationValidator {
  private config: FileOperationConfig;

  constructor(config: Partial<FileOperationConfig> = {}) {
    this.config = {
      allowedOperations: ['read', 'write', 'delete', 'list', 'create'],
      maxFileSize: 10 * 1024 * 1024, // 10MB
      allowedExtensions: ['.txt', '.md', '.json', '.yaml', '.yml', '.ts', '.js'],
      blockedExtensions: ['.exe', '.bat', '.cmd', '.sh', '.php', '.asp', '.jsp'],
      allowHiddenFiles: false,
      allowSymlinks: false,
      ...config,
    };
  }

  /**
   * Validate file operation
   */
  validateOperation(operation: FileOperation): FileOperationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Operation type validation
    const operationValidation = this.validateOperationType(operation.operation);
    if (!operationValidation.isValid) {
      errors.push(...operationValidation.errors);
    }

    // Path validation
    const pathValidation = this.validatePath(operation.path);
    if (!pathValidation.isValid) {
      errors.push(...pathValidation.errors);
    }

    // Operation-specific validation
    const specificValidation = this.validateSpecificOperation(operation);
    if (!specificValidation.isValid) {
      errors.push(...specificValidation.errors);
    }

    return {
      isAllowed: errors.length === 0,
      errors,
      warnings,
      sanitizedPath: pathValidation.sanitizedValue,
    };
  }

  /**
   * Validate operation type
   */
  private validateOperationType(operation: string): ValidationResult {
    return ValidationRules.enumValidation(this.config.allowedOperations).validate(operation);
  }

  /**
   * Validate file path
   */
  private validatePath(filePath: string): ValidationResult {
    const errors: string[] = [];
    let sanitizedPath = filePath;

    // Basic path validation
    if (typeof filePath !== 'string') {
      errors.push('Path must be a string');
      return { isValid: false, errors };
    }

    if (filePath.length === 0) {
      errors.push('Path cannot be empty');
      return { isValid: false, errors };
    }

    // Path traversal protection
    if (filePath.includes('..')) {
      errors.push('Path traversal not allowed');
    }

    // Hidden file validation
    if (!this.config.allowHiddenFiles && filePath.includes('/.')) {
      errors.push('Hidden files not allowed');
    }

    // Extension validation
    const extension = this.getFileExtension(filePath);
    if (extension && this.config.blockedExtensions.includes(extension)) {
      errors.push(`File extension not allowed: ${extension}`);
    }

    // Security pattern checking
    if (SecurityPatterns.hasSecurityThreat(filePath)) {
      warnings.push('Security patterns detected in file path');
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedValue: sanitizedPath,
    };
  }

  /**
   * Validate specific operation
   */
  private validateSpecificOperation(operation: FileOperation): ValidationResult {
    const errors: string[] = [];

    switch (operation.operation) {
      case 'write':
        // Additional write validations could go here
        break;
      case 'delete':
        // Additional delete validations could go here
        break;
      case 'create':
        // Additional create validations could go here
        break;
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Get file extension
   */
  private getFileExtension(filePath: string): string | null {
    const lastDotIndex = filePath.lastIndexOf('.');
    if (lastDotIndex === -1) return null;
    return filePath.substring(lastDotIndex);
  }
}

// Export singleton instance
export const fileOperationValidator = new FileOperationValidator(); 