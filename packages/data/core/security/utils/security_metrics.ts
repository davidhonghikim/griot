/**
 * Security Metrics Module
 * 
 * Provides basic security metrics tracking functionality.
 * Focused and minimal - tracks security metrics.
 */

// ============================================================================
// TYPES AND INTERFACES
// ============================================================================

export interface SecurityMetrics {
  totalRequests: number;
  blockedRequests: number;
  sanitizedRequests: number;
  threatDetections: number;
  averageResponseTime: number;
  topThreats: Array<{ threat: string; count: number }>;
  topSources: Array<{ source: string; count: number }>;
}

export interface MetricsConfig {
  enableTracking: boolean;
  maxTopItems: number;
}

// ============================================================================
// SECURITY METRICS CLASS
// ============================================================================

export class SecurityMetricsTracker {
  private metrics: SecurityMetrics;
  private config: MetricsConfig;
  private threatCounts: Map<string, number> = new Map();
  private sourceCounts: Map<string, number> = new Map();
  private responseTimes: number[] = [];

  constructor(config: Partial<MetricsConfig> = {}) {
    this.config = {
      enableTracking: true,
      maxTopItems: 10,
      ...config,
    };

    this.metrics = {
      totalRequests: 0,
      blockedRequests: 0,
      sanitizedRequests: 0,
      threatDetections: 0,
      averageResponseTime: 0,
      topThreats: [],
      topSources: [],
    };
  }

  /**
   * Record a security event
   */
  recordEvent(event: {
    action: 'allowed' | 'blocked' | 'sanitized';
    threats?: string[];
    source?: string;
    responseTime?: number;
  }): void {
    if (!this.config.enableTracking) return;

    this.metrics.totalRequests++;

    // Track actions
    if (event.action === 'blocked') {
      this.metrics.blockedRequests++;
    } else if (event.action === 'sanitized') {
      this.metrics.sanitizedRequests++;
    }

    // Track threats
    if (event.threats && event.threats.length > 0) {
      this.metrics.threatDetections++;
      for (const threat of event.threats) {
        this.threatCounts.set(threat, (this.threatCounts.get(threat) || 0) + 1);
      }
    }

    // Track sources
    if (event.source) {
      this.sourceCounts.set(event.source, (this.sourceCounts.get(event.source) || 0) + 1);
    }

    // Track response time
    if (event.responseTime) {
      this.responseTimes.push(event.responseTime);
      this.metrics.averageResponseTime = this.calculateAverageResponseTime();
    }

    // Update top lists
    this.updateTopLists();
  }

  /**
   * Get current metrics
   */
  getMetrics(): SecurityMetrics {
    return { ...this.metrics };
  }

  /**
   * Reset metrics
   */
  resetMetrics(): void {
    this.metrics = {
      totalRequests: 0,
      blockedRequests: 0,
      sanitizedRequests: 0,
      threatDetections: 0,
      averageResponseTime: 0,
      topThreats: [],
      topSources: [],
    };
    this.threatCounts.clear();
    this.sourceCounts.clear();
    this.responseTimes = [];
  }

  /**
   * Calculate average response time
   */
  private calculateAverageResponseTime(): number {
    if (this.responseTimes.length === 0) return 0;
    const sum = this.responseTimes.reduce((a, b) => a + b, 0);
    return sum / this.responseTimes.length;
  }

  /**
   * Update top threats and sources
   */
  private updateTopLists(): void {
    // Update top threats
    this.metrics.topThreats = Array.from(this.threatCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, this.config.maxTopItems)
      .map(([threat, count]) => ({ threat, count }));

    // Update top sources
    this.metrics.topSources = Array.from(this.sourceCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, this.config.maxTopItems)
      .map(([source, count]) => ({ source, count }));
  }
}

// Export singleton instance
export const securityMetrics = new SecurityMetricsTracker(); 