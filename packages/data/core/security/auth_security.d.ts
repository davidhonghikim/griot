import { LoginRequest, RegisterRequest } from './auth/auth_validator';
import { PasswordHash } from './auth/password_manager';
export interface AuthSecurityConfig {
    enableSessionValidation: boolean;
    enableRateLimiting: boolean;
    maxLoginAttempts: number;
    sessionTimeout: number;
}
export interface AuthResult {
    isAuthenticated: boolean;
    errors: string[];
    warnings: string[];
    user?: any;
    session?: any;
    token?: string;
}
export declare class AuthSecurity {
    private config;
    constructor(config?: Partial<AuthSecurityConfig>);
    validateLogin(request: LoginRequest): Promise<AuthResult>;
    validateRegistration(request: RegisterRequest): Promise<AuthResult>;
    hashPassword(password: string): PasswordHash;
    verifyPassword(password: string, hash: string, salt: string): boolean;
    createSession(userId: string, ipAddress: string, userAgent: string): any;
    validateSession(token: string): any;
    getConfig(): AuthSecurityConfig;
    updateConfig(newConfig: Partial<AuthSecurityConfig>): void;
}
export declare const authSecurity: AuthSecurity;
//# sourceMappingURL=auth_security.d.ts.map