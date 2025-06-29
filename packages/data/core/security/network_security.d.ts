import { NetworkRequest, NetworkValidationResult } from './network/network_request_validator';
import { CORSRequest, CORSResult } from './network/cors_validator';
export interface NetworkSecurityConfig {
    enableUrlValidation: boolean;
    enableRequestValidation: boolean;
    enableCORS: boolean;
    maxUrlLength: number;
    maxRequestSize: number;
}
export declare class NetworkSecurity {
    private config;
    constructor(config?: Partial<NetworkSecurityConfig>);
    validateRequest(request: NetworkRequest): Promise<NetworkValidationResult>;
    validateCORS(request: CORSRequest): CORSResult;
    validateUrl(url: string): any;
    getCORSHeaders(origin?: string): Record<string, string>;
    getConfig(): NetworkSecurityConfig;
    updateConfig(newConfig: Partial<NetworkSecurityConfig>): void;
}
export declare const networkSecurity: NetworkSecurity;
//# sourceMappingURL=network_security.d.ts.map