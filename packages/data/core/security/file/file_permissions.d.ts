export interface FilePermissionsConfig {
    defaultPermissions: string;
    restrictedPermissions: string;
    adminPermissions: string;
    enablePermissionValidation: boolean;
    enableOwnershipValidation: boolean;
    allowedOwners: string[];
    restrictedOperations: string[];
    enableAuditLogging: boolean;
}
export interface PermissionCheck {
    operation: 'read' | 'write' | 'delete' | 'execute';
    path: string;
    user?: {
        id: string;
        username: string;
        role: string;
        permissions: string[];
    };
    context?: any;
}
export interface PermissionResult {
    isAllowed: boolean;
    errors: string[];
    warnings: string[];
    requiredPermissions?: string[];
    currentPermissions?: string;
    owner?: string;
    group?: string;
}
export interface FileMetadata {
    permissions: string;
    owner: string;
    group: string;
    size: number;
    modified: Date;
    created: Date;
    isDirectory: boolean;
    isSymlink: boolean;
}
export declare class FilePermissions {
    private config;
    private auditLog;
    constructor(config?: Partial<FilePermissionsConfig>);
    checkPermissions(check: PermissionCheck): Promise<PermissionResult>;
    setPermissions(filePath: string, permissions: string, user?: any): Promise<boolean>;
    getFileMetadata(filePath: string): Promise<FileMetadata>;
    private checkOwnership;
    private checkFilePermissions;
    private formatPermissions;
    private logAudit;
    getConfig(): FilePermissionsConfig;
    updateConfig(newConfig: Partial<FilePermissionsConfig>): void;
    getAuditLog(): Array<{
        timestamp: number;
        check: PermissionCheck;
        result: PermissionResult;
    }>;
    clearAuditLog(): void;
    hasAdminPermissions(user?: any): boolean;
}
export declare const filePermissions: FilePermissions;
//# sourceMappingURL=file_permissions.d.ts.map