import { fileValidator } from './file/file_validator';
import { fileOperations } from './file/file_operations';
import { filePermissions } from './file/file_permissions';
import { fileOperationValidator } from './file/file_operation_validator';
export class FileSecurity {
    constructor(config = {}) {
        this.config = {
            enablePathValidation: true,
            enableOperationValidation: true,
            enablePermissions: true,
            maxFileSize: 10 * 1024 * 1024,
            allowedExtensions: ['.txt', '.md', '.json', '.yaml', '.yml', '.ts', '.js'],
            ...config,
        };
    }
    async validatePath(filePath, operation = 'read') {
        const pathValidation = fileValidator.validatePath(filePath);
        if (!pathValidation.isValid) {
            return {
                isAllowed: false,
                errors: pathValidation.errors,
                warnings: [],
            };
        }
        if (this.config.enableOperationValidation) {
            const operationValidation = fileOperationValidator.validateOperation({
                operation: operation,
                path: filePath,
            });
            if (!operationValidation.isAllowed) {
                return {
                    isAllowed: false,
                    errors: operationValidation.errors,
                    warnings: operationValidation.warnings,
                    sanitizedPath: operationValidation.sanitizedPath,
                };
            }
        }
        return {
            isAllowed: true,
            errors: [],
            warnings: [],
            sanitizedPath: pathValidation.sanitizedPath,
        };
    }
    async safeRead(filePath) {
        return fileOperations.safeRead(filePath);
    }
    async safeWrite(filePath, content) {
        return fileOperations.safeWrite(filePath, content);
    }
    async safeDelete(filePath) {
        return fileOperations.safeDelete(filePath);
    }
    checkPermissions(filePath, operation) {
        return filePermissions.checkPermissions(filePath, operation);
    }
    getConfig() {
        return { ...this.config };
    }
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
    }
}
export const fileSecurity = new FileSecurity();
//# sourceMappingURL=file_security.js.map