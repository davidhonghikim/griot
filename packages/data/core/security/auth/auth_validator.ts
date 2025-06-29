/**
 * Auth Validator Module
 * 
 * Provides basic authentication validation functionality.
 * Focused and minimal - validates auth requests.
 */

import { ValidationResult, ValidationRules } from '../core/validation_rules';
import { SecurityPatterns } from '../core/security_patterns';

// ============================================================================
// TYPES AND INTERFACES
// ============================================================================

export interface AuthValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface LoginRequest {
  username: string;
  password: string;
  ipAddress: string;
  userAgent: string;
  rememberMe?: boolean;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  ipAddress: string;
  userAgent: string;
}

export interface AuthConfig {
  passwordMinLength: number;
  passwordMaxLength: number;
  requireSpecialChars: boolean;
  requireNumbers: boolean;
  requireUppercase: boolean;
  requireLowercase: boolean;
  maxUsernameLength: number;
  maxEmailLength: number;
}

// ============================================================================
// AUTH VALIDATOR CLASS
// ============================================================================

export class AuthValidator {
  private config: AuthConfig;

  constructor(config: Partial<AuthConfig> = {}) {
    this.config = {
      passwordMinLength: 8,
      passwordMaxLength: 128,
      requireSpecialChars: true,
      requireNumbers: true,
      requireUppercase: true,
      requireLowercase: true,
      maxUsernameLength: 50,
      maxEmailLength: 255,
      ...config,
    };
  }

  /**
   * Validate login request
   */
  validateLogin(request: LoginRequest): AuthValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Username validation
    const usernameValidation = this.validateUsername(request.username);
    if (!usernameValidation.isValid) {
      errors.push(...usernameValidation.errors);
    }

    // Password validation
    const passwordValidation = this.validatePassword(request.password);
    if (!passwordValidation.isValid) {
      errors.push(...passwordValidation.errors);
    }

    // IP address validation
    const ipValidation = this.validateIPAddress(request.ipAddress);
    if (!ipValidation.isValid) {
      errors.push(...ipValidation.errors);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Validate registration request
   */
  validateRegistration(request: RegisterRequest): AuthValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Username validation
    const usernameValidation = this.validateUsername(request.username);
    if (!usernameValidation.isValid) {
      errors.push(...usernameValidation.errors);
    }

    // Email validation
    const emailValidation = this.validateEmail(request.email);
    if (!emailValidation.isValid) {
      errors.push(...emailValidation.errors);
    }

    // Password validation
    const passwordValidation = this.validatePassword(request.password);
    if (!passwordValidation.isValid) {
      errors.push(...passwordValidation.errors);
    }

    // Password confirmation
    if (request.password !== request.confirmPassword) {
      errors.push('Passwords do not match');
    }

    // IP address validation
    const ipValidation = this.validateIPAddress(request.ipAddress);
    if (!ipValidation.isValid) {
      errors.push(...ipValidation.errors);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Validate username
   */
  private validateUsername(username: string): ValidationResult {
    const errors: string[] = [];

    // Type validation
    if (typeof username !== 'string') {
      errors.push('Username must be a string');
      return { isValid: false, errors };
    }

    // Length validation
    if (username.length < 3) {
      errors.push('Username must be at least 3 characters long');
    }
    if (username.length > this.config.maxUsernameLength) {
      errors.push(`Username must be no more than ${this.config.maxUsernameLength} characters long`);
    }

    // Format validation
    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      errors.push('Username can only contain letters, numbers, underscores, and hyphens');
    }

    // Security pattern checking
    if (SecurityPatterns.hasSecurityThreat(username)) {
      errors.push('Username contains suspicious patterns');
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Validate email
   */
  private validateEmail(email: string): ValidationResult {
    const errors: string[] = [];

    // Type validation
    if (typeof email !== 'string') {
      errors.push('Email must be a string');
      return { isValid: false, errors };
    }

    // Length validation
    if (email.length > this.config.maxEmailLength) {
      errors.push(`Email must be no more than ${this.config.maxEmailLength} characters long`);
    }

    // Format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.push('Invalid email format');
    }

    // Security pattern checking
    if (SecurityPatterns.hasSecurityThreat(email)) {
      errors.push('Email contains suspicious patterns');
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Validate password
   */
  private validatePassword(password: string): ValidationResult {
    const errors: string[] = [];

    // Type validation
    if (typeof password !== 'string') {
      errors.push('Password must be a string');
      return { isValid: false, errors };
    }

    // Length validation
    if (password.length < this.config.passwordMinLength) {
      errors.push(`Password must be at least ${this.config.passwordMinLength} characters long`);
    }
    if (password.length > this.config.passwordMaxLength) {
      errors.push(`Password must be no more than ${this.config.passwordMaxLength} characters long`);
    }

    // Complexity requirements
    if (this.config.requireUppercase && !/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (this.config.requireLowercase && !/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (this.config.requireNumbers && !/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    if (this.config.requireSpecialChars && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    // Security pattern checking
    if (SecurityPatterns.hasSecurityThreat(password)) {
      errors.push('Password contains suspicious patterns');
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Validate IP address
   */
  private validateIPAddress(ipAddress: string): ValidationResult {
    const errors: string[] = [];

    // Type validation
    if (typeof ipAddress !== 'string') {
      errors.push('IP address must be a string');
      return { isValid: false, errors };
    }

    // Format validation
    const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    if (!ipRegex.test(ipAddress)) {
      errors.push('Invalid IP address format');
    }

    return { isValid: errors.length === 0, errors };
  }
}

// Export singleton instance
export const authValidator = new AuthValidator(); 