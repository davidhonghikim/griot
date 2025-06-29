export interface SecurityResult {
    isAllowed: boolean;
    errors: string[];
    warnings: string[];
    sanitizedData?: any;
    threatScore: number;
    recommendations: string[];
}
export interface SecurityContext {
    type: 'input' | 'file' | 'auth' | 'network';
    operation?: string;
    user?: any;
    source?: string;
}
export declare class SecurityOrchestrator {
    private autoBlockThreshold;
    constructor(config?: {
        autoBlockThreshold?: number;
    });
    validateSecurity(data: any, context: SecurityContext): Promise<SecurityResult>;
    private mapErrorsToSeverity;
}
export declare const securityOrchestrator: SecurityOrchestrator;
//# sourceMappingURL=security_orchestrator.d.ts.map