import * as fs from 'fs/promises';
export class FilePermissions {
    constructor(config = {}) {
        this.auditLog = [];
        this.config = {
            defaultPermissions: '644',
            restrictedPermissions: '600',
            adminPermissions: '755',
            enablePermissionValidation: true,
            enableOwnershipValidation: true,
            allowedOwners: [],
            restrictedOperations: ['execute'],
            enableAuditLogging: true,
            ...config,
        };
    }
    async checkPermissions(check) {
        const errors = [];
        const warnings = [];
        try {
            const metadata = await this.getFileMetadata(check.path);
            if (this.config.restrictedOperations.includes(check.operation)) {
                errors.push(`Operation '${check.operation}' is restricted`);
            }
            if (this.config.enableOwnershipValidation && check.user) {
                const ownershipCheck = this.checkOwnership(metadata, check.user);
                if (!ownershipCheck.isAllowed) {
                    errors.push(...ownershipCheck.errors);
                }
            }
            if (this.config.enablePermissionValidation) {
                const permissionCheck = this.checkFilePermissions(metadata, check.operation, check.user);
                if (!permissionCheck.isAllowed) {
                    errors.push(...permissionCheck.errors);
                }
                warnings.push(...permissionCheck.warnings);
            }
            const result = {
                isAllowed: errors.length === 0,
                errors,
                warnings,
                currentPermissions: metadata.permissions,
                owner: metadata.owner,
                group: metadata.group,
            };
            this.logAudit(check, result);
            return result;
        }
        catch (error) {
            const result = {
                isAllowed: false,
                errors: [`Permission check failed: ${error}`],
                warnings: [],
            };
            this.logAudit(check, result);
            return result;
        }
    }
    async setPermissions(filePath, permissions, user) {
        try {
            const check = {
                operation: 'write',
                path: filePath,
                user,
            };
            const permissionCheck = await this.checkPermissions(check);
            if (!permissionCheck.isAllowed) {
                throw new Error(`Cannot set permissions: ${permissionCheck.errors.join(', ')}`);
            }
            await fs.chmod(filePath, parseInt(permissions, 8));
            return true;
        }
        catch (error) {
            console.error(`Failed to set permissions: ${error}`);
            return false;
        }
    }
    async getFileMetadata(filePath) {
        try {
            const stats = await fs.stat(filePath);
            return {
                permissions: this.formatPermissions(stats.mode),
                owner: 'unknown',
                group: 'unknown',
                size: stats.size,
                modified: stats.mtime,
                created: stats.birthtime,
                isDirectory: stats.isDirectory(),
                isSymlink: stats.isSymbolicLink(),
            };
        }
        catch (error) {
            throw new Error(`Could not get file metadata: ${error}`);
        }
    }
    checkOwnership(metadata, user) {
        const errors = [];
        if (this.config.allowedOwners.length > 0) {
            const isOwner = this.config.allowedOwners.includes(user.username) ||
                this.config.allowedOwners.includes(user.id);
            if (!isOwner) {
                errors.push(`User '${user.username}' is not in allowed owners list`);
            }
        }
        if (metadata.owner !== 'unknown' && metadata.owner !== user.username) {
            errors.push(`User '${user.username}' does not own the file`);
        }
        return {
            isAllowed: errors.length === 0,
            errors,
        };
    }
    checkFilePermissions(metadata, operation, user) {
        const errors = [];
        const warnings = [];
        const permissions = parseInt(metadata.permissions, 8);
        if (operation === 'read') {
            const canRead = (permissions & 0o444) !== 0;
            if (!canRead) {
                errors.push('File does not have read permissions');
            }
        }
        if (operation === 'write') {
            const canWrite = (permissions & 0o222) !== 0;
            if (!canWrite) {
                errors.push('File does not have write permissions');
            }
        }
        if (operation === 'execute') {
            const canExecute = (permissions & 0o111) !== 0;
            if (!canExecute) {
                errors.push('File does not have execute permissions');
            }
        }
        if (operation === 'delete') {
            const canWrite = (permissions & 0o222) !== 0;
            if (!canWrite) {
                errors.push('File does not have delete permissions');
            }
        }
        if (permissions === 0o777) {
            warnings.push('File has overly permissive permissions (777)');
        }
        return {
            isAllowed: errors.length === 0,
            errors,
            warnings,
        };
    }
    formatPermissions(mode) {
        return (mode & 0o777).toString(8);
    }
    logAudit(check, result) {
        if (this.config.enableAuditLogging) {
            this.auditLog.push({
                timestamp: Date.now(),
                check,
                result,
            });
        }
    }
    getConfig() {
        return { ...this.config };
    }
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
    }
    getAuditLog() {
        return [...this.auditLog];
    }
    clearAuditLog() {
        this.auditLog = [];
    }
    hasAdminPermissions(user) {
        if (!user)
            return false;
        return user.role === 'admin' ||
            user.permissions.includes('admin') ||
            this.config.allowedOwners.includes(user.username);
    }
}
export const filePermissions = new FilePermissions();
//# sourceMappingURL=file_permissions.js.map