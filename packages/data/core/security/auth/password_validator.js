import * as crypto from 'crypto';
export class PasswordValidator {
    constructor(config = {}) {
        this.minLength = config.minLength || 8;
        this.commonPasswords = config.commonPasswords || [
            'password', '123456', '123456789', 'qwerty', 'abc123',
            'password123', 'admin', 'letmein', 'welcome'
        ];
    }
    validatePassword(password) {
        const errors = [];
        if (password.length < this.minLength) {
            errors.push(`Password must be at least ${this.minLength} characters long`);
        }
        if (!/[A-Z]/.test(password)) {
            errors.push('Password must contain at least one uppercase letter');
        }
        if (!/[a-z]/.test(password)) {
            errors.push('Password must contain at least one lowercase letter');
        }
        if (!/\d/.test(password)) {
            errors.push('Password must contain at least one number');
        }
        if (this.commonPasswords.includes(password.toLowerCase())) {
            errors.push('Password is too common');
        }
        return {
            isValid: errors.length === 0,
            errors,
            strength: this.calculateStrength(password),
        };
    }
    hashPassword(password) {
        const salt = crypto.randomBytes(32).toString('hex');
        const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
        return { hash, salt };
    }
    verifyPassword(password, hash, salt) {
        const testHash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
        return testHash === hash;
    }
    calculateStrength(password) {
        let score = 0;
        score += Math.min(password.length * 4, 40);
        if (/[a-z]/.test(password))
            score += 10;
        if (/[A-Z]/.test(password))
            score += 10;
        if (/\d/.test(password))
            score += 10;
        if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password))
            score += 15;
        if (score >= 70)
            return 'strong';
        if (score >= 50)
            return 'medium';
        return 'weak';
    }
}
export const passwordValidator = new PasswordValidator();
//# sourceMappingURL=password_validator.js.map