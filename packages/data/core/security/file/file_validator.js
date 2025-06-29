import { ValidationRules, SecurityPatterns } from '../core/input_validator';
export class FileValidator {
    constructor(config = {}) {
        this.blockedExtensions = config.blockedExtensions || ['.exe', '.bat', '.cmd', '.sh', '.php'];
        this.blockedDirectories = config.blockedDirectories || ['/etc', '/var', '/usr', '/bin', '/sbin'];
    }
    validatePath(filePath) {
        const errors = [];
        const pathValidation = this.validateBasicPath(filePath);
        if (!pathValidation.isValid) {
            errors.push(...pathValidation.errors);
        }
        const traversalValidation = this.validatePathTraversal(filePath);
        if (!traversalValidation.isValid) {
            errors.push(...traversalValidation.errors);
        }
        const extensionValidation = this.validateExtension(filePath);
        if (!extensionValidation.isValid) {
            errors.push(...extensionValidation.errors);
        }
        const directoryValidation = this.validateDirectory(filePath);
        if (!directoryValidation.isValid) {
            errors.push(...directoryValidation.errors);
        }
        return {
            isValid: errors.length === 0,
            errors,
            sanitizedPath: errors.length === 0 ? this.sanitizePath(filePath) : undefined,
        };
    }
    validateBasicPath(filePath) {
        const rules = [
            ValidationRules.requiredValidation(),
            ValidationRules.lengthValidation(1, 4096),
            ValidationRules.patternValidation(SecurityPatterns.PATH_TRAVERSAL, 'Path traversal detected'),
        ];
        return this.validateWithRules(filePath, rules);
    }
    validatePathTraversal(filePath) {
        const dangerousPatterns = ['../', '..\\', '..%2f', '..%5c'];
        for (const pattern of dangerousPatterns) {
            if (filePath.toLowerCase().includes(pattern)) {
                return {
                    isValid: false,
                    errors: [`Path traversal detected: ${pattern}`],
                    sanitizedValue: undefined,
                };
            }
        }
        return { isValid: true, errors: [], sanitizedValue: filePath };
    }
    validateExtension(filePath) {
        const extension = filePath.toLowerCase().split('.').pop();
        if (extension && this.blockedExtensions.includes(`.${extension}`)) {
            return {
                isValid: false,
                errors: [`Blocked file extension: .${extension}`],
                sanitizedValue: undefined,
            };
        }
        return { isValid: true, errors: [], sanitizedValue: filePath };
    }
    validateDirectory(filePath) {
        for (const blockedDir of this.blockedDirectories) {
            if (filePath.includes(blockedDir)) {
                return {
                    isValid: false,
                    errors: [`Access to directory not allowed: ${blockedDir}`],
                    sanitizedValue: undefined,
                };
            }
        }
        return { isValid: true, errors: [], sanitizedValue: filePath };
    }
    sanitizePath(filePath) {
        return filePath.replace(/\\/g, '/').replace(/\/+/g, '/');
    }
    validateWithRules(value, rules) {
        for (const rule of rules) {
            const result = rule(value);
            if (!result.isValid) {
                return result;
            }
        }
        return { isValid: true, errors: [], sanitizedValue: value };
    }
}
export const fileValidator = new FileValidator();
//# sourceMappingURL=file_validator.js.map