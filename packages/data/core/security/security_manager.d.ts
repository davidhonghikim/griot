import { SecurityResult, SecurityContext } from './security_orchestrator';
export interface SecurityManagerConfig {
    enableComprehensiveValidation: boolean;
    enableLogging: boolean;
    enableMetrics: boolean;
    securityLevel: 'low' | 'medium' | 'high' | 'critical';
    autoBlockThreshold: number;
}
export declare class SecurityManager {
    private config;
    constructor(config?: Partial<SecurityManagerConfig>);
    validateSecurity(data: any, context: SecurityContext): Promise<SecurityResult>;
    validateInput(value: any, rules: any[]): any;
    validateFilePath(path: string): any;
    validateAuthRequest(request: any): any;
    validateNetworkRequest(request: any): any;
    getConfig(): SecurityManagerConfig;
    updateConfig(newConfig: Partial<SecurityManagerConfig>): void;
}
export declare const securityManager: SecurityManager;
//# sourceMappingURL=security_manager.d.ts.map