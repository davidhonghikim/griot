export interface EncryptionResult {
    encrypted: string;
    iv: string;
    algorithm: string;
}
export interface DecryptionResult {
    decrypted: string;
    success: boolean;
    error?: string;
}
export declare class DataEncryption {
    private algorithm;
    private keyLength;
    constructor(config?: {
        algorithm?: string;
        keyLength?: number;
    });
    encrypt(data: string, key: string): EncryptionResult;
    decrypt(encryptedData: string, key: string, iv: string): DecryptionResult;
    generateKey(): string;
    hash(data: string, algorithm?: string): string;
}
export declare const dataEncryption: DataEncryption;
//# sourceMappingURL=encryption.d.ts.map