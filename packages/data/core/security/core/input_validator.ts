/**
 * Simple Input Validator Module
 * 
 * Provides basic input validation functionality.
 * Focused and minimal - coordinates validation modules.
 */

import { ValidationRules, ValidationRule, ValidationResult, ValidationContext } from './validation_rules';
import { SecurityPatterns } from './security_patterns';
import { SanitizationUtils } from './sanitization_utils';

// ============================================================================
// TYPES AND INTERFACES
// ============================================================================

export interface SecurityConfig {
  maxInputLength: number;
  enableSanitization: boolean;
  enableStrictMode: boolean;
}

// ============================================================================
// INPUT VALIDATOR CLASS
// ============================================================================

export class InputValidator {
  private config: SecurityConfig;

  constructor(config: Partial<SecurityConfig> = {}) {
    this.config = {
      maxInputLength: 10000,
      enableSanitization: true,
      enableStrictMode: false,
      ...config,
    };
  }

  /**
   * Validate input with rules
   */
  validate(value: any, rules: ValidationRule[], context?: ValidationContext): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    let sanitizedValue = value;

    // Sort rules by priority (highest first)
    const sortedRules = [...rules].sort((a, b) => b.priority - a.priority);

    // Apply each rule
    for (const rule of sortedRules) {
      const result = rule.validate(value, context);
      if (!result.isValid) {
        errors.push(...result.errors);
      }
      if (result.warnings) {
        warnings.push(...result.warnings);
      }
      if (result.sanitizedValue !== undefined) {
        sanitizedValue = result.sanitizedValue;
      }
    }

    // Security pattern checking
    if (typeof value === 'string') {
      const matchingPatterns = SecurityPatterns.getMatchingPatterns(value);
      if (matchingPatterns.length > 0) {
        warnings.push(`Security patterns detected: ${matchingPatterns.length} threats`);
      }
    }

    // Sanitization
    if (this.config.enableSanitization && SanitizationUtils.needsSanitization(value)) {
      sanitizedValue = SanitizationUtils.sanitizeObject(value);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      sanitizedValue,
    };
  }

  /**
   * Quick validation helpers
   */
  validateString(value: any, maxLength?: number): ValidationResult {
    const rules = [
      ValidationRules.typeValidation('string'),
      ValidationRules.lengthValidation(0, maxLength || this.config.maxInputLength),
    ];
    return this.validate(value, rules);
  }

  validateNumber(value: any, min?: number, max?: number): ValidationResult {
    const rules = [
      ValidationRules.typeValidation('number'),
      ...(min !== undefined || max !== undefined ? [ValidationRules.rangeValidation(min || -Infinity, max || Infinity)] : []),
    ];
    return this.validate(value, rules);
  }

  validateRequired(value: any): ValidationResult {
    return this.validate(value, [ValidationRules.requiredValidation()]);
  }

  /**
   * Get configuration
   */
  getConfig(): SecurityConfig {
    return { ...this.config };
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<SecurityConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
}

// Export singleton instance
export const inputValidator = new InputValidator(); 