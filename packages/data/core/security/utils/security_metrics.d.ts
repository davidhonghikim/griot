export interface SecurityMetrics {
    totalRequests: number;
    blockedRequests: number;
    sanitizedRequests: number;
    threatDetections: number;
    averageResponseTime: number;
    topThreats: Array<{
        threat: string;
        count: number;
    }>;
    topSources: Array<{
        source: string;
        count: number;
    }>;
}
export interface MetricsConfig {
    enableTracking: boolean;
    maxTopItems: number;
}
export declare class SecurityMetricsTracker {
    private metrics;
    private config;
    private threatCounts;
    private sourceCounts;
    private responseTimes;
    constructor(config?: Partial<MetricsConfig>);
    recordEvent(event: {
        action: 'allowed' | 'blocked' | 'sanitized';
        threats?: string[];
        source?: string;
        responseTime?: number;
    }): void;
    getMetrics(): SecurityMetrics;
    resetMetrics(): void;
    private calculateAverageResponseTime;
    private updateTopLists;
}
export declare const securityMetrics: SecurityMetricsTracker;
//# sourceMappingURL=security_metrics.d.ts.map