/**
 * File Security Module Index
 * 
 * Exports all file security components for easy importing.
 */

export { fileValidator } from './file_validator';
export { fileOperations } from './file_operations';
export { filePermissions } from './file_permissions';
export { fileMonitor } from './file_monitor';
export { fileOperationValidator, FileOperationValidator, FileOperation, FileOperationResult, FileOperationConfig } from './file_operation_validator';

// Re-export types for convenience
export type {
  FileOperation,
  FileOperationResult,
  FileOperationConfig,
} from './file_operation_validator'; 