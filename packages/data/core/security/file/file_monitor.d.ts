export interface FileMonitorConfig {
    enableMonitoring: boolean;
    watchDirectories: string[];
    ignoredPatterns: string[];
    maxFileSize: number;
    enableChangeDetection: boolean;
    enableIntegrityChecking: boolean;
    checkInterval: number;
    maxConcurrentWatches: number;
    enableEventLogging: boolean;
}
export interface FileEvent {
    type: 'created' | 'modified' | 'deleted' | 'renamed';
    path: string;
    timestamp: number;
    metadata?: {
        size?: number;
        hash?: string;
        permissions?: string;
    };
    user?: string;
}
export interface FileChange {
    path: string;
    oldHash?: string;
    newHash?: string;
    timestamp: number;
    type: 'content' | 'permissions' | 'metadata';
    severity: 'low' | 'medium' | 'high' | 'critical';
}
export interface MonitorResult {
    isMonitored: boolean;
    events: FileEvent[];
    changes: FileChange[];
    errors: string[];
    warnings: string[];
}
export declare class FileMonitor {
    private config;
    private watchedFiles;
    private eventLog;
    private changeLog;
    private activeWatches;
    private monitoringInterval?;
    constructor(config?: Partial<FileMonitorConfig>);
    startMonitoring(): Promise<void>;
    stopMonitoring(): void;
    watchDirectory(dirPath: string): Promise<void>;
    private scanDirectory;
    checkForChanges(): Promise<FileChange[]>;
    private calculateFileHash;
    private isIgnored;
    private calculateSeverity;
    private startIntegrityChecks;
    private logEvent;
    getMonitoringStatus(): MonitorResult;
    getWatchedFiles(): Map<string, {
        hash: string;
        lastModified: number;
    }>;
    addFileToMonitoring(filePath: string): Promise<void>;
    removeFileFromMonitoring(filePath: string): void;
    getConfig(): FileMonitorConfig;
    updateConfig(newConfig: Partial<FileMonitorConfig>): void;
    clearLogs(): void;
}
export declare const fileMonitor: FileMonitor;
//# sourceMappingURL=file_monitor.d.ts.map