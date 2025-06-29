/**
 * File Monitor Module
 * 
 * Provides file system monitoring and change detection.
 * Extracted from monolithic file_security.ts for better modularity.
 */

import * as fs from 'fs/promises';
import * as path from 'path';

// ============================================================================
// TYPES AND INTERFACES
// ============================================================================

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

// ============================================================================
// FILE MONITOR CLASS
// ============================================================================

export class FileMonitor {
  private config: FileMonitorConfig;
  private watchedFiles: Map<string, { hash: string; lastModified: number }> = new Map();
  private eventLog: FileEvent[] = [];
  private changeLog: FileChange[] = [];
  private activeWatches: Set<string> = new Set();
  private monitoringInterval?: NodeJS.Timeout;

  constructor(config: Partial<FileMonitorConfig> = {}) {
    this.config = {
      enableMonitoring: true,
      watchDirectories: [],
      ignoredPatterns: ['.DS_Store', 'Thumbs.db', '*.tmp', '*.log'],
      maxFileSize: 10 * 1024 * 1024, // 10MB
      enableChangeDetection: true,
      enableIntegrityChecking: true,
      checkInterval: 5000, // 5 seconds
      maxConcurrentWatches: 100,
      enableEventLogging: true,
      ...config,
    };
  }

  /**
   * Start file monitoring
   */
  async startMonitoring(): Promise<void> {
    if (!this.config.enableMonitoring) {
      return;
    }

    // Initialize monitoring for configured directories
    for (const dir of this.config.watchDirectories) {
      await this.watchDirectory(dir);
    }

    // Start periodic integrity checks
    if (this.config.enableIntegrityChecking) {
      this.startIntegrityChecks();
    }
  }

