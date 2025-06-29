import { SecurityPatterns } from '../core/security_patterns';
export class AuthValidator {
    constructor(config = {}) {
        this.config = {
            passwordMinLength: 8,
            passwordMaxLength: 128,
            requireSpecialChars: true,
            requireNumbers: true,
            requireUppercase: true,
            requireLowercase: true,
            maxUsernameLength: 50,
            maxEmailLength: 255,
            ...config,
        };
    }
    validateLogin(request) {
        const errors = [];
        const warnings = [];
        const usernameValidation = this.validateUsername(request.username);
        if (!usernameValidation.isValid) {
            errors.push(...usernameValidation.errors);
        }
        const passwordValidation = this.validatePassword(request.password);
        if (!passwordValidation.isValid) {
            errors.push(...passwordValidation.errors);
        }
        const ipValidation = this.validateIPAddress(request.ipAddress);
        if (!ipValidation.isValid) {
            errors.push(...ipValidation.errors);
        }
        return {
            isValid: errors.length === 0,
            errors,
            warnings,
        };
    }
    validateRegistration(request) {
        const errors = [];
        const warnings = [];
        const usernameValidation = this.validateUsername(request.username);
        if (!usernameValidation.isValid) {
            errors.push(...usernameValidation.errors);
        }
        const emailValidation = this.validateEmail(request.email);
        if (!emailValidation.isValid) {
            errors.push(...emailValidation.errors);
        }
        const passwordValidation = this.validatePassword(request.password);
        if (!passwordValidation.isValid) {
            errors.push(...passwordValidation.errors);
        }
        if (request.password !== request.confirmPassword) {
            errors.push('Passwords do not match');
        }
        const ipValidation = this.validateIPAddress(request.ipAddress);
        if (!ipValidation.isValid) {
            errors.push(...ipValidation.errors);
        }
        return {
            isValid: errors.length === 0,
            errors,
            warnings,
        };
    }
    validateUsername(username) {
        const errors = [];
        if (typeof username !== 'string') {
            errors.push('Username must be a string');
            return { isValid: false, errors };
        }
        if (username.length < 3) {
            errors.push('Username must be at least 3 characters long');
        }
        if (username.length > this.config.maxUsernameLength) {
            errors.push(`Username must be no more than ${this.config.maxUsernameLength} characters long`);
        }
        if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
            errors.push('Username can only contain letters, numbers, underscores, and hyphens');
        }
        if (SecurityPatterns.hasSecurityThreat(username)) {
            errors.push('Username contains suspicious patterns');
        }
        return { isValid: errors.length === 0, errors };
    }
    validateEmail(email) {
        const errors = [];
        if (typeof email !== 'string') {
            errors.push('Email must be a string');
            return { isValid: false, errors };
        }
        if (email.length > this.config.maxEmailLength) {
            errors.push(`Email must be no more than ${this.config.maxEmailLength} characters long`);
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            errors.push('Invalid email format');
        }
        if (SecurityPatterns.hasSecurityThreat(email)) {
            errors.push('Email contains suspicious patterns');
        }
        return { isValid: errors.length === 0, errors };
    }
    validatePassword(password) {
        const errors = [];
        if (typeof password !== 'string') {
            errors.push('Password must be a string');
            return { isValid: false, errors };
        }
        if (password.length < this.config.passwordMinLength) {
            errors.push(`Password must be at least ${this.config.passwordMinLength} characters long`);
        }
        if (password.length > this.config.passwordMaxLength) {
            errors.push(`Password must be no more than ${this.config.passwordMaxLength} characters long`);
        }
        if (this.config.requireUppercase && !/[A-Z]/.test(password)) {
            errors.push('Password must contain at least one uppercase letter');
        }
        if (this.config.requireLowercase && !/[a-z]/.test(password)) {
            errors.push('Password must contain at least one lowercase letter');
        }
        if (this.config.requireNumbers && !/\d/.test(password)) {
            errors.push('Password must contain at least one number');
        }
        if (this.config.requireSpecialChars && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
            errors.push('Password must contain at least one special character');
        }
        if (SecurityPatterns.hasSecurityThreat(password)) {
            errors.push('Password contains suspicious patterns');
        }
        return { isValid: errors.length === 0, errors };
    }
    validateIPAddress(ipAddress) {
        const errors = [];
        if (typeof ipAddress !== 'string') {
            errors.push('IP address must be a string');
            return { isValid: false, errors };
        }
        const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        if (!ipRegex.test(ipAddress)) {
            errors.push('Invalid IP address format');
        }
        return { isValid: errors.length === 0, errors };
    }
}
export const authValidator = new AuthValidator();
//# sourceMappingURL=auth_validator.js.map