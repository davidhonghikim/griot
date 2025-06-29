import { ValidationRules } from '../core/validation_rules';
import { SecurityPatterns } from '../core/security_patterns';
export class FileOperationValidator {
    constructor(config = {}) {
        this.config = {
            allowedOperations: ['read', 'write', 'delete', 'list', 'create'],
            maxFileSize: 10 * 1024 * 1024,
            allowedExtensions: ['.txt', '.md', '.json', '.yaml', '.yml', '.ts', '.js'],
            blockedExtensions: ['.exe', '.bat', '.cmd', '.sh', '.php', '.asp', '.jsp'],
            allowHiddenFiles: false,
            allowSymlinks: false,
            ...config,
        };
    }
    validateOperation(operation) {
        const errors = [];
        const warnings = [];
        const operationValidation = this.validateOperationType(operation.operation);
        if (!operationValidation.isValid) {
            errors.push(...operationValidation.errors);
        }
        const pathValidation = this.validatePath(operation.path);
        if (!pathValidation.isValid) {
            errors.push(...pathValidation.errors);
        }
        const specificValidation = this.validateSpecificOperation(operation);
        if (!specificValidation.isValid) {
            errors.push(...specificValidation.errors);
        }
        return {
            isAllowed: errors.length === 0,
            errors,
            warnings,
            sanitizedPath: pathValidation.sanitizedValue,
        };
    }
    validateOperationType(operation) {
        return ValidationRules.enumValidation(this.config.allowedOperations).validate(operation);
    }
    validatePath(filePath) {
        const errors = [];
        let sanitizedPath = filePath;
        if (typeof filePath !== 'string') {
            errors.push('Path must be a string');
            return { isValid: false, errors };
        }
        if (filePath.length === 0) {
            errors.push('Path cannot be empty');
            return { isValid: false, errors };
        }
        if (filePath.includes('..')) {
            errors.push('Path traversal not allowed');
        }
        if (!this.config.allowHiddenFiles && filePath.includes('/.')) {
            errors.push('Hidden files not allowed');
        }
        const extension = this.getFileExtension(filePath);
        if (extension && this.config.blockedExtensions.includes(extension)) {
            errors.push(`File extension not allowed: ${extension}`);
        }
        if (SecurityPatterns.hasSecurityThreat(filePath)) {
            warnings.push('Security patterns detected in file path');
        }
        return {
            isValid: errors.length === 0,
            errors,
            sanitizedValue: sanitizedPath,
        };
    }
    validateSpecificOperation(operation) {
        const errors = [];
        switch (operation.operation) {
            case 'write':
                break;
            case 'delete':
                break;
            case 'create':
                break;
        }
        return { isValid: errors.length === 0, errors };
    }
    getFileExtension(filePath) {
        const lastDotIndex = filePath.lastIndexOf('.');
        if (lastDotIndex === -1)
            return null;
        return filePath.substring(lastDotIndex);
    }
}
export const fileOperationValidator = new FileOperationValidator();
//# sourceMappingURL=file_operation_validator.js.map