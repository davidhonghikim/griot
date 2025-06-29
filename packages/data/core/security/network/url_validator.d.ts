export interface UrlValidationResult {
    isValid: boolean;
    errors: string[];
    sanitizedUrl?: string;
}
export interface UrlValidatorConfig {
    allowedProtocols: string[];
    blockedDomains: string[];
    maxUrlLength: number;
}
export declare class UrlValidator {
    private config;
    constructor(config?: Partial<UrlValidatorConfig>);
    validateUrl(url: string): UrlValidationResult;
    private extractProtocol;
    private extractDomain;
    private validateDomain;
    private validatePath;
    private sanitizeUrl;
}
export declare const urlValidator: UrlValidator;
//# sourceMappingURL=url_validator.d.ts.map