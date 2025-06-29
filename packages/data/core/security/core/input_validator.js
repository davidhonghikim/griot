import { ValidationRules } from './validation_rules';
import { SecurityPatterns } from './security_patterns';
import { SanitizationUtils } from './sanitization_utils';
export class InputValidator {
    constructor(config = {}) {
        this.config = {
            maxInputLength: 10000,
            enableSanitization: true,
            enableStrictMode: false,
            ...config,
        };
    }
    validate(value, rules, context) {
        const errors = [];
        const warnings = [];
        let sanitizedValue = value;
        const sortedRules = [...rules].sort((a, b) => b.priority - a.priority);
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
        if (typeof value === 'string') {
            const matchingPatterns = SecurityPatterns.getMatchingPatterns(value);
            if (matchingPatterns.length > 0) {
                warnings.push(`Security patterns detected: ${matchingPatterns.length} threats`);
            }
        }
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
    validateString(value, maxLength) {
        const rules = [
            ValidationRules.typeValidation('string'),
            ValidationRules.lengthValidation(0, maxLength || this.config.maxInputLength),
        ];
        return this.validate(value, rules);
    }
    validateNumber(value, min, max) {
        const rules = [
            ValidationRules.typeValidation('number'),
            ...(min !== undefined || max !== undefined ? [ValidationRules.rangeValidation(min || -Infinity, max || Infinity)] : []),
        ];
        return this.validate(value, rules);
    }
    validateRequired(value) {
        return this.validate(value, [ValidationRules.requiredValidation()]);
    }
    getConfig() {
        return { ...this.config };
    }
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
    }
}
export const inputValidator = new InputValidator();
//# sourceMappingURL=input_validator.js.map