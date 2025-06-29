import * as crypto from 'crypto';
export class DataEncryption {
    constructor(config = {}) {
        this.algorithm = config.algorithm || 'aes-256-gcm';
        this.keyLength = config.keyLength || 32;
    }
    encrypt(data, key) {
        try {
            const iv = crypto.randomBytes(16);
            const cipher = crypto.createCipher(this.algorithm, key);
            cipher.setAutoPadding(true);
            let encrypted = cipher.update(data, 'utf8', 'hex');
            encrypted += cipher.final('hex');
            return {
                encrypted,
                iv: iv.toString('hex'),
                algorithm: this.algorithm,
            };
        }
        catch (error) {
            throw new Error(`Encryption failed: ${error}`);
        }
    }
    decrypt(encryptedData, key, iv) {
        try {
            const decipher = crypto.createDecipher(this.algorithm, key);
            decipher.setAutoPadding(true);
            let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
            decrypted += decipher.final('utf8');
            return {
                decrypted,
                success: true,
            };
        }
        catch (error) {
            return {
                decrypted: '',
                success: false,
                error: `Decryption failed: ${error}`,
            };
        }
    }
    generateKey() {
        return crypto.randomBytes(this.keyLength).toString('hex');
    }
    hash(data, algorithm = 'sha256') {
        return crypto.createHash(algorithm).update(data).digest('hex');
    }
}
export const dataEncryption = new DataEncryption();
//# sourceMappingURL=encryption.js.map