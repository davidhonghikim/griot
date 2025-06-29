export interface AuthValidationResult {
    isValid: boolean;
    errors: string[];
    warnings: string[];
}
export interface LoginRequest {
    username: string;
    password: string;
    ipAddress: string;
    userAgent: string;
    rememberMe?: boolean;
}
export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    ipAddress: string;
    userAgent: string;
}
export interface AuthConfig {
    passwordMinLength: number;
    passwordMaxLength: number;
    requireSpecialChars: boolean;
    requireNumbers: boolean;
    requireUppercase: boolean;
    requireLowercase: boolean;
    maxUsernameLength: number;
    maxEmailLength: number;
}
export declare class AuthValidator {
    private config;
    constructor(config?: Partial<AuthConfig>);
    validateLogin(request: LoginRequest): AuthValidationResult;
    validateRegistration(request: RegisterRequest): AuthValidationResult;
    private validateUsername;
    private validateEmail;
    private validatePassword;
    private validateIPAddress;
}
export declare const authValidator: AuthValidator;
//# sourceMappingURL=auth_validator.d.ts.map