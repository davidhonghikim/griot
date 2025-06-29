export interface FileSecurityConfig {
    enablePathValidation: boolean;
    enableOperationValidation: boolean;
    enablePermissions: boolean;
    maxFileSize: number;
    allowedExtensions: string[];
}
export interface FileSecurityResult {
    isAllowed: boolean;
    errors: string[];
    warnings: string[];
    sanitizedPath?: string;
}
export declare class FileSecurity {
    private config;
    constructor(config?: Partial<FileSecurityConfig>);
    validatePath(filePath: string, operation?: string): Promise<FileSecurityResult>;
    safeRead(filePath: string): Promise<{
        content: string;
        metadata: any;
    }>;
    safeWrite(filePath: string, content: string): Promise<void>;
    safeDelete(filePath: string): Promise<void>;
    checkPermissions(filePath: string, operation: string): any;
    getConfig(): FileSecurityConfig;
    updateConfig(newConfig: Partial<FileSecurityConfig>): void;
}
export declare const fileSecurity: FileSecurity;
//# sourceMappingURL=file_security.d.ts.map