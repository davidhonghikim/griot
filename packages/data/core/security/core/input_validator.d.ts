import { ValidationRule, ValidationResult, ValidationContext } from './validation_rules';
export interface SecurityConfig {
    maxInputLength: number;
    enableSanitization: boolean;
    enableStrictMode: boolean;
}
export declare class InputValidator {
    private config;
    constructor(config?: Partial<SecurityConfig>);
    validate(value: any, rules: ValidationRule[], context?: ValidationContext): ValidationResult;
    validateString(value: any, maxLength?: number): ValidationResult;
    validateNumber(value: any, min?: number, max?: number): ValidationResult;
    validateRequired(value: any): ValidationResult;
    getConfig(): SecurityConfig;
    updateConfig(newConfig: Partial<SecurityConfig>): void;
}
export declare const inputValidator: InputValidator;
//# sourceMappingURL=input_validator.d.ts.map