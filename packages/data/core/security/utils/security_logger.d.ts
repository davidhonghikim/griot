export interface SecurityEvent {
    id: string;
    timestamp: Date;
    type: 'validation' | 'authentication' | 'file_access' | 'network_request' | 'threat_detected';
    severity: 'low' | 'medium' | 'high' | 'critical';
    source: string;
    details: any;
    action: 'allowed' | 'blocked' | 'sanitized' | 'logged';
}
export interface SecurityLoggerConfig {
    maxEvents: number;
    enableConsoleLogging: boolean;
    enableFileLogging: boolean;
}
export declare class SecurityLogger {
    private events;
    private config;
    constructor(config?: Partial<SecurityLoggerConfig>);
    logEvent(event: Omit<SecurityEvent, 'id' | 'timestamp'>): void;
    getEvents(): SecurityEvent[];
    getEventsByType(type: SecurityEvent['type']): SecurityEvent[];
    getEventsBySeverity(severity: SecurityEvent['severity']): SecurityEvent[];
    clearEvents(): void;
    private generateId;
}
export declare const securityLogger: SecurityLogger;
//# sourceMappingURL=security_logger.d.ts.map