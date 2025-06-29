import { fileValidator } from './file_validator';
import * as fs from 'fs/promises';
export class FileOperations {
    constructor(config = {}) {
        this.maxFileSize = config.maxFileSize || 10 * 1024 * 1024;
    }
    async safeRead(filePath) {
        try {
            const validation = fileValidator.validatePath(filePath);
            if (!validation.isValid) {
                return {
                    success: false,
                    errors: validation.errors,
                };
            }
            const stats = await fs.stat(validation.sanitizedPath);
            if (stats.size > this.maxFileSize) {
                return {
                    success: false,
                    errors: [`File size exceeds maximum allowed size: ${this.maxFileSize} bytes`],
                };
            }
            const content = await fs.readFile(validation.sanitizedPath, 'utf-8');
            return {
                success: true,
                errors: [],
                data: content,
            };
        }
        catch (error) {
            return {
                success: false,
                errors: [`File read failed: ${error}`],
            };
        }
    }
    async safeWrite(filePath, content) {
        try {
            const validation = fileValidator.validatePath(filePath);
            if (!validation.isValid) {
                return {
                    success: false,
                    errors: validation.errors,
                };
            }
            if (content.length > this.maxFileSize) {
                return {
                    success: false,
                    errors: [`Content size exceeds maximum allowed size: ${this.maxFileSize} bytes`],
                };
            }
            await fs.writeFile(validation.sanitizedPath, content, 'utf-8');
            return {
                success: true,
                errors: [],
            };
        }
        catch (error) {
            return {
                success: false,
                errors: [`File write failed: ${error}`],
            };
        }
    }
    async safeDelete(filePath) {
        try {
            const validation = fileValidator.validatePath(filePath);
            if (!validation.isValid) {
                return {
                    success: false,
                    errors: validation.errors,
                };
            }
            await fs.unlink(validation.sanitizedPath);
            return {
                success: true,
                errors: [],
            };
        }
        catch (error) {
            return {
                success: false,
                errors: [`File delete failed: ${error}`],
            };
        }
    }
}
export const fileOperations = new FileOperations();
//# sourceMappingURL=file_operations.js.map