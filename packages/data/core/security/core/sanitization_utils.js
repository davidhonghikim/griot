import { SecurityPatterns } from './security_patterns';
export class SanitizationUtils {
    static sanitizeString(input) {
        if (typeof input !== 'string') {
            return input;
        }
        let sanitized = input;
        sanitized = sanitized.replace(/\0/g, '');
        sanitized = sanitized.replace(/<script[^>]*>.*?<\/script>/gi, '');
        sanitized = sanitized.replace(/javascript:/gi, '');
        sanitized = sanitized.replace(/on\w+\s*=/gi, '');
        sanitized = sanitized
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;');
        return sanitized;
    }
    static sanitizeObject(obj) {
        if (obj === null || obj === undefined) {
            return obj;
        }
        if (typeof obj === 'string') {
            return this.sanitizeString(obj);
        }
        if (Array.isArray(obj)) {
            return obj.map(item => this.sanitizeObject(item));
        }
        if (typeof obj === 'object') {
            const sanitized = {};
            for (const [key, value] of Object.entries(obj)) {
                sanitized[key] = this.sanitizeObject(value);
            }
            return sanitized;
        }
        return obj;
    }
    static needsSanitization(input) {
        if (typeof input === 'string') {
            return SecurityPatterns.hasSecurityThreat(input);
        }
        return false;
    }
}
//# sourceMappingURL=sanitization_utils.js.map