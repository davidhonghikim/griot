export class SecurityLogger {
    constructor(config = {}) {
        this.events = [];
        this.config = {
            maxEvents: 1000,
            enableConsoleLogging: true,
            enableFileLogging: false,
            ...config,
        };
    }
    logEvent(event) {
        const securityEvent = {
            ...event,
            id: this.generateId(),
            timestamp: new Date(),
        };
        this.events.push(securityEvent);
        if (this.events.length > this.config.maxEvents) {
            this.events = this.events.slice(-this.config.maxEvents);
        }
        if (this.config.enableConsoleLogging) {
            console.log(`[SECURITY] ${securityEvent.type.toUpperCase()}: ${securityEvent.action} - ${securityEvent.source}`);
            if (securityEvent.severity === 'high' || securityEvent.severity === 'critical') {
                console.warn(`[SECURITY] High severity event: ${securityEvent.details}`);
            }
        }
    }
    getEvents() {
        return [...this.events];
    }
    getEventsByType(type) {
        return this.events.filter(event => event.type === type);
    }
    getEventsBySeverity(severity) {
        return this.events.filter(event => event.severity === severity);
    }
    clearEvents() {
        this.events = [];
    }
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
}
export const securityLogger = new SecurityLogger();
//# sourceMappingURL=security_logger.js.map