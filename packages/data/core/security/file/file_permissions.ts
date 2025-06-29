/**
 * File Permissions Module
 * 
 * Provides file access control and permissions management.
 * Extracted from monolithic file_security.ts for better modularity.
 */

import * as fs from 'fs/promises';
import * as path from 'path';

// ============================================================================
// TYPES AND INTERFACES
// ============================================================================

export interface FilePermissionsConfig {
  defaultPermissions: string;
  restrictedPermissions: string;
  adminPermissions: string;
  enablePermissionValidation: boolean;
  enableOwnershipValidation: boolean;
  allowedOwners: string[];
  restrictedOperations: string[];
  enableAuditLogging: boolean;
}

export interface PermissionCheck {
  operation: 'read' | 'write' | 'delete' | 'execute';
  path: string;
  user?: {
    id: string;
    username: string;
    role: string;
    permissions: string[];
  };
  context?: any;
}

export interface PermissionResult {
  isAllowed: boolean;
  errors: string[];
  warnings: string[];
  requiredPermissions?: string[];
  currentPermissions?: string;
  owner?: string;
  group?: string;
}

export interface FileMetadata {
  permissions: string;
  owner: string;
  group: string;
  size: number;
  modified: Date;
  created: Date;
  isDirectory: boolean;
  isSymlink: boolean;
}

// ============================================================================
// FILE PERMISSIONS CLASS
// ============================================================================

export class FilePermissions {
  private config: FilePermissionsConfig;
  private auditLog: Array<{ timestamp: number; check: PermissionCheck; result: PermissionResult }> = [];

  constructor(config: Partial<FilePermissionsConfig> = {}) {
    this.config = {
      defaultPermissions: '644',
      restrictedPermissions: '600',
      adminPermissions: '755',
      enablePermissionValidation: true,
      enableOwnershipValidation: true,
      allowedOwners: [],
      restrictedOperations: ['execute'],
      enableAuditLogging: true,
      ...config,
    };
  }

  /**
   * Check file permissions for operation
   */
  async checkPermissions(check: PermissionCheck): Promise<PermissionResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      // Get file metadata
      const metadata = await this.getFileMetadata(check.path);
      
      // Check if operation is restricted
      if (this.config.restrictedOperations.includes(check.operation)) {
        errors.push(`Operation '${check.operation}' is restricted`);
      }

      // Check ownership if enabled
      if (this.config.enableOwnershipValidation && check.user) {
        const ownershipCheck = this.checkOwnership(metadata, check.user);
        if (!ownershipCheck.isAllowed) {
          errors.push(...ownershipCheck.errors);
        }
      }

      // Check permissions if enabled
      if (this.config.enablePermissionValidation) {
        const permissionCheck = this.checkFilePermissions(metadata, check.operation, check.user);
        if (!permissionCheck.isAllowed) {
          errors.push(...permissionCheck.errors);
        }
        warnings.push(...permissionCheck.warnings);
      }

      const result: PermissionResult = {
        isAllowed: errors.length === 0,
        errors,
        warnings,
        currentPermissions: metadata.permissions,
        owner: metadata.owner,
        group: metadata.group,
      };

