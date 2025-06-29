/**
 * Data Security Module Index
 * 
 * Exports all data security components for easy importing.
 */

export { dataEncryption, DataEncryption, EncryptionResult, DecryptionResult } from './encryption';

// Re-export types for convenience
export type {
  EncryptionResult,
  DecryptionResult,
} from './encryption'; 