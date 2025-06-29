export interface FileOperation {
    operation: 'read' | 'write' | 'delete' | 'list' | 'create';
    path: string;
    user?: any;
    context?: any;
}
export interface FileOperationResult {
    isAllowed: boolean;
    errors: string[];
    warnings: string[];
    sanitizedPath?: string;
}
export interface FileOperationConfig {
    allowedOperations: string[];
    maxFileSize: number;
    allowedExtensions: string[];
    blockedExtensions: string[];
    allowHiddenFiles: boolean;
    allowSymlinks: boolean;
}
export declare class FileOperationValidator {
    private config;
    constructor(config?: Partial<FileOperationConfig>);
    validateOperation(operation: FileOperation): FileOperationResult;
    private validateOperationType;
    private validatePath;
    private validateSpecificOperation;
    private getFileExtension;
}
export declare const fileOperationValidator: FileOperationValidator;
//# sourceMappingURL=file_operation_validator.d.ts.map