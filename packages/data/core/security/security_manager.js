import { securityOrchestrator } from './security_orchestrator';
import { inputValidator } from './core/input_validator_simple';
import { fileValidator } from './file/file_validator';
import { authValidator } from './auth/auth_validator';
import { networkRequestValidator } from './network/network_request_validator';
export class SecurityManager {
    constructor(config = {}) {
        this.config = {
            enableComprehensiveValidation: true,
            enableLogging: true,
            enableMetrics: true,
            securityLevel: 'high',
            autoBlockThreshold: 15,
            ...config,
        };
    }
    async validateSecurity(data, context) {
        return securityOrchestrator.validateSecurity(data, context);
    }
    validateInput(value, rules) {
        return inputValidator.validate(value, rules);
    }
    validateFilePath(path) {
        return fileValidator.validatePath(path);
    }
    validateAuthRequest(request) {
        return authValidator.validateLogin(request);
    }
    validateNetworkRequest(request) {
        return networkRequestValidator.validateRequest(request);
    }
    getConfig() {
        return { ...this.config };
    }
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
    }
}
export const securityManager = new SecurityManager();
//# sourceMappingURL=security_manager.js.map