export interface PathValidationResult {
    isValid: boolean;
    errors: string[];
    sanitizedPath?: string;
}
export declare class FileValidator {
    private blockedExtensions;
    private blockedDirectories;
    constructor(config?: {
        blockedExtensions?: string[];
        blockedDirectories?: string[];
    });
    validatePath(filePath: string): PathValidationResult;
    private validateBasicPath;
    private validatePathTraversal;
    private validateExtension;
    private validateDirectory;
    private sanitizePath;
    private validateWithRules;
}
export declare const fileValidator: FileValidator;
//# sourceMappingURL=file_validator.d.ts.map