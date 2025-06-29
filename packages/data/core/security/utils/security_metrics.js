export class SecurityMetricsTracker {
    constructor(config = {}) {
        this.threatCounts = new Map();
        this.sourceCounts = new Map();
        this.responseTimes = [];
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
    recordEvent(event) {
        if (!this.config.enableTracking)
            return;
        this.metrics.totalRequests++;
        if (event.action === 'blocked') {
            this.metrics.blockedRequests++;
        }
        else if (event.action === 'sanitized') {
            this.metrics.sanitizedRequests++;
        }
        if (event.threats && event.threats.length > 0) {
            this.metrics.threatDetections++;
            for (const threat of event.threats) {
                this.threatCounts.set(threat, (this.threatCounts.get(threat) || 0) + 1);
            }
        }
        if (event.source) {
            this.sourceCounts.set(event.source, (this.sourceCounts.get(event.source) || 0) + 1);
        }
        if (event.responseTime) {
            this.responseTimes.push(event.responseTime);
            this.metrics.averageResponseTime = this.calculateAverageResponseTime();
        }
        this.updateTopLists();
    }
    getMetrics() {
        return { ...this.metrics };
    }
    resetMetrics() {
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
    calculateAverageResponseTime() {
        if (this.responseTimes.length === 0)
            return 0;
        const sum = this.responseTimes.reduce((a, b) => a + b, 0);
        return sum / this.responseTimes.length;
    }
    updateTopLists() {
        this.metrics.topThreats = Array.from(this.threatCounts.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, this.config.maxTopItems)
            .map(([threat, count]) => ({ threat, count }));
        this.metrics.topSources = Array.from(this.sourceCounts.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, this.config.maxTopItems)
            .map(([source, count]) => ({ source, count }));
    }
}
export const securityMetrics = new SecurityMetricsTracker();
//# sourceMappingURL=security_metrics.js.map