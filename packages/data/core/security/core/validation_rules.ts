/**
 * Validation Rules Module
 * 
 * Provides basic validation rules for input validation.
 * Focused and minimal - just validation rules.
 */

// ============================================================================
// TYPES AND INTERFACES
// ============================================================================

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  sanitizedValue?: any;
  warnings?: string[];
}

export interface ValidationRule {
  name: string;
  validate: (value: any, context?: ValidationContext) => ValidationResult;
  priority: number;
}

export interface ValidationContext {
  fieldName?: string;
  dataType?: string;
  constraints?: Record<string, any>;
  user?: any;
  session?: any;
  request?: any;
}

// ============================================================================
// VALIDATION RULES
// ============================================================================

export class ValidationRules {
  /**
   * Type validation rule
   */
  static typeValidation(expectedType: string): ValidationRule {
    return {
      name: 'type_validation',
      priority: 1,
      validate: (value: any, context?: ValidationContext): ValidationResult => {
        const actualType = typeof value;
        if (actualType !== expectedType) {
          return {
            isValid: false,
            errors: [`Invalid type: expected ${expectedType}, got ${actualType}`]
          };
        }
        return { isValid: true, errors: [] };
      }
    };
  }

  /**
   * Length validation rule
   */
  static lengthValidation(minLength: number, maxLength: number): ValidationRule {
    return {
      name: 'length_validation',
      priority: 2,
      validate: (value: any, context?: ValidationContext): ValidationResult => {
        if (typeof value !== 'string') {
          return { isValid: false, errors: ['Value must be a string for length validation'] };
        }

        const length = value.length;
        if (length < minLength || length > maxLength) {
          return {
            isValid: false,
            errors: [`Length out of range: ${length} (min: ${minLength}, max: ${maxLength})`]
          };
        }
        return { isValid: true, errors: [] };
      }
    };
  }

  /**
   * Pattern validation rule
   */
  static patternValidation(pattern: RegExp, description: string): ValidationRule {
    return {
      name: 'pattern_validation',
      priority: 3,
      validate: (value: any, context?: ValidationContext): ValidationResult => {
        if (typeof value !== 'string') {
          return { isValid: false, errors: ['Value must be a string for pattern validation'] };
        }

        if (pattern.test(value)) {
          return {
            isValid: false,
            errors: [`Pattern validation failed: ${description}`]
          };
        }
        return { isValid: true, errors: [] };
      }
    };
  }

  /**
   * Range validation rule
   */
  static rangeValidation(min: number, max: number): ValidationRule {
    return {
      name: 'range_validation',
      priority: 2,
      validate: (value: any, context?: ValidationContext): ValidationResult => {
        if (typeof value !== 'number' || isNaN(value)) {
          return { isValid: false, errors: ['Value must be a valid number'] };
        }

        if (value < min || value > max) {
          return {
            isValid: false,
            errors: [`Value out of range: ${value} (min: ${min}, max: ${max})`]
          };
        }
        return { isValid: true, errors: [] };
      }
    };
  }

  /**
   * Enum validation rule
   */
  static enumValidation(allowedValues: any[]): ValidationRule {
    return {
      name: 'enum_validation',
      priority: 2,
      validate: (value: any, context?: ValidationContext): ValidationResult => {
        if (!allowedValues.includes(value)) {
          return {
            isValid: false,
            errors: [`Invalid value: ${value}. Allowed values: ${allowedValues.join(', ')}`]
          };
        }
        return { isValid: true, errors: [] };
      }
    };
  }

  /**
   * Required field validation rule
   */
  static requiredValidation(): ValidationRule {
    return {
      name: 'required_validation',
      priority: 1,
      validate: (value: any, context?: ValidationContext): ValidationResult => {
        if (value === null || value === undefined || value === '') {
          return {
            isValid: false,
            errors: ['Field is required']
          };
        }
        return { isValid: true, errors: [] };
      }
    };
  }
} 