      this.logAudit(check, result);
      return result;

    } catch (error) {
      const result: PermissionResult = {
        isAllowed: false,
        errors: [`Permission check failed: ${error}`],
        warnings: [],
      };
      
      this.logAudit(check, result);
      return result;
    }
  }

  /**
   * Set file permissions
   */
  async setPermissions(filePath: string, permissions: string, user?: any): Promise<boolean> {
    try {
      // Check if user has permission to change permissions
      const check: PermissionCheck = {
        operation: 'write',
        path: filePath,
        user,
      };

      const permissionCheck = await this.checkPermissions(check);
      if (!permissionCheck.isAllowed) {
        throw new Error(`Cannot set permissions: ${permissionCheck.errors.join(', ')}`);
      }

      // Set permissions
      await fs.chmod(filePath, parseInt(permissions, 8));
      return true;

    } catch (error) {
      console.error(`Failed to set permissions: ${error}`);
      return false;
    }
  }

  /**
   * Get file metadata
   */
  async getFileMetadata(filePath: string): Promise<FileMetadata> {
    try {
      const stats = await fs.stat(filePath);
      
      // Note: In a real implementation, you would get actual owner/group info
      // This is a simplified version
      return {
        permissions: this.formatPermissions(stats.mode),
        owner: 'unknown', // Would be actual owner in real implementation
        group: 'unknown', // Would be actual group in real implementation
        size: stats.size,
        modified: stats.mtime,
        created: stats.birthtime,
        isDirectory: stats.isDirectory(),
        isSymlink: stats.isSymbolicLink(),
      };
    } catch (error) {
      throw new Error(`Could not get file metadata: ${error}`);
    }
  }

  /**
   * Check file ownership
   */
  private checkOwnership(metadata: FileMetadata, user: any): { isAllowed: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check if user is in allowed owners list
    if (this.config.allowedOwners.length > 0) {
      const isOwner = this.config.allowedOwners.includes(user.username) || 
                     this.config.allowedOwners.includes(user.id);
      
      if (!isOwner) {
        errors.push(`User '${user.username}' is not in allowed owners list`);
      }
    }

    // Check if user owns the file (simplified check)
    if (metadata.owner !== 'unknown' && metadata.owner !== user.username) {
      errors.push(`User '${user.username}' does not own the file`);
    }

    return {
      isAllowed: errors.length === 0,
      errors,
    };
  }

  /**
   * Check file permissions
   */
  private checkFilePermissions(metadata: FileMetadata, operation: string, user?: any): { isAllowed: boolean; errors: string[]; warnings: string[] } {
    const errors: string[] = [];
    const warnings: string[] = [];

    const permissions = parseInt(metadata.permissions, 8);
    
    // Check read permissions
    if (operation === 'read') {
      const canRead = (permissions & 0o444) !== 0;
      if (!canRead) {
        errors.push('File does not have read permissions');
      }
    }

    // Check write permissions
    if (operation === 'write') {
      const canWrite = (permissions & 0o222) !== 0;
      if (!canWrite) {
        errors.push('File does not have write permissions');
      }
    }

    // Check execute permissions
    if (operation === 'execute') {
      const canExecute = (permissions & 0o111) !== 0;
      if (!canExecute) {
        errors.push('File does not have execute permissions');
      }
    }

    // Check delete permissions (requires write permission on directory)
    if (operation === 'delete') {
      const canWrite = (permissions & 0o222) !== 0;
      if (!canWrite) {
        errors.push('File does not have delete permissions');
      }
    }

    // Check for overly permissive files
    if (permissions === 0o777) {
      warnings.push('File has overly permissive permissions (777)');
    }

    return {
      isAllowed: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Format permissions to string
   */
  private formatPermissions(mode: number): string {
    return (mode & 0o777).toString(8);
  }

  /**
   * Log audit entry
   */
  private logAudit(check: PermissionCheck, result: PermissionResult): void {
    if (this.config.enableAuditLogging) {
      this.auditLog.push({
        timestamp: Date.now(),
        check,
        result,
      });
    }
  }

  /**
   * Get configuration
   */
  getConfig(): FilePermissionsConfig {
    return { ...this.config };
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<FilePermissionsConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Get audit log
   */
  getAuditLog(): Array<{ timestamp: number; check: PermissionCheck; result: PermissionResult }> {
    return [...this.auditLog];
  }

  /**
   * Clear audit log
   */
  clearAuditLog(): void {
    this.auditLog = [];
  }

  /**
   * Check if user has admin permissions
   */
  hasAdminPermissions(user?: any): boolean {
    if (!user) return false;
    
    return user.role === 'admin' || 
           user.permissions.includes('admin') ||
           this.config.allowedOwners.includes(user.username);
  }
}

// Export singleton instance
export const filePermissions = new FilePermissions(); 