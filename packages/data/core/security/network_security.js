import { networkRequestValidator } from './network/network_request_validator';
import { corsValidator } from './network/cors_validator';
import { urlValidator } from './network/url_validator';
export class NetworkSecurity {
    constructor(config = {}) {
        this.config = {
            enableUrlValidation: true,
            enableRequestValidation: true,
            enableCORS: true,
            maxUrlLength: 2048,
            maxRequestSize: 10 * 1024 * 1024,
            ...config,
        };
    }
    async validateRequest(request) {
        return networkRequestValidator.validateRequest(request);
    }
    validateCORS(request) {
        return corsValidator.validateCORS(request);
    }
    validateUrl(url) {
        return urlValidator.validateUrl(url);
    }
    getCORSHeaders(origin) {
        return corsValidator.getCORSHeaders(origin);
    }
    getConfig() {
        return { ...this.config };
    }
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
    }
}
export const networkSecurity = new NetworkSecurity();
//# sourceMappingURL=network_security.js.map