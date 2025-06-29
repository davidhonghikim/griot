import * as fs from 'fs/promises';
import * as path from 'path';
export class FileMonitor {
    constructor(config = {}) {
        this.watchedFiles = new Map();
        this.eventLog = [];
        this.changeLog = [];
        this.activeWatches = new Set();
        this.config = {
            enableMonitoring: true,
            watchDirectories: [],
            ignoredPatterns: ['.DS_Store', 'Thumbs.db', '*.tmp', '*.log'],
            maxFileSize: 10 * 1024 * 1024,
            enableChangeDetection: true,
            enableIntegrityChecking: true,
            checkInterval: 5000,
            maxConcurrentWatches: 100,
            enableEventLogging: true,
            ...config,
        };
    }
    async startMonitoring() {
        if (!this.config.enableMonitoring) {
            return;
        }
        for (const dir of this.config.watchDirectories) {
            await this.watchDirectory(dir);
        }
        if (this.config.enableIntegrityChecking) {
            this.startIntegrityChecks();
        }
    }
    stopMonitoring() {
        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval);
            this.monitoringInterval = undefined;
        }
        this.activeWatches.clear();
    }
    async watchDirectory(dirPath) {
        if (this.activeWatches.size >= this.config.maxConcurrentWatches) {
            throw new Error('Maximum number of concurrent watches reached');
        }
        if (this.activeWatches.has(dirPath)) {
            return;
        }
        try {
            await this.scanDirectory(dirPath);
            this.activeWatches.add(dirPath);
            if (this.config.enableEventLogging) {
                this.logEvent({
                    type: 'created',
                    path: dirPath,
                    timestamp: Date.now(),
                });
            }
        }
        catch (error) {
            throw new Error(`Failed to watch directory ${dirPath}: ${error}`);
        }
    }
    async scanDirectory(dirPath) {
        try {
            const entries = await fs.readdir(dirPath, { withFileTypes: true });
            for (const entry of entries) {
                if (entry.isFile()) {
                    const filePath = path.join(dirPath, entry.name);
                    if (this.isIgnored(filePath)) {
                        continue;
                    }
                    const hash = await this.calculateFileHash(filePath);
                    const stats = await fs.stat(filePath);
                    this.watchedFiles.set(filePath, {
                        hash,
                        lastModified: stats.mtime.getTime(),
                    });
                }
            }
        }
        catch (error) {
            console.warn(`Failed to scan directory ${dirPath}: ${error}`);
        }
    }
    async checkForChanges() {
        const changes = [];
        for (const [filePath, previousState] of this.watchedFiles) {
            try {
                const stats = await fs.stat(filePath);
                const currentHash = await this.calculateFileHash(filePath);
                if (currentHash !== previousState.hash) {
                    changes.push({
                        path: filePath,
                        oldHash: previousState.hash,
                        newHash: currentHash,
                        timestamp: Date.now(),
                        type: 'content',
                        severity: this.calculateSeverity(filePath),
                    });
                    this.watchedFiles.set(filePath, {
                        hash: currentHash,
                        lastModified: stats.mtime.getTime(),
                    });
                }
                if (stats.mtime.getTime() !== previousState.lastModified) {
                    changes.push({
                        path: filePath,
                        timestamp: Date.now(),
                        type: 'metadata',
                        severity: 'low',
                    });
                    this.watchedFiles.set(filePath, {
                        hash: previousState.hash,
                        lastModified: stats.mtime.getTime(),
                    });
                }
            }
            catch (error) {
                if (error.code === 'ENOENT') {
                    changes.push({
                        path: filePath,
                        timestamp: Date.now(),
                        type: 'metadata',
                        severity: 'medium',
                    });
                    this.watchedFiles.delete(filePath);
                }
            }
        }
        this.changeLog.push(...changes);
        return changes;
    }
    async calculateFileHash(filePath) {
        try {
            const content = await fs.readFile(filePath);
            const crypto = require('crypto');
            return crypto.createHash('sha256').update(content).digest('hex');
        }
        catch (error) {
            return 'unknown';
        }
    }
    isIgnored(filePath) {
        const fileName = path.basename(filePath);
        for (const pattern of this.config.ignoredPatterns) {
            if (pattern.includes('*')) {
                const regex = new RegExp(pattern.replace(/\*/g, '.*'));
                if (regex.test(fileName)) {
                    return true;
                }
            }
            else if (fileName === pattern) {
                return true;
            }
        }
        return false;
    }
    calculateSeverity(filePath) {
        const extension = path.extname(filePath).toLowerCase();
        if (['.env', '.config', '.key', '.pem', '.crt'].includes(extension)) {
            return 'critical';
        }
        if (['.json', '.yaml', '.yml', '.ts', '.js'].includes(extension)) {
            return 'high';
        }
        if (['.md', '.txt', '.log'].includes(extension)) {
            return 'medium';
        }
        return 'low';
    }
    startIntegrityChecks() {
        this.monitoringInterval = setInterval(async () => {
            try {
                await this.checkForChanges();
            }
            catch (error) {
                console.error('Integrity check failed:', error);
            }
        }, this.config.checkInterval);
    }
    logEvent(event) {
        if (this.config.enableEventLogging) {
            this.eventLog.push(event);
            if (this.eventLog.length > 1000) {
                this.eventLog = this.eventLog.slice(-1000);
            }
        }
    }
    getMonitoringStatus() {
        return {
            isMonitored: this.config.enableMonitoring,
            events: [...this.eventLog],
            changes: [...this.changeLog],
            errors: [],
            warnings: [],
        };
    }
    getWatchedFiles() {
        return new Map(this.watchedFiles);
    }
    async addFileToMonitoring(filePath) {
        try {
            const hash = await this.calculateFileHash(filePath);
            const stats = await fs.stat(filePath);
            this.watchedFiles.set(filePath, {
                hash,
                lastModified: stats.mtime.getTime(),
            });
        }
        catch (error) {
            throw new Error(`Failed to add file to monitoring: ${error}`);
        }
    }
    removeFileFromMonitoring(filePath) {
        this.watchedFiles.delete(filePath);
    }
    getConfig() {
        return { ...this.config };
    }
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
    }
    clearLogs() {
        this.eventLog = [];
        this.changeLog = [];
    }
}
export const fileMonitor = new FileMonitor();
//# sourceMappingURL=file_monitor.js.map