  /**
   * Stop file monitoring
   */
  stopMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = undefined;
    }
    
    this.activeWatches.clear();
  }

  /**
   * Watch a directory for changes
   */
  async watchDirectory(dirPath: string): Promise<void> {
    if (this.activeWatches.size >= this.config.maxConcurrentWatches) {
      throw new Error('Maximum number of concurrent watches reached');
    }

    if (this.activeWatches.has(dirPath)) {
      return; // Already watching
    }

    try {
      // Scan directory for initial state
      await this.scanDirectory(dirPath);
      
      this.activeWatches.add(dirPath);
      
      if (this.config.enableEventLogging) {
        this.logEvent({
          type: 'created',
          path: dirPath,
          timestamp: Date.now(),
        });
      }

    } catch (error) {
      throw new Error(`Failed to watch directory ${dirPath}: ${error}`);
    }
  }

  /**
   * Scan directory and track files
   */
  private async scanDirectory(dirPath: string): Promise<void> {
    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true });
      
      for (const entry of entries) {
        if (entry.isFile()) {
          const filePath = path.join(dirPath, entry.name);
          
          // Skip ignored files
          if (this.isIgnored(filePath)) {
            continue;
          }

          // Get file hash and metadata
          const hash = await this.calculateFileHash(filePath);
          const stats = await fs.stat(filePath);
          
          this.watchedFiles.set(filePath, {
            hash,
            lastModified: stats.mtime.getTime(),
          });
        }
      }
    } catch (error) {
      console.warn(`Failed to scan directory ${dirPath}: ${error}`);
    }
  }

  /**
   * Check for file changes
   */
  async checkForChanges(): Promise<FileChange[]> {
    const changes: FileChange[] = [];

    for (const [filePath, previousState] of this.watchedFiles) {
      try {
        const stats = await fs.stat(filePath);
        const currentHash = await this.calculateFileHash(filePath);
        
        // Check for content changes
        if (currentHash !== previousState.hash) {
          changes.push({
            path: filePath,
            oldHash: previousState.hash,
            newHash: currentHash,
            timestamp: Date.now(),
            type: 'content',
            severity: this.calculateSeverity(filePath),
          });

          // Update tracked state
          this.watchedFiles.set(filePath, {
            hash: currentHash,
            lastModified: stats.mtime.getTime(),
          });
        }

        // Check for metadata changes
        if (stats.mtime.getTime() !== previousState.lastModified) {
          changes.push({
            path: filePath,
            timestamp: Date.now(),
            type: 'metadata',
            severity: 'low',
          });

          // Update tracked state
          this.watchedFiles.set(filePath, {
            hash: previousState.hash,
            lastModified: stats.mtime.getTime(),
          });
        }

      } catch (error) {
        // File might have been deleted
        if ((error as any).code === 'ENOENT') {
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

    // Add changes to log
    this.changeLog.push(...changes);

    return changes;
  }

  /**
   * Calculate file hash
   */
  private async calculateFileHash(filePath: string): Promise<string> {
    try {
      const content = await fs.readFile(filePath);
      const crypto = require('crypto');
      return crypto.createHash('sha256').update(content).digest('hex');
    } catch (error) {
      return 'unknown';
    }
  }

  /**
   * Check if file should be ignored
   */
  private isIgnored(filePath: string): boolean {
    const fileName = path.basename(filePath);
    
    for (const pattern of this.config.ignoredPatterns) {
      if (pattern.includes('*')) {
        // Simple wildcard matching
        const regex = new RegExp(pattern.replace(/\*/g, '.*'));
        if (regex.test(fileName)) {
          return true;
        }
      } else if (fileName === pattern) {
        return true;
      }
    }
    
    return false;
  }

  /**
   * Calculate change severity
   */
  private calculateSeverity(filePath: string): 'low' | 'medium' | 'high' | 'critical' {
    const extension = path.extname(filePath).toLowerCase();
    
    // Critical files
    if (['.env', '.config', '.key', '.pem', '.crt'].includes(extension)) {
      return 'critical';
    }
    
    // High importance files
    if (['.json', '.yaml', '.yml', '.ts', '.js'].includes(extension)) {
      return 'high';
    }
    
    // Medium importance files
    if (['.md', '.txt', '.log'].includes(extension)) {
      return 'medium';
    }
    
    return 'low';
  }

  /**
   * Start periodic integrity checks
   */
  private startIntegrityChecks(): void {
    this.monitoringInterval = setInterval(async () => {
      try {
        await this.checkForChanges();
      } catch (error) {
        console.error('Integrity check failed:', error);
      }
    }, this.config.checkInterval);
  }

  /**
   * Log file event
   */
  private logEvent(event: FileEvent): void {
    if (this.config.enableEventLogging) {
      this.eventLog.push(event);
      
      // Keep only last 1000 events
      if (this.eventLog.length > 1000) {
        this.eventLog = this.eventLog.slice(-1000);
      }
    }
  }

  /**
   * Get monitoring status
   */
  getMonitoringStatus(): MonitorResult {
    return {
      isMonitored: this.config.enableMonitoring,
      events: [...this.eventLog],
      changes: [...this.changeLog],
      errors: [],
      warnings: [],
    };
  }

  /**
   * Get watched files
   */
  getWatchedFiles(): Map<string, { hash: string; lastModified: number }> {
    return new Map(this.watchedFiles);
  }

  /**
   * Add file to monitoring
   */
  async addFileToMonitoring(filePath: string): Promise<void> {
    try {
      const hash = await this.calculateFileHash(filePath);
      const stats = await fs.stat(filePath);
      
      this.watchedFiles.set(filePath, {
        hash,
        lastModified: stats.mtime.getTime(),
      });
    } catch (error) {
      throw new Error(`Failed to add file to monitoring: ${error}`);
    }
  }

  /**
   * Remove file from monitoring
   */
  removeFileFromMonitoring(filePath: string): void {
    this.watchedFiles.delete(filePath);
  }

  /**
   * Get configuration
   */
  getConfig(): FileMonitorConfig {
    return { ...this.config };
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<FileMonitorConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Clear logs
   */
  clearLogs(): void {
    this.eventLog = [];
    this.changeLog = [];
  }
}

// Export singleton instance
export const fileMonitor = new FileMonitor(); 