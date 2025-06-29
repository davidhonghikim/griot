/**
 * Security Logger Module
 * 
 * Provides basic security event logging functionality.
 * Focused and minimal - logs security events.
 */

// ============================================================================
// TYPES AND INTERFACES
// ============================================================================

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

// ============================================================================
// SECURITY LOGGER CLASS
// ============================================================================

export class SecurityLogger {
  private events: SecurityEvent[] = [];
  private config: SecurityLoggerConfig;

  constructor(config: Partial<SecurityLoggerConfig> = {}) {
    this.config = {
      maxEvents: 1000,
      enableConsoleLogging: true,
      enableFileLogging: false,
      ...config,
    };
  }

  /**
   * Log security event
   */
  logEvent(event: Omit<SecurityEvent, 'id' | 'timestamp'>): void {
    const securityEvent: SecurityEvent = {
      ...event,
      id: this.generateId(),
      timestamp: new Date(),
    };

    this.events.push(securityEvent);

    // Keep only the last N events
    if (this.events.length > this.config.maxEvents) {
      this.events = this.events.slice(-this.config.maxEvents);
    }

    // Console logging
    if (this.config.enableConsoleLogging) {
      console.log(`[SECURITY] ${securityEvent.type.toUpperCase()}: ${securityEvent.action} - ${securityEvent.source}`);
      if (securityEvent.severity === 'high' || securityEvent.severity === 'critical') {
        console.warn(`[SECURITY] High severity event: ${securityEvent.details}`);
      }
    }
  }

  /**
   * Get all events
   */
  getEvents(): SecurityEvent[] {
    return [...this.events];
  }

  /**
   * Get events by type
   */
  getEventsByType(type: SecurityEvent['type']): SecurityEvent[] {
    return this.events.filter(event => event.type === type);
  }

  /**
   * Get events by severity
   */
  getEventsBySeverity(severity: SecurityEvent['severity']): SecurityEvent[] {
    return this.events.filter(event => event.severity === severity);
  }

  /**
   * Clear all events
   */
  clearEvents(): void {
    this.events = [];
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

// Export singleton instance
export const securityLogger = new SecurityLogger(); 