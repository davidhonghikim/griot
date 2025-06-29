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
export declare class ValidationRules {
    static typeValidation(expectedType: string): ValidationRule;
    static lengthValidation(minLength: number, maxLength: number): ValidationRule;
    static patternValidation(pattern: RegExp, description: string): ValidationRule;
    static rangeValidation(min: number, max: number): ValidationRule;
    static enumValidation(allowedValues: any[]): ValidationRule;
    static requiredValidation(): ValidationRule;
}
//# sourceMappingURL=validation_rules.d.ts.map