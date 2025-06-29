/**
 * Simple File Security Module
 * 
 * Provides basic file security coordination functionality.
 * Focused and minimal - coordinates file security modules.
 */

import { fileValidator } from './file/file_validator';
import { fileOperations } from './file/file_operations';
import { filePermissions } from './file/file_permissions';
import { fileOperationValidator, FileOperation, FileOperationResult } from './file/file_operation_validator';

// ============================================================================
// TYPES AND INTERFACES
// ============================================================================

export interface FileSecurityConfig {
  enablePathValidation: boolean;
  enableOperationValidation: boolean;
  enablePermissions: boolean;
  maxFileSize: number;
  allowedExtensions: string[];
}

export interface FileSecurityResult {
  isAllowed: boolean;
  errors: string[];
  warnings: string[];
  sanitizedPath?: string;
}

// ============================================================================
// FILE SECURITY CLASS
// ============================================================================

export class FileSecurity {
  private config: FileSecurityConfig;

  constructor(config: Partial<FileSecurityConfig> = {}) {
    this.config = {
      enablePathValidation: true,
      enableOperationValidation: true,
      enablePermissions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB
      allowedExtensions: ['.txt', '.md', '.json', '.yaml', '.yml', '.ts', '.js'],
      ...config,
    };
  }

  /**
   * Validate file path
   */
  async validatePath(filePath: string, operation: string = 'read'): Promise<FileSecurityResult> {
    const pathValidation = fileValidator.validatePath(filePath);
    
    if (!pathValidation.isValid) {
      return {
        isAllowed: false,
        errors: pathValidation.errors,
        warnings: [],
      };
    }

    // Operation validation
    if (this.config.enableOperationValidation) {
      const operationValidation = fileOperationValidator.validateOperation({
        operation: operation as any,
        path: filePath,
      });
      
      if (!operationValidation.isAllowed) {
        return {
          isAllowed: false,
          errors: operationValidation.errors,
          warnings: operationValidation.warnings,
          sanitizedPath: operationValidation.sanitizedPath,
        };
      }
    }

    return {
      isAllowed: true,
      errors: [],
      warnings: [],
      sanitizedPath: pathValidation.sanitizedPath,
    };
  }

  /**
   * Safe file read
   */
  async safeRead(filePath: string): Promise<{ content: string; metadata: any }> {
    return fileOperations.safeRead(filePath);
  }

  /**
   * Safe file write
   */
  async safeWrite(filePath: string, content: string): Promise<void> {
    return fileOperations.safeWrite(filePath, content);
  }

  /**
   * Safe file delete
   */
  async safeDelete(filePath: string): Promise<void> {
    return fileOperations.safeDelete(filePath);
  }

  /**
   * Check file permissions
   */
  checkPermissions(filePath: string, operation: string): any {
    return filePermissions.checkPermissions(filePath, operation);
  }

  /**
   * Get configuration
   */
  getConfig(): FileSecurityConfig {
    return { ...this.config };
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<FileSecurityConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
}

// Export singleton instance
export const fileSecurity = new FileSecurity(); 