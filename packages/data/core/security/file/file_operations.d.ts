export interface FileOperationResult {
    success: boolean;
    errors: string[];
    data?: any;
}
export declare class FileOperations {
    private maxFileSize;
    constructor(config?: {
        maxFileSize?: number;
    });
    safeRead(filePath: string): Promise<FileOperationResult>;
    safeWrite(filePath: string, content: string): Promise<FileOperationResult>;
    safeDelete(filePath: string): Promise<FileOperationResult>;
}
export declare const fileOperations: FileOperations;
//# sourceMappingURL=file_operations.d.ts.map