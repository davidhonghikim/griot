import { authValidator } from './auth/auth_validator';
import { passwordManager } from './auth/password_manager';
import { sessionManager } from './auth/session_manager';
import { rateLimiter } from './auth/rate_limiter';
export class AuthSecurity {
    constructor(config = {}) {
        this.config = {
            enableSessionValidation: true,
            enableRateLimiting: true,
            maxLoginAttempts: 5,
            sessionTimeout: 30 * 60 * 1000,
            ...config,
        };
    }
    async validateLogin(request) {
        const validation = authValidator.validateLogin(request);
        if (!validation.isValid) {
            return { isAuthenticated: false, errors: validation.errors, warnings: validation.warnings };
        }
        if (this.config.enableRateLimiting) {
            const rateLimitKey = `login:${request.ipAddress}`;
            if (!rateLimiter.checkLimit(rateLimitKey, this.config.maxLoginAttempts, 60000)) {
                return { isAuthenticated: false, errors: ['Too many login attempts'], warnings: [] };
            }
        }
        return { isAuthenticated: false, errors: ['Authentication not implemented'], warnings: [] };
    }
    async validateRegistration(request) {
        const validation = authValidator.validateRegistration(request);
        if (!validation.isValid) {
            return { isAuthenticated: false, errors: validation.errors, warnings: validation.warnings };
        }
        return { isAuthenticated: false, errors: ['Registration not implemented'], warnings: [] };
    }
    hashPassword(password) {
        return passwordManager.hashPassword(password);
    }
    verifyPassword(password, hash, salt) {
        return passwordManager.verifyPassword(password, hash, salt);
    }
    createSession(userId, ipAddress, userAgent) {
        return sessionManager.createSession(userId, ipAddress, userAgent);
    }
    validateSession(token) {
        return sessionManager.validateSession(token);
    }
    getConfig() {
        return { ...this.config };
    }
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
    }
}
export const authSecurity = new AuthSecurity();
//# sourceMappingURL=auth_security.js.map