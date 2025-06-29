export interface PasswordHash {
    hash: string;
    salt: string;
}
export interface PasswordConfig {
    saltRounds: number;
    hashAlgorithm: string;
    keyLength: number;
}
export declare class PasswordManager {
    private config;
    constructor(config?: Partial<PasswordConfig>);
    hashPassword(password: string): PasswordHash;
    verifyPassword(password: string, hash: string, salt: string): boolean;
    private generateSalt;
    private hashWithSalt;
    generateSecurePassword(length?: number): string;
    checkPasswordStrength(password: string): {
        score: number;
        feedback: string[];
    };
}
export declare const passwordManager: PasswordManager;
//# sourceMappingURL=password_manager.d.ts.map