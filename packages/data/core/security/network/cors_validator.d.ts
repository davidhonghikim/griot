export interface CORSConfig {
    allowedOrigins: string[];
    allowedMethods: string[];
    allowedHeaders: string[];
    allowCredentials: boolean;
    maxAge: number;
}
export interface CORSRequest {
    origin?: string;
    method: string;
    headers: Record<string, string>;
}
export interface CORSResult {
    isAllowed: boolean;
    errors: string[];
    warnings: string[];
    allowedOrigin?: string;
    allowedMethods?: string[];
    allowedHeaders?: string[];
}
export declare class CORSValidator {
    private config;
    constructor(config?: Partial<CORSConfig>);
    validateCORS(request: CORSRequest): CORSResult;
    private validateOrigin;
    private validateMethod;
    private validateHeaders;
    private getAllowedOrigin;
    getCORSHeaders(origin?: string): Record<string, string>;
}
export declare const corsValidator: CORSValidator;
//# sourceMappingURL=cors_validator.d.ts.map