export class ValidationRules {
    static typeValidation(expectedType) {
        return {
            name: 'type_validation',
            priority: 1,
            validate: (value, context) => {
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
    static lengthValidation(minLength, maxLength) {
        return {
            name: 'length_validation',
            priority: 2,
            validate: (value, context) => {
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
    static patternValidation(pattern, description) {
        return {
            name: 'pattern_validation',
            priority: 3,
            validate: (value, context) => {
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
    static rangeValidation(min, max) {
        return {
            name: 'range_validation',
            priority: 2,
            validate: (value, context) => {
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
    static enumValidation(allowedValues) {
        return {
            name: 'enum_validation',
            priority: 2,
            validate: (value, context) => {
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
    static requiredValidation() {
        return {
            name: 'required_validation',
            priority: 1,
            validate: (value, context) => {
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
//# sourceMappingURL=validation_rules.js.map