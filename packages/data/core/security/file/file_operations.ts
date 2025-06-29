/**
 * File Operations Module
 * 
 * Provides safe file operations functionality.
 * Focused and minimal - safe read/write operations.
 */

import { fileValidator } from './file_validator';
import * as fs from 'fs/promises';

// ============================================================================
// TYPES AND INTERFACES
// ============================================================================

export interface FileOperationResult {
  success: boolean;
  errors: string[];
  data?: any;
}

// ============================================================================
// FILE OPERATIONS CLASS
// ============================================================================

export class FileOperations {
  private maxFileSize: number;

  constructor(config: { maxFileSize?: number } = {}) {
    this.maxFileSize = config.maxFileSize || 10 * 1024 * 1024; // 10MB
  }

  /**
   * Safe file read operation
   */
  async safeRead(filePath: string): Promise<FileOperationResult> {
    try {
      // Validate path
      const validation = fileValidator.validatePath(filePath);
      if (!validation.isValid) {
        return {
          success: false,
          errors: validation.errors,
        };
      }

      // Check file size
      const stats = await fs.stat(validation.sanitizedPath!);
      if (stats.size > this.maxFileSize) {
        return {
          success: false,
          errors: [`File size exceeds maximum allowed size: ${this.maxFileSize} bytes`],
        };
      }

      // Read file
      const content = await fs.readFile(validation.sanitizedPath!, 'utf-8');
      
      return {
        success: true,
        errors: [],
        data: content,
      };

    } catch (error) {
      return {
        success: false,
        errors: [`File read failed: ${error}`],
      };
    }
  }

  /**
   * Safe file write operation
   */
  async safeWrite(filePath: string, content: string): Promise<FileOperationResult> {
    try {
      // Validate path
      const validation = fileValidator.validatePath(filePath);
      if (!validation.isValid) {
        return {
          success: false,
          errors: validation.errors,
        };
      }

      // Validate content size
      if (content.length > this.maxFileSize) {
        return {
          success: false,
          errors: [`Content size exceeds maximum allowed size: ${this.maxFileSize} bytes`],
        };
      }

      // Write file
      await fs.writeFile(validation.sanitizedPath!, content, 'utf-8');
      
      return {
        success: true,
        errors: [],
      };

    } catch (error) {
      return {
        success: false,
        errors: [`File write failed: ${error}`],
      };
    }
  }

  /**
   * Safe file delete operation
   */
  async safeDelete(filePath: string): Promise<FileOperationResult> {
    try {
      // Validate path
      const validation = fileValidator.validatePath(filePath);
      if (!validation.isValid) {
        return {
          success: false,
          errors: validation.errors,
        };
      }

      // Delete file
      await fs.unlink(validation.sanitizedPath!);
      
      return {
        success: true,
        errors: [],
      };

    } catch (error) {
      return {
        success: false,
        errors: [`File delete failed: ${error}`],
      };
    }
  }
}

// Export singleton instance
export const fileOperations = new FileOperations(); 