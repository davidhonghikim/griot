export interface NetworkRequest {
    url: string;
    method: string;
    headers: Record<string, string>;
    body?: any;
    ipAddress?: string;
    userAgent?: string;
    origin?: string;
    referer?: string;
}
export interface NetworkValidationResult {
    isAllowed: boolean;
    errors: string[];
    warnings: string[];
    sanitizedUrl?: string;
    sanitizedHeaders?: Record<string, string>;
    sanitizedBody?: any;
}
export interface NetworkConfig {
    allowedProtocols: string[];
    allowedDomains: string[];
    blockedDomains: string[];
    maxUrlLength: number;
    maxRequestSize: number;
}
export declare class NetworkRequestValidator {
    private config;
    constructor(config?: Partial<NetworkConfig>);
    validateRequest(request: NetworkRequest): NetworkValidationResult;
    private validateUrl;
    private validateMethod;
    private validateHeaders;
    private validateHeaderName;
    private validateHeaderValue;
    private validateBody;
    private extractDomain;
}
export declare const networkRequestValidator: NetworkRequestValidator;
//# sourceMappingURL=network_request_validator.d.ts.map