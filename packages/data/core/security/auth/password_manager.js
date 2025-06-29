import * as crypto from 'crypto';
export class PasswordManager {
    constructor(config = {}) {
        this.config = {
            saltRounds: 10,
            hashAlgorithm: 'sha256',
            keyLength: 64,
            ...config,
        };
    }
    hashPassword(password) {
        const salt = this.generateSalt();
        const hash = this.hashWithSalt(password, salt);
        return {
            hash,
            salt,
        };
    }
    verifyPassword(password, hash, salt) {
        const computedHash = this.hashWithSalt(password, salt);
        return computedHash === hash;
    }
    generateSalt() {
        return crypto.randomBytes(32).toString('hex');
    }
    hashWithSalt(password, salt) {
        const hash = crypto.pbkdf2Sync(password, salt, this.config.saltRounds, this.config.keyLength, this.config.hashAlgorithm);
        return hash.toString('hex');
    }
    generateSecurePassword(length = 16) {
        const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
        let password = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = crypto.randomInt(0, charset.length);
            password += charset[randomIndex];
        }
        return password;
    }
    checkPasswordStrength(password) {
        const feedback = [];
        let score = 0;
        if (password.length >= 8) {
            score += 1;
        }
        else {
            feedback.push('Password should be at least 8 characters long');
        }
        if (/[a-z]/.test(password)) {
            score += 1;
        }
        else {
            feedback.push('Password should contain lowercase letters');
        }
        if (/[A-Z]/.test(password)) {
            score += 1;
        }
        else {
            feedback.push('Password should contain uppercase letters');
        }
        if (/\d/.test(password)) {
            score += 1;
        }
        else {
            feedback.push('Password should contain numbers');
        }
        if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
            score += 1;
        }
        else {
            feedback.push('Password should contain special characters');
        }
        return {
            score,
            feedback,
        };
    }
}
export const passwordManager = new PasswordManager();
//# sourceMappingURL=password_manager.js.map