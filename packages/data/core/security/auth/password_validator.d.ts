export interface PasswordValidationResult {
    isValid: boolean;
    errors: string[];
    strength: 'weak' | 'medium' | 'strong';
}
export interface PasswordHashResult {
    hash: string;
    salt: string;
}
export declare class PasswordValidator {
    private minLength;
    private commonPasswords;
    constructor(config?: {
        minLength?: number;
        commonPasswords?: string[];
    });
    validatePassword(password: string): PasswordValidationResult;
    hashPassword(password: string): PasswordHashResult;
    verifyPassword(password: string, hash: string, salt: string): boolean;
    private calculateStrength;
}
export declare const passwordValidator: PasswordValidator;
//# sourceMappingURL=password_validator.d.ts.map