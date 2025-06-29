export class UrlValidator {
    constructor(config = {}) {
        this.config = {
            allowedProtocols: ['http', 'https'],
            blockedDomains: ['malware.com', 'phishing.com', 'spam.com'],
            maxUrlLength: 2048,
            ...config,
        };
    }
    validateUrl(url) {
        const errors = [];
        if (!url || typeof url !== 'string') {
            errors.push('URL must be a non-empty string');
            return { isValid: false, errors };
        }
        if (url.length > this.config.maxUrlLength) {
            errors.push(`URL too long: ${url.length} characters (max: ${this.config.maxUrlLength})`);
        }
        const protocol = this.extractProtocol(url);
        if (!protocol || !this.config.allowedProtocols.includes(protocol)) {
            errors.push(`Invalid protocol: ${protocol}. Allowed: ${this.config.allowedProtocols.join(', ')}`);
        }
        const domain = this.extractDomain(url);
        if (domain) {
            const domainCheck = this.validateDomain(domain);
            if (!domainCheck.isValid) {
                errors.push(...domainCheck.errors);
            }
        }
        const pathCheck = this.validatePath(url);
        if (!pathCheck.isValid) {
            errors.push(...pathCheck.errors);
        }
        return {
            isValid: errors.length === 0,
            errors,
            sanitizedUrl: errors.length === 0 ? this.sanitizeUrl(url) : undefined,
        };
    }
    extractProtocol(url) {
        const match = url.match(/^([a-z]+):/i);
        return match ? match[1].toLowerCase() : null;
    }
    extractDomain(url) {
        const match = url.match(/^[a-z]+:\/\/([^\/]+)/i);
        return match ? match[1].toLowerCase() : null;
    }
    validateDomain(domain) {
        const errors = [];
        for (const blockedDomain of this.config.blockedDomains) {
            if (domain.includes(blockedDomain)) {
                errors.push(`Blocked domain: ${blockedDomain}`);
            }
        }
        if (!/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(domain)) {
            errors.push('Invalid domain format');
        }
        return { isValid: errors.length === 0, errors };
    }
    validatePath(url) {
        const errors = [];
        if (url.includes('../') || url.includes('..\\')) {
            errors.push('Path traversal detected');
        }
        if (/[<>\"'&]/.test(url)) {
            errors.push('Suspicious characters detected in URL');
        }
        return { isValid: errors.length === 0, errors };
    }
    sanitizeUrl(url) {
        let sanitized = url.replace(/\0/g, '');
        sanitized = sanitized.trim();
        try {
            sanitized = encodeURI(decodeURI(sanitized));
        }
        catch {
            sanitized = url;
        }
        return sanitized;
    }
}
export const urlValidator = new UrlValidator();
//# sourceMappingURL=url_validator.js.map